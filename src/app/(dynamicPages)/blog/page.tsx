import Loading from "@/app/loading";
import BackgroundForBreadcrumb from "@/components/custom/BackgroundForBreadcrumb";
import Container from "@/components/custom/container";
import PostCard from "@/components/custom/newsAndBlog/postCard";
import PaginationComponent from "@/components/custom/pagination/PaginationComponent";
import { getAllPosts } from "@/lib/api";

import { PostsDataProps } from "@/types/typeForWordpressData"
import { usePathname } from "next/navigation";
import { Suspense } from "react";


type Edges = PostsDataProps['posts']

interface SearchParamsProps {
    searchParams?: {
        page?: string;
        query?: string;
    }
}




export default async function BlogPage({ searchParams }: Readonly<SearchParamsProps>) {

    const currentPage = Number(searchParams?.page) || 1;
    // cần lấy thông tin currentPage
    const res: Edges = await getAllPosts(10, currentPage);
    const posts = res.edges.map((edge) => edge.node)
    const pageCount = res.pageInfo?.offsetPagination?.total
    // console.log(posts)
    return (
        <main>
            <Suspense fallback={<Loading />}>
            <BackgroundForBreadcrumb />
                <Container>
                    <h2 className="text-3xl font-bold my-5">Tổng hợp các bài viết blog của IDO Architect</h2>
                    {/* rendering all posts */}
                    <Suspense>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-10">
                            {posts?.map((post) => (
                                <PostCard
                                    key={post.slug}
                                    srcOfImg={post?.featuredImage?.node.sourceUrl || ''}
                                    author={post?.author?.node.name}
                                    publishedDate={post.date}
                                    titleOfPost={post.title}
                                    subtitleOfPost={post.excerpt}
                                    tagsList={post.tags.nodes}
                                    link={`blog/${post.slug}`}
                                />
                            ))}
                        </div>
                    </Suspense>
                    <div className="my-5">
                    <PaginationComponent
                        pageCount={pageCount}
                    />
                    </div>
                </Container>
            </Suspense>

        </main>
    )
}