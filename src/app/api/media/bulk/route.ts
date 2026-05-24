import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import {
  findMediaById,
  deleteMedia,
} from "@/features/media/services/media.service";

// DELETE /api/media/bulk  Body: { "ids": ["id1", "id2", ...] }
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.ids) || body.ids.length === 0) {
    return NextResponse.json({ error: "ids phải là mảng không rỗng" }, { status: 400 });
  }

  const ids: string[] = body.ids;
  const results = { deleted: 0, failed: 0, errors: [] as string[] };

  await Promise.all(
    ids.map(async (id) => {
      try {
        const media = await findMediaById(id);
        if (!media) {
          results.failed++;
          results.errors.push(`${id}: không tìm thấy`);
          return;
        }
        // Xóa trên Blob
        await del(media.url);
        // Xóa trong DB
        await deleteMedia(id);
        results.deleted++;
      } catch (err) {
        results.failed++;
        results.errors.push(`${id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    })
  );

  return NextResponse.json(results);
}
