import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { readSiteData, writeSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteData = await readSiteData();
  return NextResponse.json(siteData);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<Awaited<ReturnType<typeof readSiteData>>>;
  const currentData = await readSiteData();

  const nextData = {
    ...currentData,
    ...payload,
    features: Array.isArray(payload.features)
      ? payload.features
      : currentData.features,
  };

  await writeSiteData(nextData);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/api/site");

  return NextResponse.json(nextData);
}
