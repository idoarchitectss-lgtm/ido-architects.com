import { PROPERTY_TYPES } from '@/features/posts/validations/post.schema';
import { portfolios, project } from '@/types/typeForWordpressData'
import { Calendar, SquareSigma, Building2, Layers, MapPin, PenTool, Locate } from 'lucide-react'
import React from 'react'

interface PortfolioInfoProps {
    portfolio: portfolios;
}

function getPropertyLabel(value: string) {
    return PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value
}

function vnCompletedYear(year?: string) {
    return year ? `Năm ${year}` : 'Đang cập nhật'
}

const PortfolioInfo: React.FC<PortfolioInfoProps> = ({ portfolio }) => {
    const { nameOfProject, generalInformation } = portfolio.project || {};

    console.log("generalInformation" + generalInformation.mapEmbedUrl)

    return (
        <div className="mb-5">
            {/* ── 4 key stats in one row ─────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-neutral-200 border border-black rounded-xl overflow-hidden mb-4">
                {/* Ngày hoàn thành  */}
                <div className="flex flex-col items-center gap-2 text-center bg-white px-3 py-6">
                    <Calendar size={32} className="text-secondary" />
                    <span className='text-sm'>Năm hoàn thành</span>
                    <span className="text-sm font-semibold text-primary">
                        {vnCompletedYear(generalInformation?.completedYear)}
                    </span>
                </div>
                {/* Diện tích sàn công trình */}
                <div className="flex flex-col items-center gap-2 text-center bg-white px-3 py-6">
                    <SquareSigma size={32} className="text-secondary" />
                    <span className='text-sm'>Diện tích sàn</span>
                    <span className="text-sm font-semibold text-primary">
                        {generalInformation?.floorDimension ?? 0} m²
                    </span>
                </div>
                {/* Loại hình dự án */}
                <div className="flex flex-col items-center gap-2 text-center bg-white px-3 py-6">
                    <Building2 size={32} className="text-secondary" />
                    <span className='text-sm'>Loại công trình</span>
                    <span className="text-sm font-semibold text-primary">
                        {getPropertyLabel(generalInformation?.propertyType ?? '')}
                    </span>
                </div>
                {/* số tầng cao */}
                <div className="flex flex-col items-center gap-2 text-center bg-white px-3 py-6">
                    <Layers size={32} className="text-secondary" />
                    <span className='text-sm'>Số tầng</span>
                    <span className="text-sm font-semibold text-primary">
                        {generalInformation?.numberOfFloors ?? 0} tầng
                    </span>
                </div>

                <div className="flex flex-col items-center gap-2 text-center bg-white px-3 py-6">
                    <PenTool size={32} className="text-secondary" />
                    <span className='text-sm'>Đơn vị thiết kế</span>
                    <span className="text-sm font-semibold text-primary">
                        {generalInformation?.designedCompany || 'Đang cập nhật'}
                    </span>
                </div>

                 <div className="flex flex-col items-center gap-2 text-center bg-white px-3 py-6">
                    <Locate size={32} className="text-secondary" />
                    <span className='text-sm'>Vị trí công trình</span>
                    <span className="text-sm font-semibold text-primary">
                       {generalInformation?.addressOfProperty || 'Đang cập nhật'}
                    </span>
                </div>
            </div>

            {/* ── Secondary info ─────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row gap-1 px-1 flex-1">
                {/* Address with Map */}
                <div className="flex flex-col gap-4 ">
                   
                    {/* Embedded Map */}
                    {(generalInformation?.mapEmbedUrl) ? (
                        <div className="rounded-lg overflow-hidden border border-neutral-200">
                            <iframe
                                src={generalInformation.mapEmbedUrl}
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                            />
                        </div>
                    ) : (
                        <div className="rounded-lg overflow-hidden border border-neutral-200 bg-gray-100 h-[300px] flex items-center justify-center text-gray-400">
                            <p className="text-sm">Chưa cập nhật bản đồ dự án</p>
                        </div>
                    )}

                </div>

                {/* Excerpt */}
                <div className='bg-secondary/10 rounded-md py-4 px-3 italic flex-1'>
                    <div dangerouslySetInnerHTML={{ __html: portfolio?.excerpt }}></div>
                </div>
            </div>
        </div>
    )
}

export default PortfolioInfo


