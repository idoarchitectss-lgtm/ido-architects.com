import Link from "next/link";

interface InfoForServiceItemProps {
    title: string;
    excerpt: string;
    slug: string;
}

const InfoForServiceItem: React.FC<InfoForServiceItemProps> = ({
    title,
    excerpt,
    slug
}) => {
    return (
        <div className='flex flex-col justify-start items-start gap-3 w-full py-5 overflow-hidden'>
            <h3 className='text-left text-base font-[600]  leading-[38px] line-clamp-1'>{title}</h3>
            <div dangerouslySetInnerHTML={{__html:excerpt}}
            className='text-neutral-400 font-[400] text-[14px] leading-[32px] line-clamp-2'></div>
            <Link href={'/our-services'} className=' relative flex flex-row justify-start items-center text-secondary font-semibold text-sm w-full '>
                <span className='flex-auto opacity-0 scale-x-0 group-hover:scale-x-100 group-hover:opacity-100  border-b-[2px] border-secondary w-3/12 duration-500 my-3'></span>
                <span className='flex-nowrap flex-none group-hover:translate-x-[65%]  duration-500 z-10'>Xem chi tiết</span>
                <span className='flex-auto group-hover:opacity-0 translate-x-5  border-b-[2px] border-primary w-3/12 duration-500'></span>
                {/* <StepForward size={14} className='absolute left-[47%]'/> */}
            </Link>

        </div>
    )
}
export default InfoForServiceItem;