import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const User = {
    // Mendapatkan user berdasarkan ID
    findFirst: prisma.tbl_user.findFirst,
  
    // Membuat user baru
    create: prisma.tbl_user.create,
};