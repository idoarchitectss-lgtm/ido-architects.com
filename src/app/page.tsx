import AboutUs from "@/components/custom/aboutUs/aboutUs";
import BackToTopNoClient from "@/components/custom/backToTop/BackToTopNoClient";
import Feelback from "@/components/custom/feelback/feelback";
import Hero from "@/components/custom/hero/hero";
import OfferServices from "@/components/custom/offerServices/offerServices";

import { Suspense } from "react";
import Loading from "./loading";
import TouchTocontact from "@/components/custom/TouchTocontact";

import NewsAndBlogComponnet from "@/components/custom/newsAndBlog/NewsAndBlogComponnet";
import { aboutFromWP, allPortfolios, allPost, allServices, herofromWP } from "@/data/datafromWP";
import SlogansComponent from "@/components/custom/SlogansComponent";
import PortfoliosForHomepage from "@/components/custom/portfolio/PortfoliosForHomepage";




export default async function Home() {
  const postsArray = await allPost();
  const portfolioArrForHome = await allPortfolios();
  const servicesArr = await allServices();
  const heroArr = await herofromWP();
  const aboutArr = await aboutFromWP();
  return (
    <div className="relative overflow-hidden" >
      <section id='topPage'></section>
      <Suspense fallback={<Loading />}>
        <Hero heroArr={heroArr} />
        <AboutUs about={aboutArr} />
        {/* featured portfolio */}
        <PortfoliosForHomepage 
        title="Khám phá các dự án nổi bật của chúng tôi"
        subtitle="Featured Portfolios"
        href="/du-an-noi-bat"
        islightBg
        portfoliosArray={portfolioArrForHome.featuredPortfolios}
        />
        <SlogansComponent />
        {/* completed project */}
        <PortfoliosForHomepage 
        title="Công trình hoàn thiện thực tế của IDO-ARCHITECTS"
        subtitle="Completed Projects"
        href="du-an-da-hoan-thien"
        islightBg
        portfoliosArray={portfolioArrForHome.completedPortfolios}
        />
        <OfferServices servicesArr={servicesArr} />
        <Feelback />
        <TouchTocontact 
        src="https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/466628780_1089355346529712_4375042002829101583_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG0QwlHrYt7oI_jpuCBWbQ1h3yFPRoKS0mHfIU9GgpLSWgB8dRYnR08IRI2vnt1oAZsPbLdqqfZWqAdZK4ddMTX&_nc_ohc=OOJt-cAco4kQ7kNvgHwYhvn&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=ARNaer0iUjXfFGrpFSNIGWn&oh=00_AYD_ngcEvzqqKi5Z6s2WWgSs7TgDgQRQzN1t9pGk_2TNxg&oe=6743C4EA"
        labelOfForm="Liên hệ với đội ngũ chúng tôi"
        />
        <NewsAndBlogComponnet BlogPostsData={postsArray} />
        {/* <Newsletter /> */}
        <BackToTopNoClient />
      </Suspense>
    </div>
  );
}
