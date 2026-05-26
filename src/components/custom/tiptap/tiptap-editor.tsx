"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { Node, mergeAttributes, type NodeConfig } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import ImageCompareSlider from "./ImageCompareSlider";

// ─── ImageGrid custom TipTap node ────────────────────────────────────────────
const ImageGridExtension = Node.create({
  name: "imageGrid",
  group: "block",
  content: "image+",

  addAttributes() {
    return {
      cols: {
        default: 2,
        parseHTML: (element: HTMLElement) => {
          if (element.classList.contains("tiptap-image-grid--3")) return 3;
          return 2;
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.tiptap-image-grid" }];
  },

  renderHTML({ node, HTMLAttributes }: Parameters<NonNullable<NodeConfig["renderHTML"]>>[0]) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: `tiptap-image-grid tiptap-image-grid--${node.attrs.cols}`,
      }),
      0,
    ];
  },
});

// ─── ImageCompare custom TipTap node ─────────────────────────────────────────
function ImageCompareNodeView({ node }: ReactNodeViewProps) {
  return (
    <NodeViewWrapper contentEditable={false} data-drag-handle className="my-4">
      <ImageCompareSlider
        before={(node.attrs.before as string) ?? ""}
        after={(node.attrs.after as string) ?? ""}
      />
    </NodeViewWrapper>
  );
}

const ImageCompareExtension = Node.create({
  name: "imageCompare",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      before: { default: null },
      after:  { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-image-compare]" }];
  },

  renderHTML({ node, HTMLAttributes }: Parameters<NonNullable<NodeConfig["renderHTML"]>>[0]) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-image-compare": "",
        "data-before": node.attrs.before,
        "data-after":  node.attrs.after,
        class: "image-compare-container",
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageCompareNodeView);
  },
});

// ─── Toolbar button ───────────────────────────────────────────────────────────
function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "px-2 py-1 rounded text-sm font-medium transition-colors hover:bg-gray-200",
        active ? "bg-gray-900 text-white hover:bg-gray-800" : "text-gray-700"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px bg-gray-300 mx-1 self-stretch" />;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  /**
   * Khi người dùng nhấn nút "Chèn ảnh" trên toolbar, hàm này được gọi với
   * một callback `insertFn`. Component cha mở MediaSelector, khi chọn xong
   * gọi `insertFn(url)` để chèn ảnh vào editor.
   */
  onOpenMediaPicker?: (insertFn: (url: string) => void) => void;
  /**
   * Khi người dùng nhấn nút "Chèn nhiều ảnh/layout", hàm này được gọi với
   * một callback `insertFn`. Component cha mở MediaPicker ở mode layout,
   * khi chọn xong gọi `insertFn(urls, cols)`.
   */
  onOpenMediaPickerLayout?: (insertFn: (urls: string[], cols: number) => void) => void;
  /**
   * Khi người dùng nhấn nút "So sánh ảnh", hàm này được gọi với callback `insertFn`.
   * Component cha mở MediaPicker 2 lần (before → after), rồi gọi `insertFn(before, after)`.
   */
  onOpenMediaPickerCompare?: (insertFn: (before: string, after: string) => void) => void;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TiptapEditor({
  content = "",
  onChange,
  placeholder = "Viết nội dung bài viết ở đây...",
  className,
  onOpenMediaPicker,
  onOpenMediaPickerLayout,
  onOpenMediaPickerCompare,
}: TiptapEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  // Keep a ref to the latest editor so callbacks always get fresh instance
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-blue-600 underline" } }),
      Image.configure({ HTMLAttributes: { class: "max-w-full h-auto rounded-lg" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ImageGridExtension,
      ImageCompareExtension,
    ],
    content,
    editorProps: {
      attributes: {
        class: "focus:outline-none",
        "data-placeholder": placeholder,
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  // Keep ref in sync so async callbacks always use latest editor
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Sync khi content prop thay đổi từ bên ngoài
  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // ESC thoát fullscreen
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  // Khóa scroll body khi fullscreen
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  const insertLink = useCallback(() => {
    if (!linkUrl) return;
    editor?.chain().focus().setLink({ href: linkUrl }).run();
    setLinkUrl("");
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const insertImageUrl = useCallback(() => {
    if (onOpenMediaPicker) {
      onOpenMediaPicker((url: string) => {
        editor?.chain().focus().setImage({ src: url }).run();
      });
    } else {
      // fallback khi không có MediaPicker
      const url = window.prompt("Nhập URL ảnh:");
      if (url) editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor, onOpenMediaPicker]);

  const insertImageLayout = useCallback(() => {
    if (onOpenMediaPickerLayout) {
      onOpenMediaPickerLayout((urls: string[], cols: number) => {
        if (urls.length === 0) return;
        if (cols === 1 || urls.length === 1) {
          // Chèn từng ảnh đơn
          urls.forEach((url) => {
            editor?.chain().focus().setImage({ src: url }).run();
          });
        } else {
          // Chèn grid node (JSON) — không bị ProseMirror strip
          editor?.chain().focus().insertContent({
            type: "imageGrid",
            attrs: { cols },
            content: urls.map((url) => ({
              type: "image",
              attrs: { src: url, class: "max-w-full h-auto rounded-lg" },
            })),
          }).run();
        }
      });
    }
  }, [editor, onOpenMediaPickerLayout]);

  const insertImageCompare = useCallback(() => {
    if (!onOpenMediaPickerCompare) return;
    onOpenMediaPickerCompare((before: string, after: string) => {
      if (!before || !after) return;
      const ed = editorRef.current;
      if (!ed) return;
      // Insert atom node using commands
      ed.commands.insertContent({
        type: "imageCompare",
        attrs: { before, after },
      });
    });
  }, [onOpenMediaPickerCompare]);

  if (!editor) return null;

  const toolbar = (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-gray-50">
      {/* Định dạng văn bản */}
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
        <b>B</b>
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
        <i>I</i>
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)">
        <u>U</u>
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
        <s>S</s>
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
        {"<>"}
      </ToolbarBtn>

      <Divider />

      {/* Heading */}
      <ToolbarBtn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")} title="Paragraph">
        ¶
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
        H1
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
        H2
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
        H3
      </ToolbarBtn>

      <Divider />

      {/* Căn chỉnh */}
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Căn trái">
        ⬛
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Căn giữa">
        ☰
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Căn phải">
        ≡
      </ToolbarBtn>

      <Divider />

      {/* Lists */}
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Danh sách">
        •—
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Danh sách đánh số">
        1.
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
        "
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
        {"{}"}
      </ToolbarBtn>

      <Divider />

      {/* Link */}
      <ToolbarBtn onClick={() => setShowLinkInput((v) => !v)} active={editor.isActive("link")} title="Chèn link">
        🔗
      </ToolbarBtn>
      {editor.isActive("link") && (
        <ToolbarBtn onClick={() => editor.chain().focus().unsetLink().run()} title="Xóa link">
          🔗✕
        </ToolbarBtn>
      )}

      {/* Image */}
      <ToolbarBtn onClick={insertImageUrl} title={onOpenMediaPicker ? "Chèn ảnh từ thư viện" : "Chèn ảnh (URL)"}>
        🖼
      </ToolbarBtn>
      {onOpenMediaPickerLayout && (
        <ToolbarBtn onClick={insertImageLayout} title="Chèn nhiều ảnh / layout lưới">
          ⊞🖼
        </ToolbarBtn>
      )}
      {onOpenMediaPickerCompare && (
        <ToolbarBtn onClick={insertImageCompare} title="Chèn ảnh so sánh Trước / Sau">
          ◧🖼
        </ToolbarBtn>
      )}

      <Divider />

      {/* Undo / Redo */}
      <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo (Ctrl+Z)">
        ↩
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo (Ctrl+Y)">
        ↪
      </ToolbarBtn>

      <Divider />

      {/* Fullscreen */}
      <ToolbarBtn onClick={() => setIsFullscreen((v) => !v)} title={isFullscreen ? "Thu nhỏ (ESC)" : "Toàn màn hình"}>
        {isFullscreen ? "⊡" : "⊞"}
      </ToolbarBtn>
    </div>
  );

  const editorArea = (
    <div
      className={cn(
        "tiptap-editor-content overflow-y-auto",
        isFullscreen ? "tiptap-editor-fullscreen flex-1" : "min-h-[300px]"
      )}
      onClick={() => editor.commands.focus()}
    >
      <EditorContent editor={editor} />
    </div>
  );

  // Link input popup
  const linkInput = showLinkInput && (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-yellow-50 border-b border-yellow-200">
      <input
        type="url"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && insertLink()}
        placeholder="https://..."
        className="flex-1 text-sm border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-400"
        autoFocus
      />
      <button type="button" onClick={insertLink} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
        Chèn
      </button>
      <button type="button" onClick={() => setShowLinkInput(false)} className="text-sm text-gray-500 hover:text-gray-700">
        Hủy
      </button>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden">
          {toolbar}
          {linkInput}
          {editorArea}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden bg-white", className)}>
      {toolbar}
      {linkInput}
      {editorArea}
    </div>
  );
}
