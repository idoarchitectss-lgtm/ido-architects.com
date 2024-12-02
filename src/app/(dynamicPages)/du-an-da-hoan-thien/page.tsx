

import PortfolioComponent from "@/components/custom/portfolio/PortfolioComponent";
import Container from "@/components/custom/container";
import { Suspense } from "react";
import Loading from "@/app/loading";
import BackgroundForBreadcrumb from "@/components/custom/BackgroundForBreadcrumb";
import { allPortfolioCategories, allPortfolios } from "@/data/datafromWP";
import BreadcrumbComponent from "@/components/custom/breadcrumb/BreadcrumbComponent";

export default async function CompletedPortfolioPage() {
    const portfolios = await allPortfolios();
    const porfolioCategoryArray = await allPortfolioCategories();
    return (
        <main>
            <BackgroundForBreadcrumb 
            titleForPage="Các công trình thực tế đã hoàn thiện"
            />
            <Container>
                <BreadcrumbComponent />
            </Container>
            <Suspense fallback={<Loading />}>
            <PortfolioComponent
            href="/du-an"
            labelOfButton="Xem tất cả dự án"
            
                title="Các dự án được hoàn thiện bởi đội ngũ IDO Architects"
                islightBg
                subtitle="Completed Portfolios"
                text="Khám phá các công trình thực tế với tỷ lệ hài lòng 100% từ khách hàng"
                portfoliosArray={portfolios.completedPortfolios}
                porfolioCategoryArray={porfolioCategoryArray}
                />
            </Suspense>
        </main>
    )
}