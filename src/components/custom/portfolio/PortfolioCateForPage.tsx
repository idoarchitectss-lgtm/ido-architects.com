'use client'
import React, { useEffect } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { portfolios } from '@/types/typeForWordpressData'


type portfolioCate = {
    nodes: {
        name: string;
        slug: string;
    }[]
}

const PortfolioCateForPage = ({ portfolioCates }: { portfolioCates: portfolioCate }) => {

    const { nodes } = portfolioCates
    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Danh mục dự án" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
                {nodes?.map((item) => (
                    <SelectItem
                        value={item.name}
                        key={item.slug}
                    >
                        <p className='text-black'>{item.name}</p>
                    </SelectItem>

                ))}

            </SelectContent>
        </Select>
    )
}

export default PortfolioCateForPage