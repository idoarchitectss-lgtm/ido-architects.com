/**
 * staticData.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Dữ liệu tĩnh (hardcoded) cho các trang không có model Prisma.
 *
 * Đây là dữ liệu được nhúng trực tiếp trong code (không qua API / DB).
 * TODO: Tạo Prisma model và API route để quản lý các nội dung này qua Admin CMS.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type {
  ServicesNodeArr,
  AboutType,
} from "@/types/typeForWordpressData";
import type { HeroArr } from "@/types/types";

// ─── Services ─────────────────────────────────────────────────────────────────

/** Danh sách dịch vụ */
export function allServicesStatic(): ServicesNodeArr {
  return [
    {
      slug: "thiet-ke-kien-truc",
      title: "Thiết kế kiến trúc",
      excerpt: "Giải pháp kiến trúc sáng tạo, tối ưu công năng và thẩm mỹ cho mọi công trình.",
      featuredImage: { node: { sourceUrl: "/image/our-service.webp" } },
      serviceFields: {
        serviceName: "Thiết kế kiến trúc",
        descriptionOfService:
          "Chúng tôi cung cấp dịch vụ thiết kế kiến trúc toàn diện từ nhà ở, biệt thự đến công trình thương mại.",
      },
    },
    {
      slug: "thiet-ke-noi-that",
      title: "Thiết kế nội thất",
      excerpt: "Không gian sống tinh tế, hài hòa giữa thẩm mỹ và công năng sử dụng.",
      featuredImage: { node: { sourceUrl: "/image/our-service.webp" } },
      serviceFields: {
        serviceName: "Thiết kế nội thất",
        descriptionOfService:
          "Dịch vụ thiết kế nội thất theo phong cách hiện đại, tối giản hoặc cổ điển theo yêu cầu.",
      },
    },
    {
      slug: "tu-van-xay-dung",
      title: "Tư vấn xây dựng",
      excerpt: "Đồng hành cùng chủ đầu tư từ giai đoạn lên ý tưởng đến nghiệm thu công trình.",
      featuredImage: { node: { sourceUrl: "/image/our-service.webp" } },
      serviceFields: {
        serviceName: "Tư vấn xây dựng",
        descriptionOfService:
          "Tư vấn giám sát, lập dự toán và quản lý dự án xây dựng chuyên nghiệp.",
      },
    },
    {
      slug: "lap-du-toan",
      title: "Lập dự toán công trình",
      excerpt: "Kiểm soát chi phí xây dựng chính xác, minh bạch và hiệu quả.",
      featuredImage: { node: { sourceUrl: "/image/our-service.webp" } },
      serviceFields: {
        serviceName: "Lập dự toán công trình",
        descriptionOfService:
          "Phân tích và lập dự toán chi tiết giúp tối ưu ngân sách đầu tư.",
      },
    },
  ];
}

/** Lấy single service theo slug */
export function singleServiceStatic(slug: string) {
  const service = allServicesStatic().find((s) => s.slug === slug);
  if (!service) return null;
  return {
    title: service.title,
    excerpt: service.excerpt,
    content: `<h2>${service.title}</h2><p>${service.serviceFields.descriptionOfService}</p>`,
    serviceFields: service.serviceFields,
    slug: service.slug,
    featuredImage: service.featuredImage,
    seo: { metaKeywords: "", mateDesc: "", canonical: "", title: service.title },
  };
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

/** Hero banner data */
export function heroStatic(): HeroArr {
  return [
    {
      heros: {
        hero: {
          heroTitle: "Thiết kế thi công trọn gói chuyên nghiệp",
          heroSubtitle: "IDO-ARCHITECTS",
          heroBodyText:
            "",
          ctaButton: "Liên hệ",
          banner_img: {
            node: {
              altText: "IDO Architects – Thiết kế kiến trúc",
              sourceUrl: "/image/hero-banner-idoarchitects.jpg",
            },
          },
        },
      },
    },
    {
      heros: {
        hero: {
          heroTitle: "Thiết Kế Nội Thất – Hài Hòa Giữa Thẩm Mỹ & Công Năng",
          heroSubtitle: "DỊCH VỤ NỘI THẤT",
          heroBodyText:
            "Chúng tôi kiến tạo những không gian sống tinh tế, phản ánh cá tính và phong cách riêng của từng gia chủ.",
          ctaButton: "Xem dịch vụ",
          banner_img: {
            node: {
              altText: "Thiết kế nội thất IDO Architects",
              sourceUrl:
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1800&q=80",
            },
          },
        },
      },
    },
    {
      heros: {
        hero: {
          heroTitle: "Kiến Trúc Xanh – Bền Vững Theo Thời Gian",
          heroSubtitle: "DỰ ÁN NỔI BẬT",
          heroBodyText:
            "Mỗi công trình được nghiên cứu kỹ lưỡng từ phong thủy, công năng đến thẩm mỹ – kết hợp kiến trúc hiện đại và bản sắc Việt.",
          ctaButton: "Xem dự án",
          banner_img: {
            node: {
              altText: "Dự án kiến trúc IDO Architects",
              sourceUrl:
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80",
            },
          },
        },
      },
    },
  ];
}

// ─── About ────────────────────────────────────────────────────────────────────

/** About us data */
export function aboutStatic(): AboutType["abouts"]["nodes"] {
  return [
    {
      aboutComponent: {
        subtitle: "VỀ CHÚNG TÔI",
        title:
          "Dự án của Ido Architects là sự kết hợp giữa nghệ thuật kiến trúc và công năng sử dụng",
        bodytext:
          "IDO Architects là công ty thiết kế kiến trúc và nội thất hàng đầu, với đội ngũ kiến trúc sư giàu kinh nghiệm. Chúng tôi cam kết mang đến những giải pháp thiết kế sáng tạo, phù hợp với phong cách sống và tối ưu hóa công năng cho từng khách hàng.",
        image: {
          node: {
            altText: "IDO Architects",
            sourceUrl:
              "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop",
          },
        },
        button: { labelbtn: "Xem thêm", hrefbtn: "/gioi-thieu" },
      },
    },
  ];
}

// ─── Recruit ──────────────────────────────────────────────────────────────────

/** Trang tuyển dụng static data */
export function recruitPageStatic() {
  return {
    page: {
      content: `
        <div style="padding:20px">
          <h2>IDO Architects tuyển dụng</h2>
          <p>Chúng tôi đang tìm kiếm các tài năng trẻ để gia nhập đội ngũ IDO Architects.</p>
          <h3>Vị trí đang tuyển:</h3>
          <ul>
            <li>Kiến trúc sư thiết kế (2-5 năm kinh nghiệm)</li>
            <li>Kiến trúc sư nội thất</li>
            <li>Kỹ sư giám sát công trình</li>
          </ul>
          <p>Vui lòng gửi CV về email: <strong>tuyendung@ido-architects.com</strong></p>
        </div>
      `,
      slug: "tuyen-dung",
      title: "Tuyển dụng",
      featuredImage: {
        node: { altText: "tuyen dung", sourceUrl: "/image/bg-breadcrumb.webp" },
      },
    },
  };
}
