import { Router } from 'express';
import { db } from '../db';
import { events } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';

const router = Router();

router.get('/summary', async (req, res) => {
  try {
    const allEvents = await db.select().from(events);
    
    const openTickets = allEvents.filter(e => e.type === 'TICKET_CREATE').length;
    const errors = allEvents.filter(e => e.type === 'CONSOLE_ERROR').length;
    const totalEvents = allEvents.length;

    res.json({ openTickets, errors, totalEvents });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

router.get('/tickets', async (req, res) => {
  try {
    const { status = 'all' } = req.query;
    
    let allEvents = await db.select().from(events)
      .orderBy(desc(events.createdAt));
    
    const ticketEvents = allEvents.filter(e => 
      e.type === 'TICKET_CREATE' || e.type === 'TICKET_CLOSE'
    );

    res.json(ticketEvents);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

router.get('/errors', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const errorEvents = await db.select().from(events)
      .where(eq(events.type, 'CONSOLE_ERROR'))
      .orderBy(desc(events.createdAt))
      .limit(parseInt(limit as string));

    res.json(errorEvents);
  } catch (error) {
    console.error('Error fetching errors:', error);
    res.status(500).json({ error: 'Failed to fetch errors' });
  }
});

router.get('/activity', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const allEvents = await db.select().from(events)
      .orderBy(desc(events.createdAt))
      .limit(parseInt(limit as string));

    res.json(allEvents);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

export { router as dashboardRouter };
