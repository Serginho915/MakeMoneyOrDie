import cron from "node-cron";
import { config } from "../config";
import { generateAndStoreArticle, getAutoPostTopics } from "./publish";

function pickTopic(): string {
  const topics = getAutoPostTopics();
  return topics[Math.floor(Math.random() * topics.length)];
}

export function startAutoPublishScheduler(): void {
  cron.schedule(
    config.autoPostCron,
    async () => {
      try {
        const article = await generateAndStoreArticle({
          topic: pickTopic(),
          tone: "premium"
        });

        console.log(`[scheduler] Published article: ${article.slug}`);
      } catch (error) {
        console.error(
          "[scheduler] Failed to publish article:",
          error instanceof Error ? error.message : error
        );
      }
    },
    {
      timezone: config.autoPostTimezone
    }
  );
}
