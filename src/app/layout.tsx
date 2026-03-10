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
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-M8VKQ3H7R2";
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Analytics 4 */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            send_page_view: true,
            custom_map: {
              'dimension1': 'archetype_result',
              'dimension2': 'completion_time_seconds',
              'dimension3': 'tier'
            }
          });
        `}} />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#0A0A0B] text-[#F5F5F7]`}>
        {children}
      </body>
    </html>
  );
}
