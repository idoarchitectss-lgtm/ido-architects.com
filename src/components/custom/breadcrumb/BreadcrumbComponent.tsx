'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useEffect } from "react";
import Container from "../container";


const BreadcrumbComponent = () => {
  // Lấy dữ liệu breadcrumb thông qua pathname bằng hook useBreadcrumbs
  const breadcrumbItemArr = useBreadcrumbs();
  useEffect(()=>{
    console.log("check breadcrumbItemArr",breadcrumbItemArr)
  },[breadcrumbItemArr])

  return (
    <div className=" my-5  pb-2 w-full overflow-x-scroll hiddenScrollBar">
      <Breadcrumb className="w-full overflow-x-scroll hiddenScrollBar">
        <BreadcrumbList className="px-2 w-[1000px] flex flex-row">
          {/* xử lý name breadcrumb viết hoa chữ cái đầu */}
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="hover:text-secondary duration-300 font-semibold">
              Về trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {breadcrumbItemArr?.map((breadcrumb, index) => {
            const name = breadcrumb.name
              .replace(/-/g, ' ')//thay thế - thành khoảng trống
              .split(' ') //tách chuỗi thành mảng các từ 
              .map(word => word.charAt(0).toUpperCase() + word.slice(1)) //viết hoa chữ cái đầu tiên của mỗi từ
              .join(' '); //Ghép các từ lại thành chuỗi

            const isLastItem = index === breadcrumbItemArr.length - 1; //kiểm tra có phải phần tử cuối mảng hay không?

            return (
              <div key={breadcrumb.link || "/"} className='flex flex-row items-center gap-1'>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className={`hover:text-secondary duration-300 font-semibold
                  ${isLastItem ? "text-secondary font-normal" : ""}
                  `}
                    href={breadcrumb.link || "/"}>
                      {name}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {!isLastItem && <BreadcrumbSeparator />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>

  );
}

export default BreadcrumbComponent;