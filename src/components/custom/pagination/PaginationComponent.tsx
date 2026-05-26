'use client';

/**
 * PaginationComponent — site-wide pagination using shadcn/ui primitives.
 *
 * Props:
 *   pageCount  — total number of pages
 *
 * Behaviour:
 *   - Reads current page from `?page=` query param (defaults to 1)
 *   - Preserves ALL existing query params when navigating (search, type, filters…)
 *   - Shows up to 7 page slots with ellipsis when needed
 *   - Previous / Next disabled at boundaries
 */

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
    pageCount: number;
}

/** Returns the page slots to render, inserting '...' where needed. */
function buildPageSlots(current: number, total: number): (number | '...')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const slots: (number | '...')[] = [1];

    if (current > 3) slots.push('...');

    const start = Math.max(2, current - 1);
    const end   = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) slots.push(i);

    if (current < total - 2) slots.push('...');

    slots.push(total);
    return slots;
}

const PaginationComponent = ({ pageCount }: Readonly<PaginationProps>) => {
    const pathname    = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Math.max(1, Number(searchParams.get("page") ?? 1));

    /** Build URL preserving all existing params, only replacing `page`. */
    const createPageURL = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        return `${pathname}?${params.toString()}`;
    };

    const slots = buildPageSlots(currentPage, pageCount);

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        href={createPageURL(currentPage - 1)}
                        aria-disabled={currentPage <= 1}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {/* Page slots */}
                {slots.map((slot, i) =>
                    slot === '...' ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={slot}>
                            <PaginationLink
                                href={createPageURL(slot)}
                                isActive={slot === currentPage}
                            >
                                {slot}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                {/* Next */}
                <PaginationItem>
                    <PaginationNext
                        href={createPageURL(currentPage + 1)}
                        aria-disabled={currentPage >= pageCount}
                        className={currentPage >= pageCount ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationComponent;