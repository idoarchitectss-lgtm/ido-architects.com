'use client'

import { cn } from '@/lib/utils'
import { ChevronDown, List } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import type { TocHeading } from './tiptap/heading-utils'

interface TableOfContentProps {
    headings: TocHeading[]
    className?: string
}

const SCROLL_OFFSET = 90 // px chừa khoảng trống phía trên khi cuộn tới heading

const TableOfContent: React.FC<TableOfContentProps> = ({ headings, className }) => {
    const [activeId, setActiveId] = useState<string | null>(null)
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (headings.length === 0) return

        const elements = headings
            .map((h) => document.getElementById(h.id))
            .filter((el): el is HTMLElement => !!el)

        if (elements.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
                if (visible[0]) {
                    setActiveId(visible[0].target.id)
                }
            },
            { rootMargin: `-${SCROLL_OFFSET}px 0px -70% 0px`, threshold: 0 }
        )

        elements.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [headings])

    if (headings.length === 0) return null

    const scrollToHeading = (id: string) => {
        const el = document.getElementById(id)
        if (!el) return
        const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
        window.scrollTo({ top, behavior: 'smooth' })
        window.history.replaceState(null, '', `#${id}`)
        setActiveId(id)
    }

    const handleClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        scrollToHeading(id)
    }

    const handleMobileClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        scrollToHeading(id)
        setMobileOpen(false)
    }

    const renderLinks = (onItemClick: (e: React.MouseEvent, id: string) => void) => (
        <ul className="flex flex-col gap-0.5 text-sm">
            {headings.map((h) => (
                <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                    <a
                        href={`#${h.id}`}
                        onClick={(e) => onItemClick(e, h.id)}
                        className={cn(
                            'block py-1.5 leading-snug border-l-2 pl-3 -ml-px transition-colors',
                            activeId === h.id
                                ? 'border-secondary text-secondary font-medium'
                                : 'border-transparent text-neutral-500 hover:text-primary hover:border-neutral-300'
                        )}
                    >
                        {h.text}
                    </a>
                </li>
            ))}
        </ul>
    )

    return (
        <>
            {/* Desktop / sidebar: card thu gọn được */}
            <nav className={cn('hidden lg:block bg-white border border-black rounded-xl mb-5', className)}>
                <button
                    type="button"
                    onClick={() => setCollapsed((c) => !c)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-3"
                >
                    <span className="flex items-center gap-2 text-lg font-semibold text-primary">
                        <List size={20} className="text-secondary" />
                        Nội dung bài viết
                    </span>
                    <ChevronDown
                        size={16}
                        className={cn('text-neutral-400 transition-transform', collapsed ? '' : 'rotate-180')}
                    />
                </button>
                {!collapsed && <div className="px-4 pb-4">{renderLinks(handleClick)}</div>}
            </nav>

            {/* Mobile: nút nổi cố định bên phải màn hình -> mở drawer (Sheet) */}
            {mounted &&
                createPortal(
                    <div className="lg:hidden">
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <button
                                    type="button"
                                    aria-label="Mở mục lục"
                                    className="fixed right-0 top-20 z-40 flex items-center gap-1.5 bg-secondary text-white text-xs font-medium pl-3 pr-2.5 py-2 rounded-l-full shadow-md"
                                >
                                    <List size={15} />
                                    {/* Mục lục */}
                                </button>
                            </SheetTrigger>
                            <SheetContent 
                            side="right" 
                            className="w-[85vw] sm:max-w-sm overflow-y-auto bg-white">
                                <SheetHeader>
                                    <SheetTitle>Nội dung bài viết</SheetTitle>
                                </SheetHeader>
                                <div className="mt-4">{renderLinks(handleMobileClick)}</div>
                            </SheetContent>
                        </Sheet>
                    </div>,
                    document.body
                )}
        </>
    )
}

export default TableOfContent
