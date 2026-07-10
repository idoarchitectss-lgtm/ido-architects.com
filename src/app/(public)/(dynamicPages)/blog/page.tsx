import Loading from "@/app/loading";
import BackgroundForBreadcrumb from "@/components/custom/BackgroundForBreadcrumb";
import BreadcrumbComponent from "@/components/custom/breadcrumb/BreadcrumbComponent";
import CategoryCarousel from "@/components/custom/blog/CategoryCarousel";
import Container from "@/components/custom/container";
import PostCard from "@/components/custom/newsAndBlog/postCard";
import PaginationComponent from "@/components/custom/pagination/PaginationComponent";
import { allBlogsFromCMS, allBlogCategoriesFromCMS } from "@/data/datafromCMS";
import { Suspense } from "react";

interface SearchParamsProps {
    searchParams: Promise<{
        page?: string;
        query?: string;
        categoryId?: string;
    }>;
}

export default async function BlogPage({ searchParams }: Readonly<SearchParamsProps>) {
    const resolvedSearchParams = await searchParams;
    const currentPage = Number(resolvedSearchParams?.page) || 1;
    const categoryId = resolvedSearchParams?.categoryId;
    const res = await allBlogsFromCMS(10, currentPage, categoryId);
    const posts = res.edges.map((edge) => edge.node);
    const pageCount = res.pageInfo?.offsetPagination?.total;
    const categories = await allBlogCategoriesFromCMS();

    return (
        <main>
            <Suspense fallback={<Loading />}>
                <BackgroundForBreadcrumb
                    titleForPage="Trang blog và tin tức kiến trúc"
                />
                <Container className="my-8 md:my-20 space-y-10">
                    {/* Breadcrumb */}
                    <BreadcrumbComponent />

                    {/* Danh mục bài viết */}
                    <CategoryCarousel categories={categories} selectedCategoryId={categoryId} />
                    
                    {/* Danh sách bài viết */}
                    <div className="w-full mx-auto px-1">
                        <h2 className="text-xl md:text-3xl font-bold my-5">Tổng hợp các bài viết blog của IDO Architect</h2>
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
                            pageCount={Math.ceil((pageCount ?? 0) / 10)}
                        />
                    </div>
                </Container>
            </Suspense>
        </main>
    );
}
