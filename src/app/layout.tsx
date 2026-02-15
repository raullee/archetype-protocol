import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display" });

export const metadata: Metadata = {
  title: "The Archetype Protocol — Discover Your Core Archetype",
  description: "The psychological framework used by the world's most self-aware people. Discover your Jungian archetype in 90 seconds.",
  openGraph: {
    title: "The Archetype Protocol",
    description: "Discover your core archetype in 90 seconds. Based on Jungian psychology.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#0A0A0B] text-[#F5F5F7]`}>
        {children}
      </body>
    </html>
  );
}
