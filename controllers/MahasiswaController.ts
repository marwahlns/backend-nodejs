import { Request, Response } from 'express';
import { Mahasiswa } from '../models/Mahasiswa';

export const getAllMahasiswa = async (req: Request, res: Response): Promise<void> => {
    try {
        const mahasiswa = await Mahasiswa.findMany();
        res.json({
            message: "Get mahasiswa successfully",
            data: mahasiswa,
        })
    }catch (error: any){
        console.error('Error during get data mahasiswa:', error);
        res.status(500).json({
            message: 'Get data failed. Please try again later.',
        });
    }
};

export const findOneMahasiswa = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nim } = req.params;

        const mahasiswa = await Mahasiswa.findUnique({
            where: {
                nim: nim,
            },
        });

        if (!mahasiswa) {
            res.status(404).json({
                message: "mahasiswa not found",
            });
            return;
        }

        res.json({
            message: "mahasiswa retrieved successfully",
            data: mahasiswa,
        });
    } catch (error: any) {
        console.error('Error during findOneMahasiswa:', error);
        res.status(500).json({
            message: 'Error retrieving mahasiswa. Please try again later.',
        });
    }
};

export const createMahasiswa = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nim, nama, kelas, alamat } = req.body;

        if (!nim || !nama || !kelas || alamat === undefined) {
            res.status(400).json({
                message: "All fields are required (nim, nama, kelas, alamat)",
            });
            return;
        }

        const mahasiswa = await Mahasiswa.create({
            data: {
                nim: nim,
                nama: nama,
                kelas: kelas,
                alamat: alamat,
            },
        });

        res.status(201).json({
            message: "Mahasiswa created successfully",
            data: mahasiswa,
        });
    } catch (error: any) {
        console.error('Error during createMahasiswa:', error);
        res.status(500).json({
            message: 'Error creating mahasiswa. Please try again later.',
        });
    }
};

export const updateMahasiswa = async (req: Request, res: Response): Promise<void> => {
    const{nim} = req.params;
    const{nama, kelas, alamat} = req.body;

    const result = await Mahasiswa.update({
        data: {
            nama: nama,
            kelas: kelas,
            alamat: alamat
        },
        where: {
            nim: nim
        }
    });
    res.json({
        message: "Mahasiswa updated successfully!",
        data: result
    });
};

export const deleteMahasiswa = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nim } = req.params;

        // Hapus mahasiswa berdasarkan id
        const deletedMahasiswa = await Mahasiswa.delete({
            where: {
                nim: nim,
            },
        });

        res.json({
            message: "Mahasiswa deleted successfully",
            data: deletedMahasiswa
        });
    } catch (error: any) {
        console.error('Error during deleteMahasiswa:', error);

        // Jika mahasiswa tidak ditemukan
        if (error.code === 'P2025') {
            res.status(404).json({
                message: "mahasiswa not found",
            });
        } else {
            res.status(500).json({
                message: 'Error deleting mahasiswa. Please try again later.',
            });
        }
    }
};