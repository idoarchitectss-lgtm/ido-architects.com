import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { createMedia } from "@/features/media/services/media.service";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Không có file được gửi lên" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Chỉ chấp nhận ảnh JPEG, PNG, WebP, GIF, SVG" },
      { status: 415 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File không được vượt quá 10MB" }, { status: 413 });
  }

  // Upload lên Vercel Blob (public store)
  let blob;
  try {
    blob = await put(`media/${Date.now()}-${file.name}`, file, {
      access: "public",
      contentType: file.type,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[media/upload] Blob error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const fileUrl = blob.url;

  // Lưu metadata vào DB
  const media = await createMedia({
    filename: file.name,
    url: fileUrl,
    contentType: file.type,
    size: file.size,
    uploadedBy: session.user.id!,
  });

  return NextResponse.json(media, { status: 201 });
}
