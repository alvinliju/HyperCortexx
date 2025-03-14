import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                [key: string]: any;
            };
        }
    }
}

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

        if (!token) {
            res.status(401).json({ message: 'Invalid token format' });
            return;
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & {
            id: string;
            email: string;
        };
        
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token expired' });
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        res.status(500).json({ message: 'Server error' });
        return;
    }
};