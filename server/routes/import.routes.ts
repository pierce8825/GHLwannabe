import express, { Request, Response } from 'express';
import { storage } from '../storage';
import { InsertContact } from '@shared/schema';

const router = express.Router();

/**
 * Import contacts from CSV
 * POST /api/import/contacts
 */
router.post('/contacts', async (req: Request, res: Response) => {
  try {
    const { contacts } = req.body;
    
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ error: 'Invalid contacts data. Expected an array of contacts.' });
    }
    
    const importedContacts = [];
    
    // Process each contact
    for (const contact of contacts) {
      try {
        const newContact = await storage.createContact(contact as InsertContact);
        importedContacts.push(newContact);
      } catch (contactError) {
        console.error('Error importing contact:', contactError);
        // Continue with other contacts even if one fails
      }
    }
    
    return res.status(201).json({
      message: `Successfully imported ${importedContacts.length} out of ${contacts.length} contacts`,
      importedContacts
    });
  } catch (error) {
    console.error('Error in contact import:', error);
    return res.status(500).json({ error: 'Failed to import contacts' });
  }
});

/**
 * Import deals from CSV
 * POST /api/import/deals
 */
router.post('/deals', async (req: Request, res: Response) => {
  try {
    const { deals } = req.body;
    
    if (!Array.isArray(deals) || deals.length === 0) {
      return res.status(400).json({ error: 'Invalid deals data. Expected an array of deals.' });
    }
    
    const importedDeals = [];
    
    // Process each deal
    for (const deal of deals) {
      try {
        const newDeal = await storage.createDeal(deal);
        importedDeals.push(newDeal);
      } catch (dealError) {
        console.error('Error importing deal:', dealError);
        // Continue with other deals even if one fails
      }
    }
    
    return res.status(201).json({
      message: `Successfully imported ${importedDeals.length} out of ${deals.length} deals`,
      importedDeals
    });
  } catch (error) {
    console.error('Error in deal import:', error);
    return res.status(500).json({ error: 'Failed to import deals' });
  }
});

export default router;