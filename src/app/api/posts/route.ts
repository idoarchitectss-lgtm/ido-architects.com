import { NextRequest, NextResponse } from "next/server";
import { PostQuerySchema, PostCreateSchema } from "@/features/posts/validations/post.schema";
import { findManyPosts, createPost } from "@/features/posts/services/post.service";
import { transformPostList, transformPost } from "@/features/posts/transforms/post.transform";
import { auth } from "@/lib/auth";

// GET /api/posts?type=&page=&size=&showAll=&isFeatured=&isCompleted=
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const parsed = PostQuerySchema.safeParse(
    Object.fromEntries(searchParams.entries())
  );
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { posts, total } = await findManyPosts(parsed.data);
  const result = transformPostList(posts, total, parsed.data.page, parsed.data.size);

  return NextResponse.json(result);
}

// POST /api/posts (Admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PostCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const post = await createPost(parsed.data, session.user.id!);
  const result = transformPost(post);

  return NextResponse.json(result, { status: 201 });
}
