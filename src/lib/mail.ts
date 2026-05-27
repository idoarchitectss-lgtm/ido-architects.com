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

export const sendRequestFromContactForm = async (
    adminEmail: string,
    phone: string,
    name: string,
    message: string | undefined,
    customerEmail: string
) => {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: adminEmail,
        replyTo: customerEmail,
        subject: `[IDO Architects] Yêu cầu tư vấn mới từ ${name}`,
        html: `
            <h2>Thông tin yêu cầu tư vấn mới</h2>
            <ul>
                <li><strong>Họ và tên:</strong> ${name}</li>
                <li><strong>Số điện thoại:</strong> ${phone}</li>
                <li><strong>Email:</strong> ${customerEmail}</li>
                <li><strong>Nội dung yêu cầu:</strong> ${message || "(Không có)"}</li>
            </ul>
            <p>Vui lòng liên hệ lại với khách hàng sớm nhất!</p>
        `,
    });
};