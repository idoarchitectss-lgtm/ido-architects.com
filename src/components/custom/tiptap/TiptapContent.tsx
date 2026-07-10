import { cn } from "@/lib/utils";
import ImageCompareSlider from "./ImageCompareSlider";

/**
 * TiptapContent — renders HTML output from TipTap editor with full typography styling.
 * Uses @tailwindcss/typography `prose` class, customized to match site brand.
 * Supports inline rendering of image-compare nodes as interactive Before/After sliders.
 *
 * Usage:
 *   <TiptapContent html={post.content} />
 *   <TiptapContent html={post.excerpt} className="text-sm italic" />
 */
interface TiptapContentProps {
  html: string | null | undefined;
  className?: string;
}

// ─── Parse HTML into segments ─────────────────────────────────────────────────
type HtmlPart   = { type: "html"; html: string };
type ComparePart = { type: "compare"; before: string; after: string };
type ContentPart = HtmlPart | ComparePart;

function parseContent(html: string): ContentPart[] {
  const parts: ContentPart[] = [];
  // Matches: <div data-image-compare="" data-before="URL1" data-after="URL2" ...></div>
  const regex = /<div[^>]*data-image-compare[^>]*data-before="([^"]*)"[^>]*data-after="([^"]*)"[^>]*><\/div>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "html", html: html.slice(lastIndex, match.index) });
    }
    parts.push({ type: "compare", before: match[1], after: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    parts.push({ type: "html", html: html.slice(lastIndex) });
  }

  return parts;
}

// ─── Shared prose classes ─────────────────────────────────────────────────────
const PROSE_CLASSES = [
  "prose prose-stone max-w-none",
  "prose-headings:font-bold prose-headings:text-gray-900 prose-headings:leading-snug",
  "prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4",
  "prose-h2:text-2xl prose-h2:mt-7 prose-h2:mb-3 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:scroll-mt-24",
  "prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2 prose-h3:scroll-mt-24",
  "prose-h4:text-lg prose-h4:mt-5 prose-h4:mb-2",
  "prose-h5:text-base prose-h5:mt-4 prose-h5:mb-1",
  "prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-3",
  "prose-a:text-[#F6821F] prose-a:no-underline hover:prose-a:underline",
  "prose-strong:text-gray-900 prose-strong:font-semibold",
  "prose-em:text-gray-600",
  "prose-ul:my-3 prose-ul:pl-5 prose-ol:my-3 prose-ol:pl-5",
  "prose-li:text-gray-700 prose-li:my-1",
  "prose-blockquote:border-l-4 prose-blockquote:border-[#F6821F] prose-blockquote:pl-4",
  "prose-blockquote:text-gray-500 prose-blockquote:not-italic",
  "prose-code:text-red-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
  "prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:overflow-x-auto",
  "prose-img:rounded-xl prose-img:shadow-sm prose-img:my-5",
  "prose-hr:border-gray-200 prose-hr:my-8",
  "prose-table:text-sm prose-th:text-gray-900 prose-td:text-gray-700",
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
export default function TiptapContent({ html, className }: TiptapContentProps) {
  if (!html) return null;

  const parts = parseContent(html);

  // Fast path: no image-compare nodes — render as before (single div)
  if (parts.length === 1 && parts[0].type === "html") {
    return (
      <div
        className={cn(...PROSE_CLASSES, className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Has image-compare nodes — render HTML segments + sliders interleaved
  return (
    <div className={cn(...PROSE_CLASSES, className)}>
      {parts.map((part, i) =>
        part.type === "html" ? (
          <div key={i} dangerouslySetInnerHTML={{ __html: part.html }} />
        ) : (
          <ImageCompareSlider
            key={i}
            before={part.before}
            after={part.after}
            className="my-5 not-prose"
          />
        )
      )}
    </div>
  );
}

