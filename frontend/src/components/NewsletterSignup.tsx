"use client";

import { FormEvent, useState } from "react";
import { sendNewsletterSignup } from "@/lib/api";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatus("error");
      setMessage("Enter your email first.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      await sendNewsletterSignup(trimmedEmail);
      setStatus("success");
      setEmail("");
      setMessage("Check your inbox. The first signal is already moving.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not send email.");
    }
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <div className="newsletter-input-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={status === "loading"}
          required
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Get The Letter"}
        </button>
      </div>
      {message ? (
        <p className={status === "success" ? "newsletter-message success" : "newsletter-message error"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
