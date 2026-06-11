import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const MainButton = ({ href, labelOfButton }: { href: string; labelOfButton: string }) => {
    return (
        <Button
            variant="cta-outline"
            size="default"
            asChild
            className="group relative mt-8 w-auto min-w-[126px] px-4 py-2 overflow-hidden"
        >
            <Link href={href} className="flex flex-row items-center justify-center gap-2">
                <span className="text-xs font-semibold tracking-widest uppercase transition-transform duration-300 group-hover:-translate-x-1">
                    {labelOfButton}
                </span>
                <MoveRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100 opacity-70" />
            </Link>
        </Button>
    )
}

export default MainButton