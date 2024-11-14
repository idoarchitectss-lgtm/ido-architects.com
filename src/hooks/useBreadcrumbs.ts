import { breadcrumbItem } from "@/types/typeForBreadcrumbs";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useBreadcrumbs = () => {
    const pathname = usePathname()
    const [pathSegments, setPathSegments] = useState<breadcrumbItem>([]);
    useEffect(() => {
      if (pathname) {
        const segments = pathname.split('/').filter(Boolean); //nếu pathname là /blog/post/lem thì segments = ["blog", "post", "lem"]
        // tiếp theo tạo ra một mảng mới thêm prop {name,link} vào trong mảng lấy item là value
        const newSegments = segments.map((item,index)=> ({
          name: item,
          link: `/${segments.slice(0, index +1).join("/")}` //Cắt mảng từ phần tử đầu tiên đến phần tử hiện tại (index + 1), bao gồm cả phần tử hiện tại. join("/"): Nối các phần tử trong mảng với dấu / để tạo ra đường dẫn.
        }));
        // cập nhật biến state với giá trị mới newSegments : [{name:"value 1",link:"/portfolios"}, {name:"value-value2",link:"portfolios/portfolioItem"}]
        setPathSegments(newSegments);
      }
      // console.log("check pathname",pathname)
    }, [pathname])
    return pathSegments;
  }