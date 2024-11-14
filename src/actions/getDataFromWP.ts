import { getAllPortfolios, getAllPosts, getHero, getLogo, getPortfolioCates, getServices } from "@/lib/api";
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
    const portfoliosArray: portfolios[] = portfoliosRes.nodes
    return portfoliosArray;
  }
  export async function allServices() {
    const data: Services = await getServices();
    const edges = data.edges.map(edge => edge.node)
    // console.log("check services>>>>",edges)
    return edges;
  }
  export async function herofromWP() {
    const hero:hero = await getHero();
    const heroArr:hero['edges'] = hero.edges;
    
    return heroArr;
  }
  
  export async function logoImg() {
    const data = await getLogo();
    const logo = data.page.editorBlocks[0].attributes.url
    return logo;
  }
  