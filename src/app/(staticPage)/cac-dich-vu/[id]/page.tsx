import BackgroundForBreadcrumb from "@/components/custom/BackgroundForBreadcrumb";
import BackToTopNoClient from "@/components/custom/backToTop/BackToTopNoClient";
import BreadcrumbComponent from "@/components/custom/breadcrumb/BreadcrumbComponent";
import Container from "@/components/custom/container";
import { allServices, singleService } from "@/data/datafromWP";

interface Params {
    id:string;
}

// tạo trang tĩnh SSG
export async function generateStaticParams() {
    const servicesArr = await allServices();
    return servicesArr.map((service)=> ({
        id:service.slug
    }))
}

export default async function SingleServicePage({params}:{params:Params}) {
    const service = await singleService(params.id)
    console.log("check params",params)
    return(
        <main id='topPage' className="">
            <Container className="">
            <BackgroundForBreadcrumb 
            titleForPage={service?.title || 'Các dịch vụ'}
            />
                <div className="w-full md:w-8/12 mx-auto px-2">
            <div dangerouslySetInnerHTML={{__html:service?.content}}></div>

                </div>
            </Container>
            <BackToTopNoClient />
        </main>
    )
}