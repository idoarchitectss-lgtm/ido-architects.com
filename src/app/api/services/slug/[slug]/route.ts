import { NextRequest, NextResponse } from "next/server";
import { findServiceBySlug } from "@/features/company-services/services/service.data";
import { transformService } from "@/features/company-services/transforms/service.transform";
import { apiLogger } from "@/lib/helpers/api-logger";

type RouteContext = { params: Promise<{ slug: string }> };

// GET /api/services/slug/[slug]
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;

    const service = await findServiceBySlug(slug);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(transformService(service));
  } catch (error) {
    apiLogger.logError("[GET /api/services/slug/[slug]]", error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
