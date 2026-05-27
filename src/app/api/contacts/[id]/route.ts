import { NextRequest, NextResponse } from "next/server";
import { ContactUpdateSchema } from "@/features/contact-submissions/validations/contact-submission.schema";
import {
  findContactById,
  updateContactSubmission,
  deleteContactSubmission,
} from "@/features/contact-submissions/services/contact-submission.data";
import { transformContact } from "@/features/contact-submissions/transforms/contact-submission.transform";
import { apiLogger } from "@/lib/helpers/api-logger";
import { auth } from "@/auth";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/contacts/[id] — Admin only
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const contact = await findContactById(id);
    if (!contact) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(transformContact(contact));
  } catch (error) {
    apiLogger.logError("[GET /api/contacts/[id]]", error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/contacts/[id] — update status + note (Admin only)
export async function PATCH(req: NextRequest, { params }: RouteContext) {
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

    const parsed = ContactUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const existing = await findContactById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await updateContactSubmission(id, parsed.data);
    return NextResponse.json(transformContact(updated));
  } catch (error) {
    apiLogger.logError("[PATCH /api/contacts/[id]]", error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/contacts/[id] — Admin only
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await findContactById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deleteContactSubmission(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    apiLogger.logError("[DELETE /api/contacts/[id]]", error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
