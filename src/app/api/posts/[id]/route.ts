import { NextRequest, NextResponse } from "next/server";
import { PostUpdateSchema } from "@/features/posts/validations/post.schema";
import {
  findPostById,
  updatePost,
  deletePost,
} from "@/features/posts/services/post.service";
import { transformPost } from "@/features/posts/transforms/post.transform";
import { auth } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/posts/[id]
export async function GET(
  _req: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;

  const post = await findPostById(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(transformPost(post));
}

// PUT /api/posts/[id]
export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PostUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const existing = await findPostById(id);
  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const post = await updatePost(id, parsed.data);
  return NextResponse.json(transformPost(post));
}

// DELETE /api/posts/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const existing = await findPostById(id);
  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await deletePost(id);
  return NextResponse.json({ success: true });
}
