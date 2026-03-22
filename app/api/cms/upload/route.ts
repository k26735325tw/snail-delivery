import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const allowedContentTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
const overwriteUploadKeys = new Set([
  "shared/logo",
  "home/hero",
  "consumer/hero",
  "courier/hero",
  "merchant/hero",
]);

function normalizePath(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9/-]+/g, "-");
}

function normalizeUploadKey(uploadKey: string) {
  const value = normalizePath(uploadKey);

  if (!value) {
    return "shared/logo";
  }

  return value;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const uploadKey = normalizeUploadKey(String(formData.get("uploadKey") ?? "shared/logo"));

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing upload file" }, { status: 400 });
    }

    if (!allowedContentTypes.has(file.type)) {
      return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
    }

    const filename = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const extension = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : "";
    const shouldOverwrite = overwriteUploadKeys.has(uploadKey);
    const blobPath = shouldOverwrite
      ? `cms/${uploadKey}${extension}`
      : `cms/${uploadKey}/${Date.now()}-${filename}`;
    const blob = await put(blobPath, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
      allowOverwrite: shouldOverwrite,
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
