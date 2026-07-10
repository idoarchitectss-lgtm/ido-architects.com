"use client"

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { DEFAULT_IMG } from "@/lib/constants";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface Category {
  id: string;
  name: string;
  image?: string | null;
}

interface CategoryCarouselProps {
  categories: Category[];
  selectedCategoryId?: string;
}

export default function CategoryCarousel({ categories, selectedCategoryId }: CategoryCarouselProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (categories.length === 0) return null;

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);

    if (params.get("categoryId") === categoryId) {
      params.delete("categoryId");
    } else {
      params.set("categoryId", categoryId);
    }
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("categoryId");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="my-7">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-3xl font-bold">Danh mục bài viết</h2>
        {selectedCategoryId && (
          <button
            onClick={handleClearFilter}
            className="text-sm text-black hover:text-[#FF6D1B] underline"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 py-2">
          {categories.map((cat) => (
            <CarouselItem
              key={cat.id}
              className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
            >
              <button
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex flex-col items-center gap-2 text-center w-full cursor-pointer transition-all ${
                  selectedCategoryId === cat.id
                    ? "opacity-100 scale-105"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                <div className={`relative w-24 h-24 rounded-full overflow-hidden border-2 bg-gray-50 shrink-0 ${
                  selectedCategoryId === cat.id
                    ? "border-[#FF6D1B] shadow-lg"
                    : "border-gray-200"
                }`}>
                  <Image
                    src={cat.image || DEFAULT_IMG}
                    alt={cat.name}
                    width={800}
                    height={600}
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 line-clamp-2">
                  {cat.name}
                </span>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
