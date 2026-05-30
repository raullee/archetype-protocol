import type { Metadata } from "next";
import { Outfit, Newsreader, Inter } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import { getBrand } from "@/lib/brand";
import { BundleRedeemer } from "@/components/BundleRedeemer";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["400", "500", "700", "900"] });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", weight: ["400", "500", "600", "700"], style: ["normal", "italic"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["300", "400", "500", "600", "700"] });

// Sanitize: trim whitespace and keep only valid GA-ID characters (the env var
// has shipped with a stray newline before, which corrupted the script URL).
const RAW_GA_ID = (process.env.NEXT_PUBLIC_GA_ID || "G-M8VKQ3H7R2").trim();
const GA_ID = /^G-[A-Z0-9]+$/.test(RAW_GA_ID) ? RAW_GA_ID : "G-M8VKQ3H7R2";

export const metadata: Metadata = {
  title: "The Archetype Protocol — Discover Your Core Archetype",
  description: "The psychological framework used by the world's most self-aware people. Discover your Jungian archetype in 90 seconds.",
  openGraph: {
    title: "The Archetype Protocol",
    description: "Discover your core archetype in 90 seconds. Based on Jungian psychology.",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const host = hdrs.get("host") || "";
  const brand = getBrand(host);
  const isSaraf = brand.id === "saraf";

  return (
    <html lang="en" data-brand={brand.id}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              send_page_view: true,
              custom_map: {
                'dimension1': 'archetype_result',
                'dimension2': 'completion_time_seconds',
                'dimension3': 'tier'
              }
            });
          `}
        </Script>
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )}
        <style>{`
          :root {
            --paper: ${brand.paper};
            --paper-elev: ${brand.paperElevated};
            --ink: ${brand.ink};
            --ink-soft: ${brand.inkSoft};
            --muted: ${brand.muted};
            --accent: ${brand.accent};
            --accent-soft: ${brand.accentSoft};
            --rule-soft: ${brand.ruleSoft};
            --font-display: ${brand.displayFont};
            --font-body: ${brand.bodyFont};
            --font-mono: ${brand.monoFont};
          }
          body { background: var(--paper); color: var(--ink); font-family: var(--font-body); }
          ${isSaraf ? `
            html[data-brand="saraf"] h1,
            html[data-brand="saraf"] h2,
            html[data-brand="saraf"] h3 {
              font-family: var(--font-display) !important;
              text-transform: none !important;
              letter-spacing: -0.02em !important;
              font-weight: 600 !important;
            }
            html[data-brand="saraf"] h1 { font-weight: 700 !important; }
            html[data-brand="saraf"] .uppercase:not(.font-mono):not([data-keep-uppercase]) {
              text-transform: none !important;
              letter-spacing: 0 !important;
            }
          ` : ``}
        `}</style>
      </head>
      <body className={`${outfit.variable} ${newsreader.variable} ${inter.variable} font-sans`} style={{ background: "var(--paper)", color: "var(--ink)" }}>
        <BundleRedeemer />
        {children}
      </body>
    </html>
  );
}
