import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nama, username, password } = req.body;

        // Validate request body
        if (!nama || !username || !password) {
            res.status(400).json({
                message: 'Invalid input. Please provide nama, username, and password.',
            });
            return;
        }

        // Check if username already exists
        const existingUser = await User.findFirst({
            where: { username },
        });
        if (existingUser) {
            res.status(409).json({
                message: 'Username already exists. Please choose another username.',
            });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to the database
        const user = await User.create({
            data: {
                nama,
                username,
                password: hashedPassword,
            },
        });

        // Return success response
        res.status(201).json({
            message: 'User registered successfully',
            data: {
                id: user.id,
                nama: user.nama,
                username: user.username,
            },
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({
            message: 'Registration failed. Please try again later.',
        });
    }
};


export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        // Cari user berdasarkan username menggunakan Prisma
        const user = await User.findFirst({
            where: { username },
        });
        if (!user) {
            res.status(401).json({ error: 'Authentication failed: user not found' });
            return;
        }

        // Bandingkan password yang dikirim dengan password yang tersimpan
        const passwordMatch = await bcrypt.compare(password, user.password!);

        if (!passwordMatch) {
            res.status(401).json({ error: 'Authentication failed: incorrect password' });
            return;
        }else{
            // Jika password cocok, buat token JWT
            const payload = {
                id: user.id,
                nama: user.nama,
            };
            const secret = process.env.JWT_SECRET!;
            const expiresIn = 60 * 60 * 1; // Token berlaku selama 1 jam
    
            const token = jwt.sign(payload, secret, { expiresIn });
    
            // Kirim response dengan data user dan token
            res.json({
                data: {
                    id: user.id,
                    nama: user.nama,
                    username: user.username,
                    token: token,
                },
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};

export const sendEmail = async (req: Request, res: Response): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { to, subject, text } = req.body;

    try {
        await transporter.sendMail({
            from: 'noreply', // Email pengirim
            to: to, // Email tujuan
            subject: subject, // Subjek email
            text: text, // Isi email
        });

        res.status(200).json({ message: 'Email berhasil dikirim!' });
    } catch (error) {
        console.error('Error saat mengirim email:', error);
        res.status(500).json({ error: 'Gagal mengirim email' });
    }
};