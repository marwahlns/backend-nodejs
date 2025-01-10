import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const Mahasiswa = {
    // Mendapatkan mahasiswa berdasarkan ID
    findUnique: prisma.tbl_mahasiswa.findUnique,
  
    // Mendapatkan semua mahasiswa
    findMany: prisma.tbl_mahasiswa.findMany,
  
    // Membuat mahasiswa baru
    create: prisma.tbl_mahasiswa.create,
  
    // Memperbarui mahasiswa
    update: prisma.tbl_mahasiswa.update,
  
    // Menghapus mahasiswa
    delete: prisma.tbl_mahasiswa.delete,
};