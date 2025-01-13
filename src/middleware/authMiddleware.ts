import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.header('Authorization');
    const secret = process.env.JWT_SECRET;

    if (!authHeader) {
        res.status(401).json({ error: 'Access denied' });
        return;
    }

    const token = authHeader.split(' ')[1]; // Ambil token setelah "Bearer"
    if (!token) {
        res.status(401).json({ error: 'Access denied' });
        return;
    }

    if (!secret) {
        res.status(500).json({ error: 'JWT secret is not defined' });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};