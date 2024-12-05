'use client'

import MailSvg from './svgcomponent/MailSvg'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import ContactForm from './forms/ContactForm'
import ZaloSvg from './svgcomponent/ZaloSvg'

const ContactFormIcon = () => {
    return (
        <div className="fixed w-12 h-12 bottom-28 left-3 z-50  flex flex-row items-center justify-between ">
            <Dialog>
                <DialogTrigger className='h-26 w-26 flex flex-col items-center justify-center gap-5'>
                    <div className='w-16 opacity-60 hover:opacity-100 cursor-pointer duration-300'>
                    <MailSvg />
                    </div>
                    {/* <div className='w-full opacity-60 hover:opacity-100 cursor-pointer duration-300'>
                    <ZaloSvg />
                    </div> */}
                </DialogTrigger>
                <DialogContent className='p-0 border-0'>
                    <DialogHeader>
                        {/* <DialogTitle>Are you absolutely sure?</DialogTitle> */}
                        <DialogDescription className='flex justify-center items-center w-full h-full'>
                            <ContactForm
                            labelOfForm='Đăng ký tư vấn'
                            />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ContactFormIcon