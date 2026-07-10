import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@generated/prisma/client";
import type {
  ContactSubmitInput,
  ContactQuery,
  ContactUpdateInput,
} from "../validations/contact-submission.schema";
import type { ContactSubmission } from "@generated/prisma/client";

export type ContactSubmissionWithService = ContactSubmission & {
  service: { id: string; title: string } | null;
};

const SERVICE_INCLUDE = {
  service: { select: { id: true, title: true } },
} satisfies Prisma.ContactSubmissionInclude;

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createContactSubmission(
  data: ContactSubmitInput
): Promise<ContactSubmission> {
  return prisma.contactSubmission.create({ data });
}

// ─── Find many (admin) ────────────────────────────────────────────────────────
export async function findManyContacts(
  query: ContactQuery
): Promise<{ contacts: ContactSubmissionWithService[]; total: number }> {
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
      include: SERVICE_INCLUDE,
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
): Promise<ContactSubmissionWithService | null> {
  return prisma.contactSubmission.findUnique({
    where: { id },
    include: SERVICE_INCLUDE,
  });
}

// ─── Update status + note ─────────────────────────────────────────────────────
export async function updateContactSubmission(
  id: string,
  data: ContactUpdateInput
): Promise<ContactSubmissionWithService> {
  return prisma.contactSubmission.update({
    where: { id },
    data,
    include: SERVICE_INCLUDE,
  });
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function deleteContactSubmission(id: string): Promise<void> {
  await prisma.contactSubmission.delete({ where: { id } });
}

// ─── Count by status (for dashboard badge) ────────────────────────────────────
export async function countNewContacts(): Promise<number> {
  return prisma.contactSubmission.count({ where: { status: "NEW" } });
}
