import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

function requirePort(name: string): number {
  const value = requireEnv(name);
  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid port in environment variable ${name}: ${value}`);
  }

  return port;
}

function requireBoolean(name: string): boolean {
  const value = requireEnv(name).toLowerCase();

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`Invalid boolean in environment variable ${name}: ${value}`);
}

function optionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value?.trim() || undefined;
}

function optionalPort(name: string): number | undefined {
  const value = optionalEnv(name);

  if (!value) {
    return undefined;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid port in environment variable ${name}: ${value}`);
  }

  return port;
}

function optionalBoolean(name: string): boolean | undefined {
  const value = optionalEnv(name)?.toLowerCase();

  if (!value) {
    return undefined;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`Invalid boolean in environment variable ${name}: ${value}`);
}

function requireList(name: string): string[] {
  const value = requireEnv(name);
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const config = {
  port: requirePort("PORT"),
  corsOrigin: requireEnv("CORS_ORIGIN"),
  openRouterApiKey: requireEnv("OPENROUTER_API_KEY"),
  openRouterModel: requireEnv("OPENROUTER_MODEL"),
  openRouterApiUrl: requireEnv("OPENROUTER_API_URL"),
  openRouterSystemPromptPath: requireEnv("OPENROUTER_SYSTEM_PROMPT_PATH"),
  openRouterSiteUrl: requireEnv("OPENROUTER_SITE_URL"),
  openRouterSiteName: requireEnv("OPENROUTER_SITE_NAME"),
  articlesDbPath: requireEnv("ARTICLES_DB_PATH"),
  mediaDir: requireEnv("MEDIA_DIR"),
  publicMediaUrl: requireEnv("PUBLIC_MEDIA_URL"),
  autoPostCron: requireEnv("AUTO_POST_CRON"),
  autoPostTimezone: requireEnv("AUTO_POST_TIMEZONE"),
  autoPostTopics: requireList("AUTO_POST_TOPICS"),
  autoPostEnabled: requireBoolean("AUTO_POST_ENABLED"),
  smtpHost: optionalEnv("SMTP_HOST"),
  smtpPort: optionalPort("SMTP_PORT"),
  smtpSecure: optionalBoolean("SMTP_SECURE"),
  smtpUser: optionalEnv("SMTP_USER"),
  smtpPass: optionalEnv("SMTP_PASS"),
  smtpFrom: optionalEnv("SMTP_FROM"),
  newsletterSubject: optionalEnv("NEWSLETTER_SUBJECT") ?? "Welcome to MakeMoneyOrDie"
};
