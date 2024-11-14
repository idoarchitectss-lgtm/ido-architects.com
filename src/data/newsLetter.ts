import prisma from "@/lib/prisma";

export const getNewsLetterByEmail = async (email:string) => {
try {
    const newsLetterByEmail = await prisma.newsletter.findUnique({
        where: {
            email
        }
    })
    return newsLetterByEmail
} catch {
    return null;
}
}