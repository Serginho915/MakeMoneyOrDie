import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { publicEnv } from "@/lib/env";

const titleFont = Oswald({
  subsets: ["latin"],
  variable: "--font-title",
  weight: ["500", "700"]
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title: {
    default: "MakeMoneyOrDie | Andrew Nicklson",
    template: "%s | MakeMoneyOrDie"
  },
  description:
    "MakeMoneyOrDie by Andrew Nicklson: practical playbooks on side hustles, online business, and behavioral economics of money.",
  openGraph: {
    title: "MakeMoneyOrDie",
    description: "Online income playbooks by Andrew Nicklson.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "MakeMoneyOrDie",
    description: "Online income playbooks by Andrew Nicklson."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${titleFont.variable} ${bodyFont.variable}`}>
      <body>
        <div className="orb orb-left" />
        <div className="orb orb-right" />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
