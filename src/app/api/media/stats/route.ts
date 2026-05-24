import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/media/stats — tổng hợp thống kê media
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalCount, sizeAgg, formatGroups] = await prisma.$transaction([
    // Tổng số ảnh
    prisma.media.count(),

    // Tổng dung lượng
    prisma.media.aggregate({ _sum: { size: true } }),

    // Phân bố theo contentType
    prisma.media.groupBy({
      by: ["contentType"],
      _count: true,
      _sum: { size: true },
      orderBy: { _count: { contentType: "desc" } },
    }),
  ]);

  const formatDistribution = formatGroups.map((g) => ({
    contentType: g.contentType,
    count: typeof g._count === "object" ? (g._count?.contentType ?? 0) : 0,
    size: g._sum?.size ?? 0,
  }));

  return NextResponse.json({
    totalCount,
    totalSize: sizeAgg._sum.size ?? 0,
    formatDistribution,
  });
}
