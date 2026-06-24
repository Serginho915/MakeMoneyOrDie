import path from "node:path";
import cors from "cors";
import express from "express";
import { config } from "./config";
import articlesRouter from "./routes/articles";
import generateRouter from "./routes/generate";
import { startAutoPublishScheduler } from "./lib/scheduler";

const app = express();

app.use(
  cors({
    origin: config.corsOrigin
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(
  "/media",
  express.static(path.resolve(process.cwd(), config.mediaDir), {
    fallthrough: false
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/articles", articlesRouter);
app.use("/api/generate", generateRouter);

app.listen(config.port, () => {
  console.log(`Backend API started on port ${config.port}`);
  if (config.autoPostEnabled) {
    startAutoPublishScheduler();
    console.log(
      `[scheduler] Enabled with ${config.autoPostCron} in timezone ${config.autoPostTimezone}`
    );
  }
});
