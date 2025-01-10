import { Request, Response } from 'express';
import { Peminjaman } from '../models/Peminjaman';
import { Mahasiswa } from '../models/Mahasiswa';
import { Buku } from '../models/Buku';

export const getAllPeminjaman = async (req: Request, res: Response): Promise<void> => {
    try {
        const peminjaman = await Peminjaman.findMany({
            include: {
                tbl_mahasiswa: true, // Menyertakan data mahasiswa
                tbl_buku: true,      // Menyertakan data buku
            },
        });

        res.json({
            message: "Get peminjaman successfully",
            data: peminjaman,
        });
    } catch (error: any) {
        console.error('Error during get data peminjaman:', error);
        res.status(500).json({
            message: 'Get data failed. Please try again later.',
        });
    }
};


export const createPeminjaman = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nim, id_buku, tgl_pinjam } = req.body;
        if (!nim || !id_buku || !tgl_pinjam) {
            res.status(400).json({
                message: "All fields are required (nim, id_buku, tgl_pinjam)",
            });
            return;
        }

        // Cek apakah mahasiswa ada
        const mahasiswa = await Mahasiswa.findUnique({
            where: { nim: nim },
        });
        if (!mahasiswa) {
            res.status(404).json({
                message: `Mahasiswa with NIM ${nim} not found`,
            });
            return;
        }

        // Cek apakah buku ada
        const buku = await Buku.findUnique({
            where: { id_buku: Number(id_buku) },
        });
        if (!buku) {
            res.status(404).json({
                message: `Buku with ID ${id_buku} not found`,
            });
            return;
        }

        // Buat data peminjaman
        const peminjaman = await Peminjaman.create({
            data: {
                nim: nim,
                id_buku: Number(id_buku),
                tgl_pinjam: new Date(tgl_pinjam),
                status: 'Dipinjam',
            },
        });

        res.status(201).json({
            message: "Peminjaman created successfully",
            data: peminjaman,
        });
    } catch (error: any) {
        console.error('Error during createPeminjaman:', error);
        res.status(500).json({
            message: 'Error creating peminjaman. Please try again later.',
        });
    }
};

export const updateStatusPeminjaman = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Cek apakah peminjaman ada
        const peminjaman = await Peminjaman.findUnique({
            where: { id: Number(id) },
        });

        if (!peminjaman) {
            res.status(404).json({
                message: `Peminjaman with ID ${id} not found`,
            });
            return;
        }

        // Update data peminjaman
        const updatedPeminjaman = await Peminjaman.update({
            where: { id: Number(id) },
            data: {
                tgl_kembali: new Date(),
                status: 'Dikembalikan',
            },
        });

        res.json({
            message: "Peminjaman updated successfully",
            data: updatedPeminjaman,
        });
    } catch (error: any) {
        console.error('Error during updateStatusPeminjaman:', error);
        res.status(500).json({
            message: 'Error updating peminjaman. Please try again later.',
        });
    }
};
