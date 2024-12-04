import BackgroundForBreadcrumb from "@/components/custom/BackgroundForBreadcrumb";
import BackToTopNoClient from "@/components/custom/backToTop/BackToTopNoClient";
import BreadcrumbComponent from "@/components/custom/breadcrumb/BreadcrumbComponent";
import Container from "@/components/custom/container";
import { allServices, singleService } from "@/data/datafromWP";

interface Params {
    id: string;
}

// tạo trang tĩnh SSG
export async function generateStaticParams() {
    try {
    const servicesArr = await allServices();
    return servicesArr.map((service) => ({
        id: service.slug
    }))
    } catch (error) {
        console.error('Error in generateStaticParams:', error);
        return [];
    }
}

export default async function SingleServicePage({ params }: { params: Params }) {
    const service = await singleService(params.id)
    return (
        <main id='topPage' className="">
            <BackgroundForBreadcrumb
                titleForPage={service?.title || 'Các dịch vụ'}
            />
            <Container className="">
                <BreadcrumbComponent />
                <div dangerouslySetInnerHTML={{ __html: service?.content }}></div>
                <div className="w-full md:w-8/12 mx-auto px-2">
                </div>
            </Container>
            <BackToTopNoClient />
        </main>
    )
}