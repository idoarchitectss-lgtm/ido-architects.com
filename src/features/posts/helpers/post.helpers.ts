/**
 * Helpers thuần — không import prisma, không server-only
 * Dùng được ở cả server và client
 */

// ─── Slug generator từ tiếng Việt ─────────────────────────────────────────────
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // bỏ dấu
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
}

// ─── Excerpt từ content HTML ──────────────────────────────────────────────────
export function generateExcerpt(content: string, maxLength = 160): string {
  // Bỏ HTML tags
  const plain = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

// ─── Reading time (phút) ──────────────────────────────────────────────────────
export function calcReadingTime(content: string): number {
  const plain = content.replace(/<[^>]+>/g, " ");
  const words = plain.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200)); // ~200 words/phút
}

// ─── Format published date ────────────────────────────────────────────────────
export function formatPublishedDate(isoString: string | null): string {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
