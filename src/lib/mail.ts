import { EmailTemplate } from '@/components/custom/emailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendNewsLetterInfo = async (
    email:string
) => {
    
        await resend.emails.send({
            from:"onboarding@resend.dev",
            to:email,
            subject:"NewsLetter thông tin đăng ký",
            html:`<p>Người dùng có ${email} đã đăng ký nhận bản tin</p>`
        });
   
}

export const sendRequestFromContactForm = async(email:string,phone:string,name:string,message:string | undefined)=> {
    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:email,
        subject:"Yêu cầu tư vấn từ trang liên hệ",
        html:`{
            <h2>Thông tin người yêu cầu tư vấn</h2>
            <ul>
            <li>Họ và tên:${name}</li>
            <li>Số điện thoai: ${phone}</li>
            <li>Email người đăng ký: ${email}</li>
            <li>Yêu cầu: ${message}</li>
            </ul>
        }`
    });
};