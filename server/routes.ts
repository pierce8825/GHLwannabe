import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertDealSchema, insertTaskSchema, insertActivitySchema, insertCampaignSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import messagingRoutes from "./routes/messaging.routes";
import importRoutes from "./routes/import.routes";
import funnelsRoutes from "./routes/funnels.routes";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Register messaging routes
  app.use('/api/messaging', messagingRoutes);
  
  // Register import routes
  app.use('/api/import', importRoutes);
  
  // Register funnels routes
  app.use('/api/funnels', funnelsRoutes);

  // Contacts API
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.getContact(parseInt(req.params.id));
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create contact" });
    }
  });

  app.put("/api/contacts/:id", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.updateContact(parseInt(req.params.id), contactData);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const success = await storage.deleteContact(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  // Deals API
  app.get("/api/deals", async (req, res) => {
    try {
      const deals = await storage.getAllDeals();
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.get("/api/deals/:id", async (req, res) => {
    try {
      const deal = await storage.getDeal(parseInt(req.params.id));
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deal" });
    }
  });

  app.post("/api/deals", async (req, res) => {
    try {
      const dealData = insertDealSchema.parse(req.body);
      const deal = await storage.createDeal(dealData);
      res.status(201).json(deal);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create deal" });
    }
  });

  app.put("/api/deals/:id", async (req, res) => {
    try {
      const dealData = insertDealSchema.parse(req.body);
      const deal = await storage.updateDeal(parseInt(req.params.id), dealData);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update deal" });
    }
  });

  app.put("/api/deals/:id/stage", async (req, res) => {
    try {
      const { stage } = req.body;
      if (!stage) {
        return res.status(400).json({ message: "Stage is required" });
      }
      const deal = await storage.updateDealStage(parseInt(req.params.id), stage);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update deal stage" });
    }
  });

  app.delete("/api/deals/:id", async (req, res) => {
    try {
      const success = await storage.deleteDeal(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete deal" });
    }
  });

  // Tasks API
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id/complete", async (req, res) => {
    try {
      const task = await storage.completeTask(parseInt(req.params.id));
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete task" });
    }
  });

  // Activities API
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getAllActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // Campaigns API
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const campaignData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.put("/api/campaigns/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const campaign = await storage.updateCampaignStatus(parseInt(req.params.id), status);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to update campaign status" });
    }
  });

  // User and Subaccount API
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  app.put("/api/users/:id", async (req, res) => {
    try {
      // Create a subset schema for user updates that doesn't require password
      const updateUserSchema = z.object({
        fullName: z.string().optional(),
        email: z.string().email().optional(),
        role: z.string().optional(),
        avatarUrl: z.string().optional().nullable(),
        companyName: z.string().optional().nullable(),
      });
      
      const userData = updateUserSchema.parse(req.body);
      const user = await storage.updateUser(parseInt(req.params.id), userData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  // Subaccount Management
  app.get("/api/users/:id/subaccounts", async (req, res) => {
    try {
      const subaccounts = await storage.getSubaccounts(parseInt(req.params.id));
      res.json(subaccounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subaccounts" });
    }
  });
  
  app.post("/api/users/:id/subaccounts", async (req, res) => {
    try {
      // Create a specific schema for subaccount creation
      const createSubaccountSchema = z.object({
        username: z.string(),
        password: z.string(),
        email: z.string().email(),
        fullName: z.string(),
        role: z.string().optional(),
        companyName: z.string().optional(),
      });
      
      const subaccountData = createSubaccountSchema.parse(req.body);
      const parentId = parseInt(req.params.id);
      
      const subaccount = await storage.createSubaccount(subaccountData, parentId);
      res.status(201).json(subaccount);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      } else if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create subaccount" });
    }
  });

  // Dashboard statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const totalContacts = await storage.countContacts();
      const deals = await storage.getAllDeals();
      const openDeals = deals.filter(deal => !["won", "lost"].includes(deal.stage)).length;
      const activeCampaigns = (await storage.getAllCampaigns()).filter(c => c.status === "active").length;
      const upcomingTasks = (await storage.getAllTasks()).filter(t => !t.completed && t.dueDate && new Date(t.dueDate) >= new Date()).length;
      
      res.json({
        totalContacts,
        openDeals,
        activeCampaigns,
        upcomingTasks
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  return httpServer;
}
