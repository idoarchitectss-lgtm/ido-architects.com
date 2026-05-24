import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import {
  findMediaById,
  deleteMedia,
  updateMedia,
} from "@/features/media/services/media.service";
import { MediaUpdateSchema } from "@/features/media/validations/media.schema";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/media/[id] — cập nhật alt text
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const media = await findMediaById(id);
  if (!media) {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = MediaUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await updateMedia(id, parsed.data);
  return NextResponse.json(updated);
}

// DELETE /api/media/[id] — admin only
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const media = await findMediaById(id);
  if (!media) {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }

  // Xóa file trên Vercel Blob
  await del(media.url);

  // Xóa metadata khỏi DB
  await deleteMedia(id);

  return NextResponse.json({ success: true });
}
