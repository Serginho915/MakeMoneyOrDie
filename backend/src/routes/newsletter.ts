import { Router } from "express";
import { z } from "zod";
import { isNewsletterMailerConfigured, sendNewsletterEmail } from "../lib/newsletter";

const router = Router();

const payloadSchema = z.object({
  email: z.string().trim().email().max(254)
});

router.post("/", async (req, res) => {
  const parsed = payloadSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid email", details: parsed.error.flatten() });
    return;
  }

  if (!isNewsletterMailerConfigured()) {
    res.status(503).json({ error: "SMTP is not configured" });
    return;
  }

  try {
    await sendNewsletterEmail(parsed.data);
    res.status(202).json({ ok: true });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send newsletter email",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
