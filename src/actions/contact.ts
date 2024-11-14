"use server"

import { ContactSchema } from "@/schemas"
import { z } from "zod"
import prisma from '@/lib/prisma'
import { sendRequestFromContactForm } from "@/lib/mail"
import { getExistingRequestByEmail } from "@/data/contactData"

export const contact = async(values:z.infer<typeof ContactSchema>)=> {
        const validatedField = ContactSchema.safeParse(values)

        if(!validatedField.success) {
            return {error : "Đã có lỗi xảy ra, vui lòng thử lại!"}
        }

        const { name, email , phone, message } = validatedField.data;

        const existingRequest = await getExistingRequestByEmail(email)

        if(existingRequest) {
            return {error: "Chúng tôi đã nhận được yêu cầu từ email này trước đó, chúng tôi sẽ sớm liên hệ bạn!"}
        }

        await prisma.contact.create({
            data: {
                name,
                email,
                phone,
                message
            }
        })

        await sendRequestFromContactForm(email,phone,name,message); 

        return { success: "Yêu cầu đã được gửi đi! Chúng tôi sẽ sớm liên hệ!" }
};