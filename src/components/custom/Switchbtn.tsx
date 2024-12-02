"use client"
 
import * as React from "react"
import { MoonIcon, SunIcon, TimerIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings2Icon } from "lucide-react"
 
export function Switchbtn() {
  const { setTheme } = useTheme()
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="border-0 hover:text-secondary">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-neutral-500" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-neutral-500" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className=" text-secondary bg-transparent/50 border-0">
        <DropdownMenuItem
        className="flex flex-row gap-2 items-center"
        onClick={() => setTheme("light")}>
          <span className="font-semibold">Sáng</span> 
          <SunIcon/>
        </DropdownMenuItem>
        <DropdownMenuItem 
        className="flex flex-row gap-2 items-center"
        onClick={() => setTheme("dark")}>
          <span className="font-semibold">
          Tối
          </span>
          <MoonIcon />
        </DropdownMenuItem>
        <DropdownMenuItem 
        className="flex flex-row gap-2 items-center"
        onClick={() => setTheme("system")}>
          <span className="font-semibold">
          Tự động
          </span>
          <TimerIcon />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}