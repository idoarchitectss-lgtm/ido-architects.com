import Date from '@/components/custom/Date';
import { PROPERTY_TYPES } from '@/features/posts/validations/post.schema';
import { project } from '@/types/typeForWordpressData'
import { Calendar, SquareSigma, Building2, Layers, MapPin, PenTool } from 'lucide-react'
import React from 'react'

interface PortfolioInfoProps {
    project: project;
}

function getPropertyLabel(value: string) {
    return PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value
}

const PortfolioInfo: React.FC<PortfolioInfoProps> = ({ project }) => {
    const { nameOfProject, generalInformation } = project || {};

    return (
        <div className="mb-5">
            {/* ── 4 key stats in one row ─────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200 rounded-xl overflow-hidden mb-4">
                <div className="flex flex-col items-center gap-2 text-center bg-white px-3 py-6">
                    <Calendar size={32} className="text-secondary" />
                    <span className="text-sm font-semibold text-primary">
                        <Date dateString={generalInformation?.completedYear} />
                    </span>
                </div>

                <div className="flex flex-col items-center gap-2 text-center bg-white px-3 py-6">
                    <SquareSigma size={32} className="text-secondary" />
                    <span className="text-sm font-semibold text-primary">
                        {generalInformation?.floorDimension ?? 0} m²
                    </span>
                </div>

                <div className="flex flex-col items-center gap-2 text-center bg-white px-3 py-6">
                    <Building2 size={32} className="text-secondary" />
                    <span className="text-sm font-semibold text-primary">
                        {getPropertyLabel(generalInformation?.propertyType ?? '')}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-2 text-center bg-white px-3 py-6">
                    <Layers size={32} className="text-secondary" />
                    <span className="text-sm font-semibold text-primary">
                        {generalInformation?.numberOfFloors ?? 0} tầng
                    </span>
                </div>
            </div>

            {/* ── Secondary info ─────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-4 px-1">
                <div className="flex items-start gap-2 flex-1">
                    <MapPin size={16} className="text-secondary mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">Địa chỉ dự án</p>
                        <p className="text-sm text-primary">{generalInformation?.addressOfProperty || 'Đang cập nhật'}</p>
                    </div>
                </div>
                <div className="flex items-start gap-2 flex-1">
                    <PenTool size={16} className="text-secondary mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">Đơn vị thiết kế</p>
                        <p className="text-sm text-primary">{generalInformation?.designedCompany || 'Đang cập nhật'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortfolioInfo


