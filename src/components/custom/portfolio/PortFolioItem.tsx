import { Building, SquareSigmaIcon, TimerIcon } from 'lucide-react';
import Image from 'next/image'
import React from 'react'
import Date from '../Date';
import Link from 'next/link';
import { portfolios } from '@/types/typeForWordpressData';



const PortFolioItem = ({portfolio}:{portfolio:portfolios}) => {
    const { ...props } = portfolio;
  return (
    <div className=''>
        <Image 
        src={props.featuredImage.node.sourceUrl}
        alt={props.title}
        width={1200}
        height={800}
        className='w-full h-[250px] rounded-md'
        />
        <div>
            <Link href={`/portfolios/${props.slug}`}>
        <h2 className='text-xl font-[700]'>{props.title}</h2>
            </Link>
        <div className='flex flex-row items-center gap-2'>
            <Building size={16} className='text-secondary'/>
            <p><span>{props.project.generalInformation.numberOfFloors}</span> tầng</p>
        </div>

        <div className='flex flex-row items-center gap-2'>
            <SquareSigmaIcon size={16} className='text-secondary'/>
            <p><span>{props.project.generalInformation.floorDimension}</span> m2</p>
        </div>

        <div className='flex flex-row items-center gap-2'>
            <TimerIcon size={16} className='text-secondary'/>
            <p>Hoàn thành <span>
                <Date
                dateString={props?.project?.generalInformation?.completedYear}
                />
                </span></p>
        </div>
        </div>
    </div>
  )
}

export default PortFolioItem