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
  metadataBase: new URL("https://snail-delivery.vercel.app"),
  title: "GoGet 蝸牛外送",
  description: "GoGet 蝸牛外送提供消費者、騎手、店家三端入口與 CMS V2 內容管理後台。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW">
      <body
        className={`${manrope.variable} ${notoSansTc.variable} bg-cream font-[var(--font-noto-tc)] text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
