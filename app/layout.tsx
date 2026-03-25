import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { getMetadataBase } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: "GoGet 蝸牛外送",
  description: "GoGet 蝸牛外送提供消費者、騎手、店家三端入口與 CMS V2 內容管理後台。",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    title: "GoGet 蝸牛外送",
    description: "GoGet 蝸牛外送提供消費者、騎手、店家三端入口與 CMS V2 內容管理後台。",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoGet 蝸牛外送",
    description: "GoGet 蝸牛外送提供消費者、騎手、店家三端入口與 CMS V2 內容管理後台。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW">
      <body
        className="bg-cream font-[var(--font-noto-tc)] text-ink antialiased"
      >
        {children}
      </body>
    </html>
  );
}
