import Loading from "@/app/loading";
import BreadcrumbComponent from "@/components/custom/breadcrumb/BreadcrumbComponent";
import Container from "@/components/custom/container";
import { processHeadings } from "@/components/custom/tiptap/heading-utils";
import { portfolios } from "@/types/typeForWordpressData";
import { Suspense } from "react";
import SideBarComponent from "../../blog/[post]/SideBarComponent";
import BodyPortfolio from "./BodyPortfolio";
import FooterPortfolio from "./FooterPortfolio";
import HeaderPortfolio from "./HeaderPortfolio";
import {
    allProjectsFromCMS,
    getSingleProjectFromCMS,
} from "@/data/datafromCMS";
import { getPublishedSlugsByType } from "@/features/posts/services/post.service";
import { PostType } from "@generated/prisma/client";

interface Params {
    portfolio: string
}

export async function generateStaticParams() {
    try {
        const slugs = await getPublishedSlugsByType(PostType.PROJECT_POST);
        return slugs.map((slug) => ({ portfolio: slug }));
    } catch (error) {
        console.error('Error in generateStaticParams portfolio:', error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
    try {
        const { portfolio: portfolioSlug } = await params;
        const res = await getSingleProjectFromCMS(portfolioSlug);
        const portfolio: portfolios | undefined = res?.portfolio;
        const imageUrl = portfolio?.featuredImage?.node.sourceUrl || '';

        return {
            title: portfolio?.title ?? 'Dự án',
            description: portfolio?.excerpt ?? 'Các dự án tại Ido Architects',
            openGraph: {
                title: portfolio?.title,
                description: portfolio?.excerpt,
                url: `https://www.ido-architects.com/du-an/${portfolioSlug}`,
                type: 'article',
                images: imageUrl ? [{ url: imageUrl, width: 800, height: 600, alt: portfolio?.title }] : [],
            },
        };
    } catch (error) {
        console.error('Error in generateMetadata portfolio:', error);
        return {
            title: 'Không có portfolio nào phù hợp',
            description: 'Các dự án tại Ido Architects',
        };
    }
}

export default async function DetailPortfolioPage({ params }: { params: Promise<Params> }) {
    const { portfolio: portfolioSlug } = await params;
    const res = await getSingleProjectFromCMS(portfolioSlug);
    const portfolio: portfolios | undefined = res?.portfolio;

    const { portfoliosArray } = await allProjectsFromCMS();
    const { headings } = portfolio ? processHeadings(portfolio.content ?? '') : { headings: [] };

    return (
        <main>
            <Suspense fallback={<Loading />}>
                <Container>
                    <BreadcrumbComponent />
                    {portfolio ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3">
                            <div className="col-span-3 lg:col-span-2 border-0">
                                <HeaderPortfolio portfolio={portfolio} />
                                <BodyPortfolio portfolio={portfolio} />
                                <FooterPortfolio portfolioArr={portfoliosArray} />
                            </div>
                            <div className="relative col-span-1 hidden lg:block ml-5 w-full">
                                <SideBarComponent headings={headings} />
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center text-gray-400">
                            Không tìm thấy dự án.
                        </div>
                    )}
                </Container>
            </Suspense>
        </main>
    );
}
