import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const allowedContentTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);

function normalizeSection(section: string) {
  const value = section.trim().toLowerCase();

  if (!value) {
    return "shared";
  }

  return value.replace(/[^a-z0-9/-]+/g, "-");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const section = normalizeSection(String(formData.get("section") ?? "shared"));

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing upload file" }, { status: 400 });
    }

    if (!allowedContentTypes.has(file.type)) {
      return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
    }

    const filename = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const blob = await put(`cms/${section}/${Date.now()}-${filename}`, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload image",
      },
      { status: 500 },
    );
  }
}
