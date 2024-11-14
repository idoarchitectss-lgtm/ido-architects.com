import { PreviewData } from "next";


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


  
