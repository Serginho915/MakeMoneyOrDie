import { readFile } from "node:fs/promises";
import path from "node:path";
import { config } from "../config";
import { GenerateArticleInput, GeneratedArticleDraft } from "../types";

const responseContract = `Return only valid JSON with these exact fields:
- title
- excerpt
- contentMarkdown
- tags (array of 3-6 short tags)
- seoTitle
- seoDescription

Do not add markdown fences. Do not add explanations outside JSON.`;

let cachedSystemPrompt: string | null = null;

const fallbackModels = ["openai/gpt-4o-mini"];

async function getSystemPrompt(): Promise<string> {
  if (cachedSystemPrompt) {
    return cachedSystemPrompt;
  }

  const promptPath = path.isAbsolute(config.openRouterSystemPromptPath)
    ? config.openRouterSystemPromptPath
    : path.resolve(process.cwd(), config.openRouterSystemPromptPath);

  const promptFromFile = await readFile(promptPath, "utf-8");
  cachedSystemPrompt = `${promptFromFile.trim()}\n\n${responseContract}`;
  return cachedSystemPrompt;
}

function extractJson(text: string): GeneratedArticleDraft {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed) as GeneratedArticleDraft;
  } catch {
    // Fall through to brace extraction for fenced or prefixed JSON.
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const fencedText = fencedMatch?.[1]?.trim();

  if (fencedText) {
    return JSON.parse(fencedText) as GeneratedArticleDraft;
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model response did not contain JSON");
  }

  const jsonSlice = trimmed.slice(start, end + 1);
  return JSON.parse(jsonSlice) as GeneratedArticleDraft;
}

async function requestDraft(model: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch(config.openRouterApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.openRouterApiKey}`,
      "HTTP-Referer": config.openRouterSiteUrl,
      "X-Title": config.openRouterSiteName
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenRouter API failed: ${response.status} ${details}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenRouter returned empty content");
  }

  return content;
}

export async function generateArticleWithOpenRouter(
  input: GenerateArticleInput
): Promise<GeneratedArticleDraft> {
  const systemPrompt = await getSystemPrompt();
  const userPrompt = `Topic: ${input.topic}\nDesired tags: ${input.tags?.join(", ") || "auto"}\nTone: ${input.tone || "premium"}\n\nCreate a high-value article in markdown:\n- H1 title\n- intro\n- 3 to 5 sections with H2 headings\n- practical examples\n- conclusion\n\nSEO title max 60 chars, SEO description max 160 chars.`;

  const modelsToTry = [config.openRouterModel, ...fallbackModels.filter((model) => model !== config.openRouterModel)];
  const parseErrors: string[] = [];

  for (const model of modelsToTry) {
    try {
      const content = await requestDraft(model, systemPrompt, userPrompt);
      const draft = extractJson(content);

      if (!draft.title || !draft.contentMarkdown || !draft.excerpt) {
        throw new Error("Generated article is missing required fields");
      }

      return {
        ...draft,
        tags: draft.tags?.length ? draft.tags : ["AI", "Automation", "Content"]
      };
    } catch (error) {
      parseErrors.push(error instanceof Error ? `${model}: ${error.message}` : `${model}: Unknown error`);
    }
  }

  throw new Error(`Failed to generate a valid article. Tried: ${parseErrors.join(" | ")}`);
}
