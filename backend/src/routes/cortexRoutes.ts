import { Router, Request, Response } from 'express';
import db from '../db';
import { cortex } from '../db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../middleware/authMiddleware';

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id: string;
            email: string;
            [key: string]: any;
        };
    }
}

const router = Router();

// Get user's cortex items
router.get('/', verifyToken, async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const cortexes = await db
            .select()
            .from(cortex)
            .where(eq(cortex.userId, req.user.id));

        res.status(200).json({ cortexes });
    } catch (error) {
        console.error('Error fetching cortexes:', error);
        res.status(500).json({ message: 'Failed to fetch cortex items' });
    }
});

// Create new cortex item
router.post('/', verifyToken, async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const { type, title, description, link, language, content, tags, isPublic } = req.body;

        // Validate required fields
        if (!type || !title || !link) {
            res.status(400).json({ message: 'Type, title, and link are required' });
            return;
        }

        const [newCortex] = await db
            .insert(cortex)
            .values({
                userId: req.user.id,
                type,
                title,
                description,
                link,
                language,
                content,
                tags,
                isPublic: isPublic || false
            })
            .returning();

        res.status(201).json({ cortex: newCortex });
    } catch (error) {
        console.error('Error creating cortex:', error);
        res.status(500).json({ message: 'Failed to create cortex item' });
    }
});

export default router;