import { NextRequest, NextResponse } from "next/server";
import { ServiceUpdateSchema } from "@/features/company-services/validations/service.schema";
import {
  findServiceById,
  updateService,
  deleteService,
} from "@/features/company-services/services/service.data";
import { transformService } from "@/features/company-services/transforms/service.transform";
import { apiLogger } from "@/lib/helpers/api-logger";
import { auth } from "@/auth";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/services/[id]
export async function GET(
  _req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const service = await findServiceById(id);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(transformService(service));
  } catch (error) {
    apiLogger.logError("[GET /api/services/[id]]", error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/services/[id]
export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = ServiceUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const existing = await findServiceById(id);
    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const service = await updateService(id, parsed.data);
    return NextResponse.json(transformService(service));
  } catch (error) {
    apiLogger.logError("[PUT /api/services/[id]]", error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/services/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await findServiceById(id);
    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    await deleteService(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    apiLogger.logError("[DELETE /api/services/[id]]", error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}