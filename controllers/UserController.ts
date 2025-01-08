import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { nama, username, password } = req.body;

        // Hash password sebelum menyimpan ke database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan user ke database
        const user = await prisma.tbl_user.create({
            data: {
                nama: nama,
                username: username,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            message: 'User registered successfully',
            data: user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Registration failed' });
    }
};
