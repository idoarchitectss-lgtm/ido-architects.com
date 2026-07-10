import type { ContactSubmissionWithService } from "../services/contact-submission.data";
import type {
  ContactSubmissionResponse,
  ContactListResponse,
} from "../types/contact-submission.types";

export function transformContact(c: ContactSubmissionWithService): ContactSubmissionResponse {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    message: c.message,
    status: c.status as ContactSubmissionResponse["status"],
    note: c.note,
    serviceId: c.serviceId,
    service: c.service,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export function transformContactList(
  contacts: ContactSubmissionWithService[],
  total: number
): ContactListResponse {
  return { contacts: contacts.map(transformContact), total };
}
