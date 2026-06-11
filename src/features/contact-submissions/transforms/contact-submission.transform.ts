import type { ContactSubmission } from "@generated/prisma/client";
import type {
  ContactSubmissionResponse,
  ContactListResponse,
} from "../types/contact-submission.types";

export function transformContact(c: ContactSubmission): ContactSubmissionResponse {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    message: c.message,
    status: c.status as ContactSubmissionResponse["status"],
    note: c.note,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export function transformContactList(
  contacts: ContactSubmission[],
  total: number
): ContactListResponse {
  return { contacts: contacts.map(transformContact), total };
}
