import type { Metadata } from "next";
import { Noto_Sans_JP, Shippori_Mincho, Syne } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_JP({
  variable: "--font-mplus",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const display = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const serif = Shippori_Mincho({
  variable: "--font-mincho",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ECHO — 社内問い合わせの渋滞",
  description:
    "繰り返される社内問い合わせを集計し、マニュアル1本で減らせる時間を出す。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${sans.variable} ${display.variable} ${serif.variable} h-full bg-background antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
