import BackgroundForBreadcrumb from "@/components/custom/BackgroundForBreadcrumb";
import BackToTopNoClient from "@/components/custom/backToTop/BackToTopNoClient";
import BreadcrumbComponent from "@/components/custom/breadcrumb/BreadcrumbComponent";
import Container from "@/components/custom/container";
import { allServicesStatic, singleServiceStatic } from "@/data/staticData";
import { notFound } from "next/navigation";

interface Params {
    id: string;
}

export async function generateStaticParams() {
    try {
        const servicesArr = allServicesStatic();
        return servicesArr.map((service) => ({ id: service.slug }));
    } catch (error) {
        console.error('Error in generateStaticParams:', error);
        return [];
    }
}

export default async function SingleServicePage({ params }: { params: Params }) {
    const service = singleServiceStatic(params.id);
    if (!service) notFound();

    return (
        <main id='topPage' className="">
            <BackgroundForBreadcrumb titleForPage={service.title} />
            <Container className="px-1">
                <BreadcrumbComponent />
                <div dangerouslySetInnerHTML={{ __html: service.content }}></div>
            </Container>
            <BackToTopNoClient />
        </main>
    );
}
