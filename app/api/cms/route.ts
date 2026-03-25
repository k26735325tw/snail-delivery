import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCmsData, saveCmsData } from "@/lib/cms-store";
import type { CmsData } from "@/lib/cms-schema";

export const dynamic = "force-dynamic";

function revalidateCmsPaths() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/consumer");
  revalidatePath("/courier");
  revalidatePath("/merchant");
  revalidatePath("/admin");
  revalidatePath("/admin/visual");
  revalidatePath("/api/site");
}

export async function GET() {
  try {
    const data = await getCmsData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load CMS data",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as { data: CmsData; dirtyPaths?: string[] };
    const { data, url } = await saveCmsData(payload.data, payload.dirtyPaths ?? []);

    revalidateCmsPaths();

    return NextResponse.json({
      success: true,
      url,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save CMS data",
      },
      { status: 500 },
    );
  }
}
