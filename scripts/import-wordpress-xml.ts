/**
 * Import WordPress WXR (XML) → IDO Architects Database
 * ─────────────────────────────────────────────────────
 * Đọc trực tiếp file export WordPress .xml và import vào DB.
 *
 * Chạy:
 *   pnpx dotenv-cli -e .env.local -- pnpm exec tsx scripts/import-wordpress-xml.ts
 *
 * Cấu trúc XML được parse:
 *   - post_type = "portfolio"  → PROJECT_POST
 *   - post_type = "attachment" → map wpId → URL (dùng cho ảnh đại diện)
 *   - Custom fields (ACF):
 *       nameOfProject, descriptionOfProject, imageOfProject (wp_id),
 *       generalInformation_completedYear, generalInformation_propertyType,
 *       generalInformation_floorDimension, generalInformation_numberOfFloors,
 *       generalInformation_addressOfProperty, generalInformation_designed_company,
 *       isFeatured, statusOfProject
 */

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import fs from "fs";
import path from "path";

// ─── Prisma ───────────────────────────────────────────────────────────────────

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Config ───────────────────────────────────────────────────────────────────

const XML_FILE = path.join(
  __dirname,
  "../src/data/wordpress/ido-architectsio.WordPress.2026-05-26.xml"
);
const ADMIN_EMAIL = "admin@idoarchitects.vn";
const SKIP_EXISTING = true; // false = update nếu đã tồn tại slug

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 200);
}

/** Lấy text trong CDATA hoặc tag thường */
function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))<\\/${tag}>`, "i");
  const m = xml.match(re);
  if (!m) return "";
  return (m[1] ?? m[2] ?? "").trim();
}

/** Lấy TẤT CẢ giá trị của tag (dùng cho postmeta) */
function extractAllTags(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))<\\/${tag}>`, "gi");
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    results.push((m[1] ?? m[2] ?? "").trim());
  }
  return results;
}

/** Parse tất cả <item>...</item> */
function parseItems(xml: string): string[] {
  const items: string[] = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    items.push(m[1]);
  }
  return items;
}

/** Parse postmeta thành Map<key, value> */
function parsePostMeta(itemXml: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /<wp:postmeta>\s*<wp:meta_key[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/wp:meta_key>\s*<wp:meta_value[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:meta_value>\s*<\/wp:postmeta>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(itemXml)) !== null) {
    const key = m[1].trim();
    const val = m[2].trim();
    if (!key.startsWith("_")) {
      // Ưu tiên key không underscore (giá trị thực, không phải field key)
      if (!map.has(key)) map.set(key, val);
    }
  }
  return map;
}

/** Lấy categories từ item */
function parseCategories(itemXml: string): string[] {
  const re = /<category[^>]*domain="portfoliio-category"[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/category>/g;
  const cats: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(itemXml)) !== null) {
    const name = m[1].trim();
    if (name) cats.push(name);
  }
  return cats;
}

/** Xóa WordPress Block comments, chuẩn hóa HTML */
function cleanContent(html: string): string {
  return html
    .replace(/<!-- wp:[^\n]*-->/g, "")
    .replace(/<!-- \/wp:[^\n]*-->/g, "")
    .replace(/<figure[^>]*>/g, "")
    .replace(/<\/figure>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Sanitise địa chỉ (WP lưu "http://ĐÀ NẴNG") */
function cleanAddress(raw: string): string {
  return raw.replace(/^https?:\/\//i, "").trim();
}

/** Chuyển "20220907" → "2022" */
function parseYear(raw: string): string {
  if (!raw) return "";
  const s = raw.replace(/\D/g, "");
  return s.slice(0, 4);
}

/** Map tên loại công trình WP → enum value (chỉ 5 loại) */
function mapPropertyType(raw: string): string {
  const s = raw.toLowerCase().trim();
  // Nhà phố / townhouse
  if (s.includes("nhà phố") || s.includes("nha pho") || s.includes("townhouse") || s.includes("town house")) return "townhouse";
  // Căn hộ / apartment
  if (s.includes("căn hộ") || s.includes("can ho") || s.includes("apartment") || s.includes("loft")) return "apartment";
  // Văn phòng / office — bao gồm thương mại, coffee, spa, retail
  if (
    s.includes("văn phòng") || s.includes("van phong") || s.includes("office") ||
    s.includes("thương mại") || s.includes("commercial") || s.includes("coffee") ||
    s.includes("spa") || s.includes("cửa hàng") || s.includes("shop") || s.includes("showroom")
  ) return "office";
  // Khách sạn / hotel — bao gồm resort, homestay, nhà hàng
  if (
    s.includes("khách sạn") || s.includes("khach san") || s.includes("hotel") ||
    s.includes("resort") || s.includes("homestay") || s.includes("nhà hàng") || s.includes("restaurant")
  ) return "hotel";
  // Villa / biệt thự — mặc định cho các loại không xác định
  return "villa";
}

// ─── Main parser ──────────────────────────────────────────────────────────────

interface ParsedPost {
  wpId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  status: string;
  thumbnailWpId: string;
  imageOfProjectWpId: string;
  categories: string[];
  meta: Map<string, string>;
}

interface ParsedAttachment {
  wpId: string;
  url: string;
  mimeType: string;
  width?: number;
  height?: number;
  filesize?: number;
  altText?: string;
  date: string;
  title: string;
}

function parseXml(xml: string): { posts: ParsedPost[]; attachments: ParsedAttachment[] } {
  const posts: ParsedPost[] = [];
  const attachments: ParsedAttachment[] = [];
  const items = parseItems(xml);

  for (const item of items) {
    const postType = extractTag(item, "wp:post_type");

    if (postType === "attachment") {
      const url = item.match(/<wp:attachment_url>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/wp:attachment_url>/)?.[1]?.trim() ?? "";
      if (!url) continue;

      const wpId = extractTag(item, "wp:post_id");
      const date = extractTag(item, "wp:post_date_gmt");
      const title = extractTag(item, "title");

      // Parse _wp_attachment_metadata for dimensions
      const metaMap = parsePostMeta(item);
      const rawMeta = metaMap.get("_wp_attachment_metadata") ?? "";
      const widthM = rawMeta.match(/"width";i:(\d+)/);
      const heightM = rawMeta.match(/"height";i:(\d+)/);
      const filesizeM = rawMeta.match(/"filesize";i:(\d+)/);
      const mimeM = rawMeta.match(/"mime-type";s:\d+:"([^"]+)"/);

      attachments.push({
        wpId,
        url,
        title,
        date,
        width: widthM ? parseInt(widthM[1]) : undefined,
        height: heightM ? parseInt(heightM[1]) : undefined,
        filesize: filesizeM ? parseInt(filesizeM[1]) : undefined,
        mimeType: mimeM?.[1] ?? guessContentType(url),
        altText: metaMap.get("_wp_attachment_image_alt") ?? "",
      });
      continue;
    }

    if (postType === "portfolio") {
      const wpId = extractTag(item, "wp:post_id");
      const title = extractTag(item, "title");
      const wpSlug = extractTag(item, "wp:post_name");
      const date = extractTag(item, "wp:post_date_gmt");
      const status = extractTag(item, "wp:status");
      const contentRaw = item.match(/<content:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/)?.[1] ?? "";
      const excerptRaw = item.match(/<excerpt:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/excerpt:encoded>/)?.[1]?.trim() ?? "";

      const meta = parsePostMeta(item);
      const thumbnailWpId = meta.get("_thumbnail_id") ?? "";
      const imageOfProjectWpId = meta.get("imageOfProject") ?? "";
      const categories = parseCategories(item);

      posts.push({
        wpId,
        title,
        slug: wpSlug,
        content: cleanContent(contentRaw),
        excerpt: excerptRaw,
        date,
        status,
        thumbnailWpId,
        imageOfProjectWpId,
        categories,
        meta,
      });
    }
  }

  return { posts, attachments };
}

function guessContentType(url: string): string {
  const ext = url.split(".").pop()?.toLowerCase().split("?")[0];
  const map: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg",
    png: "image/png", gif: "image/gif",
    webp: "image/webp", svg: "image/svg+xml",
  };
  return map[ext ?? ""] ?? "image/jpeg";
}

// ─── DB Import ────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 WordPress XML Import");
  console.log("═══════════════════════════════════════════════════\n");

  if (!fs.existsSync(XML_FILE)) {
    console.error(`❌ Không tìm thấy file: ${XML_FILE}`);
    process.exit(1);
  }

  const admin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!admin) {
    console.error(`❌ Không tìm thấy user: ${ADMIN_EMAIL} — chạy "pnpm db:seed" trước.`);
    process.exit(1);
  }
  console.log(`👤 Author: ${admin.name} (${admin.email})\n`);

  // Parse XML
  console.log("📖 Đang đọc và parse XML...");
  const xml = fs.readFileSync(XML_FILE, "utf-8");
  const { posts, attachments } = parseXml(xml);
  console.log(`   → ${posts.length} portfolio posts`);
  console.log(`   → ${attachments.length} attachments\n`);

  // Build wpId → URL map từ attachments
  const attachmentMap = new Map<string, ParsedAttachment>();
  for (const att of attachments) {
    attachmentMap.set(att.wpId, att);
  }

  // ── Import posts ────────────────────────────────────────────────────────────
  console.log(`📝 Importing ${posts.length} posts...`);
  let created = 0, skipped = 0, failed = 0;

  for (const wp of posts) {
    const slug = /^[a-z0-9-]+$/.test(wp.slug) ? wp.slug : makeSlug(wp.title);

    try {
      const existing = await prisma.post.findUnique({ where: { slug } });
      if (existing && SKIP_EXISTING) {
        console.log(`   ⏭  [skip] "${wp.title}"`);
        skipped++;
        continue;
      }

      // Resolve featured image URL
      const imageWpId = wp.imageOfProjectWpId || wp.thumbnailWpId;
      const featuredAtt = imageWpId ? attachmentMap.get(imageWpId) : undefined;
      const featuredImage = featuredAtt?.url ?? null;

      // Upsert categories
      const categoryConnects: { id: string }[] = [];
      for (const catName of wp.categories) {
        const catSlug = makeSlug(catName);
        const cat = await prisma.category.upsert({
          where: { slug: catSlug },
          update: {},
          create: { name: catName, slug: catSlug },
        });
        categoryConnects.push({ id: cat.id });
      }

      // Build projectMeta from ACF fields
      const m = wp.meta;
      const rawAddress = m.get("generalInformation_addressOfProperty") ?? m.get("addressOfProperty") ?? "";
      const rawYear = m.get("generalInformation_completedYear") ?? "";
      const rawPropertyType = m.get("generalInformation_propertyType") ?? "";
      const floorDim = parseFloat(m.get("generalInformation_floorDimension") ?? "0") || undefined;
      const numFloors = parseInt(m.get("generalInformation_numberOfFloors") ?? "0") || undefined;

      const projectMeta = {
        nameOfProject: m.get("nameOfProject") ?? wp.title,
        addressOfProperty: cleanAddress(rawAddress),
        completedYear: parseYear(rawYear),
        floorDimension: floorDim,
        numberOfFloors: numFloors,
        propertyType: rawPropertyType ? mapPropertyType(rawPropertyType) : "villa",
        designedCompany: m.get("generalInformation_designed_company") ?? "IDO Architects",
        isCompleted: m.get("statusOfProject") === "1",
        isFeatured: m.get("isFeatured") === "1" || m.get("labelofproject") === "1",
      };

      // Build excerpt — dùng descriptionOfProject hoặc mo_ta nếu có
      const excerpt =
        m.get("descriptionOfProject") ||
        m.get("mo_ta") ||
        wp.excerpt ||
        null;

      const isPublished = wp.status === "publish";

      const postData = {
        type: "PROJECT_POST" as const,
        title: wp.title,
        slug,
        excerpt,
        content: wp.content,
        featuredImage,
        isPublished,
        publishedAt: wp.date ? new Date(wp.date) : isPublished ? new Date() : null,
        projectMeta,
        authorId: admin.id,
      };

      if (existing && !SKIP_EXISTING) {
        await prisma.post.update({
          where: { slug },
          data: {
            ...postData,
            categories: { set: categoryConnects },
          },
        });
        console.log(`   ✏️  [update] "${wp.title}"`);
      } else {
        await prisma.post.create({
          data: {
            ...postData,
            categories: { connect: categoryConnects },
          },
        });
        console.log(`   ✅ [create] "${wp.title}"`);
      }

      created++;
    } catch (err) {
      console.error(`   ❌ [error] "${wp.title}": ${(err as Error).message}`);
      failed++;
    }
  }

  console.log(`\n📊 Kết quả:`);
  console.log(`   ✅ ${created} posts imported`);
  console.log(`   ⏭  ${skipped} posts skipped (đã tồn tại)`);
  console.log(`   ❌ ${failed} posts failed`);
  console.log("\n🎉 Import hoàn tất!");
}

main()
  .catch((e) => {
    console.error("\n💥 Import thất bại:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
