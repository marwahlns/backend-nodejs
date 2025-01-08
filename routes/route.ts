import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = 4000;
const prisma = new PrismaClient();

app.use(express.json());

// User registration
app.post('/register', async (req, res) => {
    try {
        const { nama, username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.tbl_user.create({
            data: {
                nama: nama,
                username: username,
                password: hashedPassword,
            },
        });

        res.status(201).json({ 
            message: 'User registered successfully', 
            data: user 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// //User login
// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         const user = await prisma.tbl_user.findUnique({
//             where: { username },
//         });
//         if (!user) {
//             return res.status(401).json({ error: 'Authentication failed: user not found' });
//         }

//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//             return res.status(401).json({ error: 'Authentication failed: incorrect password' });
//         }

//         const payload = {
//             id: user.id,
//             nama: user.nama,
//         };
//         const secret = process.env.JWT_SECRET || 'default_secret_key';
//         const expiresIn = 60 * 60 * 1; // Token berlaku selama 1 jam

//         const token = jwt.sign(payload, secret, { expiresIn });

//         // Kirim response dengan data user dan token
//         return res.json({
//             data: {
//                 id: user.id,
//                 nama: user.nama,
//             },
//             token: token,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Login failed' });
//     }
// });

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});