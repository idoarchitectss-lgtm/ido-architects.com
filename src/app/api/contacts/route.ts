import { NextRequest, NextResponse } from "next/server";
import { ContactQuerySchema } from "@/features/contact-submissions/validations/contact-submission.schema";
import { findManyContacts } from "@/features/contact-submissions/services/contact-submission.data";
import { transformContactList } from "@/features/contact-submissions/transforms/contact-submission.transform";
import { apiLogger } from "@/lib/helpers/api-logger";
import { auth } from "@/auth";

// GET /api/contacts — Admin only
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = ContactQuerySchema.safeParse(
      Object.fromEntries(req.nextUrl.searchParams.entries())
    );
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { contacts, total } = await findManyContacts(parsed.data);
    return NextResponse.json(transformContactList(contacts, total));
  } catch (error) {
    apiLogger.logError("[GET /api/contacts]", error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
