import { Toaster } from '@/components/ui/sonner'
import React from 'react'

interface ToastProviderProps {
    children: React.ReactNode
}

const ToastProvider = ({ children }: ToastProviderProps) => {
    return (
        <>
            <Toaster
                theme="light"
                position="top-right"
                richColors
                className="z-50 bg-white text-black"
            />
            {children}
        </>
    )
}

export default ToastProvider