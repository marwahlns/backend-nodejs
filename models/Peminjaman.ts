import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const Peminjaman = {
    // Mendapatkan buku berdasarkan ID
    findUnique: prisma.tbl_peminjaman.findUnique,
  
    // Mendapatkan semua buku
    findMany: prisma.tbl_peminjaman.findMany,
  
    // Membuat buku baru
    create: prisma.tbl_peminjaman.create,
  
    // Memperbarui buku
    update: prisma.tbl_peminjaman.update,  
};