"use server";

import { revalidatePath } from "next/cache";

import { readSiteData, writeSiteData } from "@/lib/site-data";

export async function updateSiteContent(formData: FormData) {
  const siteData = await readSiteData();
  const heroTitle = formData.get("heroTitle");
  const heroSubtitle = formData.get("heroSubtitle");

  await writeSiteData({
    ...siteData,
    heroTitle: typeof heroTitle === "string" ? heroTitle : siteData.heroTitle,
    heroSubtitle:
      typeof heroSubtitle === "string" ? heroSubtitle : siteData.heroSubtitle,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/api/site");
}
