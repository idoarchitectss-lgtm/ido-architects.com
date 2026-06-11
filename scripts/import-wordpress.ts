/**
 * WordPress Import Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Nhập dữ liệu bài viết dự án + media từ WordPress vào hệ thống IDO Architects.
 *
 * Cách dùng:
 *   1. Xuất dữ liệu WordPress ra file JSON (xem hướng dẫn bên dưới)
 *   2. Đặt file vào scripts/data/wp-posts.json và scripts/data/wp-media.json
 *   3. Chạy: pnpx dotenv-cli -e .env.local -- pnpm exec tsx scripts/import-wordpress.ts
 *
 * ─── Cách xuất dữ liệu từ WordPress ─────────────────────────────────────────
 * Cách 1 – Plugin WP All Export (khuyến nghị):
 *   - Cài plugin "WP All Export" hoặc "Export WP Page to Static HTML/CSS"
 *   - Export Posts → chọn fields: id, title, slug, content, excerpt,
 *     featured_image_url, date, categories, tags, custom fields (ACF nếu có)
 *   - Export Media → id, title, url, mime_type, width, height, alt_text
 *   - Save dạng JSON
 *
 * Cách 2 – WP REST API (nếu còn truy cập được site):
 *   GET https://your-wp-site.com/wp-json/wp/v2/posts?per_page=100&_embed
 *   GET https://your-wp-site.com/wp-json/wp/v2/media?per_page=100
 *
 * Cách 3 – Export thủ công từ phpMyAdmin:
 *   SELECT ID, post_title, post_name, post_content, post_excerpt,
 *          post_date, post_status FROM wp_posts WHERE post_type='post'
 *   Rồi copy sang JSON theo cấu trúc WpPost bên dưới.
 */

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import fs from "fs";
import path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Cấu trúc mỗi bài viết trong file wp-posts.json
 * Điều chỉnh field names cho khớp với file export của bạn.
 */
interface WpPost {
  id: number | string;
  title: string;                    // Tiêu đề bài viết
  slug: string;                     // Slug (post_name trong WP)
  content: string;                  // Nội dung HTML
  excerpt?: string;                 // Mô tả ngắn
  featured_image_url?: string;      // URL ảnh đại diện
  date?: string;                    // Ngày đăng, ISO string
  categories?: string[];            // Mảng tên category
  tags?: string[];                  // Mảng tên tag
  status?: string;                  // "publish" | "draft" | ...
  // ── Project meta (nếu dùng ACF hoặc custom fields) ──
  meta?: {
    nameOfProject?: string;
    addressOfProperty?: string;
    completedYear?: string;
    floorDimension?: number | string;
    numberOfFloors?: number | string;
    propertyType?: string;
    designedCompany?: string;
    isCompleted?: boolean | string;
    isFeatured?: boolean | string;
  };
}

/**
 * Cấu trúc mỗi ảnh trong file wp-media.json
 */
interface WpMedia {
  id: number | string;
  title?: string;
  url: string;                     // URL gốc trên WordPress
  mime_type?: string;              // "image/jpeg" | "image/png" | ...
  width?: number;
  height?: number;
  alt_text?: string;
  filesize?: number;               // bytes
  date?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(__dirname, "data");
const WP_POSTS_FILE = path.join(DATA_DIR, "wp-posts.json");
const WP_MEDIA_FILE = path.join(DATA_DIR, "wp-media.json");

/** Email của admin sẽ là author cho tất cả bài viết import */
const ADMIN_EMAIL = "admin@idoarchitects.vn";

/** Loại bài viết: PROJECT_POST hoặc BLOG_POST */
const DEFAULT_POST_TYPE = "PROJECT_POST" as const;

/**
 * Nếu true: bài viết đã có slug → bỏ qua (không overwrite).
 * Nếu false: update bài viết đã có.
 */
const SKIP_EXISTING = true;

// ─── Prisma setup ─────────────────────────────────────────────────────────────

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

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

/** Sanitise slug từ WordPress — giữ nếu hợp lệ, tự sinh nếu không */
function resolveSlug(wpSlug: string, title: string): string {
  const cleaned = wpSlug?.trim();
  if (cleaned && /^[a-z0-9-]+$/.test(cleaned)) return cleaned;
  return makeSlug(title);
}

function toBoolean(val: boolean | string | undefined): boolean {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val === "1" || val === "true" || val === "yes";
  return false;
}

function toNumber(val: number | string | undefined): number | undefined {
  if (val === undefined || val === null || val === "") return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}

function loadJson<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : parsed.data ?? parsed.posts ?? parsed.items ?? [];
}

// ─── Import Media ─────────────────────────────────────────────────────────────

async function importMedia(adminId: string): Promise<Map<string, string>> {
  /** Map: wp_url → new media id */
  const urlToId = new Map<string, string>();

  const wpMediaList = loadJson<WpMedia>(WP_MEDIA_FILE);
  if (wpMediaList.length === 0) {
    console.log("⚠️  Không tìm thấy wp-media.json hoặc file rỗng — bỏ qua import media.");
    return urlToId;
  }

  console.log(`\n📷 Import ${wpMediaList.length} media items...`);
  let created = 0, skipped = 0;

  for (const item of wpMediaList) {
    const url = item.url?.trim();
    if (!url) { skipped++; continue; }

    // Kiểm tra đã tồn tại chưa
    const existing = await prisma.media.findFirst({ where: { url } });
    if (existing) {
      urlToId.set(url, existing.id);
      skipped++;
      continue;
    }

    // Đoán filename từ URL
    const filename = url.split("/").pop()?.split("?")[0] ?? `wp-media-${item.id}`;

    const record = await prisma.media.create({
      data: {
        filename,
        url,
        contentType: item.mime_type ?? guessContentType(filename),
        size: item.filesize ?? 0,
        width: item.width ?? null,
        height: item.height ?? null,
        alt: item.alt_text ?? item.title ?? null,
        uploadedBy: adminId,
        createdAt: item.date ? new Date(item.date) : undefined,
      },
    });

    urlToId.set(url, record.id);
    created++;
  }

  console.log(`   ✅ ${created} media created, ${skipped} skipped.`);
  return urlToId;
}

function guessContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg",
    png: "image/png", gif: "image/gif",
    webp: "image/webp", svg: "image/svg+xml",
  };
  return map[ext ?? ""] ?? "image/jpeg";
}

// ─── Import Posts ─────────────────────────────────────────────────────────────

async function importPosts(adminId: string) {
  const wpPosts = loadJson<WpPost>(WP_POSTS_FILE);
  if (wpPosts.length === 0) {
    console.log("⚠️  Không tìm thấy wp-posts.json hoặc file rỗng — bỏ qua import posts.");
    return;
  }

  console.log(`\n📝 Import ${wpPosts.length} posts...`);
  let created = 0, skipped = 0, failed = 0;

  for (const wp of wpPosts) {
    const slug = resolveSlug(wp.slug, wp.title);

    try {
      // Kiểm tra đã tồn tại
      const existing = await prisma.post.findUnique({ where: { slug } });
      if (existing && SKIP_EXISTING) {
        console.log(`   ⏭  [skip] "${wp.title}" (slug: ${slug})`);
        skipped++;
        continue;
      }

      // Upsert categories
      const categoryConnects: { id: string }[] = [];
      for (const catName of wp.categories ?? []) {
        const catSlug = makeSlug(catName);
        const cat = await prisma.category.upsert({
          where: { slug: catSlug },
          update: {},
          create: { name: catName, slug: catSlug },
        });
        categoryConnects.push({ id: cat.id });
      }

      // Upsert tags
      const tagConnects: { id: string }[] = [];
      for (const tagName of wp.tags ?? []) {
        const tagSlug = makeSlug(tagName);
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName, slug: tagSlug },
        });
        tagConnects.push({ id: tag.id });
      }

      // Build projectMeta
      const m = wp.meta;
      const projectMeta = m
        ? {
            nameOfProject: m.nameOfProject ?? wp.title,
            addressOfProperty: m.addressOfProperty,
            completedYear: m.completedYear,
            floorDimension: toNumber(m.floorDimension),
            numberOfFloors: toNumber(m.numberOfFloors),
            propertyType: m.propertyType,
            designedCompany: m.designedCompany ?? "IDO Architects",
            isCompleted: toBoolean(m.isCompleted),
            isFeatured: toBoolean(m.isFeatured),
          }
        : {
            nameOfProject: wp.title,
            designedCompany: "IDO Architects",
            isCompleted: true,
            isFeatured: false,
          };

      const isPublished = !wp.status || wp.status === "publish";

      const data = {
        type: DEFAULT_POST_TYPE,
        title: wp.title,
        slug,
        excerpt: wp.excerpt ?? null,
        content: wp.content ?? "",
        featuredImage: wp.featured_image_url ?? null,
        isPublished,
        publishedAt: wp.date ? new Date(wp.date) : isPublished ? new Date() : null,
        projectMeta,
        authorId: adminId,
        categories: { set: categoryConnects },
        tags: { set: tagConnects },
      };

      if (existing && !SKIP_EXISTING) {
        await prisma.post.update({ where: { slug }, data });
        console.log(`   ✏️  [update] "${wp.title}"`);
      } else {
        await prisma.post.create({
          data: {
            ...data,
            categories: { connect: categoryConnects },
            tags: { connect: tagConnects },
          },
        });
        console.log(`   ✅ [create] "${wp.title}"`);
      }

      created++;
    } catch (err) {
      console.error(`   ❌ [error] "${wp.title}":`, (err as Error).message);
      failed++;
    }
  }

  console.log(`\n   📊 Posts: ${created} imported, ${skipped} skipped, ${failed} failed.`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 WordPress Import Script");
  console.log("═══════════════════════════════════════════════════\n");

  // Validate data dir
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`📁 Đã tạo thư mục: scripts/data/`);
    console.log(`   → Đặt file wp-posts.json và wp-media.json vào đó rồi chạy lại.\n`);
    console.log(`   Xem hướng dẫn cấu trúc JSON trong file này (phần đầu file).\n`);
    process.exit(0);
  }

  // Lấy admin user
  const admin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!admin) {
    console.error(`❌ Không tìm thấy user: ${ADMIN_EMAIL}`);
    console.error(`   Chạy "pnpm db:seed" trước để tạo admin user.`);
    process.exit(1);
  }
  console.log(`👤 Author: ${admin.name} (${admin.email})\n`);

  // Import media trước (để có URL map nếu cần)
  await importMedia(admin.id);

  // Import posts
  await importPosts(admin.id);

  console.log("\n🎉 Import hoàn tất!");
}

main()
  .catch((e) => {
    console.error("\n💥 Import thất bại:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
