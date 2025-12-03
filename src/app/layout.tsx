import { NavbarWrapper } from "@/components/navbar-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingProvider } from "@/context/loading-context";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import DynamicScrollbar from "@/components/dynamic-scroll";
import MusicPlayer from "@/components/music-card";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: DATA.name,
    template: `%s | ${DATA.name}`,
  },
  description: DATA.description,
  openGraph: {
    title: `${DATA.name}`,
    description: DATA.description,
    url: DATA.url,
    siteName: `${DATA.name}`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: `${DATA.name}`,
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("overflow-scroll",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider delayDuration={0}>
            <LoadingProvider>
              {/* 🔥 This wrapper contains ONLY content that gets replaced by loading.tsx */}
              <div className="content-wrapper overflow-hidden">
                <DynamicScrollbar>
                  <MusicPlayer />
                </DynamicScrollbar>
                {children}
              </div>

              {/* 🔥 Navbar is conditionally hidden during loading */}
              <NavbarWrapper />

              <Analytics />
            </LoadingProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

