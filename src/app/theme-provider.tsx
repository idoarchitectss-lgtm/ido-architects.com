'use client'

import Footer from "@/components/custom/footer/footer";
import Header from "@/components/custom/header/header";
import ThemeContext from "@/context/theme"
import { useState } from "react"

export default function ThemeProvider({
    children,
}: {children: React.ReactNode}){
    const [theme, setTheme] = useState('light');
    const toggleTheme = ()=> {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }
    return <ThemeContext.Provider value={{theme,toggleTheme}}>
        {children}
        </ThemeContext.Provider>

}