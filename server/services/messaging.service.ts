import { emailService } from './email.service';
import { smsService } from './sms.service';

/**
 * Unified Messaging Service for the CRM platform
 * This service provides a common interface for sending both emails and SMS messages
 */
class MessagingService {
  /**
   * Send message via email
   */
  async sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
    replyTo?: string;
  }): Promise<boolean> {
    return emailService.sendEmail(options);
  }

  /**
   * Send a templated email (for campaigns)
   */
  async sendTemplatedEmail(options: {
    to: string | string[];
    templateName: string;
    templateData: Record<string, any>;
    from?: string;
    replyTo?: string;
  }): Promise<boolean> {
    return emailService.sendTemplatedEmail(options);
  }

  /**
   * Send bulk templated emails (for campaigns to multiple recipients)
   */
  async sendBulkTemplatedEmail(options: {
    destinations: Array<{
      to: string;
      templateData: Record<string, any>;
    }>;
    templateName: string;
    from?: string;
    replyTo?: string;
  }): Promise<boolean> {
    return emailService.sendBulkTemplatedEmail(options);
  }

  /**
   * Send a single SMS message
   */
  async sendSMS(options: {
    to: string;
    message: string;
    from?: string;
  }): Promise<boolean> {
    return smsService.sendSMS(options);
  }

  /**
   * Send bulk SMS messages
   */
  async sendBulkSMS(options: {
    messages: Array<{
      to: string;
      message: string;
    }>;
    from?: string;
  }): Promise<{
    success: boolean;
    successCount: number;
    failureCount: number;
  }> {
    return smsService.sendBulkSMS(options);
  }

  /**
   * Send message to contact via their preferred channel (email or SMS)
   */
  async sendToContact(options: {
    contactId: number;
    subject: string;
    body: string;
    channel?: 'email' | 'sms' | 'both';
    from?: string;
  }): Promise<{
    success: boolean;
    emailSent?: boolean;
    smsSent?: boolean;
  }> {
    const { contactId, subject, body, channel = 'email', from } = options;
    
    // In a real implementation, we'd query the database to get the contact's info
    // For now, this is a placeholder that would be replaced with actual logic
    const contactInfo = await this.getContactInfo(contactId);
    
    if (!contactInfo) {
      return { success: false };
    }

    let emailSent = false;
    let smsSent = false;

    // Send message based on preferred channel
    if (channel === 'email' || channel === 'both') {
      if (contactInfo.email) {
        emailSent = await this.sendEmail({
          to: contactInfo.email,
          subject,
          html: body,
          from,
        });
      }
    }

    if (channel === 'sms' || channel === 'both') {
      if (contactInfo.phone) {
        smsSent = await this.sendSMS({
          to: contactInfo.phone,
          message: body,
          from,
        });
      }
    }

    return {
      success: emailSent || smsSent,
      emailSent,
      smsSent,
    };
  }

  /**
   * Send a campaign message to a list of contacts
   */
  async sendCampaign(options: {
    campaignId: number;
    channel: 'email' | 'sms' | 'both';
  }): Promise<{
    success: boolean;
    emailCount: number;
    smsCount: number;
  }> {
    const { campaignId, channel } = options;
    
    // In a real implementation, we'd query the database to get campaign details
    // and the list of contacts to send to
    const campaignInfo = await this.getCampaignInfo(campaignId);
    
    if (!campaignInfo) {
      return { success: false, emailCount: 0, smsCount: 0 };
    }

    let emailCount = 0;
    let smsCount = 0;

    // For email campaigns
    if ((channel === 'email' || channel === 'both') && campaignInfo.contacts.length > 0) {
      const emailDestinations = campaignInfo.contacts
        .filter(contact => contact.email)
        .map(contact => ({
          to: contact.email!,
          templateData: {
            first_name: contact.firstName,
            last_name: contact.lastName,
            company: contact.company || '',
            // Add any other personalization fields needed for the template
          },
        }));

      if (emailDestinations.length > 0) {
        const emailResult = await this.sendBulkTemplatedEmail({
          destinations: emailDestinations,
          templateName: campaignInfo.emailTemplateName || 'default-template',
          from: campaignInfo.senderEmail,
        });

        if (emailResult) {
          emailCount = emailDestinations.length;
        }
      }
    }

    // For SMS campaigns
    if ((channel === 'sms' || channel === 'both') && campaignInfo.contacts.length > 0) {
      const smsMessages = campaignInfo.contacts
        .filter(contact => contact.phone)
        .map(contact => {
          // Simple template replacement (in a real app, use a proper template engine)
          let personalizedMessage = campaignInfo.smsContent || '';
          personalizedMessage = personalizedMessage.replace(/{first_name}/g, contact.firstName);
          personalizedMessage = personalizedMessage.replace(/{last_name}/g, contact.lastName);
          
          return {
            to: contact.phone!,
            message: personalizedMessage,
          };
        });

      if (smsMessages.length > 0) {
        const smsResult = await this.sendBulkSMS({
          messages: smsMessages,
          from: campaignInfo.senderPhone,
        });

        smsCount = smsResult.successCount;
      }
    }

    return {
      success: emailCount > 0 || smsCount > 0,
      emailCount,
      smsCount,
    };
  }

  /**
   * Helper method to get contact information
   * This is a placeholder - in a real implementation, this would query the database
   */
  private async getContactInfo(contactId: number): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    preferredChannel?: 'email' | 'sms';
  } | null> {
    // In a real implementation, this would query the contacts table
    // For now, return a placeholder that we'd replace with actual database logic
    return {
      id: contactId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+15551234567',
      company: 'Example Corp',
      preferredChannel: 'email',
    };
  }

  /**
   * Helper method to get campaign information
   * This is a placeholder - in a real implementation, this would query the database
   */
  private async getCampaignInfo(campaignId: number): Promise<{
    id: number;
    name: string;
    emailSubject?: string;
    emailContent?: string;
    emailTemplateName?: string;
    smsContent?: string;
    senderEmail?: string;
    senderPhone?: string;
    contacts: Array<{
      id: number;
      firstName: string;
      lastName: string;
      email?: string | null;
      phone?: string | null;
      company?: string | null;
    }>;
  } | null> {
    // In a real implementation, this would query the campaigns table and related contacts
    // For now, return a placeholder that we'd replace with actual database logic
    return {
      id: campaignId,
      name: 'Sample Campaign',
      emailSubject: 'Special Offer Just for You',
      emailContent: '<h1>Hello {first_name}</h1><p>We have a special offer for you!</p>',
      emailTemplateName: 'special-offer',
      smsContent: 'Hi {first_name}! Check out our special offer just for you.',
      senderEmail: 'marketing@example.com',
      senderPhone: '+18005551234',
      contacts: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+15551234567',
          company: 'Example Corp',
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+15559876543',
          company: 'Test Inc',
        },
      ],
    };
  }
}

// Export a singleton instance
export const messagingService = new MessagingService();