import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const Buku = {
    // Mendapatkan buku berdasarkan ID
    findUnique: prisma.tbl_buku.findUnique,
  
    // Mendapatkan semua buku
    findMany: prisma.tbl_buku.findMany,
  
    // Membuat buku baru
    create: prisma.tbl_buku.create,
  
    // Memperbarui buku
    update: prisma.tbl_buku.update,
  
    // Menghapus buku
    delete: prisma.tbl_buku.delete,
};