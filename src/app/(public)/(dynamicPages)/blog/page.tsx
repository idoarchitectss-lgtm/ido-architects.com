import Loading from "@/app/loading";
import BackgroundForBreadcrumb from "@/components/custom/BackgroundForBreadcrumb";
import BreadcrumbComponent from "@/components/custom/breadcrumb/BreadcrumbComponent";
import Container from "@/components/custom/container";
import PostCard from "@/components/custom/newsAndBlog/postCard";
import PaginationComponent from "@/components/custom/pagination/PaginationComponent";
import { allBlogsFromCMS } from "@/data/datafromCMS";
import { Suspense } from "react";

interface SearchParamsProps {
    searchParams?: {
        page?: string;
        query?: string;
    };
}

export default async function BlogPage({ searchParams }: Readonly<SearchParamsProps>) {
    const currentPage = Number(searchParams?.page) || 1;
    const res = await allBlogsFromCMS(10, currentPage);
    const posts = res.edges.map((edge) => edge.node);
    const pageCount = res.pageInfo?.offsetPagination?.total;

    return (
        <main>
            <Suspense fallback={<Loading />}>
                <BackgroundForBreadcrumb
                    titleForPage="Trang blog và tin tức kiến trúc"
                />
                <Container className="">
                    <BreadcrumbComponent />
                    <div className="w-full mx-auto">
                        <h2 className="text-3xl font-bold my-5">Tổng hợp các bài viết blog của IDO Architect</h2>
                        <Suspense>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-10">
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
                        <PaginationComponent
                            totalPages={Math.ceil((pageCount ?? 0) / 10)}
                            currentPage={currentPage}
                        />
                    </div>
                </Container>
            </Suspense>
        </main>
    );
}
