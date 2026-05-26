/**
 * Seed demo: 5 BLOG_POST + 5 PROJECT_POST
 * Chạy: pnpm tsx prisma/seed-demo.ts
 */
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ─── Nội dung HTML mẫu ────────────────────────────────────────────────────────
const sampleHtml = (title: string) => `
<h2>${title}</h2>
<p>
  Đây là nội dung demo cho bài viết <strong>${title}</strong>. IDO Architects chuyên thiết kế kiến trúc
  và nội thất cao cấp tại Đà Nẵng, mang lại không gian sống tinh tế, hài hòa với thiên nhiên.
</p>
<h3>Phong cách thiết kế</h3>
<p>
  Chúng tôi kết hợp giữa kiến trúc hiện đại và truyền thống Việt, tạo nên những công trình độc đáo, bền vững
  theo thời gian. Mỗi dự án được nghiên cứu kỹ lưỡng từ <em>phong thủy, công năng đến thẩm mỹ</em>.
</p>
<h3>Quy trình làm việc</h3>
<ol>
  <li>Tư vấn &amp; khảo sát thực địa</li>
  <li>Lập phương án thiết kế sơ bộ</li>
  <li>Phối cảnh 3D chi tiết</li>
  <li>Thi công &amp; giám sát</li>
  <li>Bàn giao và bảo hành</li>
</ol>
<p>Liên hệ IDO Architects để được tư vấn miễn phí ngay hôm nay!</p>
`;

// ─── Ảnh placeholder từ Unsplash ─────────────────────────────────────────────
const IMAGES = [
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
  "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
];

// ─── Dữ liệu BLOG_POST ────────────────────────────────────────────────────────
const BLOG_POSTS = [
  {
    title: "5 xu hướng thiết kế nhà ở hiện đại năm 2025",
    excerpt:
      "Khám phá những xu hướng kiến trúc nổi bật nhất năm 2025: minimalism, không gian mở, vật liệu xanh và tích hợp công nghệ thông minh.",
  },
  {
    title: "Bí quyết chọn vật liệu nội thất bền đẹp theo thời gian",
    excerpt:
      "Các chuyên gia IDO Architects chia sẻ kinh nghiệm lựa chọn vật liệu hoàn thiện phù hợp với khí hậu nhiệt đới miền Trung Việt Nam.",
  },
  {
    title: "Phong thủy trong thiết kế nhà ở – những điều cần biết",
    excerpt:
      "Tổng hợp những nguyên tắc phong thủy cơ bản giúp gia chủ có được không gian sống hanh thông, thuận lợi trong cuộc sống.",
  },
  {
    title: "Thiết kế nhà phố 3 tầng tối ưu trên diện tích 60m²",
    excerpt:
      "Giải pháp thiết kế thông minh giúp khai thác tối đa công năng cho nhà phố hẹp, tạo cảm giác rộng rãi và thoáng đãng.",
  },
  {
    title: "Màu sắc trong kiến trúc – ngôn ngữ của cảm xúc",
    excerpt:
      "Màu sắc không chỉ là yếu tố thẩm mỹ mà còn ảnh hưởng trực tiếp đến tâm trạng và cảm xúc của người sống trong không gian đó.",
  },
];

// ─── Dữ liệu PROJECT_POST ─────────────────────────────────────────────────────
const PROJECT_POSTS: {
  title: string;
  excerpt: string;
  projectMeta: {
    nameOfProject: string;
    addressOfProperty: string;
    completedYear: string;
    floorDimension: number;
    numberOfFloors: number;
    propertyType: string;
    designedCompany: string;
    isCompleted: boolean;
    isFeatured: boolean;
  };
}[] = [
  {
    title: "Biệt thự hiện đại The Sunrise – Ngũ Hành Sơn",
    excerpt:
      "Công trình biệt thự 3 tầng tọa lạc tại Ngũ Hành Sơn, Đà Nẵng với phong cách hiện đại tối giản, hướng biển thoáng đãng.",
    projectMeta: {
      nameOfProject: "The Sunrise Villa",
      addressOfProperty: "Ngũ Hành Sơn, Đà Nẵng",
      completedYear: "2024",
      floorDimension: 350,
      numberOfFloors: 3,
      propertyType: "Biệt thự",
      designedCompany: "IDO Architects",
      isCompleted: true,
      isFeatured: true,
    },
  },
  {
    title: "Nhà phố tân cổ điển – Hải Châu, Đà Nẵng",
    excerpt:
      "Nhà phố 4 tầng kết hợp phong cách tân cổ điển Châu Âu với vật liệu cao cấp, mang lại vẻ đẹp sang trọng và trường tồn.",
    projectMeta: {
      nameOfProject: "Grand Avenue House",
      addressOfProperty: "Hải Châu, Đà Nẵng",
      completedYear: "2024",
      floorDimension: 220,
      numberOfFloors: 4,
      propertyType: "Nhà phố",
      designedCompany: "IDO Architects",
      isCompleted: true,
      isFeatured: true,
    },
  },
  {
    title: "Căn hộ Penthouse Sky Garden – Sơn Trà",
    excerpt:
      "Penthouse 2 tầng đỉnh tòa nhà cao tầng tại Sơn Trà với sân vườn trời, bể bơi riêng và tầm nhìn 360° ra vịnh Đà Nẵng.",
    projectMeta: {
      nameOfProject: "Sky Garden Penthouse",
      addressOfProperty: "Sơn Trà, Đà Nẵng",
      completedYear: "2023",
      floorDimension: 280,
      numberOfFloors: 2,
      propertyType: "Căn hộ",
      designedCompany: "IDO Architects",
      isCompleted: true,
      isFeatured: false,
    },
  },
  {
    title: "Văn phòng Xanh EcoOffice – Liên Chiểu",
    excerpt:
      "Không gian văn phòng 5 tầng theo tiêu chí Green Building, tích hợp năng lượng mặt trời, vườn đứng và hệ thống thông gió tự nhiên.",
    projectMeta: {
      nameOfProject: "EcoOffice Tower",
      addressOfProperty: "Liên Chiểu, Đà Nẵng",
      completedYear: "2025",
      floorDimension: 1200,
      numberOfFloors: 5,
      propertyType: "Văn phòng",
      designedCompany: "IDO Architects",
      isCompleted: false,
      isFeatured: true,
    },
  },
  {
    title: "Resort Mini Homestay Ven Biển – Mỹ Khê",
    excerpt:
      "Quần thể 8 bungalow nghỉ dưỡng phong cách tropical hiện đại, khai thác tối đa cảnh quan bờ biển Mỹ Khê nổi tiếng.",
    projectMeta: {
      nameOfProject: "Mỹ Khê Tropical Resort",
      addressOfProperty: "Mỹ Khê, Đà Nẵng",
      completedYear: "2025",
      floorDimension: 800,
      numberOfFloors: 1,
      propertyType: "Resort",
      designedCompany: "IDO Architects",
      isCompleted: false,
      isFeatured: true,
    },
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Seeding demo posts...\n");

  // Lấy admin user
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) throw new Error("❌ Không tìm thấy admin. Chạy seed.ts trước!");

  // Lấy categories
  const catBietThu = await prisma.category.findUnique({ where: { slug: "biet-thu" } });
  const catNhaPho = await prisma.category.findUnique({ where: { slug: "nha-pho" } });
  const catTinTuc = await prisma.category.findUnique({ where: { slug: "tin-tuc" } });
  const catCanHo = await prisma.category.findUnique({ where: { slug: "can-ho" } });
  const catVanPhong = await prisma.category.findUnique({ where: { slug: "van-phong" } });

  const blogCategoryId = catTinTuc?.id;
  const projectCategoryIds = [catBietThu?.id, catNhaPho?.id, catCanHo?.id, catVanPhong?.id].filter(Boolean) as string[];

  // ─── Tạo BLOG_POST ───────────────────────────────────────────────────────────
  console.log("📝 Tạo 5 BLOG_POST...");
  for (let i = 0; i < BLOG_POSTS.length; i++) {
    const { title, excerpt } = BLOG_POSTS[i];
    const postSlug = slug(title);

    await prisma.post.upsert({
      where: { slug: postSlug },
      update: {},
      create: {
        type: "BLOG_POST",
        title,
        slug: postSlug,
        excerpt,
        content: sampleHtml(title),
        featuredImage: IMAGES[i],
        isPublished: true,
        publishedAt: new Date(Date.now() - i * 86400_000 * 3).toISOString(),
        metaTitle: title,
        metaDesc: excerpt,
        authorId: admin.id,
        categories: blogCategoryId
          ? { connect: [{ id: blogCategoryId }] }
          : undefined,
      },
    });
    console.log(`  ✅ Blog: ${title}`);
  }

  // ─── Tạo PROJECT_POST ─────────────────────────────────────────────────────────
  console.log("\n🏗️  Tạo 5 PROJECT_POST...");
  for (let i = 0; i < PROJECT_POSTS.length; i++) {
    const { title, excerpt, projectMeta } = PROJECT_POSTS[i];
    const postSlug = slug(title);

    await prisma.post.upsert({
      where: { slug: postSlug },
      update: {},
      create: {
        type: "PROJECT_POST",
        title,
        slug: postSlug,
        excerpt,
        content: sampleHtml(title),
        featuredImage: IMAGES[i + 5],
        isPublished: true,
        publishedAt: new Date(Date.now() - i * 86400_000 * 5).toISOString(),
        metaTitle: title,
        metaDesc: excerpt,
        projectMeta,
        authorId: admin.id,
        categories: {
          connect: projectCategoryIds.slice(0, 1).map((id) => ({ id })),
        },
      },
    });
    console.log(`  ✅ Project: ${title}`);
  }

  console.log("\n🎉 Seed demo hoàn tất!");
  console.log("   5 BLOG_POST + 5 PROJECT_POST đã được tạo.");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi seed demo:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
