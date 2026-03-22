import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Noto_Sans_TC } from "next/font/google";

import "@/app/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const notoSansTc = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-noto-tc",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "GoGet CMS",
  description: "Snail Delivery CMS with Vercel Blob storage and live content sync.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${manrope.variable} ${notoSansTc.variable} bg-cream font-[var(--font-noto-tc)] text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
