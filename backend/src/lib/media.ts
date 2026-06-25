import { readdir } from "node:fs/promises";
import path from "node:path";
import { config } from "../config";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function resolveMediaDir(): string {
  if (path.isAbsolute(config.mediaDir)) {
    return config.mediaDir;
  }

  return path.resolve(process.cwd(), config.mediaDir);
}

export async function pickRandomMediaImageUrl(): Promise<string> {
  const mediaDir = resolveMediaDir();
  const files = await readdir(mediaDir, { withFileTypes: true });
  const images = files
    .filter((file) => file.isFile())
    .map((file) => file.name)
    .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()));

  if (!images.length) {
    return "";
  }

  const filename = images[Math.floor(Math.random() * images.length)];
  return `${config.publicMediaUrl}/${encodeURIComponent(filename)}`;
}
