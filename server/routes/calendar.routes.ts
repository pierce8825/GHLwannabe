import { Request, Response, Router } from 'express';
import { storage } from '../storage';
import { insertCalendarEventSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

/**
 * Get all calendar events
 * GET /api/calendar
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const events = await storage.getAllCalendarEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});

/**
 * Get a specific calendar event by ID
 * GET /api/calendar/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    const event = await storage.getCalendarEvent(id);
    if (!event) {
      return res.status(404).json({ error: 'Calendar event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching calendar event:', error);
    res.status(500).json({ error: 'Failed to fetch calendar event' });
  }
});

/**
 * Create a new calendar event
 * POST /api/calendar
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate request body against schema
    const validatedData = insertCalendarEventSchema.parse(req.body);

    // Create the event
    const newEvent = await storage.createCalendarEvent(validatedData);

    res.status(201).json(newEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid event data',
        details: error.errors
      });
    }
    console.error('Error creating calendar event:', error);
    res.status(500).json({ error: 'Failed to create calendar event' });
  }
});

/**
 * Update a calendar event
 * PATCH /api/calendar/:id
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    // Validate request body against schema
    const validatedData = insertCalendarEventSchema.partial().parse(req.body);

    // Update the event
    const updatedEvent = await storage.updateCalendarEvent(id, validatedData);
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Calendar event not found' });
    }

    res.json(updatedEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid event data',
        details: error.errors
      });
    }
    console.error('Error updating calendar event:', error);
    res.status(500).json({ error: 'Failed to update calendar event' });
  }
});

/**
 * Delete a calendar event
 * DELETE /api/calendar/:id
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    const success = await storage.deleteCalendarEvent(id);
    if (!success) {
      return res.status(404).json({ error: 'Calendar event not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({ error: 'Failed to delete calendar event' });
  }
});

export default router;