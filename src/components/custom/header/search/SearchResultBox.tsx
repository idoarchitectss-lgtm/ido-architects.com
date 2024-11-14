'use client'
import Link from 'next/link'
import { Search, SquareCheck } from 'lucide-react';
import Image from 'next/image';
import { EdgesProps } from '@/types/typeForWordpressData';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';


interface SearchResultBoxProps {
    term: string | null;
    posts: EdgesProps[number]['node'][];
    closeHandleClick: (open:boolean)=> void;
}
const SearchResultBox: React.FC<SearchResultBoxProps> = ({
    term,
    posts,
    closeHandleClick
}) => {
    // const pathname = usePathname();
    const route = useRouter();

    const [newTerm, setNewTerm] = useState<string>('')
    const [postsWithQuery, setPostsWithQuery] = useState<EdgesProps[number]['node'][]>([])

    // tạo biến quản lý trạng thái đóng modal AlertDialog searchresult khi handleClick
    const  [openDialog, setOpenDialog] = useState<boolean>(false)


    useEffect(() => {
        const termString = term?.toString().toLowerCase()
        setNewTerm(termString || '')
        const newPosts = posts.filter(post => post.title.toLowerCase().includes(termString || ''))
        setPostsWithQuery(newPosts)
        console.dir("check term >>>>",termString)
    }, [term, posts])

   
    const handleClick = (slug:string) => {
        setOpenDialog(false)
        closeHandleClick(openDialog)
        route.refresh()
        route.push(`/blog/${slug}`)
    }

    return (
        <div className='w-full flex flex-col gap-5 mt-5 bg-secondary/20 px-2 py-4 rounded-md'>
            <div className='flex flex-col justify-center'>
                <div className='flex flex-col justify-center items-start w-12/12 gap-3 w-full '>
                    {newTerm === '' ? 
                    (
                    <p>Không có bài viết nào được tìm kiếm</p>) :
                        (<>
                        <p className='text-sm font-semibold'>{`Có ${postsWithQuery.length} bài viết phù hợp với tìm kiếm`}</p>
                            {postsWithQuery?.map((post) => (
                                <div
                                key={post.slug} 
                                onClick={()=>handleClick(post.slug)}
                                // href={`blog/${post.slug}`}
                                className='w-full cursor-pointer text-sm whitespace-nowrap mt-3 flex flex-row justify-start items-center gap-3 h-[35px] hover:text-secondary overflow-hidden'>
                                    {/* <SquareCheck  className='mx-1 text-neutral-500 text-sm'/> */}
                                    <Image
                                        src={post.featuredImage?.node.sourceUrl}
                                        alt={post.title}
                                        width={40}
                                        height={40}
                                        className='rounded-md object-cover h-full'
                                    />
                                    <div className='flex flex-col w-full items-start'>
                                        <p className='line-clamp-1'>
                                            {post.title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>)
                    }



                </div>
            </div>

        </div>
    )
}

export default SearchResultBox