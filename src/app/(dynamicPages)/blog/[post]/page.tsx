import Container from '@/components/custom/container';
import HeaderPost from './HeaderPost';
import BodyPost from './BodyPost';
import FooterPost from './FooterPost';

import { getAllPosts, getSinglePost } from '@/lib/api';
import { NodeProps, PostsDataProps, PostsProps } from '@/types/typeForWordpressData';
import SideBarComponent from './SideBarComponent';
import { Suspense } from 'react';
import Loading from '@/app/loading';
import BreadcrumbComponent from '@/components/custom/breadcrumb/BreadcrumbComponent';


interface Params {
    post: string
}
type Edges = PostsDataProps['posts']

async function AllPosts() {
    const posts = await getAllPosts(10, 1);
    // console.log("checkpost>>>", posts)
    return posts;
}

export async function generateStaticParams() {
    const res: Edges = await getAllPosts(100, 0);
    const edges = res.edges
    return edges.map((post) => ({
        id: post.node.slug
    }))
}


// dùng function generateMetadata để tạo ra các thông tin meta động cho các trang hổ trợ SEO
export async function generateMetadata({ params }: { params: Params }) {
    const post: NodeProps = await getSinglePost(params.post);
    const imageUrl = post.featuredImage?.node.sourceUrl || '';
    const validImageUrl = imageUrl ? new URL(imageUrl).toString() : '';
    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://www.ido-architects.com/blog/${post.slug}`,
            type: 'article',
            images: [
                {
                    url: validImageUrl,
                    width: 800,
                    height: 600,
                    alt: post.title,
                },
            ],
        },
    };
}

export default async function SingelPostPage({ params }: { params: Params }) {
    const post: NodeProps = await getSinglePost(params.post)
    const relevantPosts: PostsProps = await AllPosts();
    return (
        <main id='topPage'>
            <Suspense fallback={<Loading />}>
                {/* <Header /> */}
                <Container>
                    <BreadcrumbComponent />
                    <div className='grid grid-cols-3'>
                        {/* right side */}
                        <div className='col-span-3 lg:col-span-2 '>
                            <HeaderPost post={post} />
                            <BodyPost post={post} />
                        </div>
                        {/* left side */}
                        <div className='relative col-span-1 hidden lg:block ml-5 w-full'>
                            <SideBarComponent />
                        </div>
                    </div>
                    <div>
                        <h2 className='text-3xl font-semibold mt-10 mb-5'>Các bài viết liên quan</h2>
                        <FooterPost relevantPosts={relevantPosts} />
                    </div>
                </Container>
            </Suspense>
        </main>

    )
}