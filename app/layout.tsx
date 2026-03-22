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
  title: "GoGet 官方下載頁",
  description: "GoGet 外送員、店家與消費者 App 官方下載入口。",
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
