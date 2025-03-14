import { Router, Request, Response } from 'express';
import db from '../db';
import { cortex } from '../db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { verifyToken } from '../middleware/authMiddleware';
import { getCache, setCache, clearCache } from '../services/redis';
import { cacheMiddleware } from '../middleware/cache';

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
router.get('/', verifyToken, cacheMiddleware('cortex', 300),  async (req: Request, res: Response): Promise<void> => {
    try {

        const userId = req.user?.id;

        const cacheKey = `cortex:${req.user?.id}`;

        const cachedItems = await getCache(cacheKey);
        if(cachedItems){
            return res.status(200).json({cortexes: cachedItems});
        }

       

        const cortexes = await db
            .select()
            .from(cortex)
            .where(eq(cortex.userId, userId!));

        await setCache(cacheKey, cortexes, 300);

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

        await clearCache(`cortex:${req.user.id}:*`);

        res.status(201).json({ cortex: newCortex });
    } catch (error) {
        console.error('Error creating cortex:', error);
        res.status(500).json({ message: 'Failed to create cortex item' });
    }
});

//Search through cortexes

router.get('/search', verifyToken, async (req:Request, res:Response)=>{
    try{
        const {query} = req.query;
        const userId = req.user?.id;
    
        //text search for now, will implmenet vector search later
        const result = db.select().from(cortex).where(sql`to_tsvector('english', title || ' ' || description || ' ' || content) @@ plainto_tsquery('english'), ${query} AND user_id = ${userId}`)

        res.status(200).json({result})
    }catch(err){
        res.status(500).json({message:"server error"})
    }

})

//Delete a cortex
router.delete('/', verifyToken, async (req:Request, res:Response):Promise<void> =>{
    try{
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const {id} = req.body;

        const cortexDelete = await db.select().from(cortex).where(eq(cortex.id, id)).limit(1)

        if(cortexDelete[0].userId !== req.user.id){
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        await db.delete(cortex)
        .where(and(
          eq(cortex.id, id),
          eq(cortex.userId, req.user.id)
        ));

       res.status(200).json({message: "cortex deleted"})
    }catch(err){
        console.error('Error deleting cortex:', err);
        res.status(500).json({message:"server error"})
    }
})


export default router;