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
    phone: z.string().regex(/^(\+84|84|0)(3[2-9]|5[2689]|7[06-9]|8[0-689]|9[0-9])\d{7}$/, {
        message: "Số điện thoại không hợp lệ (VD: 0901234567 hoặc +84901234567)"
    }),
    message:z.string().optional(),
    serviceId: z.string().optional()
})



