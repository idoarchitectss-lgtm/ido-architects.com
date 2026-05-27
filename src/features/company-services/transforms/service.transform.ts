import type { Service } from "@generated/prisma/client";
import type { ServiceResponse, ServiceListResponse } from "../types/service.types";
import type { ServicesNodeArr } from "@/types/typeForWordpressData";

/**
 * Transform a Prisma Service model into a serializable API response.
 * Converts Date objects to ISO strings so NextResponse.json() serializes cleanly.
 */
export function transformService(service: Service): ServiceResponse {
  return {
    id:           service.id,
    title:        service.title,
    slug:         service.slug,
    excerpt:      service.excerpt,
    content:      service.content,
    featuredImage: service.featuredImage,
    icon:         service.icon,
    isPublished:  service.isPublished,
    sortOrder:    service.sortOrder,
    metaTitle:    service.metaTitle,
    metaDesc:     service.metaDesc,
    createdAt:    service.createdAt.toISOString(),
    updatedAt:    service.updatedAt.toISOString(),
  };
}

export function transformServiceList(
  services: Service[],
  total: number
): ServiceListResponse {
  return {
    services: services.map(transformService),
    total,
  };
}

// ─── UI adapter ──────────────────────────────────────────────────────────────
/**
 * Convert a ServiceResponse (from DB) into the legacy ServicesNodeArr item shape
 * so existing OfferServices / ServiceCarousel / ServiceItem components keep working
 * without modification.
 */
export function serviceResponseToNodeItem(
  service: ServiceResponse
): ServicesNodeArr[number] {
  return {
    slug: service.slug,
    title: service.title,
    excerpt: service.excerpt ?? "",
    featuredImage: {
      node: {
        sourceUrl: service.featuredImage ?? "/image/our-service.webp",
      },
    },
    serviceFields: {
      serviceName: service.title,
      descriptionOfService: service.excerpt ?? "",
    },
  };
}

export function serviceListToNodeArr(services: ServiceResponse[]): ServicesNodeArr {
  return services.map(serviceResponseToNodeItem);
}
