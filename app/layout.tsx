import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { instructor, site } from "@/data/cohortData";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["opsz"] });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

const description =
  "An 8-month hands-on cohort for leaders: build real AI workflows, policies and automations in 90-minute sessions, with remote 1:1 coaching. Taught by Keisha Solomon, EVOBRAND Concepts.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: ${site.tagline}`, template: `%s · ${site.name}` },
  description,
  authors: [{ name: instructor.name }],
  openGraph: { title: site.name, description, url: site.url, siteName: site.name, type: "website" },
};

export const viewport: Viewport = { themeColor: "#070e1c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-sm bg-amber px-4 py-3 font-semibold text-navy-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
