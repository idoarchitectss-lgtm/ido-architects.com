import AboutUs from "@/components/custom/aboutUs/aboutUs";
import BackToTopNoClient from "@/components/custom/backToTop/BackToTopNoClient";
import Feelback from "@/components/custom/feelback/feelback";
import Hero from "@/components/custom/hero/hero";
import Media from "@/components/custom/media/media";
import OfferServices from "@/components/custom/offerServices/offerServices";
import PortfolioComponent from "@/components/custom/portfolio/PortfolioComponent";
import Solutions from "@/components/custom/Solutions/solutions";
import Team from "@/components/custom/team/team";

import { Suspense } from "react";
import Loading from "./loading";
import TouchTocontact from "@/components/custom/TouchTocontact";

import Newsletter from "@/components/custom/newsletter/newsletter";
import NewsAndBlogComponnet from "@/components/custom/newsAndBlog/NewsAndBlogComponnet";
import { allPortfolioCategories, allPortfolios, allPost, allServices, herofromWP, logoImg } from "@/actions/getDataFromWP";




export default async function Home() {
  const postsArray = await allPost();
  const portfoliosArray = await allPortfolios();
  const porfolioCategoryArray = await allPortfolioCategories();
  const servicesArr = await allServices();
  // lấy 6  object ở arr portfolios để hiển thị ở trang chủ
  const portfolioArrForHome = portfoliosArray.slice(0, 6);

  const heroArr = await herofromWP();
  const logo = await logoImg();


  return (
    <section className="relative overflow-hidden" >
      <section id='topPage'></section>
      <Suspense fallback={<Loading />}>
        <Hero 
        heroArr={heroArr}
        />
        <OfferServices
          servicesArr={servicesArr}
        />
        <AboutUs />
        <PortfolioComponent
          portfoliosArray={portfolioArrForHome}
          porfolioCategoryArray={porfolioCategoryArray}
        />
        <Solutions />
        <Team />
        <Media />
        <Feelback />
        <NewsAndBlogComponnet
          BlogPostsData={postsArray}
        />
        <TouchTocontact />
        <Newsletter />
        <BackToTopNoClient />
      </Suspense>
    </section>
  );
}
