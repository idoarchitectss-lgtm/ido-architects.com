import { PreviewData } from "next";

// ─── Hero types ───────────────────────────────────────────────────────────────
export type HeroSlide = {
  heros: {
    hero: {
      heroTitle: string;
      heroSubtitle: string;
      heroBodyText: string;
      ctaButton: string;
      banner_img: {
        node: {
          altText: string;
          sourceUrl: string;
        };
      };
    };
  };
};

export type HeroArr = HeroSlide[];

export interface MenuItemProps {
    name:string;
    link:string;
}

export interface LocationItemProps {
    name:string;
    content:React.ReactNode;
}

export interface ValueCardProps {
    title:string;
    subTitle:string;
    src:string;
}

export interface FeelbacksProps {
    description:string;
    img:string;
    name:string;
    job:string;
  }

export interface PostCardProps {
    title:string;
    subTitle:string;
    src:string;
    category:string;
    date:string;
    slug:string;
}

export interface PostTitleProps {
    children: string
  };


  
