import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllBuku = async (req: Request, res: Response): Promise<void> => {
    try {
        const buku = await prisma.tbl_buku.findMany();
        res.json({
            message: "Get buku successfully",
            data: buku,
        })
    }catch (error: any){
        console.error('Error during get data buku:', error);
        res.status(500).json({
            message: 'Get data failed. Please try again later.',
        });
    }
};

export const findOneBuku = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_buku } = req.params;

        const buku = await prisma.tbl_buku.findUnique({
            where: {
                id_buku: Number(id_buku),
            },
        });

        if (!buku) {
            res.status(404).json({
                message: "Buku not found",
            });
            return;
        }

        res.json({
            message: "Buku retrieved successfully",
            data: buku,
        });
    } catch (error: any) {
        console.error('Error during findOneBuku:', error);
        res.status(500).json({
            message: 'Error retrieving buku. Please try again later.',
        });
    }
};

export const createBuku = async (req: Request, res: Response): Promise<void> => {
    try {
        const { judul, pengarang, tahun_terbit, stok } = req.body;

        if (!judul || !pengarang || !tahun_terbit || stok === undefined) {
            res.status(400).json({
                message: "All fields are required (judul, pengarang, tahun_terbit, stok)",
            });
            return;
        }

        const buku = await prisma.tbl_buku.create({
            data: {
                judul: judul,
                pengarang: pengarang,
                tahun_terbit: new Date(tahun_terbit),
                stok: Number(stok),
            },
        });

        res.status(201).json({
            message: "Buku created successfully",
            data: buku,
        });
    } catch (error: any) {
        console.error('Error during createBuku:', error);
        res.status(500).json({
            message: 'Error creating buku. Please try again later.',
        });
    }
};

export const updateBuku = async (req: Request, res: Response): Promise<void> => {
    const{id_buku} = req.params;
    const{judul, pengarang, tahun_terbit, stok} = req.body;

    const result = await prisma.tbl_buku.update({
        data: {
            judul: judul,
            pengarang: pengarang,
            tahun_terbit: new Date(tahun_terbit),
            stok: stok
        },
        where: {
            id_buku: Number(id_buku)
        }
    });
    res.json({
        message: "Buku updated successfully!",
        data: result
    });
};

export const deleteBuku = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_buku } = req.params;

        // Hapus buku berdasarkan id_buku
        const deletedBuku = await prisma.tbl_buku.delete({
            where: {
                id_buku: Number(id_buku),
            },
        });

        res.json({
            message: "Buku deleted successfully",
            data: deletedBuku
        });
    } catch (error: any) {
        console.error('Error during deleteBuku:', error);

        // Jika buku tidak ditemukan
        if (error.code === 'P2025') {
            res.status(404).json({
                message: "Buku not found",
            });
        } else {
            res.status(500).json({
                message: 'Error deleting buku. Please try again later.',
            });
        }
    }
};