import { processHeadings } from '@/components/custom/tiptap/heading-utils'
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
    const { html: content } = processHeadings(portfolio?.content ?? '')

    return (
        <div className='px-1'>
            <PortfolioInfo
            portfolio={portfolio}
            />
            <TiptapContent html={content} />
        </div>
    )
}

export default BodyPortfolio