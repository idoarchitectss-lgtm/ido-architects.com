'use client'

import { Search } from 'lucide-react'
import SearchDialog from './SearchDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,

}
  from '@/components/ui/alert-dialog'
import SearchResultBox from './SearchResultBox';
import { EdgesProps } from '@/types/typeForWordpressData';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import Loading from '@/app/loading';
import { SkeletonForSearch } from '../../skeleton/SkeletonForSearch';



interface SearchComponentProps {
  className?: string | null | undefined;
  placeholder?: string,
  posts: EdgesProps[number]['node'][];
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  className,
  placeholder = 'Nhập từ khóa...',
  posts
}) => {
  const [term, setTerm] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const route = useRouter()


  // hàm đồng bộ url với truy vấn đầu vào là biến term

  const urlHandleChange = useDebouncedCallback((term: string) => {
    // console.log('check term',term)
    const params = new URLSearchParams(searchParams || "")

    if (term) {
      params.set("query", term) // params lấy chuỗi ký tự sau dấu ? là query=term
    } else params.delete("query")

    route.replace(`${pathname}?${params.toString()}`)
  }, 300)

  useEffect(() => {
    setTerm(searchParams?.get("query")?.toString() || '')
    // console.log(term)
  }, [searchParams, term])


  const closeHandleClick = (open: boolean) => {
    setOpen(open)
  }
  // closeHandleClick sử dụng parameter open được truyền từ component con là SearchResultBox lên
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* open và onOpenChange sử dụng để tùy chỉnh trạng thái bật tắt của dialog */}
      <AlertDialogTrigger>
        <Search className={`hover:text-secondary hover:-translate-y-2 duration-300 ${className}`} />
        {/* <p>Tìm kiếm bài viết</p> */}
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-white dark:bg-neutral-900 dark:text-white w-full h-screen md:h-[60vh]  p-5 flex flex-col justify-start items-center'>
        <AlertDialogHeader className='w-full'>
          <AlertDialogTitle>Tìm kiếm</AlertDialogTitle>
          <Suspense fallback={<SkeletonForSearch />}>
          <SearchDialog
            placeholder={placeholder}
            onChange={(e) => urlHandleChange(e.target.value)}
            defaultValue={searchParams?.get("query")?.toString()}
            />
            </Suspense>

          <p>Kết quả tìm kiếm phù hợp </p>
          <Suspense fallback={<Loading />}>
          <SearchResultBox
            term={searchParams?.get("query")?.toString() || ''}
            posts={posts}
            closeHandleClick={closeHandleClick}
            />
            </Suspense>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='text-secondary'>Quay lại</AlertDialogCancel>
        </AlertDialogFooter>
        {/* <AlertDialogAction>Tìm kiếm</AlertDialogAction> */}
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SearchComponent