import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getSiteData, saveSiteData, type SiteContent } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const siteData = await getSiteData();
    return NextResponse.json(siteData);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to read site data";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<SiteContent>;
    const currentData = await getSiteData();

    const nextData: SiteContent = {
      siteName:
        typeof payload.siteName === "string"
          ? payload.siteName
          : currentData.siteName,
      heroTitle:
        typeof payload.heroTitle === "string"
          ? payload.heroTitle
          : currentData.heroTitle,
      heroSubtitle:
        typeof payload.heroSubtitle === "string"
          ? payload.heroSubtitle
          : currentData.heroSubtitle,
      features: Array.isArray(payload.features)
        ? payload.features.filter(
            (feature): feature is string =>
              typeof feature === "string" && feature.trim().length > 0,
          )
        : currentData.features,
      logo: typeof payload.logo === "string" ? payload.logo : currentData.logo,
    };

    await saveSiteData(nextData);
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/api/site");

    return NextResponse.json({ success: true, data: nextData });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update site data";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
