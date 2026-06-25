function requirePublicEnv(name: "NEXT_PUBLIC_SITE_URL" | "NEXT_PUBLIC_API_URL"): string {
  const value =
    name === "NEXT_PUBLIC_SITE_URL"
      ? process.env.NEXT_PUBLIC_SITE_URL
      : process.env.NEXT_PUBLIC_API_URL;

  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

export const publicEnv = {
  siteUrl: requirePublicEnv("NEXT_PUBLIC_SITE_URL"),
  apiUrl: requirePublicEnv("NEXT_PUBLIC_API_URL")
};
