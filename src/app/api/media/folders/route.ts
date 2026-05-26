import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/media/folders — trả về danh sách thư mục duy nhất từ URL blob
// Blob URL pattern: https://xxx.public.blob.vercel-storage.com/{folder}/timestamp-filename
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.media.findMany({ select: { url: true } });

  const folderSet = new Set<string>();
  for (const { url } of rows) {
    try {
      const pathname = new URL(url).pathname; // e.g. /media/1234-file.jpg
      const parts = pathname.split("/").filter(Boolean); // ["media", "1234-file.jpg"]
      if (parts.length >= 2) {
        // Tất cả segments ngoại trừ filename cuối cùng là "thư mục"
        const folder = parts.slice(0, -1).join("/"); // "media" hoặc "media/avatars"
        folderSet.add(folder);
      }
    } catch {
      // URL không hợp lệ — bỏ qua
    }
  }

  const folders = Array.from(folderSet).sort();
  return NextResponse.json({ folders });
}
