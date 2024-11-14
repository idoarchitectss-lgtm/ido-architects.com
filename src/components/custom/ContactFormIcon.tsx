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

const ContactFormIcon = () => {
    return (
        <div className="fixed w-12 h-12 bottom-28 left-3 z-50 opacity-60 hover:opacity-100 flex flex-row items-center justify-between cursor-pointer duration-300">
            <Dialog>
                <DialogTrigger className='h-16 w-16'>
                    <MailSvg />
                </DialogTrigger>
                <DialogContent className='p-0 border-0'>
                    <DialogHeader>
                        {/* <DialogTitle>Are you absolutely sure?</DialogTitle> */}
                        <DialogDescription className='flex justify-center items-center w-full h-full'>
                            <ContactForm />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ContactFormIcon