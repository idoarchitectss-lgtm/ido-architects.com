import * as z from "zod"


export const NewsletterSchema = z.object({
    email:z.string().email({
        message:'Email nhập vào không đúng!'
    })
});

export const ContactSchema = z.object({
    name:z.string().min(2,{message:"Điền ít nhất 2 ký tự"})
    .max(20,"Không được quá 20 ký tự"),
    email:z.string()
    .email({message:"Không đúng định dạng email, hãy thử lại"}),
    phone: z.string().regex(/^\+\d{1,3}\s?\d{10,13}$/,{message:"Vui lòng điền đúng số điện thoại"}),
    message:z.string().optional()
})



