import Container from "@/components/custom/container";
import { getAllPortfolios, getSinglePortfolio } from "@/lib/api"
import { portfolios } from "@/types/typeForWordpressData";
import { Suspense, useEffect } from "react";
import HeaderPortfolio from "./HeaderPortfolio";
import BodyPortfolio from "./BodyPortfolio";
import FooterPortfolio from "./FooterPortfolio";
import Loading from "@/app/loading";
import ContactForm from "@/components/custom/forms/ContactForm";
import SideBarComponent from "../../blog/[post]/SideBarComponent";
import BreadcrumbComponent from "@/components/custom/breadcrumb/BreadcrumbComponent";
import { Description } from "@radix-ui/react-dialog";
import { url } from "inspector";

interface Params {
    portfolio: string
}

export async function generateStaticParams() {
    const data = await getAllPortfolios();
    const portfolios: portfolios[] = data?.nodes
    return portfolios.map((portfolio) => ({
        id: portfolio.slug
    }))
}


export async function generateMetadata({params}:{params:Params}) {
    const res = await getSinglePortfolio(params.portfolio)
    const portfolio: portfolios = await res.portfolio;

    const imageUrl = portfolio?.featuredImage?.node.sourceUrl || '';
    const validImageUrl = imageUrl ? new URL(imageUrl).toString() : '';

    
    return {
        title: portfolio?.title,
        description: portfolio?.excerpt,
        opengraph: {
            title:portfolio?.title,
            Description:portfolio?.excerpt,
            url: `https://www.ido-architects.com/du-an/${params.portfolio}`,
            type: 'article',
            image: [
                {
                    url: validImageUrl,
                    width: 800,
                    height: 600,
                    alt:portfolio?.title,
                },
            ]
        }
    }
}

// [{params1:{uri:"portfoliio/lem-apart"}}, {params2:{uri:"portfoliio/lem-apart2"}}]
export default async function DetailPortfolioPage({ params }: { params: Params }) {
    const res = await getSinglePortfolio(params.portfolio)
    const portfolio: portfolios = await res.portfolio;

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