import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const allowedContentTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
]);
const overwriteUploadKeys = new Set([
  "shared/logo",
  "home/hero",
  "consumer/hero",
  "courier/hero",
  "merchant/hero",
  "about/video",
]);

function shouldOverwriteUpload(uploadKey: string) {
  return overwriteUploadKeys.has(uploadKey) || uploadKey.startsWith("home/download-cards/");
}

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

    if (
      !file ||
      typeof file === "string" ||
      typeof (file as Blob).arrayBuffer !== "function" ||
      typeof (file as { type?: unknown }).type !== "string"
    ) {
      return NextResponse.json({ error: "Missing upload file" }, { status: 400 });
    }

    const uploadFile = file as Blob & { name?: string; type: string };

    if (!allowedContentTypes.has(uploadFile.type)) {
      return NextResponse.json({ error: "Unsupported upload type" }, { status: 400 });
    }

    const filename = (uploadFile.name ?? "upload-image").replace(/[^a-zA-Z0-9._-]+/g, "-");
    const extension = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : "";
    const shouldOverwrite = shouldOverwriteUpload(uploadKey);
    const blobPath = shouldOverwrite
      ? `cms/${uploadKey}${extension}`
      : `cms/${uploadKey}/${Date.now()}-${filename}`;
    const blob = await put(blobPath, uploadFile, {
      access: "public",
      contentType: uploadFile.type,
      addRandomSuffix: false,
      allowOverwrite: shouldOverwrite,
    });

    const version = Date.now();

    return NextResponse.json({
      success: true,
      url: `${blob.url}${blob.url.includes("?") ? "&" : "?"}v=${version}`,
      rawUrl: blob.url,
      version,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload asset",
      },
      { status: 500 },
    );
  }
}
