import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@generated/prisma/client";
import type {
  ContactSubmitInput,
  ContactQuery,
  ContactUpdateInput,
} from "../validations/contact-submission.schema";
import type { ContactSubmission } from "@generated/prisma/client";

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createContactSubmission(
  data: ContactSubmitInput
): Promise<ContactSubmission> {
  return prisma.contactSubmission.create({ data });
}

// ─── Find many (admin) ────────────────────────────────────────────────────────
export async function findManyContacts(
  query: ContactQuery
): Promise<{ contacts: ContactSubmission[]; total: number }> {
  const { page, size, search, status } = query;

  const where: Prisma.ContactSubmissionWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (search?.trim()) {
    where.OR = [
      { name: { contains: search.trim(), mode: "insensitive" } },
      { email: { contains: search.trim(), mode: "insensitive" } },
      { phone: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  const [contacts, total] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * size,
      take: size,
    }),
    prisma.contactSubmission.count({ where }),
  ]);

  return { contacts, total };
}

// ─── Find one ─────────────────────────────────────────────────────────────────
export async function findContactById(
  id: string
): Promise<ContactSubmission | null> {
  return prisma.contactSubmission.findUnique({ where: { id } });
}

// ─── Update status + note ─────────────────────────────────────────────────────
export async function updateContactSubmission(
  id: string,
  data: ContactUpdateInput
): Promise<ContactSubmission> {
  return prisma.contactSubmission.update({ where: { id }, data });
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function deleteContactSubmission(id: string): Promise<void> {
  await prisma.contactSubmission.delete({ where: { id } });
}

// ─── Count by status (for dashboard badge) ────────────────────────────────────
export async function countNewContacts(): Promise<number> {
  return prisma.contactSubmission.count({ where: { status: "NEW" } });
}
