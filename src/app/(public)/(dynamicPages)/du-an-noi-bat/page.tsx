import PortfolioComponent from "@/components/custom/portfolio/PortfolioComponent";
import Container from "@/components/custom/container";
import { Suspense } from "react";
import Loading from "@/app/loading";
import BackgroundForBreadcrumb from "@/components/custom/BackgroundForBreadcrumb";
import { allProjectsFromCMS, allProjectCategoriesFromCMS } from "@/data/datafromCMS";
import BreadcrumbComponent from "@/components/custom/breadcrumb/BreadcrumbComponent";

export default async function FeaturedPortfolios() {
    const { featuredPortfolios } = await allProjectsFromCMS();
    const porfolioCategoryArray = await allProjectCategoriesFromCMS();
    return (
        <main>
            <BackgroundForBreadcrumb
                titleForPage="Các dự án nổi bật bởi đội ngũ IDO Architects"
            />
            <Container>
                <BreadcrumbComponent />
            </Container>
            <Suspense fallback={<Loading />}>
                <PortfolioComponent
                    href="/du-an"
                    labelOfButton="Xem tất cả dự án"
                    title="Các dự án nổi bật bởi đội ngũ IDO Architects"
                    islightBg
                    subtitle="Featured Portfolios"
                    text="Khám phá các công trình thực tế với tỷ lệ hài lòng 100% từ khách hàng"
                    portfoliosArray={featuredPortfolios}
                    porfolioCategoryArray={porfolioCategoryArray}
                />
            </Suspense>
        </main>
    );
}
