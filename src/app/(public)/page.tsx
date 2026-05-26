import AboutUs from "@/components/custom/aboutUs/aboutUs";
import BackToTopNoClient from "@/components/custom/backToTop/BackToTopNoClient";
import Feelback from "@/components/custom/feelback/feelback";
import Hero from "@/components/custom/hero/hero";
import OfferServices from "@/components/custom/offerServices/offerServices";
import { Suspense } from "react";
import Loading from "@/app/loading";
import TouchTocontact from "@/components/custom/TouchTocontact";
import NewsAndBlogComponnet from "@/components/custom/newsAndBlog/NewsAndBlogComponnet";
import SlogansComponent from "@/components/custom/SlogansComponent";
import PortfoliosForHomepage from "@/components/custom/portfolio/PortfoliosForHomepage";
import {
  allBlogsFromCMS,
  allProjectsFromCMS,
} from "@/data/datafromCMS";
import { allServicesStatic, heroStatic, aboutStatic } from "@/data/staticData";

export default async function Home() {
  const [blogsRes, portfolioRes] = await Promise.all([
    allBlogsFromCMS(10, 1),
    allProjectsFromCMS(),
  ]);

  const postsArray = blogsRes.edges;
  const servicesArr = allServicesStatic();

  return (
    <div className="relative overflow-hidden">
      <section id="topPage"></section>
      <Suspense fallback={<Loading />}>
        <Hero />
        <AboutUs />
        {/* featured portfolio */}
        <PortfoliosForHomepage
          title="Khám phá các dự án nổi bật của chúng tôi"
          subtitle="Featured Portfolios"
          href="/du-an-noi-bat"
          islightBg
          portfoliosArray={portfolioRes.featuredPortfolios}
        />
        <SlogansComponent />
        {/* completed project */}
        <PortfoliosForHomepage
          title="Công trình hoàn thiện thực tế của IDO-ARCHITECTS"
          subtitle="Completed Projects"
          href="du-an-da-hoan-thien"
          islightBg
          portfoliosArray={portfolioRes.completedPortfolios}
        />
        <OfferServices servicesArr={servicesArr} />
        <Feelback />
        <TouchTocontact
          src="https://res.cloudinary.com/dskpdydeu/images/v1727844184/z5500051833278_817e97e73af9e055e1213d0001a45299-1/z5500051833278_817e97e73af9e055e1213d0001a45299-1.jpg"
          labelOfForm="Liên hệ với đội ngũ chúng tôi"
        />
        <NewsAndBlogComponnet BlogPostsData={postsArray} />
        <BackToTopNoClient />
      </Suspense>
    </div>
  );
}
