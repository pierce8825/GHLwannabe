import { 
  users, contacts, deals, tasks, activities, campaigns, funnels, funnelSteps, calendarEvents,
  type User, type InsertUser, 
  type Contact, type InsertContact,
  type Deal, type InsertDeal,
  type Task, type InsertTask,
  type Activity, type InsertActivity,
  type Campaign, type InsertCampaign,
  type Funnel, type InsertFunnel,
  type FunnelStep, type InsertFunnelStep,
  type CalendarEvent, type InsertCalendarEvent
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Subaccounts
  getSubaccounts(parentId: number): Promise<User[]>;
  createSubaccount(subaccount: InsertUser, parentId: number): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Contacts
  getAllContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: InsertContact): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;
  countContacts(): Promise<number>;
  
  // Deals
  getAllDeals(): Promise<Deal[]>;
  getDeal(id: number): Promise<Deal | undefined>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: number, deal: InsertDeal): Promise<Deal | undefined>;
  updateDealStage(id: number, stage: string): Promise<Deal | undefined>;
  deleteDeal(id: number): Promise<boolean>;
  
  // Tasks
  getAllTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: InsertTask): Promise<Task | undefined>;
  completeTask(id: number): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Activities
  getAllActivities(): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Campaigns
  getAllCampaigns(): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaignStatus(id: number, status: string): Promise<Campaign | undefined>;
  
  // Funnels
  getAllFunnels(userId: number): Promise<Funnel[]>;
  getFunnel(id: number): Promise<Funnel | undefined>;
  createFunnel(funnel: InsertFunnel): Promise<Funnel>;
  updateFunnel(id: number, funnelData: Partial<InsertFunnel>): Promise<Funnel | undefined>;
  updateFunnelStatus(id: number, status: string): Promise<Funnel | undefined>;
  deleteFunnel(id: number): Promise<boolean>;
  
  // Funnel Steps
  getFunnelSteps(funnelId: number): Promise<FunnelStep[]>;
  getFunnelStep(id: number): Promise<FunnelStep | undefined>;
  createFunnelStep(step: InsertFunnelStep): Promise<FunnelStep>;
  updateFunnelStep(id: number, stepData: Partial<InsertFunnelStep>): Promise<FunnelStep | undefined>;
  deleteFunnelStep(id: number): Promise<boolean>;
  reorderFunnelSteps(funnelId: number, stepIds: number[]): Promise<FunnelStep[]>;
  
  // Calendar Events
  getAllCalendarEvents(): Promise<CalendarEvent[]>;
  getCalendarEvent(id: number): Promise<CalendarEvent | undefined>;
  createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  updateCalendarEvent(id: number, eventData: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined>;
  deleteCalendarEvent(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private deals: Map<number, Deal>;
  private tasks: Map<number, Task>;
  private activities: Map<number, Activity>;
  private campaigns: Map<number, Campaign>;
  private calendarEvents: Map<number, CalendarEvent>;
  
  private userCurrentId: number;
  private contactCurrentId: number;
  private dealCurrentId: number;
  private taskCurrentId: number;
  private activityCurrentId: number;
  private campaignCurrentId: number;
  private calendarEventCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.deals = new Map();
    this.tasks = new Map();
    this.activities = new Map();
    this.campaigns = new Map();
    this.calendarEvents = new Map();
    
    this.userCurrentId = 1;
    this.contactCurrentId = 1;
    this.dealCurrentId = 1;
    this.taskCurrentId = 1;
    this.activityCurrentId = 1;
    this.campaignCurrentId = 1;
    this.calendarEventCurrentId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create a sample user
    const sampleUser: InsertUser = {
      username: "alexjohnson",
      password: "password123", // In a real app, this would be hashed
      email: "alex@example.com",
      fullName: "Alex Johnson",
      role: "Administrator",
    };
    this.createUser(sampleUser);
    
    // Create sample contacts
    const sampleContacts: InsertContact[] = [
      {
        firstName: "John",
        lastName: "Smith",
        email: "john@acmeinc.com",
        phone: "555-123-4567",
        company: "Acme Inc.",
        status: "lead",
        source: "Website",
        notes: "Interested in website redesign",
      },
      {
        firstName: "Sarah",
        lastName: "Jones",
        email: "sarah@techstar.com",
        phone: "555-987-6543",
        company: "TechStar Solutions",
        status: "lead",
        source: "Referral",
        notes: "Looking for CRM implementation",
      },
      {
        firstName: "Michael",
        lastName: "Davis",
        email: "michael@globemedia.com",
        phone: "555-456-7890",
        company: "Globe Media",
        status: "prospect",
        source: "Conference",
        notes: "Needs marketing automation",
      },
      {
        firstName: "Jennifer",
        lastName: "Wilson",
        email: "jennifer@vertex.com",
        phone: "555-222-3333",
        company: "Vertex Inc.",
        status: "prospect",
        source: "LinkedIn",
        notes: "Interested in sales funnel optimization",
      },
      {
        firstName: "Robert",
        lastName: "Brown",
        email: "robert@pinnacle.com",
        phone: "555-444-5555",
        company: "Pinnacle Corp",
        status: "customer",
        source: "Webinar",
        notes: "Looking for complete CRM package",
      },
    ];
    
    for (const contact of sampleContacts) {
      this.createContact(contact);
    }
    
    // Create sample deals
    const sampleDeals: InsertDeal[] = [
      {
        title: "Website redesign project",
        contactId: 1,
        amount: 5800,
        stage: "lead",
        description: "Complete redesign of company website",
      },
      {
        title: "CRM implementation",
        contactId: 2,
        amount: 3200,
        stage: "lead",
        description: "Implementation of CRM system",
      },
      {
        title: "Marketing automation",
        contactId: 3,
        amount: 7500,
        stage: "qualified",
        description: "Setup of marketing automation workflows",
      },
      {
        title: "Sales funnel optimization",
        contactId: 4,
        amount: 12400,
        stage: "proposal",
        description: "Optimizing sales funnel to increase conversions",
      },
      {
        title: "Complete CRM package",
        contactId: 5,
        amount: 28000,
        stage: "negotiation",
        description: "Full CRM implementation with training",
      },
    ];
    
    for (const deal of sampleDeals) {
      this.createDeal(deal);
    }
    
    // Create sample tasks
    const sampleTasks: InsertTask[] = [
      {
        title: "Send proposal to Acme Inc.",
        description: "Prepare and send website redesign proposal",
        dueDate: new Date(Date.now() + 86400000), // tomorrow
        contactId: 1,
        dealId: 1,
        assignedTo: 1,
        completed: false,
      },
      {
        title: "Follow up with TechStar Solutions",
        description: "Call to discuss CRM implementation details",
        dueDate: new Date(Date.now() + 172800000), // day after tomorrow
        contactId: 2,
        dealId: 2,
        assignedTo: 1,
        completed: false,
      },
      {
        title: "Prepare demo for Globe Media",
        description: "Set up demo for marketing automation platform",
        dueDate: new Date(Date.now() + 259200000), // 3 days from now
        contactId: 3,
        dealId: 3,
        assignedTo: 1,
        completed: false,
      },
      {
        title: "Email marketing campaign setup",
        description: "Configure email sequences for new campaign",
        dueDate: new Date(Date.now() + 432000000), // 5 days from now
        assignedTo: 1,
        completed: false,
      }
    ];
    
    for (const task of sampleTasks) {
      this.createTask(task);
    }
    
    // Create sample activities
    const sampleActivities: InsertActivity[] = [
      {
        type: "email",
        title: "Email sent to TechStar Solutions",
        description: "Proposal for CRM implementation",
        contactId: 2,
        dealId: 2,
        createdBy: 1,
      },
      {
        type: "call",
        title: "Call completed with Globe Media",
        description: "Discussed marketing automation needs",
        contactId: 3,
        dealId: 3,
        createdBy: 1,
      },
      {
        type: "note",
        title: "New lead added to pipeline",
        description: "Acme Inc. - Website redesign project",
        contactId: 1,
        dealId: 1,
        createdBy: 1,
      },
      {
        type: "meeting",
        title: "Meeting scheduled with Vertex Inc.",
        description: "Demo for sales funnel optimization",
        contactId: 4,
        dealId: 4,
        createdBy: 1,
      }
    ];
    
    for (const activity of sampleActivities) {
      this.createActivity(activity);
    }
    
    // Create sample campaigns
    const sampleCampaigns: InsertCampaign[] = [
      {
        name: "Spring Promotion",
        type: "email",
        status: "active",
        subject: "Special Spring Offer Inside!",
        content: "Dear {first_name}, we have a special spring promotion for you...",
        scheduledAt: new Date(),
      },
      {
        name: "Follow-up Sequence",
        type: "email",
        status: "active",
        subject: "Following up on our conversation",
        content: "Hi {first_name}, I wanted to follow up on our recent conversation about...",
        scheduledAt: new Date(),
      },
      {
        name: "Product Update Announcement",
        type: "email",
        status: "draft",
        subject: "Exciting New Features Have Arrived!",
        content: "We're excited to announce the latest updates to our platform...",
        scheduledAt: new Date(Date.now() + 604800000), // 1 week from now
      },
      {
        name: "Customer Feedback Survey",
        type: "email",
        status: "active",
        subject: "We value your feedback",
        content: "As a valued customer, your opinion matters to us...",
        scheduledAt: new Date(),
      },
      {
        name: "Black Friday Special",
        type: "email",
        status: "draft",
        subject: "Exclusive Black Friday Deals Inside",
        content: "Get ready for our biggest sale of the year...",
        scheduledAt: new Date(Date.now() + 7776000000), // 90 days from now
      },
      {
        name: "Webinar Invitation",
        type: "email",
        status: "active",
        subject: "Join Our Upcoming Webinar",
        content: "We're hosting an exclusive webinar on...",
        scheduledAt: new Date(Date.now() + 259200000), // 3 days from now
      }
    ];
    
    for (const campaign of sampleCampaigns) {
      this.createCampaign(campaign);
    }
    
    // Create sample calendar events
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const sampleCalendarEvents: InsertCalendarEvent[] = [
      {
        title: "Initial consultation with John Smith",
        description: "Discuss website redesign project requirements",
        start: new Date(today.setHours(10, 0, 0, 0)).toISOString(), 
        end: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
        location: "Video call",
        userId: 1,
        contactId: 1,
        dealId: 1,
        allDay: false,
        type: "meeting"
      },
      {
        title: "Follow-up call with Sarah Jones",
        description: "CRM implementation progress check",
        start: new Date(tomorrow.setHours(14, 0, 0, 0)).toISOString(),
        end: new Date(tomorrow.setHours(14, 30, 0, 0)).toISOString(),
        location: "Phone",
        userId: 1,
        contactId: 2,
        dealId: 2,
        allDay: false,
        type: "call"
      },
      {
        title: "Presentation to Globe Media",
        description: "Marketing automation platform demo",
        start: new Date(dayAfterTomorrow.setHours(11, 0, 0, 0)).toISOString(),
        end: new Date(dayAfterTomorrow.setHours(12, 30, 0, 0)).toISOString(),
        location: "Client office",
        userId: 1,
        contactId: 3,
        dealId: 3, 
        allDay: false,
        type: "meeting"
      },
      {
        title: "Product strategy workshop",
        description: "Full-day team workshop to plan Q3 roadmap",
        start: new Date(nextWeek.setHours(9, 0, 0, 0)).toISOString(),
        end: new Date(nextWeek.setHours(17, 0, 0, 0)).toISOString(),
        location: "Conference room",
        userId: 1,
        allDay: true,
        type: "workshop"
      }
    ];
    
    for (const event of sampleCalendarEvents) {
      this.createCalendarEvent(event);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Subaccount methods
  async getSubaccounts(parentId: number): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.parentId === parentId && user.isSubaccount
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
    
    return this.createUser(modifiedSubaccount);
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return undefined;
    }
    
    // Update the user with the new data
    const updatedUser: User = { 
      ...existingUser,
      ...userData,
      // Make sure we don't override the ID
      id: existingUser.id
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Contact methods
  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.contactCurrentId++;
    const now = new Date();
    const newContact: Contact = { 
      ...contact, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.contacts.set(id, newContact);
    
    // Also create an activity for this new contact
    await this.createActivity({
      type: "note",
      title: "New contact created",
      description: `${contact.firstName} ${contact.lastName} from ${contact.company || 'N/A'}`,
      contactId: id,
      createdBy: 1, // Default to the first user
    });
    
    return newContact;
  }

  async updateContact(id: number, contact: InsertContact): Promise<Contact | undefined> {
    const existingContact = this.contacts.get(id);
    if (!existingContact) {
      return undefined;
    }
    
    const updatedContact: Contact = { 
      ...existingContact, 
      ...contact, 
      id, 
      updatedAt: new Date() 
    };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async deleteContact(id: number): Promise<boolean> {
    return this.contacts.delete(id);
  }
  
  async countContacts(): Promise<number> {
    return this.contacts.size;
  }

  // Deal methods
  async getAllDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values());
  }

  async getDeal(id: number): Promise<Deal | undefined> {
    return this.deals.get(id);
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const id = this.dealCurrentId++;
    const now = new Date();
    const newDeal: Deal = { 
      ...deal, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.deals.set(id, newDeal);
    
    // Create an activity for this new deal
    await this.createActivity({
      type: "note",
      title: "New deal created",
      description: `${deal.title} ($${deal.amount})`,
      contactId: deal.contactId,
      dealId: id,
      createdBy: 1, // Default to the first user
    });
    
    return newDeal;
  }

  async updateDeal(id: number, deal: InsertDeal): Promise<Deal | undefined> {
    const existingDeal = this.deals.get(id);
    if (!existingDeal) {
      return undefined;
    }
    
    const updatedDeal: Deal = { 
      ...existingDeal, 
      ...deal, 
      id, 
      updatedAt: new Date() 
    };
    this.deals.set(id, updatedDeal);
    return updatedDeal;
  }
  
  async updateDealStage(id: number, stage: string): Promise<Deal | undefined> {
    const existingDeal = this.deals.get(id);
    if (!existingDeal) {
      return undefined;
    }
    
    const previousStage = existingDeal.stage;
    const updatedDeal: Deal = { 
      ...existingDeal, 
      stage, 
      updatedAt: new Date() 
    };
    this.deals.set(id, updatedDeal);
    
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
    return this.deals.delete(id);
  }

  // Task methods
  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.taskCurrentId++;
    const now = new Date();
    const newTask: Task = { 
      ...task, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, task: InsertTask): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) {
      return undefined;
    }
    
    const updatedTask: Task = { 
      ...existingTask, 
      ...task, 
      id, 
      updatedAt: new Date() 
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async completeTask(id: number): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) {
      return undefined;
    }
    
    const updatedTask: Task = { 
      ...existingTask, 
      completed: true, 
      updatedAt: new Date() 
    };
    this.tasks.set(id, updatedTask);
    
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
    return this.tasks.delete(id);
  }

  // Activity methods
  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.activityCurrentId++;
    const now = new Date();
    const newActivity: Activity = { 
      ...activity, 
      id, 
      createdAt: now 
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Campaign methods
  async getAllCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const id = this.campaignCurrentId++;
    const now = new Date();
    const newCampaign: Campaign = { 
      ...campaign, 
      id, 
      createdAt: now 
    };
    this.campaigns.set(id, newCampaign);
    return newCampaign;
  }
  
  async updateCampaignStatus(id: number, status: string): Promise<Campaign | undefined> {
    const existingCampaign = this.campaigns.get(id);
    if (!existingCampaign) {
      return undefined;
    }
    
    const updatedCampaign: Campaign = { 
      ...existingCampaign, 
      status
    };
    this.campaigns.set(id, updatedCampaign);
    
    // Create an activity for campaign status change
    await this.createActivity({
      type: "note",
      title: "Campaign status updated",
      description: `${existingCampaign.name} changed to ${status}`,
      createdBy: 1, // Default to the first user
    });
    
    return updatedCampaign;
  }

  // Funnel methods (stubs for MemStorage)
  async getAllFunnels(userId: number): Promise<Funnel[]> {
    return [];
  }

  async getFunnel(id: number): Promise<Funnel | undefined> {
    return undefined;
  }

  async createFunnel(funnel: InsertFunnel): Promise<Funnel> {
    throw new Error("Not implemented in MemStorage");
  }

  async updateFunnel(id: number, funnelData: Partial<InsertFunnel>): Promise<Funnel | undefined> {
    throw new Error("Not implemented in MemStorage");
  }

  async updateFunnelStatus(id: number, status: string): Promise<Funnel | undefined> {
    throw new Error("Not implemented in MemStorage");
  }

  async deleteFunnel(id: number): Promise<boolean> {
    throw new Error("Not implemented in MemStorage");
  }

  // Funnel Step methods (stubs for MemStorage)
  async getFunnelSteps(funnelId: number): Promise<FunnelStep[]> {
    return [];
  }

  async getFunnelStep(id: number): Promise<FunnelStep | undefined> {
    return undefined;
  }

  async createFunnelStep(step: InsertFunnelStep): Promise<FunnelStep> {
    throw new Error("Not implemented in MemStorage");
  }

  async updateFunnelStep(id: number, stepData: Partial<InsertFunnelStep>): Promise<FunnelStep | undefined> {
    throw new Error("Not implemented in MemStorage");
  }

  async deleteFunnelStep(id: number): Promise<boolean> {
    throw new Error("Not implemented in MemStorage");
  }

  async reorderFunnelSteps(funnelId: number, stepIds: number[]): Promise<FunnelStep[]> {
    throw new Error("Not implemented in MemStorage");
  }
  
  // Calendar Events methods
  async getAllCalendarEvents(): Promise<CalendarEvent[]> {
    return Array.from(this.calendarEvents.values()).sort((a, b) => 
      new Date(b.start).getTime() - new Date(a.start).getTime()
    );
  }

  async getCalendarEvent(id: number): Promise<CalendarEvent | undefined> {
    return this.calendarEvents.get(id);
  }

  async createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const id = this.calendarEventCurrentId++;
    const now = new Date();
    const newEvent: CalendarEvent = { 
      ...event, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.calendarEvents.set(id, newEvent);
    
    // Create an activity for this new event if it's related to a contact
    if (event.contactId) {
      await this.createActivity({
        type: "note",
        title: "New calendar event created",
        description: `${event.title} (${new Date(event.start).toLocaleString()})`,
        contactId: event.contactId,
        dealId: event.dealId,
        createdBy: event.userId,
      });
    }
    
    return newEvent;
  }

  async updateCalendarEvent(id: number, eventData: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined> {
    const existingEvent = this.calendarEvents.get(id);
    if (!existingEvent) {
      return undefined;
    }
    
    const updatedEvent: CalendarEvent = { 
      ...existingEvent, 
      ...eventData, 
      id, 
      updatedAt: new Date() 
    };
    this.calendarEvents.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteCalendarEvent(id: number): Promise<boolean> {
    return this.calendarEvents.delete(id);
  }
}

// Import the DatabaseStorage
import { DatabaseStorage } from "./storage.db";

// Uncomment to use the database storage implementation
export const storage = new DatabaseStorage();

// Comment out to disable memory storage
// export const storage = new MemStorage();
