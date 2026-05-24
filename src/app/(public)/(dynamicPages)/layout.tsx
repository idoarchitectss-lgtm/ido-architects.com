'use client'
import BackToTopButton from "@/components/custom/backToTop/BackToTopButton ";
import { Progress } from "@/components/ui/progress";

export default function PagesLayout({
    children}: { children: React.ReactNode }) {
    return (
        <main id='topPage' className="border-0 relative">
            {children}
            <BackToTopButton />
        </main>
    )
}