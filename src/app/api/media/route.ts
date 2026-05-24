import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findAllMedia } from "@/features/media/services/media.service";

// GET /api/media?page=1&limit=24&search=banner&contentType=image/png&folder=media
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "24");
  const search = searchParams.get("search") ?? undefined;
  const contentType = searchParams.get("contentType") ?? undefined;
  const folder = searchParams.get("folder") ?? undefined;

  const result = await findAllMedia({ page, limit, search, contentType, folder });
  return NextResponse.json(result);
}
