import { Router } from 'express';
import { db } from '../db';
import { events } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { type, serverName, payload } = req.body;
    
    await db.insert(events).values({
      type,
      serverName,
      payload,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { type, limit = 50, offset = 0 } = req.query;
    
    let query = db.select().from(events);
    
    if (type) {
      query = query.where(eq(events.type, type as string));
    }
    
    const allEvents = await query
      .orderBy(desc(events.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json(allEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

export { router as eventsRouter };
