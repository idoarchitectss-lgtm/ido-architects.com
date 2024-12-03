import Date from '@/components/custom/Date';
import { project } from '@/types/typeForWordpressData'
import React from 'react'



interface PortfolioInfoProps {
    project: project;
}
const PortfolioInfo: React.FC<PortfolioInfoProps> = ({
    project
}) => {
    const { descriptionOfProject, nameOfProject, generalInformation } = project || {};
    return (
        <div className=' px-2 py-2 overflow-hidden'>
            <table className="table-auto w-full text-sm">
                <thead className='rounded-md'>
                    <tr className="bg-neutral-100 ">
                        <th className="px-2 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider">Thông tin tổng quan của dự án</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider">{nameOfProject || "Đang cập nhật"}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    <tr>
                        <td className="px-2 py-2 whitespace-nowrap">Năm hoàn thành</td>
                        <td className="px-2 py-2 whitespace-nowrap">
                            <Date 
                            dateString={generalInformation?.completedYear}
                            />
                            </td>
                    </tr>
                    <tr>
                        <td className="px-2 py-2 whitespace-nowrap">Quy mô dự án</td>
                        <td className="px-2 py-2 whitespace-nowrap">{generalInformation?.floorDimension} m2</td>
                    </tr>
                    <tr>
                        <td className="px-2 py-2 whitespace-nowrap">Loại công trình</td>
                        <td className="px-2 py-2 whitespace-nowrap">{generalInformation?.propertyType}</td>
                    </tr>
                    <tr>
                        <td className="px-2 py-2 whitespace-nowrap">Số tầng cao</td>
                        <td className="px-2 py-2 whitespace-nowrap">{generalInformation?.numberOfFloors} tầng</td>
                    </tr>
                    <tr>
                        <td className="px-2 py-2 whitespace-nowrap">Địa chỉ dự án</td>
                        <td className="px-2 py-2 whitespace-nowrap">{generalInformation?.addressOfProperty || "Đang cập nhật"}</td>
                    </tr>
                    <tr>
                        <td className="px-2 py-2 whitespace-nowrap">Đơn vị thiết kế</td>
                        <td className="px-2 py-2 whitespace-nowrap">{generalInformation?.designedCompany || "Đang cập nhật"}</td>
                    </tr>
                    <tr>
                        <td className="px-2 py-2 whitespace-normal">Mô tả dự án</td>
                        <td className="px-2 py-2 whitespace-normal">{descriptionOfProject || "Đang cập nhật"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default PortfolioInfo

