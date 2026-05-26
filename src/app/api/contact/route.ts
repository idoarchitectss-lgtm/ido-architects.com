import { NextRequest, NextResponse } from "next/server";
import { ContactSchema } from "@/schemas";
import { sendRequestFromContactForm } from "@/lib/mail";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate với Zod schema
        const parsed = ContactSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ" },
                { status: 400 }
            );
        }

        const { name, email, phone, message } = parsed.data;

        // Gửi email thông báo về admin
        const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@ido-architects.io";
        await sendRequestFromContactForm(adminEmail, phone, name, message, email);

        return NextResponse.json(
            { success: "Gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ lại sớm nhất." },
            { status: 200 }
        );
    } catch (error) {
        console.error("[POST /api/contact] Error:", error);
        return NextResponse.json(
            { error: "Gửi yêu cầu thất bại. Vui lòng thử lại sau!" },
            { status: 500 }
        );
    }
}
