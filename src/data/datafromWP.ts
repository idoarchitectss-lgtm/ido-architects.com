import { getAbout, getAllPortfolios, getAllPosts, getDetailPage, getHero, getLogo, getPortfolioCates, getServices, getSingleService } from "@/lib/api";
import { hero, porfolioCategory, portfolios, PostsProps, Services } from "@/types/typeForWordpressData";

export async function allPost() {
  const res: PostsProps = await getAllPosts(10, 1); //5 bài viết mới nhất
  const edges = res.edges;
  // console.log("cehckres",edges)
  return edges;
}
export async function allPortfolioCategories() {
  const portfolioCategoriesRes = await getPortfolioCates();
  const porfolioCategoryArray: porfolioCategory[] = portfolioCategoriesRes.nodes

  return porfolioCategoryArray;
}
export async function allPortfolios() {
  const portfoliosRes = await getAllPortfolios();
  const portfoliosArray: portfolios[] = portfoliosRes?.nodes;
  // const portfolioArrForHome = portfoliosArray?.slice(0, 6);

  const featuredPortfolios = portfoliosArray.filter(item => item.project.isFeatured === true);
  const completedPortfolios = portfoliosArray.filter(item=>item.project.isCompleted === true);
  return {portfoliosArray,featuredPortfolios,completedPortfolios};
}
export async function allServices() {
  const data: Services = await getServices();
  const serviceArr = data.edges.map(edge => edge.node)
  // console.log("check services>>>>",edges)
  return serviceArr;
}

export async function singleService(id:string) {
  const data = await getSingleService(id)
  // console.log(data.service)
  return data.service;
}
export async function herofromWP() {
  const res: hero = await getHero();
  // console.log("check info hero",res.heros )
  return res?.heros?.nodes;
}


export async function aboutFromWP() {
  const res = await getAbout();
  const about = res.abouts.nodes
  return about;
}


export async function reCruitPageFromWP(id: string) {
  const res = await getDetailPage(id)
  return res;
}
