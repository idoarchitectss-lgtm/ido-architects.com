'use server'
import { getNewsLetterByEmail } from "@/data/newsLetter"
import { sendNewsLetterInfo } from "@/lib/mail"
import prisma from "@/lib/prisma"
import { NewsletterSchema } from "@/schemas"
import * as z from 'zod'

export const newsletter = async(values: z.infer<typeof NewsletterSchema>)=> {
    const validatedFields = NewsletterSchema.safeParse(values)

    if(!validatedFields.success) {
        return { error: "Định dạng email không đúng" }
    }

    const { email } = validatedFields.data;
    
    const existingNewsLetter = await getNewsLetterByEmail(email);

    if(existingNewsLetter?.email === email) {
        return { error: "Email này đã được đăng ký!" }
    }

    await prisma.newsletter.create({
        data: {
            email,
            subscribedAt :new Date(),
        }
    })
    
    await sendNewsLetterInfo(email)

    return { success: "Đăng ký nhận bản tin thành công!" }
}