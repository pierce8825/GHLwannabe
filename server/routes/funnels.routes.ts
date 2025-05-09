import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { createInsertSchema } from "drizzle-zod";
import { funnels, insertFunnelSchema, insertFunnelStepSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

/**
 * Get all funnels for a user
 * GET /api/funnels
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // In a real app, get userId from session
    const userId = 1; // Hardcoded for demo
    const funnelsList = await storage.getAllFunnels(userId);
    res.json(funnelsList);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get a specific funnel by ID
 * GET /api/funnels/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid funnel ID' });
    }
    
    const funnel = await storage.getFunnel(id);
    if (!funnel) {
      return res.status(404).json({ error: 'Funnel not found' });
    }
    
    res.json(funnel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create a new funnel
 * POST /api/funnels
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = insertFunnelSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid funnel data',
        details: validation.error.format() 
      });
    }
    
    const newFunnel = await storage.createFunnel(validation.data);
    res.status(201).json(newFunnel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update a funnel
 * PATCH /api/funnels/:id
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid funnel ID' });
    }
    
    // Create a partial validation schema
    const partialFunnelSchema = insertFunnelSchema.partial();
    const validation = partialFunnelSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid funnel data',
        details: validation.error.format() 
      });
    }
    
    const updatedFunnel = await storage.updateFunnel(id, validation.data);
    if (!updatedFunnel) {
      return res.status(404).json({ error: 'Funnel not found' });
    }
    
    res.json(updatedFunnel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update a funnel's status
 * PATCH /api/funnels/:id/status
 */
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid funnel ID' });
    }
    
    // Validate status
    const { status } = req.body;
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const updatedFunnel = await storage.updateFunnelStatus(id, status);
    if (!updatedFunnel) {
      return res.status(404).json({ error: 'Funnel not found' });
    }
    
    res.json(updatedFunnel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete a funnel
 * DELETE /api/funnels/:id
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid funnel ID' });
    }
    
    const deleted = await storage.deleteFunnel(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Funnel not found' });
    }
    
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all steps for a funnel
 * GET /api/funnels/:funnelId/steps
 */
router.get('/:funnelId/steps', async (req: Request, res: Response) => {
  try {
    const funnelId = parseInt(req.params.funnelId);
    if (isNaN(funnelId)) {
      return res.status(400).json({ error: 'Invalid funnel ID' });
    }
    
    const funnel = await storage.getFunnel(funnelId);
    if (!funnel) {
      return res.status(404).json({ error: 'Funnel not found' });
    }
    
    const steps = await storage.getFunnelSteps(funnelId);
    res.json(steps);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create a new funnel step
 * POST /api/funnels/:funnelId/steps
 */
router.post('/:funnelId/steps', async (req: Request, res: Response) => {
  try {
    const funnelId = parseInt(req.params.funnelId);
    if (isNaN(funnelId)) {
      return res.status(400).json({ error: 'Invalid funnel ID' });
    }
    
    // Check if funnel exists
    const funnel = await storage.getFunnel(funnelId);
    if (!funnel) {
      return res.status(404).json({ error: 'Funnel not found' });
    }
    
    // Count existing steps to determine order
    const existingSteps = await storage.getFunnelSteps(funnelId);
    const order = existingSteps.length + 1;
    
    // Add funnelId and order to request body
    const stepData = {
      ...req.body,
      funnelId,
      order,
    };
    
    // Validate request body
    const validation = insertFunnelStepSchema.safeParse(stepData);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid step data',
        details: validation.error.format() 
      });
    }
    
    const newStep = await storage.createFunnelStep(validation.data);
    res.status(201).json(newStep);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update a funnel step
 * PATCH /api/funnels/:funnelId/steps/:stepId
 */
router.patch('/:funnelId/steps/:stepId', async (req: Request, res: Response) => {
  try {
    const funnelId = parseInt(req.params.funnelId);
    const stepId = parseInt(req.params.stepId);
    
    if (isNaN(funnelId) || isNaN(stepId)) {
      return res.status(400).json({ error: 'Invalid funnel or step ID' });
    }
    
    // Create a partial validation schema
    const partialStepSchema = insertFunnelStepSchema.partial();
    const validation = partialStepSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid step data',
        details: validation.error.format() 
      });
    }
    
    const updatedStep = await storage.updateFunnelStep(stepId, validation.data);
    if (!updatedStep) {
      return res.status(404).json({ error: 'Step not found' });
    }
    
    res.json(updatedStep);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete a funnel step
 * DELETE /api/funnels/:funnelId/steps/:stepId
 */
router.delete('/:funnelId/steps/:stepId', async (req: Request, res: Response) => {
  try {
    const stepId = parseInt(req.params.stepId);
    if (isNaN(stepId)) {
      return res.status(400).json({ error: 'Invalid step ID' });
    }
    
    const deleted = await storage.deleteFunnelStep(stepId);
    if (!deleted) {
      return res.status(404).json({ error: 'Step not found' });
    }
    
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Reorder funnel steps
 * POST /api/funnels/:funnelId/steps/reorder
 */
router.post('/:funnelId/steps/reorder', async (req: Request, res: Response) => {
  try {
    const funnelId = parseInt(req.params.funnelId);
    if (isNaN(funnelId)) {
      return res.status(400).json({ error: 'Invalid funnel ID' });
    }
    
    const { stepIds } = req.body;
    if (!Array.isArray(stepIds) || stepIds.some(id => typeof id !== 'number')) {
      return res.status(400).json({ error: 'stepIds must be an array of numbers' });
    }
    
    const updatedSteps = await storage.reorderFunnelSteps(funnelId, stepIds);
    res.json(updatedSteps);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;