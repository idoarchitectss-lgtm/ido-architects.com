import TableOfContent from '@/components/custom/TableOfContent'
import { NodeProps, portfolios } from '@/types/typeForWordpressData'
import React from 'react'
import PortfolioInfo from './PortfolioInfo'
import TiptapContent from '@/components/custom/tiptap/TiptapContent'

interface BodyPostProps {
    portfolio: portfolios
}

const BodyPortfolio: React.FC<BodyPostProps> = ({
    portfolio
}) => {

    return (
        <div className='px-1'>
            <PortfolioInfo 
            project={portfolio?.project}
            />
            <div className='bg-secondary/10 rounded-md py-4 px-3 my-5 italic'>
                <div dangerouslySetInnerHTML={{ __html: portfolio?.excerpt }}></div>
            </div>
            <TiptapContent html={portfolio?.content} />
        </div>
    )
}

export default BodyPortfolio