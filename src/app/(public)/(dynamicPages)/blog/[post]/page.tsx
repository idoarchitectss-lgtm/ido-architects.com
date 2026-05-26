import Container from '@/components/custom/container';
import HeaderPost from './HeaderPost';
import BodyPost from './BodyPost';
import FooterPost from './FooterPost';
import { getSingleBlogFromCMS, allBlogsFromCMS, allBlogSlugsFromCMS } from '@/data/datafromCMS';
import { NodeProps, PostsProps } from '@/types/typeForWordpressData';
import SideBarComponent from './SideBarComponent';
import { Suspense } from 'react';
import Loading from '@/app/loading';
import BreadcrumbComponent from '@/components/custom/breadcrumb/BreadcrumbComponent';
import { notFound } from 'next/navigation';

interface Params {
    post: string;
}

export async function generateStaticParams() {
    try {
        const slugs = await allBlogSlugsFromCMS();
        return slugs.map((slug) => ({ post: slug }));
    } catch (error) {
        console.error('Error in generateStaticParams blog:', error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
    try {
        const { post: postSlug } = await params;
        const post = await getSingleBlogFromCMS(postSlug);
        if (!post) return { title: 'IDO Architects Blog' };
        const imageUrl = post?.featuredImage?.node.sourceUrl || '';
        return {
            title: post?.title,
            description: post?.excerpt,
            openGraph: {
                title: post?.title,
                description: post?.excerpt,
                url: `https://www.ido-architects.com/blog/${post?.slug}`,
                type: 'article',
                images: imageUrl ? [{ url: imageUrl, width: 800, height: 600, alt: post?.title }] : [],
            },
        };
    } catch (error) {
        console.error('Error in generateMetadata blog:', error);
        return { title: 'IDO Architects', description: 'Công ty thiết kế kiến trúc' };
    }
}

export default async function SinglePostPage({ params }: { params: Promise<Params> }) {
    try {
        const { post: postSlug } = await params;
        const post: NodeProps | null = await getSingleBlogFromCMS(postSlug);
        if (!post) notFound();

        const res: PostsProps = await allBlogsFromCMS(10, 1);

        return (
            <main id='topPage' className='px-1'>
                <Suspense fallback={<Loading />}>
                    <Container className=''>
                        <BreadcrumbComponent />
                        <div className='grid grid-cols-3'>
                            <div className='col-span-3 lg:col-span-2'>
                                <HeaderPost post={post} />
                                <BodyPost post={post} />
                            </div>
                            <div className='relative col-span-1 hidden lg:block ml-5 w-full'>
                                <SideBarComponent />
                            </div>
                        </div>
                        <div>
                            <h2 className='text-3xl font-semibold mt-10 mb-5'>Các bài viết liên quan</h2>
                            <FooterPost relevantPosts={res} />
                        </div>
                    </Container>
                </Suspense>
            </main>
        );
    } catch (error) {
        console.error('Error in SinglePostPage:', error);
        return <div>Error loading post</div>;
    }
}
