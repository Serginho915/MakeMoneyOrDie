import { Router } from "express";
import { z } from "zod";
import { generateAndStoreArticle } from "../lib/publish";

const router = Router();

const payloadSchema = z.object({
  topic: z.string().min(6),
  tags: z.array(z.string().min(2)).max(8).optional(),
  tone: z.enum(["premium", "technical", "practical"]).optional()
});

router.post("/", async (req, res) => {
  const parsed = payloadSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
    return;
  }

  try {
    const article = await generateAndStoreArticle(parsed.data);

    res.status(201).json({ article });
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate article",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
