import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { CategoryUpdateSchema } from "@/features/categories/validations/category.schema";
import {
  findCategoryById,
  findCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "@/features/categories/services/category.service";

type Params = { params: Promise<{ id: string }> };

// GET /api/categories/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const category = await findCategoryById(id);
  if (!category) {
    return NextResponse.json({ error: "Không tìm thấy chuyên mục" }, { status: 404 });
  }
  return NextResponse.json(category);
}

// PUT /api/categories/[id] — admin only
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await findCategoryById(id);
  if (!existing) {
    return NextResponse.json({ error: "Không tìm thấy chuyên mục" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CategoryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  // Kiểm tra slug trùng (ngoài chính nó)
  if (parsed.data.slug && parsed.data.slug !== existing.slug) {
    const slugConflict = await findCategoryBySlug(parsed.data.slug);
    if (slugConflict) {
      return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 409 });
    }
  }

  const updated = await updateCategory(id, parsed.data);
  return NextResponse.json(updated);
}

// DELETE /api/categories/[id] — admin only
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await findCategoryById(id);
  if (!existing) {
    return NextResponse.json({ error: "Không tìm thấy chuyên mục" }, { status: 404 });
  }

  await deleteCategory(id);
  return NextResponse.json({ success: true });
}
