import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

import { normalizeUploadKey, shouldOverwriteUpload } from "@/lib/upload-paths";
import { MAX_UPLOAD_BYTES } from "@/lib/upload-rules";

export const dynamic = "force-dynamic";

const allowedContentTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
]);

function tryParseClientPayload(input: string | null) {
  if (!input) {
    return null;
  }

  try {
    const parsed = JSON.parse(input) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function isHandleUploadBody(value: unknown): value is HandleUploadBody {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return typeof record.type === "string" && "payload" in record;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;

    if (!isHandleUploadBody(body)) {
      return NextResponse.json({ error: "Invalid upload payload" }, { status: 400 });
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const payload = tryParseClientPayload(clientPayload);
        const fileType = typeof payload?.fileType === "string" ? payload.fileType : "";
        const uploadKey = normalizeUploadKey(typeof payload?.uploadKey === "string" ? payload.uploadKey : "");
        const fileSize = typeof payload?.fileSize === "number" ? payload.fileSize : null;

        if (!allowedContentTypes.has(fileType)) {
          throw new Error("Unsupported upload type");
        }

        if (fileSize !== null && (!Number.isFinite(fileSize) || fileSize > MAX_UPLOAD_BYTES)) {
          throw new Error("File too large");
        }

        return {
          allowedContentTypes: [fileType],
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: false,
          allowOverwrite: shouldOverwriteUpload(uploadKey),
        };
      },
      onUploadCompleted: async () => {
        // No-op. The editor saves the returned URL into CMS data explicitly.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to prepare upload";
    const normalized = message.toLowerCase();

    if (normalized.includes("unsupported upload type")) {
      return NextResponse.json({ error: "Unsupported upload type" }, { status: 400 });
    }

    if (normalized.includes("file is too large") || normalized.includes("maximum size")) {
      return NextResponse.json({ error: "Video file too large" }, { status: 413 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
