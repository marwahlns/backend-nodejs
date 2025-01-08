import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
        const existingUser = await prisma.tbl_user.findFirst({
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
        const user = await prisma.tbl_user.create({
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
