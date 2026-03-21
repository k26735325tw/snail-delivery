import type { ReactNode } from "react";
import type { Metadata } from "next";
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
  title: "蝸牛外送 Snail Delivery",
  description:
    "蝸牛外送以藍黃品牌視覺重塑外送體驗，為消費者、外送員與店家建立更高的品質標準。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${manrope.variable} ${notoSansTc.variable} bg-cream font-[var(--font-noto-tc)] text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
