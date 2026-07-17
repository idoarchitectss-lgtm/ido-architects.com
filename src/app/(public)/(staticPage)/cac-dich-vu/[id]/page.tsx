import BackgroundForBreadcrumb from "@/components/custom/BackgroundForBreadcrumb";
import BackToTopNoClient from "@/components/custom/backToTop/BackToTopNoClient";
import BreadcrumbComponent from "@/components/custom/breadcrumb/BreadcrumbComponent";
import Container from "@/components/custom/container";
import ContactForm from "@/components/custom/forms/ContactForm";
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
                <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div className="col-span-3 lg:col-span-2 border-0">
                        {service.content ? (
                            <div dangerouslySetInnerHTML={{ __html: service.content }} />
                        ) : (
                            <p className="py-10 text-center text-muted-foreground">
                                {service.excerpt ?? ""}
                            </p>
                        )}
                    </div>
                    <div className="relative col-span-1 lg:block ml-0 lg:ml-5 w-full">
                        <div className="sticky top-0">
                            <ContactForm labelOfForm="Đăng ký tư vấn" />
                        </div>
                    </div>
                </div>
            </Container>
            <BackToTopNoClient />
        </main>
    );
}

