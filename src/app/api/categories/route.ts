import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  CategoryCreateSchema,
} from "@/features/categories/validations/category.schema";
import {
  findAllCategories,
  findCategoryBySlug,
  createCategory,
} from "@/features/categories/services/category.service";

// GET /api/categories — public
export async function GET() {
  const raw = await findAllCategories();
  const categories = raw.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    postCount: c._count.posts,
    createdAt: c.createdAt,
  }));
  return NextResponse.json(categories);
}

// POST /api/categories — admin only
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CategoryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const existing = await findCategoryBySlug(parsed.data.slug);
  if (existing) {
    return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 409 });
  }

  const category = await createCategory(parsed.data);
  return NextResponse.json(category, { status: 201 });
}
