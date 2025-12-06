import Loading from "@/app/loading";
import BreadcrumbComponent from "@/components/custom/breadcrumb/BreadcrumbComponent";
import Container from "@/components/custom/container";
import { getAllPortfolios, getSinglePortfolio } from "@/lib/api";
import { portfolios } from "@/types/typeForWordpressData";
import { Suspense } from "react";
import SideBarComponent from "../../blog/[post]/SideBarComponent";
import BodyPortfolio from "./BodyPortfolio";
import FooterPortfolio from "./FooterPortfolio";
import HeaderPortfolio from "./HeaderPortfolio";

interface Params {
    portfolio: string
}

export async function generateStaticParams() {
    try {
<<<<<<< HEAD
    const data = await getAllPortfolios();
    const portfolios: portfolios[] = data?.nodes || []
    return portfolios.map((portfolio) => ({
        id: portfolio.slug
    }))
=======
        const data = await getAllPortfolios();
        const portfolios: portfolios[] = data?.nodes || []
        return portfolios.map((portfolio) => ({
            id: portfolio.slug
        }))
>>>>>>> develop
    } catch (error) {
        console.error('Error in generateStaticParams portfolio:', error);
        return [];
    }
}


<<<<<<< HEAD
export async function generateMetadata({params}:{params:Params}) {
    try {
    const res = await getSinglePortfolio(params.portfolio)
    const portfolio: portfolios = await res.portfolio;
=======
export async function generateMetadata({ params }: { params: Params }) {
    try {
        const res = await getSinglePortfolio(params.portfolio)
        const portfolio: portfolios = await res.portfolio;
>>>>>>> develop

        const imageUrl = portfolio?.featuredImage?.node.sourceUrl || '';
        const validImageUrl = imageUrl ? new URL(imageUrl).toString() : '';

<<<<<<< HEAD
    
    return {
        title: portfolio?.title,
        description: portfolio?.excerpt,
        opengraph: {
            title:portfolio?.title,
            Description:portfolio?.excerpt,
            url: `https://www.ido-architects.com/du-an/${params.portfolio}`,
            type: 'article',
            images: validImageUrl ? [
                {
                    url: validImageUrl,
                    width: 800,
                    height: 600,
                    alt: portfolio?.title,
                },
            ] : [],
        }
    }
    } catch (error) {
        console.error('Error in generateMetadata portfolio:', error);
        return {
            title:'Không có portfolio nào phù hợp',
            description:'Các dự án tại Ido Architects'
=======

        return {
            title: portfolio?.title,
            description: portfolio?.excerpt,
            opengraph: {
                title: portfolio?.title,
                Description: portfolio?.excerpt,
                url: `https://www.ido-architects.com/du-an/${params.portfolio}`,
                type: 'article',
                images: validImageUrl ? [
                    {
                        url: validImageUrl,
                        width: 800,
                        height: 600,
                        alt: portfolio?.title,
                    },
                ] : [],
            }
        }
    } catch (error) {
        console.error('Error in generateMetadata portfolio:', error);
        return {
            title: 'Không có portfolio nào phù hợp',
            description: 'Các dự án tại Ido Architects'
>>>>>>> develop
        }
    }
}

// [{params1:{uri:"portfoliio/lem-apart"}}, {params2:{uri:"portfoliio/lem-apart2"}}]
export default async function DetailPortfolioPage({ params }: { params: Params }) {
    const res = await getSinglePortfolio(params.portfolio)
    const portfolio: portfolios = await res?.portfolio;

    const allPortfolios = await getAllPortfolios();
    const portfolioArr: portfolios[] = allPortfolios?.nodes


    return (
        <main>
            <Suspense fallback={<Loading />}>
                <Container>
                    <BreadcrumbComponent />
                    <div className="grid grid-cols-1  lg:grid-cols-3 ">
                        <div className="'col-span-3 lg:col-span-2 border-0'">
                            <HeaderPortfolio
                                portfolio={portfolio}
                            />
                            <BodyPortfolio
                                portfolio={portfolio}
                            />
                            <FooterPortfolio
                                portfolioArr={portfolioArr}
                            />
                        </div>
                        <div className='relative col-span-1 hidden lg:block ml-5 w-full'>
                            {/* <SideBarComponent></SideBarComponent> */}
                            <SideBarComponent />
                        </div>
                    </div>
                    {/* <ContactForm /> */}
                </Container>
            </Suspense>

        </main>
    )
}