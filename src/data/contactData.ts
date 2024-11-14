import prisma from "@/lib/prisma"

export const getExistingRequestByEmail = async(email:string)=> {
    try {
        const existingRequest = await prisma.contact.findFirst({
            where:{
                email
            }
        })
        return existingRequest;
    } catch {
        return null
    }
}