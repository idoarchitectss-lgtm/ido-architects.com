
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
        };
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
    edges: {
      node: {
        heros: {
          heroTitle:string;
          heroSubtitle:string;
          heroBodyText:string;
          heroBanner: {
            node:{
              sourceUrl:string;
            }
          }
        }
      }
    }[]
  }

