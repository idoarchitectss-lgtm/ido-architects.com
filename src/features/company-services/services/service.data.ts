import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@generated/prisma/client";
import type { ServiceCreateInput, ServiceUpdateInput, ServiceQuery } from "../validations/service.schema";
import type { Service } from "@generated/prisma/client";

// ─── Find many ────────────────────────────────────────────────────────────────
export async function findManyServices(
  query: ServiceQuery
): Promise<{ services: Service[]; total: number }> {
  const { page, size, search, showAll } = query;

  const where: Prisma.ServiceWhereInput = {};

  if (!showAll) {
    where.isPublished = true;
  }

  if (search?.trim()) {
    where.OR = [
      { title: { contains: search.trim(), mode: "insensitive" } },
      { slug: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * size,
      take: size,
    }),
    prisma.service.count({ where }),
  ]);

  return { services, total };
}

// ─── Find one ─────────────────────────────────────────────────────────────────
export async function findServiceById(id: string): Promise<Service | null> {
  return prisma.service.findUnique({ where: { id } });
}

export async function findServiceBySlug(slug: string): Promise<Service | null> {
  return prisma.service.findUnique({ where: { slug } });
}

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createService(data: ServiceCreateInput): Promise<Service> {
  return prisma.service.create({ data });
}

// ─── Update ───────────────────────────────────────────────────────────────────
export async function updateService(id: string, data: ServiceUpdateInput): Promise<Service> {
  return prisma.service.update({ where: { id }, data });
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function deleteService(id: string): Promise<void> {
  await prisma.service.delete({ where: { id } });
}
