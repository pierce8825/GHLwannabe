import { 
  users, contacts, deals, tasks, activities, campaigns, funnels, funnelSteps,
  type User, type InsertUser, 
  type Contact, type InsertContact,
  type Deal, type InsertDeal,
  type Task, type InsertTask,
  type Activity, type InsertActivity,
  type Campaign, type InsertCampaign,
  type Funnel, type InsertFunnel,
  type FunnelStep, type InsertFunnelStep
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq, desc, count, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  
  // Subaccount methods
  async getSubaccounts(parentId: number): Promise<User[]> {
    return await db.select()
      .from(users)
      .where(
        and(
          eq(users.parentId, parentId),
          eq(users.isSubaccount, true)
        )
      );
  }
  
  async createSubaccount(subaccount: InsertUser, parentId: number): Promise<User> {
    const parentUser = await this.getUser(parentId);
    if (!parentUser) {
      throw new Error(`Parent user with ID ${parentId} not found`);
    }
    
    const modifiedSubaccount: InsertUser = {
      ...subaccount,
      parentId,
      isSubaccount: true,
      // Inherit company name from parent if not explicitly provided
      companyName: subaccount.companyName || parentUser.companyName
    };
    
    const [newUser] = await db.insert(users).values(modifiedSubaccount).returning();
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) {
      return undefined;
    }
    
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }

  // Contact methods
  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    
    // Also create an activity for this new contact
    await this.createActivity({
      type: "note",
      title: "New contact created",
      description: `${contact.firstName} ${contact.lastName} from ${contact.company || 'N/A'}`,
      contactId: newContact.id,
      createdBy: 1, // Default to the first user
    });
    
    return newContact;
  }

  async updateContact(id: number, contact: InsertContact): Promise<Contact | undefined> {
    const [updatedContact] = await db
      .update(contacts)
      .set({ ...contact, updatedAt: new Date() })
      .where(eq(contacts.id, id))
      .returning();
    
    return updatedContact || undefined;
  }

  async deleteContact(id: number): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
  
  async countContacts(): Promise<number> {
    const result = await db.select({ count: count() }).from(contacts);
    return Number(result[0].count) || 0;
  }

  // Deal methods
  async getAllDeals(): Promise<Deal[]> {
    return await db.select().from(deals);
  }

  async getDeal(id: number): Promise<Deal | undefined> {
    const [deal] = await db.select().from(deals).where(eq(deals.id, id));
    return deal || undefined;
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const [newDeal] = await db.insert(deals).values(deal).returning();
    
    // Create an activity for this new deal
    await this.createActivity({
      type: "note",
      title: "New deal created",
      description: `${deal.title} ($${deal.amount})`,
      contactId: deal.contactId,
      dealId: newDeal.id,
      createdBy: 1, // Default to the first user
    });
    
    return newDeal;
  }

  async updateDeal(id: number, deal: InsertDeal): Promise<Deal | undefined> {
    const [updatedDeal] = await db
      .update(deals)
      .set({ ...deal, updatedAt: new Date() })
      .where(eq(deals.id, id))
      .returning();
    
    return updatedDeal || undefined;
  }
  
  async updateDealStage(id: number, stage: string): Promise<Deal | undefined> {
    // First get the existing deal to record previous stage
    const [existingDeal] = await db.select().from(deals).where(eq(deals.id, id));
    if (!existingDeal) {
      return undefined;
    }
    
    const previousStage = existingDeal.stage;
    
    // Update the deal stage
    const [updatedDeal] = await db
      .update(deals)
      .set({ stage, updatedAt: new Date() })
      .where(eq(deals.id, id))
      .returning();
    
    if (!updatedDeal) {
      return undefined;
    }
    
    // Create an activity for stage change
    await this.createActivity({
      type: "note",
      title: "Deal stage updated",
      description: `Changed from ${previousStage} to ${stage}`,
      contactId: existingDeal.contactId,
      dealId: id,
      createdBy: 1, // Default to the first user
    });
    
    return updatedDeal;
  }

  async deleteDeal(id: number): Promise<boolean> {
    const result = await db.delete(deals).where(eq(deals.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Task methods
  async getAllTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, task: InsertTask): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...task, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    
    return updatedTask || undefined;
  }
  
  async completeTask(id: number): Promise<Task | undefined> {
    // First get the existing task
    const [existingTask] = await db.select().from(tasks).where(eq(tasks.id, id));
    if (!existingTask) {
      return undefined;
    }
    
    // Update the task as completed
    const [updatedTask] = await db
      .update(tasks)
      .set({ completed: true, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    
    if (!updatedTask) {
      return undefined;
    }
    
    // Create an activity for task completion
    if (existingTask.contactId || existingTask.dealId) {
      await this.createActivity({
        type: "note",
        title: "Task completed",
        description: existingTask.title,
        contactId: existingTask.contactId,
        dealId: existingTask.dealId,
        createdBy: 1, // Default to the first user
      });
    }
    
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Activity methods
  async getAllActivities(): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .orderBy(desc(activities.createdAt));
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity || undefined;
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  // Campaign methods
  async getAllCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns);
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || undefined;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }
  
  async updateCampaignStatus(id: number, status: string): Promise<Campaign | undefined> {
    const [updatedCampaign] = await db
      .update(campaigns)
      .set({ status })
      .where(eq(campaigns.id, id))
      .returning();
    
    return updatedCampaign || undefined;
  }

  // Funnel methods
  async getAllFunnels(userId: number): Promise<Funnel[]> {
    return await db
      .select()
      .from(funnels)
      .where(eq(funnels.userId, userId))
      .orderBy(desc(funnels.updatedAt));
  }

  async getFunnel(id: number): Promise<Funnel | undefined> {
    const [funnel] = await db.select().from(funnels).where(eq(funnels.id, id));
    return funnel || undefined;
  }

  async createFunnel(funnel: InsertFunnel): Promise<Funnel> {
    const [newFunnel] = await db.insert(funnels).values(funnel).returning();
    
    // Create an activity for this new funnel
    await this.createActivity({
      type: "note",
      title: "New funnel created",
      description: `${funnel.name} (${funnel.status})`,
      createdBy: funnel.userId,
    });
    
    return newFunnel;
  }

  async updateFunnel(id: number, funnelData: Partial<InsertFunnel>): Promise<Funnel | undefined> {
    const [updatedFunnel] = await db
      .update(funnels)
      .set({ ...funnelData, updatedAt: new Date() })
      .where(eq(funnels.id, id))
      .returning();
    
    return updatedFunnel || undefined;
  }

  async updateFunnelStatus(id: number, status: string): Promise<Funnel | undefined> {
    const [existingFunnel] = await db.select().from(funnels).where(eq(funnels.id, id));
    if (!existingFunnel) {
      return undefined;
    }
    
    const previousStatus = existingFunnel.status;
    
    const [updatedFunnel] = await db
      .update(funnels)
      .set({ status, updatedAt: new Date() })
      .where(eq(funnels.id, id))
      .returning();
    
    if (!updatedFunnel) {
      return undefined;
    }
    
    // Create an activity for status change
    await this.createActivity({
      type: "note",
      title: "Funnel status updated",
      description: `Changed from ${previousStatus} to ${status}`,
      createdBy: existingFunnel.userId,
    });
    
    return updatedFunnel;
  }

  async deleteFunnel(id: number): Promise<boolean> {
    // First delete all funnel steps
    await db.delete(funnelSteps).where(eq(funnelSteps.funnelId, id));
    
    // Then delete the funnel
    const result = await db.delete(funnels).where(eq(funnels.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Funnel Step methods
  async getFunnelSteps(funnelId: number): Promise<FunnelStep[]> {
    return await db
      .select()
      .from(funnelSteps)
      .where(eq(funnelSteps.funnelId, funnelId))
      .orderBy(funnelSteps.order);
  }

  async getFunnelStep(id: number): Promise<FunnelStep | undefined> {
    const [step] = await db.select().from(funnelSteps).where(eq(funnelSteps.id, id));
    return step || undefined;
  }

  async createFunnelStep(step: InsertFunnelStep): Promise<FunnelStep> {
    const [newStep] = await db.insert(funnelSteps).values(step).returning();
    return newStep;
  }

  async updateFunnelStep(id: number, stepData: Partial<InsertFunnelStep>): Promise<FunnelStep | undefined> {
    const [updatedStep] = await db
      .update(funnelSteps)
      .set({ ...stepData, updatedAt: new Date() })
      .where(eq(funnelSteps.id, id))
      .returning();
    
    return updatedStep || undefined;
  }

  async deleteFunnelStep(id: number): Promise<boolean> {
    const result = await db.delete(funnelSteps).where(eq(funnelSteps.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async reorderFunnelSteps(funnelId: number, stepIds: number[]): Promise<FunnelStep[]> {
    // Get the existing steps to verify they all exist
    const steps = await this.getFunnelSteps(funnelId);
    
    if (steps.length !== stepIds.length) {
      throw new Error("The number of steps provided doesn't match the number of steps in the funnel");
    }
    
    // Update the order of each step
    const updates = stepIds.map((stepId, index) => {
      return db
        .update(funnelSteps)
        .set({ order: index + 1, updatedAt: new Date() })
        .where(eq(funnelSteps.id, stepId));
    });
    
    await Promise.all(updates);
    
    // Return the updated steps in order
    return await this.getFunnelSteps(funnelId);
  }
}