import { NextRequest, NextResponse } from "next/server";
import { findPostBySlug } from "@/features/posts/services/post.service";
import { transformPost } from "@/features/posts/transforms/post.transform";

// GET /api/posts/slug/[slug]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const post = await findPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(transformPost(post));
}
