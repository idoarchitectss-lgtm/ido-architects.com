// ─── Service response shape (API → client) ──────────────────────────────────
export type ServiceResponse = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featuredImage: string | null;
  icon: string | null;
  isPublished: boolean;
  sortOrder: number;
  metaTitle: string | null;
  metaDesc: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ServiceListResponse = {
  services: ServiceResponse[];
  total: number;
};
