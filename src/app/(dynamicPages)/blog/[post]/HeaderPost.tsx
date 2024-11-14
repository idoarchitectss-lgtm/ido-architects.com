'use client'
import PostMeta from '@/components/custom/newsAndBlog/PostMeta'
import { NodeProps } from '@/types/typeForWordpressData'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShareLinkComponent } from '@/components/custom/ShareLinkComponent'

interface HeaderPostProps {
  post: NodeProps
}

const HeaderPost: React.FC<HeaderPostProps> = ({
  post,
}) => {
  const pathname = usePathname()
  return (
    <>
      <div className="relative h-[250px] rounded-xl overflow-hidden"
        style={{
          backgroundImage: `url(${post?.featuredImage?.node.sourceUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='absolute top-0 left-0 bg-transparent/25 w-full h-full'></div>
        <Link href={pathname || "/"}>
          <div
            className=' absolute text-2xl z-10 text-white mt-10 mx-5 font-semibold'
            dangerouslySetInnerHTML={{ __html: post?.title }}></div>
        </Link>

      </div>
      <div className='flex flex-row items-center justify-between my-2'>

        <PostMeta
          author={post?.author?.node.name}
          publishedDate={post?.date}
          tagsList={post?.tags?.nodes}
        />
        <div className='flex flex-row items-center gap-1'>
          <ShareLinkComponent />
        </div>
      </div>

    </>

  )
}

export default HeaderPost