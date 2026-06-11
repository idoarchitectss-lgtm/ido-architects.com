import { auth } from "@/auth";
import { apiLogger } from "@/lib/helpers/api-logger";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        image: true,
        role: true,
      },
    });

    if (!user) {
      apiLogger.warn("[GET /api/me] User not found", { userId: session.user.id });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    apiLogger.logError("[GET /api/me] Failed", error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
