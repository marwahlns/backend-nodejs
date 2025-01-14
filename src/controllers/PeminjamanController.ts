import { Request, Response } from 'express';
import { Peminjaman } from '../models/Peminjaman';
import { Mahasiswa } from '../models/Mahasiswa';
import { Buku } from '../models/Buku';
import XLSX from 'xlsx';
import nodemailer from 'nodemailer';


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

export const getDataDipinjam = async (req: Request, res: Response): Promise<void> => {
    try {
        const peminjaman = await Peminjaman.findMany({
            where: { status: 'Dipinjam' },
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

        await Buku.update({
            where: { id_buku: Number(id_buku) },
            data: {
                stok: { decrement: 1 },
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

const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: 'noreply@library.com', // Email pengirim
            to, // Email tujuan
            subject, // Subjek email
            text, // Isi email
        });

        console.log(`Email berhasil dikirim ke: ${to}`);
    } catch (error) {
        console.error('Error saat mengirim email:', error);
        throw new Error('Gagal mengirim email');
    }
};

export const updateStatusPeminjaman = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Cek apakah peminjaman ada
        const peminjaman = await Peminjaman.findUnique({
            where: { id: Number(id) },
            include: { tbl_mahasiswa: true }
        });

        if (!peminjaman) {
                res.status(404).json({
                message: `Peminjaman with ID ${id} not found`,
            });
            return;
        }

        const { id_buku, tbl_mahasiswa } = peminjaman;

        // Update data peminjaman
        const updatedPeminjaman = await Peminjaman.update({
            where: { id: Number(id) },
            data: {
                tgl_kembali: new Date(),
                status: 'Dikembalikan',
            },
        });

        await Buku.update({
            where: { id_buku: Number(id_buku) },
            data: {
                stok: { increment: 1 },
            },
        });

        // Kirim email pemberitahuan
        if (tbl_mahasiswa && tbl_mahasiswa.email) {
            const subject = 'Pengembalian Buku Berhasil';
            const emailText = `Halo ${tbl_mahasiswa.nama},\n\nBuku yang Anda pinjam telah berhasil dikembalikan. Terima kasih!`;
            await sendEmail(tbl_mahasiswa.email, subject, emailText);
        }

        res.json({
            message: "Peminjaman updated successfully, and book stock increased by 1",
            data: updatedPeminjaman,
        });
    } catch (error: any) {
        console.error('Error during updateStatusPeminjaman:', error);
        res.status(500).json({
            message: 'Error updating peminjaman. Please try again later.',
        });
    }
};

export const exportExcel = async (req: Request, res: Response): Promise<void> => {
    try {
        // Ambil data dari database
        const rows = await Peminjaman.findMany();

        if (!rows.length) {
            res.status(404).json({ message: 'No data found' });
            return;
        }

        const heading = [['ID Peminjaman', 'NIM', 'ID Buku', 'Tanggal Pinjam', 'Tanggal Kembali', 'Status']];
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rows);

        XLSX.utils.sheet_add_aoa(worksheet, heading, { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Peminjaman');

        // Konversi workbook menjadi buffer
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        res.attachment('Data Peminjaman Buku.xlsx')
        res.send(buffer);
    } catch (error) {
        console.error('Error exporting Excel:', error);
        res.status(500).json({ message: 'Failed to export Excel' });
    }
};