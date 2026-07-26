import type { Metadata } from "next";
import { SoundProvider } from "@/components/ui/SoundProvider";
import PageTransition from "@/components/ui/PageTransition";
import GlobalEscapeHandler from "@/components/ui/GlobalEscapeHandler";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chronicle — A History of Human Progress",
  description: "An evidence-led interactive history of humanity's uneven progress toward the Sustainable Development Goals.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skipLink" href="#main-content">Skip to content</a>
        <SoundProvider><PageTransition>{children}</PageTransition></SoundProvider>
        <GlobalEscapeHandler />
      </body>
    </html>
  );
}
