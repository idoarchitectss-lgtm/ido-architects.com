📋 Spec: Tiptap Rich Text Editor (CMS)
Vị trí file gốc: components/custom/tiptap/tiptap-editor.tsx + components/custom/tiptap/tiptap-editor-styles.css

1. Dependencies cần cài

"@tiptap/react": "^2.11.0",
"@tiptap/starter-kit": "^2.11.0",
"@tiptap/extension-underline": "^2.11.0",
"@tiptap/extension-link": "^2.11.0",
"@tiptap/extension-image": "^2.11.0",
"@tiptap/extension-text-align": "^2.11.0"
⚠️ Lưu ý quan trọng: repo còn cài thêm extension-code-block-lowlight, extension-color, extension-table (+cell/header/row), extension-placeholder, extension-heading, extension-italic, extension-text-style nhưng KHÔNG được dùng trong component này. Editor thực tế chỉ dùng 4 extension bên trên cộng StarterKit. Đừng để AI coding tự ý thêm table/code-highlight/color picker vào — bản gốc không có các tính năng đó trên toolbar.

2. Component props

interface TiptapEditorProps {
  content?: string          // HTML string, controlled
  onChange?: (content: string) => void   // trả về editor.getHTML()
  placeholder?: string      // default: "Bắt đầu viết nội dung..."
  className?: string
}
Là controlled component: có useEffect so sánh editor.getHTML() !== content để editor.commands.setContent(content, false) khi prop content đổi từ bên ngoài (tránh vòng lặp update).
useEditor({ immediatelyRender: false, ... }) — bắt buộc để tránh SSR hydration mismatch với Next.js App Router.
3. Extensions & config chính xác

StarterKit.configure({ heading: { levels: [1, 2, 3] } }), // chỉ cho phép H1-H3
Underline,
Link.configure({
  openOnClick: false,
  HTMLAttributes: { class: "text-primary underline underline-offset-2 hover:text-primary/80" },
}),
Image.configure({
  HTMLAttributes: { class: "max-w-full h-auto rounded-lg" },
}),
TextAlign.configure({ types: ["heading", "paragraph"] }),
editorProps.attributes.class = "prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6"

4. Toolbar — đầy đủ các nút (theo đúng thứ tự, dùng icon lucide-react)
Nhóm	Nút	Lệnh Tiptap	Icon
Format chữ	Bold	toggleBold()	Bold
Italic	toggleItalic()	Italic
Underline	toggleUnderline()	UnderlineIcon
Strikethrough	toggleStrike()	Strikethrough
Inline code	toggleCode()	Code
Heading	Paragraph	setParagraph()	Type
H1/H2/H3	toggleHeading({level})	Heading1/2/3
Căn lề	Left/Center/Right/Justify	setTextAlign(...)	AlignLeft/Center/Right/Justify
List/Block	Bullet list	toggleBulletList()	List
Ordered list	toggleOrderedList()	ListOrdered
Blockquote	toggleBlockquote()	Quote
Code block	toggleCodeBlock()	Code
Link/Media	Add link (Dialog + Input URL)	extendMarkRange("link").setLink({href})	LinkIcon
Insert image (Dialog mở MediaSelector)	setImage({src, alt})	ImageIcon
Remove link	unsetLink()	LinkIcon (gạch ngang)
Utility	Clear formatting	clearNodes().unsetAllMarks()	RemoveFormatting
Undo/Redo	undo()/redo()	Undo/Redo
Layout	Toggle fullscreen	state riêng, không phải lệnh Tiptap	Expand/Minimize
Mỗi nút là component ToolbarButton dùng Button (shadcn/ui) size h-8 w-8, variant="default" khi active (dùng editor.isActive(...)) / variant="ghost" khi không, có title = tooltip kèm phím tắt (vd "Bold (Ctrl+B)").

5. Tính năng chèn ảnh — QUAN TRỌNG
Không phải upload trực tiếp trong editor. Nút Image mở <Dialog> chứa component MediaSelector (thư viện media riêng của dự án, dùng Cloudinary qua next-cloudinary, có search/filter/folder). Khi chọn ảnh → handleMediaSelect gọi editor.chain().focus().setImage({ src: item.url, alt: item.altText || item.filename }).
→ Nếu AI coding không có sẵn hệ thống media library, họ cần thay bằng input URL ảnh đơn giản hoặc upload endpoint riêng — nói rõ điều này với AI coding để họ không bịa ra thư viện media giả.

6. Chế độ Fullscreen (tự viết, không phải extension)
State isFullscreen (useState).
Khi bật: backdrop overlay fixed inset-0 bg-black/50 + backdrop-filter: blur(8px), container editor chuyển fixed top-[5vh] left-[5vw] right-[5vw] bottom-[5vh] z-50, toolbar sticky top.
Nhấn phím ESC để thoát fullscreen (document.addEventListener('keydown', ...)).
Khi fullscreen, khóa scroll body (document.body.style.overflow = 'hidden').
Click vào backdrop cũng thoát fullscreen.
Font-size/line-height của heading, paragraph, list, blockquote tăng riêng trong mode fullscreen (định nghĩa trong CSS, xem mục 7).
7. CSS tùy chỉnh (file riêng tiptap-editor-styles.css, import global)
Toàn bộ style không dùng Tailwind Typography plugin dù có class prose — mà override thủ công từng thẻ .ProseMirror:

H1: 2.25rem/700, H2: 1.875rem/600, H3: 1.5rem/600 (fullscreen tăng lên 2.5rem/2rem/1.75rem)
p: margin-bottom: 1rem; line-height: 1.7 (fullscreen: 1.25rem/1.8)
blockquote: border-left 4px màu primary, background muted/30%, bo góc phải, italic
code inline: nền muted, border, border-radius, monospace
pre (code block): nền muted, border, padding, overflow-x auto — không có syntax highlighting (dù có cài lowlight nhưng không dùng)
img: border-radius: 0.5rem, box-shadow nhẹ
a: màu primary, underline offset 2px, hover giảm opacity
[data-text-align="..."]: text-align tương ứng
.ProseMirror-selectednode: outline 2px primary khi chọn ảnh
Custom scrollbar cho fullscreen (webkit only)
Placeholder: không dùng @tiptap/extension-placeholder, mà tự vẽ <div className="absolute top-6 left-6 ...">{placeholder}</div> hiển thị khi editor.isEmpty
8. Các nơi component này được dùng trong dự án (để AI coding hiểu context tái sử dụng)
ProductContentTab.tsx, AiForm.tsx, ContentTab.tsx (posts & ai-tools) — đều là form nhập nội dung mô tả sản phẩm/bài viết trong dashboard admin.

Những gì editor KHÔNG có (để tránh AI coding tự thêm thừa)
Không có bảng (table)
Không có syntax highlighting cho code block
Không có color/highlight text picker
Không có slash command (/) hay bubble menu/floating toolbar
Không có upload ảnh trực tiếp (kéo-thả hay paste) — chỉ qua thư viện media có sẵn
Không có collaborative editing, không có markdown shortcuts hiển thị riêng ngoài StarterKit mặc định
Không có character/word count
Bạn có thể copy nguyên phần trên dán vào prompt cho AI coding khác — đủ chi tiết để họ dựng lại đúng UI, đúng hành vi, và không "sáng tạo" thêm tính năng ngoài phạm vi bản gốc.