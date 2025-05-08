import { db } from "./db";
import { 
  users, contacts, deals, tasks, activities, campaigns,
  type InsertUser, type InsertContact, type InsertDeal, 
  type InsertTask, type InsertActivity, type InsertCampaign
} from "@shared/schema";

/**
 * This script initializes the database with sample data
 */
async function seedDatabase() {
  console.log("Seeding database with sample data...");

  try {
    // First check if we have any users already
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      console.log("Database already has data, skipping seed");
      return;
    }

    // 1. Create a sample user
    const sampleUser: InsertUser = {
      username: "alexjohnson",
      password: "password123", // In a real app, this would be hashed
      email: "alex@example.com",
      fullName: "Alex Johnson",
      role: "Administrator",
    };
    
    const [user] = await db.insert(users).values(sampleUser).returning();
    console.log(`Created user: ${user.username}`);
    
    // 2. Create sample contacts
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
    
    const createdContacts = await db.insert(contacts).values(sampleContacts).returning();
    console.log(`Created ${createdContacts.length} contacts`);
    
    // 3. Create sample deals
    const sampleDeals: InsertDeal[] = [
      {
        title: "Website redesign project",
        contactId: createdContacts[0].id,
        amount: 5800,
        stage: "lead",
        description: "Complete redesign of company website",
      },
      {
        title: "CRM implementation",
        contactId: createdContacts[1].id,
        amount: 3200,
        stage: "lead",
        description: "Implementation of CRM system",
      },
      {
        title: "Marketing automation",
        contactId: createdContacts[2].id,
        amount: 7500,
        stage: "qualified",
        description: "Setup of marketing automation workflows",
      },
      {
        title: "Sales funnel optimization",
        contactId: createdContacts[3].id,
        amount: 12400,
        stage: "proposal",
        description: "Optimizing sales funnel to increase conversions",
      },
      {
        title: "Complete CRM package",
        contactId: createdContacts[4].id,
        amount: 28000,
        stage: "negotiation",
        description: "Full CRM implementation with training",
      },
    ];
    
    const createdDeals = await db.insert(deals).values(sampleDeals).returning();
    console.log(`Created ${createdDeals.length} deals`);
    
    // 4. Create sample tasks
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    const sampleTasks: InsertTask[] = [
      {
        title: "Send proposal to Acme Inc.",
        description: "Prepare and send website redesign proposal",
        dueDate: tomorrow,
        contactId: createdContacts[0].id,
        dealId: createdDeals[0].id,
        assignedTo: user.id,
        completed: false,
      },
      {
        title: "Follow up with TechStar Solutions",
        description: "Call to discuss CRM implementation details",
        dueDate: dayAfterTomorrow,
        contactId: createdContacts[1].id,
        dealId: createdDeals[1].id,
        assignedTo: user.id,
        completed: false,
      },
      {
        title: "Prepare demo for Globe Media",
        description: "Set up demo for marketing automation platform",
        dueDate: threeDaysFromNow,
        contactId: createdContacts[2].id,
        dealId: createdDeals[2].id,
        assignedTo: user.id,
        completed: false,
      },
      {
        title: "Email marketing campaign setup",
        description: "Configure email sequences for new campaign",
        dueDate: new Date(Date.now() + 432000000), // 5 days from now
        assignedTo: user.id,
        completed: false,
      }
    ];
    
    const createdTasks = await db.insert(tasks).values(sampleTasks).returning();
    console.log(`Created ${createdTasks.length} tasks`);
    
    // 5. Create sample activities
    const sampleActivities: InsertActivity[] = [
      {
        type: "note",
        title: "New contact created",
        description: `${createdContacts[0].firstName} ${createdContacts[0].lastName} from ${createdContacts[0].company}`,
        contactId: createdContacts[0].id,
        createdBy: user.id,
      },
      {
        type: "note",
        title: "New deal created",
        description: `${createdDeals[0].title} ($${createdDeals[0].amount})`,
        contactId: createdContacts[0].id,
        dealId: createdDeals[0].id,
        createdBy: user.id,
      },
      {
        type: "email",
        title: "Email sent to TechStar Solutions",
        description: "Proposal for CRM implementation",
        contactId: createdContacts[1].id,
        dealId: createdDeals[1].id,
        createdBy: user.id,
      },
      {
        type: "call",
        title: "Call completed with Globe Media",
        description: "Discussed marketing automation needs",
        contactId: createdContacts[2].id,
        dealId: createdDeals[2].id,
        createdBy: user.id,
      },
      {
        type: "meeting",
        title: "Meeting scheduled with Vertex Inc.",
        description: "Demo for sales funnel optimization",
        contactId: createdContacts[3].id,
        dealId: createdDeals[3].id,
        createdBy: user.id,
      }
    ];
    
    const createdActivities = await db.insert(activities).values(sampleActivities).returning();
    console.log(`Created ${createdActivities.length} activities`);
    
    // 6. Create sample campaigns
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setDate(threeMonthsFromNow.getDate() + 90);
    
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
        scheduledAt: oneWeekFromNow,
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
        scheduledAt: threeMonthsFromNow,
      },
      {
        name: "Webinar Invitation",
        type: "email",
        status: "active",
        subject: "Join Our Upcoming Webinar",
        content: "We're hosting an exclusive webinar on...",
        scheduledAt: threeDaysFromNow,
      }
    ];
    
    const createdCampaigns = await db.insert(campaigns).values(sampleCampaigns).returning();
    console.log(`Created ${createdCampaigns.length} campaigns`);
    
    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the database connection if needed
    // Note: with Neon serverless, we don't need to close the connection
    // as it will be automatically closed
  }
}

// Run the seed function
seedDatabase();