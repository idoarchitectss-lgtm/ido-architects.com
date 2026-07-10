
export type PostsDataProps =
        {
            posts: {
                edges: {
                    node: {
                        slug: string;
                        title: string;
                        excerpt: string;
                        content: string;
                        featuredImage: {
                            node: {
                                sourceUrl: string;
                                altText: string;
                                title: string;
                            }
                        };
                        date: string;
                        uri:string;
                        author: {
                            node: {
                                name: string;
                                firstName: string;
                                lastName: string;
                                description: string | null;
                                avatar: {
                                    url: string
                                }
                            }
                        };
                        categories: {
                            nodes: {
                                name: string;
                                slug: string;
                            }[]
                        };
                        tags: {
                            nodes: {
                                name: string;
                                slug: string;
                            }[]
                        }
                    }
                }[]
                pageInfo:{
                    offsetPagination:{
                        total:number;
                        hasMore:boolean;
                        hasPrevious:boolean;
                    }
                }
            }
        }
    
// trích xuất edges từ
export type PostsProps = PostsDataProps['posts'];
export type EdgesProps = PostsDataProps['posts']['edges'];
export type NodeProps = PostsDataProps['posts']['edges'][number]['node']
export type FeaturedImageProps = PostsDataProps['posts']['edges'][number]['node']['featuredImage'];
export type AuthorProps = PostsDataProps['posts']['edges'][number]['node']['author'];
export type CategoriesProps = PostsDataProps['posts']['edges'][number]['node']['categories'];
export type TagsProps = PostsDataProps['posts']['edges'][number]['node']['tags'];



// type of services

export type Services = {
    edges: {
        node: {
            slug:string;
            title:string;
            excerpt:string;
            featuredImage:{
                node: {
                    sourceUrl:string;
                }
            };
            serviceFields:{
                descriptionOfService:string;
                serviceName:string
            };

        }
    }[]
}
export type ServicesNodeArr = Services['edges'][number]['node'][]

export type SingleServiceType = {
    service: {
      title:string;
      excerpt:string;
      content:string;
      serviceFields:{
        serviceName:string;
        descriptionOfService:string;
      }
      slug:string;
      featuredImage:{
        node: {
          altText:string;
          sourceUrl:string;
        }
      }
      seo:{
        metaKeywords:string;
        mateDesc:string;
        canonical:string;
        title:string;
      }
  
    }
  }

export type PostMoreStoriesProps = {
    author: AuthorProps;
    date: string;
    featuredImage: FeaturedImageProps;
    slug: string;
    title: string;
    categories: {
        nodes: {
            name: string;
        }[];
    };
}[]

export type AllCategoriesProps = {
    nodes: {
        name: string;
        slug: string;
        posts: {
            nodes: PostMoreStoriesProps
        }
    }[]
};

export type portfolios = {
    slug: string;
    title: string;
    featuredImage:{
        node:{
            sourceUrl:string
        }
    }
    content:string;
    excerpt: string;
    date:string;
    galleryImages: string[];
    project: {
        descriptionOfProject: string;
        nameOfProject: string;
        generalInformation: {
            completedYear: string;
            floorDimension: number;
            propertyType: string;
            numberOfFloors: number;
            addressOfProperty: string;
            designedCompany:string;
            mapEmbedUrl?: string;
        };
        isCompleted:boolean;
        isFeatured:boolean;
    };
    
    portfolioCategories: {
        nodes: {
            name: string;
            slug: string;
        }
    }
};
export type project = portfolios['project']

export type porfolioCategory={
    name:string;
    slug:string;
  };


//   component hero type
  export type hero = {
    heros: {
      nodes: {
        heros: {
            hero: {
                heroTitle:string;
                heroSubtitle:string;
                heroBodyText:string;
                ctaButton:string;
                banner_img: {
                  node:{
                    altText:string;
                    sourceUrl:string;
                  }
                }
            }
          
        }
      }[]
    }
  };

  export type AboutType = {
    abouts: {
        nodes: {
            aboutComponent: {
                bodytext:string;
                title:string;
                subtitle:string;
                image:{
                    node: {
                        altText:string;
                        sourceUrl:string;
                    }
                };
                button: {
                    labelbtn:string;
                    hrefbtn:string;
                }
               
            }
        }[]
    }
  };

  export type DetailPageType = {
    page: {
      content :string;
      slug:string;
      title:String;
      featuredImage:{
        node:{
          altText: string;
          sourceUrl:string;
        }
      }
    }
};

