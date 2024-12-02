

import PortfolioComponent from "@/components/custom/portfolio/PortfolioComponent";
import Container from "@/components/custom/container";
import { Suspense } from "react";
import Loading from "@/app/loading";
import BackgroundForBreadcrumb from "@/components/custom/BackgroundForBreadcrumb";
import { allPortfolioCategories, allPortfolios } from "@/data/datafromWP";
import BreadcrumbComponent from "@/components/custom/breadcrumb/BreadcrumbComponent";

export default async function PortfolioPage() {
    const portfolios = await allPortfolios();
    const porfolioCategoryArray = await allPortfolioCategories();
    return (
        <main>
            <BackgroundForBreadcrumb 
            titleForPage="Các dự án"
            />
            <Container>
                <BreadcrumbComponent />
            </Container>
            <Suspense fallback={<Loading />}>
            <PortfolioComponent
            labelOfButton="Xem thêm"
            href="/du-an"
                title="Khám phá các dự án nổi bật của chúng tôi"
                subtitle="Our Portfolios"
                text="Khám phá các dự án nổi bật của chúng tôi"
                islightBg
                portfoliosArray={portfolios.portfoliosArray}
                porfolioCategoryArray={porfolioCategoryArray}
                />
            </Suspense>
        </main>
    )
}