import { prisma } from "@/lib/prisma";

/**
 * Get a user by their email address.
 */
export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch {
    return null;
  }
}

/**
 * Get a user by their ID.
 */
export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch {
    return null;
  }
}
