import { Router, Request, Response } from 'express';
import { messagingService } from '../services/messaging.service';
import { z } from 'zod';
import { contacts } from '@shared/schema';
import { db } from '../db';
import { eq } from 'drizzle-orm';

const router = Router();

// Schema for validating email requests
const sendEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  subject: z.string().min(1),
  html: z.string().min(1),
  text: z.string().optional(),
  from: z.string().email().optional(),
  replyTo: z.string().email().optional(),
});

// Schema for validating SMS requests
const sendSmsSchema = z.object({
  to: z.string().min(10), // Simplified phone validation - would be more robust in production
  message: z.string().min(1).max(1600), // SMS typically has a length limit
  from: z.string().optional(),
});

// Schema for validating contact messages
const sendToContactSchema = z.object({
  contactId: z.number().int().positive(),
  subject: z.string().min(1),
  body: z.string().min(1),
  channel: z.enum(['email', 'sms', 'both']).optional(),
  from: z.string().optional(),
});

// Schema for validating campaign sending
const sendCampaignSchema = z.object({
  campaignId: z.number().int().positive(),
  channel: z.enum(['email', 'sms', 'both']),
});

/**
 * Send an email
 * POST /api/messaging/email
 */
router.post('/email', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = sendEmailSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: validationResult.error.format() 
      });
    }

    const data = validationResult.data;
    const result = await messagingService.sendEmail(data);

    if (result) {
      return res.status(200).json({ success: true, message: 'Email sent successfully' });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to send email' });
    }
  } catch (error: any) {
    console.error('Error in /email endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error', 
      error: error.message 
    });
  }
});

/**
 * Send an SMS
 * POST /api/messaging/sms
 */
router.post('/sms', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = sendSmsSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: validationResult.error.format() 
      });
    }

    const data = validationResult.data;
    const result = await messagingService.sendSMS(data);

    if (result) {
      return res.status(200).json({ success: true, message: 'SMS sent successfully' });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to send SMS' });
    }
  } catch (error: any) {
    console.error('Error in /sms endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error', 
      error: error.message 
    });
  }
});

/**
 * Send a message to a contact (email, SMS, or both)
 * POST /api/messaging/contact
 */
router.post('/contact', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = sendToContactSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: validationResult.error.format() 
      });
    }

    const data = validationResult.data;
    
    // Get contact data from database
    const [contactData] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, data.contactId));
    
    if (!contactData) {
      return res.status(404).json({ 
        success: false, 
        message: `Contact with ID ${data.contactId} not found` 
      });
    }

    // Determine channel based on available contact info if not specified
    if (!data.channel) {
      if (contactData.email && contactData.phone) {
        data.channel = 'both';
      } else if (contactData.email) {
        data.channel = 'email';
      } else if (contactData.phone) {
        data.channel = 'sms';
      } else {
        return res.status(400).json({ 
          success: false, 
          message: 'Contact has no email or phone number' 
        });
      }
    }

    // Send message via appropriate channel
    let emailResult = false;
    let smsResult = false;

    if (data.channel === 'email' || data.channel === 'both') {
      if (contactData.email) {
        emailResult = await messagingService.sendEmail({
          to: contactData.email,
          subject: data.subject,
          html: data.body,
          from: data.from,
        });
      }
    }

    if (data.channel === 'sms' || data.channel === 'both') {
      if (contactData.phone) {
        smsResult = await messagingService.sendSMS({
          to: contactData.phone,
          message: data.body,
          from: data.from,
        });
      }
    }

    return res.status(200).json({ 
      success: emailResult || smsResult, 
      emailSent: emailResult, 
      smsSent: smsResult 
    });
  } catch (error: any) {
    console.error('Error in /contact endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error', 
      error: error.message 
    });
  }
});

/**
 * Send a campaign to multiple contacts
 * POST /api/messaging/campaign
 */
router.post('/campaign', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = sendCampaignSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: validationResult.error.format() 
      });
    }

    const data = validationResult.data;
    const result = await messagingService.sendCampaign(data);

    return res.status(200).json({
      success: result.success,
      emailCount: result.emailCount,
      smsCount: result.smsCount,
    });
  } catch (error: any) {
    console.error('Error in /campaign endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error', 
      error: error.message 
    });
  }
});

export default router;