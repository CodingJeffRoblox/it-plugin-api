import { Router } from 'express';
import { db } from '../db';
import { apiKeys } from '@workspace/db';
import { eq } from 'drizzle-orm';

const router = Router();

router.post('/verify', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    const result = await db.select().from(apiKeys).where(eq(apiKeys.key, apiKey)).limit(1);
    
    if (result.length === 0) {
      res.json({ valid: false, role: null });
    } else {
      res.json({ valid: true, role: result[0].role });
    }
  } catch (error) {
    console.error('Error verifying API key:', error);
    res.status(500).json({ error: 'Failed to verify API key' });
  }
});

export { router as authRouter };
