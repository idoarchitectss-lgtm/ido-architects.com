import TableOfContent from '@/components/custom/TableOfContent'
import { NodeProps, portfolios } from '@/types/typeForWordpressData'
import React from 'react'
import PortfolioInfo from './PortfolioInfo'

interface BodyPostProps {
    portfolio: portfolios
}

const BodyPortfolio: React.FC<BodyPostProps> = ({
    portfolio
}) => {

    return (
        <div>
            <PortfolioInfo 
            project={portfolio?.project}
            />
            <div className='bg-secondary/20 rounded-md py-4 px-3 my-5 italic'>
                <div dangerouslySetInnerHTML={{ __html: portfolio?.excerpt }}></div>
            </div>
            <div className='flex flex-col justify-start gap-1 break-words'
                dangerouslySetInnerHTML={{ __html: portfolio?.content }}></div>
        </div>
    )
}

export default BodyPortfolio