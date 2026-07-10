'use client'

import { portfolios } from '@/types/typeForWordpressData'
import Image from 'next/image'
import { Images, X, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { DEFAULT_IMG } from '@/lib/constants'

interface HeaderPortfolioProps {
  portfolio: portfolios
}

/** Extract all <img src="..."> from HTML string */
function extractImagesFromHtml(html: string): string[] {
  const matches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)]
  return matches.map((m) => m[1])
}

const HeaderPortfolio: React.FC<HeaderPortfolioProps> = ({ portfolio }) => {
  // Bỏ qua ảnh default placeholder — không phải ảnh thật của bài viết
  const rawFeatured = portfolio?.featuredImage?.node.sourceUrl
  const featured = rawFeatured && rawFeatured !== DEFAULT_IMG ? rawFeatured : undefined

  // Priority: galleryImages from CMS → fallback extract from content HTML
  const cmsGallery: string[] = portfolio.galleryImages ?? []
  const contentImages = cmsGallery.length === 0
    ? extractImagesFromHtml(portfolio?.content ?? '')
    : []

  // featured first, then gallery/content, deduped
  const seen = new Set<string>()
  const allImages: string[] = []
  for (const src of [featured, ...cmsGallery, ...contentImages]) {
    if (src && !seen.has(src)) { seen.add(src); allImages.push(src) }
  }

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Mobile swipeable carousel: theo dõi ảnh đang hiển thị để render counter
  const [mobileIndex, setMobileIndex] = useState(0)
  const mobileScrollRef = useRef<HTMLDivElement>(null)

  const handleMobileScroll = () => {
    const el = mobileScrollRef.current
    if (!el) return
    setMobileIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLightboxIndex((i) => (i - 1 + allImages.length) % allImages.length)
  }

  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLightboxIndex((i) => (i + 1) % allImages.length)
  }

  // ── Gallery grid ──────────────────────────────────────────────────────────
  const displayImages = allImages.slice(0, 5)

  return (
    <>
      {/* ── Photo gallery ───────────────────────────────────────────── */}
      <div className="relative mb-6 rounded-xl overflow-hidden">
        {displayImages.length === 0 ? (
          <div className="h-[280px] md:h-[420px] bg-neutral-200 rounded-xl" />
        ) : (
          <>
            {/* Mobile: swipeable carousel */}
            <div className="md:hidden relative">
              <div
                ref={mobileScrollRef}
                onScroll={handleMobileScroll}
                className="flex overflow-x-auto snap-x snap-mandatory rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {allImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative w-full flex-shrink-0 snap-center h-[280px] cursor-pointer"
                    onClick={() => openLightbox(idx)}
                  >
                    <Image
                      src={src}
                      alt={`${portfolio.project.nameOfProject} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority={idx === 0}
                    />
                  </div>
                ))}
              </div>
              {allImages.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Images size={13} />
                  {mobileIndex + 1}/{allImages.length}
                </div>
              )}
            </div>

            {/* Desktop: Airbnb-style photo grid */}
            <div className="hidden md:block">
              {displayImages.length === 1 ? (
                <div
                  className="relative h-[420px] cursor-pointer"
                  onClick={() => openLightbox(0)}
                >
                  <Image
                    src={displayImages[0]}
                    alt={portfolio.project.nameOfProject}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                </div>
              ) : (
                /* 1 large left + 2×2 right */
                <div className="grid grid-cols-2 gap-1.5 h-[420px]">
                  {/* Large featured image */}
                  <div
                    className="relative col-span-1 cursor-pointer overflow-hidden rounded-tl-xl rounded-bl-xl"
                    onClick={() => openLightbox(0)}
                  >
                    <Image
                      src={displayImages[0]}
                      alt={portfolio.project.nameOfProject}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="50vw"
                      priority
                    />
                  </div>

                  {/* 2×2 right grid */}
                  <div className="grid grid-cols-2 grid-rows-2 gap-1.5">
                    {[1, 2, 3, 4].map((idx) => {
                      const src = displayImages[idx]
                      const isLast = idx === 4
                      const remaining = allImages.length - 4 // ảnh chưa hiển thị
                      const roundedClass =
                        idx === 1 ? 'rounded-tr-xl' : idx === 4 ? 'rounded-br-xl' : ''

                      return src ? (
                        <div
                          key={idx}
                          className={`relative cursor-pointer overflow-hidden ${roundedClass}`}
                          onClick={() => openLightbox(idx)}
                        >
                          <Image
                            src={src}
                            alt={`${portfolio.project.nameOfProject} ${idx + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                            sizes="25vw"
                          />
                          {/* Overlay "+N ảnh" trên ô cuối nếu còn ảnh chưa hiển thị */}
                          {isLast && remaining > 0 && (
                            <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1 hover:bg-black/65 transition-colors">
                              <Images size={24} className="text-white/90" />
                              <span className="text-white font-semibold text-lg leading-none">
                                +{remaining}
                              </span>
                              <span className="text-white/70 text-xs">ảnh</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div key={idx} className={`bg-neutral-100 ${roundedClass}`} />
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Project title ────────────────────────────────────────────── */}
      <h1
        className="text-xl md:text-3xl font-bold text-primary mb-5 px-1"
        dangerouslySetInnerHTML={{ __html: portfolio?.title }}
      />

      {/* ── Lightbox ─────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white hover:text-neutral-300 z-10"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={30} />
          </button>

          {/* Prev */}
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white hover:text-secondary z-10 bg-black/40 rounded-full p-1"
            onClick={prev}
          >
            <ChevronLeft size={32} />
          </button>

          {/* Image */}
          <div
            className="relative w-[90vw] max-w-4xl h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[lightboxIndex]}
              alt={`${portfolio.project.nameOfProject} - ảnh ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/70 text-sm select-none">
              {lightboxIndex + 1} / {allImages.length}
            </p>
          </div>

          {/* Next */}
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-secondary z-10 bg-black/40 rounded-full p-1"
            onClick={next}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </>
  )
}

export default HeaderPortfolio