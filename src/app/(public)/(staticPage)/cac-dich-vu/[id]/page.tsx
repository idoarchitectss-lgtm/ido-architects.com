import BackgroundForBreadcrumb from "@/components/custom/BackgroundForBreadcrumb";
import BackToTopNoClient from "@/components/custom/backToTop/BackToTopNoClient";
import BreadcrumbComponent from "@/components/custom/breadcrumb/BreadcrumbComponent";
import Container from "@/components/custom/container";
import { allServiceSlugsFromCMS, singleServiceFromCMS } from "@/data/datafromCMS";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
    try {
        const slugs = await allServiceSlugsFromCMS();
        return slugs.map((slug) => ({ id: slug }));
    } catch (error) {
        console.error("Error in generateStaticParams:", error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    const service = await singleServiceFromCMS(id);
    if (!service) return {};
    return {
        title: service.metaTitle ?? service.title,
        description: service.metaDesc ?? service.excerpt ?? undefined,
    };
}

export default async function SingleServicePage({ params }: { params: Params }) {
    const { id } = await params;
    const service = await singleServiceFromCMS(id);
    if (!service) notFound();

    return (
        <main id="topPage" className="">
            <BackgroundForBreadcrumb titleForPage={service.title} />
            <Container className="px-1">
                <BreadcrumbComponent />
                {service.content ? (
                    <div dangerouslySetInnerHTML={{ __html: service.content }} />
                ) : (
                    <p className="py-10 text-center text-muted-foreground">
                        {service.excerpt ?? ""}
                    </p>
                )}
            </Container>
            <BackToTopNoClient />
        </main>
    );
}

