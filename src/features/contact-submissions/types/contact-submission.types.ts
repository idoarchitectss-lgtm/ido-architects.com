export type ContactStatus = "NEW" | "READ" | "RESOLVED" | "SPAM";

export type ContactSubmissionResponse = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  status: ContactStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContactListResponse = {
  contacts: ContactSubmissionResponse[];
  total: number;
};
