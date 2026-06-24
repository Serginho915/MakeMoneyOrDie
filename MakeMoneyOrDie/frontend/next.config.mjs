/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_API_URL");
}

const apiBase = new URL(apiUrl);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiBase.protocol.replace(":", ""),
        hostname: apiBase.hostname,
        port: apiBase.port,
        pathname: "/media/**"
      }
    ]
  }
};

export default nextConfig;
