import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Tạo admin user
  const hashedPassword = await bcrypt.hash("admin123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@idoarchitects.vn" },
    update: {},
    create: {
      name: "IDO Admin",
      email: "admin@idoarchitects.vn",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Tạo một số categories mẫu
  const categories = [
    { name: "Biệt thự", slug: "biet-thu", type: "PROJECT_POST" as const },
    { name: "Nhà phố", slug: "nha-pho", type: "PROJECT_POST" as const },
    { name: "Căn hộ", slug: "can-ho", type: "PROJECT_POST" as const },
    { name: "Văn phòng", slug: "van-phong", type: "PROJECT_POST" as const },
    { name: "Kiến trúc nội thất", slug: "kien-truc-noi-that", type: "PROJECT_POST" as const },
    { name: "Tin tức", slug: "tin-tuc", type: "BLOG_POST" as const },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { type: cat.type },
      create: cat,
    });
  }

  console.log(`✅ ${categories.length} categories created`);
  console.log("\n🎉 Seed complete!");
  console.log("   Email:    admin@idoarchitects.vn");
  console.log("   Password: admin123456");
  console.log("   ⚠️  Đổi mật khẩu sau khi đăng nhập lần đầu!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
