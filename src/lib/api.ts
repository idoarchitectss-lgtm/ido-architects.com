import { AboutType, DetailPageType, hero, SingleServiceType } from "@/types/typeForWordpressData";
import { StringValidation } from "zod";


const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "";

async function FetchAPI(query = "", { variables }: Record<string, any> = {}) {
  const headers: { "Content-Type": string, [key: string]: string } = { "Content-Type": "application/json" };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 giây
  /**
   * Vì không truyền trực tiếp timeout value vào fetch, nên cần tạo một AbortController để có thể hủy yêu cầu fetch. 
   * AbortController: Tạo một AbortController để có thể hủy yêu cầu fetch.
      Timeout: Sử dụng setTimeout để hủy yêu cầu sau 10 giây.
      Signal: Truyền signal từ AbortController vào hàm fetch.
      Error Handling: Bắt lỗi nếu yêu cầu bị hủy do hết thời gian chờ hoặc gặp lỗi khác.
   */

  const res = await fetch(
    API_URL,
    {
      headers,
    method: "POST",
      body: JSON.stringify({
        query,
        variables
      }),
      next: { revalidate: 10 },
      //thêm thời gian chờ load dữ liệu để tạo các trang tĩnh, tránh trường hợp fail vì fetch dữ liệu về vượt quá thời gian chờ, điều này dẫn đến lỗi và không delop được. Thường gặp khi deploy vercel.
      signal: controller.signal
    }
  );
  clearTimeout(timeoutId);


  const json = await res.json();

  if (json.error) {
    console.error(json.error);
    throw new Error('Failed to fetch API')
  }

  return json.data;
}


export async function getAllPortfolios() {
  const data = await FetchAPI(`
query AllPortfolios {
  portfolios (first: 50) {
    nodes {
      slug
      uri
      title(format: RAW)
      excerpt
      date
      project {
        descriptionOfProject
        nameOfProject
        generalInformation {
          completedYear
          floorDimension
          propertyType
          numberOfFloors
          addressofproperty
        }
        isCompleted
      	isFeatured
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
      portfolioCategories {
        nodes {
          name
          slug
        }
      }
    }
  }
            }
        `)
  return data?.portfolios;
}

export async function getPortfolioCates() {
  const data = await FetchAPI(`
  query portfolioCate {
   portfolioCategories {
        nodes {
          name
          slug
        }
      }
}
        `)
  return data.portfolioCategories;
}


export async function getSinglePortfolio(slug: string) {
  const data = await FetchAPI(`
  query portfolioByUri($id: ID = "", $idType: PortfolioIdType = URI) {
  portfolio(id: $id, idType: $idType) {
    slug
    title
     featuredImage{
      node{
        sourceUrl
      }
    }
    content
    excerpt
    project {
      descriptionOfProject
      generalInformation {
        addressofproperty
        completedYear
        floorDimension
        numberOfFloors
        propertyType
        designedCompany
      }
      nameOfProject
    }
  }
}
        `, {
    variables: {
      id: slug
    }
  }
  )
  return data;
}

export async function getAllPosts(postPerPage: number, currentPage: any) {
  const offset = parseInt(currentPage) * 5 - 5
  const data = await FetchAPI(`
    query AllPosts {
      posts(where: {offsetPagination: {size: ${postPerPage}, offset:${offset}}}) {
        edges {
          node {
            title
            excerpt
            slug
            date
            uri
            featuredImage {
              node {
                sourceUrl
                altText
                title
              }
            }
            author {
              node {
                name
                firstName
                lastName
                avatar {
                  url
                }
                description
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
            tags {
              nodes {
                name
                slug
              }
            }
          }
        }
        pageInfo {
          offsetPagination {
          total
          hasMore
          hasPrevious
      }
    }
      }
      }
  `
    , {
      cache: 'only-if-cached',
      next: { revalidate: 10 } // Tải lại dữ liệu sau 60 giây
    }
  );

  return data?.posts;
}

export async function getSinglePost(slug: string) {
  const data = await FetchAPI(`
  query SinglePost($id: ID = "", $idType: PostIdType = SLUG) {
    post(id: $id, idType: $idType) {
      content
      title
      date
      featuredImage{
      node{
        sourceUrl
      }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
      categories {
        nodes {
          name
          link
        }
      }
      excerpt
      tags {
        nodes {
          name
          link
        }
      }
    }
  }
    `, {
    variables: {
      id: slug
    }
  })

  return data.post;
}


type ServiceData = {
  services: {
    edges: {
      node: {
        slug: string;
        title: string;
        excerpt: string;
        featuredImage: {
          node: {
            sourceUrl: string;
          }
        };
        serviceFields: {
          descriptionOfService: string;
          serviceName: string
        };

      }
    }[]
  }
}

export async function getServices() {
  const data: ServiceData = await FetchAPI(`
    query Services {
      services {
        edges {
          node {
            featuredImage {
              node {
                sourceUrl
              }
            }
            slug
            title
            excerpt
            serviceFields {
              descriptionOfService
              serviceName
            }
          }
        }
      }
    }
    `)
  return data?.services;
}

export async function getSingleService(slug:string):Promise<SingleServiceType>{
  const data = await FetchAPI(`
 query singleService($id: ID = "", $idType: ServiceIdType = URI) {
  service(id: $id, idType: $idType) {
    title
    excerpt
    content
    serviceFields {
      serviceName
      descriptionOfService
    }
    slug
    featuredImage {
      node {
        altText
        sourceUrl
      }
    }
    seo {
      metaKeywords
      metaDesc
      canonical
      title
    }
  }
}
    `,
  {
    variables: {
      id:slug
    }
  } );

    return data
}


export async function getHero() {
  const data = await FetchAPI(`
query hero {
  heros {
    nodes {
      heros {
        hero {
          heroTitle
          heroSubtitle
          heroBodyText
          ctaButton
          banner_img {
            node {
              altText
              sourceUrl
            }
          }
        }
      }
    }
  }
}
    `)

  return data;
}

// get image for logo
export async function getLogo() {
  const data = await FetchAPI(`
    query Contentblocks {
  page(id: "cG9zdDoxMTYx", idType: ID) {
    editorBlocks {
      ... on CoreImage {
        anchor
        apiVersion
        attributes {
          alt
          url
        }
      }
    }
  }
}
    `)

    return data;
};

export async function getAbout():Promise<AboutType> {
  const data = await FetchAPI(`
    query about {
  abouts {
    nodes {
      aboutComponent {
        bodytext
        title
        subtitle
        image {
          node {
            altText
            sourceUrl
          }
        }
        button {
          hrefbtn
          labelbtn
        }
      }
    }
  }
}
    `)

    return data;

}



export async function getDetailPage(id:string):Promise<DetailPageType>{
  const data = await FetchAPI(`
  query detailPage($id: ID = "", $idType: PageIdType = ID) {
  page(id: $id, idType: $idType) {
    content
    slug
    title
    featuredImage {
      node {
        altText
        sourceUrl
      }
    }
  }
}
   `
  ,
  {
    variables: {
      id:id
    }
  }
  )
  return data;
}
