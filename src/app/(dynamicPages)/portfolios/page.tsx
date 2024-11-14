

import PortfolioComponent from "@/components/custom/portfolio/PortfolioComponent";
import Container from "@/components/custom/container";
import { Suspense } from "react";
import Loading from "@/app/loading";
import BackgroundForBreadcrumb from "@/components/custom/BackgroundForBreadcrumb";
import { allPortfolioCategories, allPortfolios } from "@/actions/getDataFromWP";

export default async function PortfolioPage() {
    const portfoliosArray = await allPortfolios();
    const porfolioCategoryArray = await allPortfolioCategories();
    return (
        <main>
            <BackgroundForBreadcrumb />
            <Suspense fallback={<Loading />}>
            <PortfolioComponent
                portfoliosArray={portfoliosArray}
                porfolioCategoryArray={porfolioCategoryArray}
                />
            </Suspense>
        </main>
    )
}