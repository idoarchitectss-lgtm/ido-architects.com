export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

// Bỏ dấu tiếng Việt bằng cách tách tổ hợp NFD rồi loại các ký tự combining mark (U+0300–U+036F)
function removeDiacritics(text: string): string {
  return text
    .normalize("NFD")
    .split("")
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code < 0x0300 || code > 0x036f;
    })
    .join("");
}

function slugify(text: string): string {
  const ascii = removeDiacritics(text.replace(/đ/g, "d").replace(/Đ/g, "D"));
  return (
    ascii
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

/**
 * Quét các thẻ <h2>/<h3> trong HTML, gán id (nếu chưa có) để làm anchor,
 * đồng thời trả về danh sách heading dùng cho Table of Content.
 */
export function processHeadings(html: string): { html: string; headings: TocHeading[] } {
  if (!html) return { html, headings: [] };

  const headings: TocHeading[] = [];
  const usedIds = new Map<string, number>();

  const result = html.replace(
    /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag: string, attrs: string, inner: string) => {
      const text = stripTags(inner);
      if (!text) return match;

      const baseId = slugify(text);
      const count = usedIds.get(baseId) ?? 0;
      usedIds.set(baseId, count + 1);
      const id = count === 0 ? baseId : `${baseId}-${count}`;

      headings.push({ id, text, level: tag.toLowerCase() === "h2" ? 2 : 3 });

      const cleanedAttrs = attrs.replace(/\sid="[^"]*"/i, "");
      return `<${tag}${cleanedAttrs} id="${id}">${inner}</${tag}>`;
    }
  );

  return { html: result, headings };
}
