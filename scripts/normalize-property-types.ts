/**
 * Normalize propertyType trong projectMeta của tất cả PROJECT_POST về 5 loại chuẩn:
 *   villa | townhouse | apartment | office | hotel
 *
 * Chạy: pnpx dotenv-cli -e .env.local -- pnpm exec tsx scripts/normalize-property-types.ts
 */
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const VALID = new Set(["villa", "townhouse", "apartment", "office", "hotel"]);

function normalize(raw: string | undefined | null, title = ""): string {
  const pt = (raw ?? "").toLowerCase().trim();
  const t = title.toLowerCase();

  // Nhà phố — ưu tiên check title trước vì "nhà phố" rõ ràng
  if (t.includes("nhà phố") || t.includes("nha pho") || pt === "townhouse") return "townhouse";
  // Căn hộ — nhưng chú ý "kết hợp căn hộ để ở" trong Spa thì không phải căn hộ
  if ((t.includes("căn hộ") || t.includes("apartment") || pt === "apartment") &&
      !t.includes("spa") && !t.includes("coffee") && !t.includes("tiệm") && !t.includes("quán")) return "apartment";
  // Khách sạn / resort
  if (
    t.includes("khách sạn") || t.includes("hotel") || t.includes("resort") ||
    t.includes("homestay") || t.includes("nhà hàng") ||
    pt === "hotel"
  ) return "hotel";
  // Văn phòng / thương mại / dịch vụ — coffee, spa, tiệm, quán
  if (
    t.includes("văn phòng") || t.includes("van phong") || t.includes("office") ||
    t.includes("coffee") || t.includes("cafe") || t.includes("cà phê") ||
    t.includes("spa") || t.includes("tiệm") || t.includes("quán") ||
    t.includes("showroom") || t.includes("shop") || t.includes("cửa hàng") ||
    t.includes("thương mại") || t.includes("commercial") ||
    pt === "office"
  ) return "office";
  // Villa / biệt thự — hoặc mặc định
  return "villa";
}

async function main() {
  console.log("🔧 Normalizing propertyType in all PROJECT_POST records...\n");

  const posts = await prisma.post.findMany({
    where: { type: "PROJECT_POST" },
    select: { id: true, title: true, projectMeta: true },
  });

  console.log(`Found ${posts.length} PROJECT_POST records.\n`);

  let updated = 0, skipped = 0;

  for (const post of posts) {
    const meta = post.projectMeta as Record<string, unknown> | null;
    if (!meta) { skipped++; continue; }

    const current = meta.propertyType as string | undefined;
    const normalized = normalize(current, post.title);

    if (current === normalized) {
      skipped++;
      continue;
    }

    await prisma.post.update({
      where: { id: post.id },
      data: {
        projectMeta: { ...meta, propertyType: normalized },
      },
    });

    console.log(`   ✅ "${post.title}"`);
    console.log(`      "${current ?? "(empty)"}" → "${normalized}"`);
    updated++;
  }

  console.log(`\n📊 ${updated} updated, ${skipped} already valid / skipped.`);
  console.log("🎉 Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
