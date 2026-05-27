import { NextRequest, NextResponse } from "next/server";
import { ServiceQuerySchema, ServiceCreateSchema } from "@/features/company-services/validations/service.schema";
import { findManyServices, createService } from "@/features/company-services/services/service.data";
import { transformService, transformServiceList } from "@/features/company-services/transforms/service.transform";
import { apiLogger } from "@/lib/helpers/api-logger";
import { auth } from "@/auth";

// GET /api/services?page=&size=&search=&showAll=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const parsed = ServiceQuerySchema.safeParse(
      Object.fromEntries(searchParams.entries())
    );
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { services, total } = await findManyServices(parsed.data);

    return NextResponse.json(transformServiceList(services, total));
  } catch (error) {
    apiLogger.logError("[GET /api/services]", error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/services (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = ServiceCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const service = await createService(parsed.data);

    return NextResponse.json(transformService(service), { status: 201 });
  } catch (error) {
    apiLogger.logError("[POST /api/services]", error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
