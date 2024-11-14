'use client'
import { CopyIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ShareBtn from "./buttons/ShareBtn"
import { usePathname } from "next/navigation"
import { OFFICIAL_WEB_URL } from "@/lib/constants"
import { useState } from "react"
import { toast } from "sonner"



export function ShareLinkComponent() {
    const pathname = usePathname()

    const [isOpen,setIsOpen] = useState<boolean>()
        const handleClick = () => {
                setIsOpen(false)
                toast.success('Sao chép địa chỉ bài viết thành công!')
        }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="shadow-md ">
                <span className=" text-secondary mr-2 ">
                <ShareBtn />
                </span>
                    <p className="text-xs hover:text-secondary">
                    Chia sẽ
                    </p>
                    </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md ">
                <DialogHeader>
                    <DialogTitle>Chia sẽ bài viết</DialogTitle>
                    <DialogDescription>
                        Ai có link có thể xem được bài viết
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={`${OFFICIAL_WEB_URL}${pathname}`}
                            readOnly
                        />
                    </div>
                    <Button 
                    onClick={handleClick}
                    variant='outline' type="submit" size="sm" className="px-3">
                        <span className="sr-only">Copy</span>
                        <CopyIcon className="h-4 w-4 text-secondary" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
