import { NextResponse } from "next/server";

import { getCmsData } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

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
