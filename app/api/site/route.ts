import { NextResponse } from "next/server";

import { getCmsSnapshot } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getCmsSnapshot();
    return NextResponse.json(snapshot);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load CMS data",
      },
      { status: 500 },
    );
  }
}
