import type { Metadata } from "next";
import { M_PLUS_2, Syne } from "next/font/google";
import "./globals.css";

const sans = M_PLUS_2({
  variable: "--font-mplus",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const display = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Spark — Capture a thought.",
  description: "The fastest place to capture a thought.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} h-full bg-background antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
