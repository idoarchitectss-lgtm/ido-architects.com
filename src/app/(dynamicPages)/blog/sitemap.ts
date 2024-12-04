import { getAllPosts } from "@/lib/api";
import { BASE_URL } from "@/lib/constants";
import { PostsDataProps } from "@/types/typeForWordpressData";
import { MetadataRoute } from "next";

export default async function sitemap():Promise<MetadataRoute.Sitemap> {
    const res:PostsDataProps['posts'] = await getAllPosts(100,1);
    const posts = res.edges || [];

    return posts?.map((post)=>({
        url:`${BASE_URL}/blog/${post.node.slug}`,
        lastModified:post.node.date,
        changeFrequency:'daily',
        priority:1
    }
));
}