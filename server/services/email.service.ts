import { 
  SESClient, 
  SendEmailCommand, 
  SendTemplatedEmailCommand,
  SendBulkTemplatedEmailCommand
} from "@aws-sdk/client-ses";

/**
 * Email Service using AWS Simple Email Service (SES)
 */
class EmailService {
  private sesClient: SESClient;
  private defaultSender: string = 'noreply@yourdomain.com'; // Replace with your verified sender

  constructor() {
    // Initialize SES client with AWS credentials from environment variables
    this.sesClient = new SESClient({ 
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    });

    // Optionally set default sender from environment
    if (process.env.DEFAULT_EMAIL_SENDER) {
      this.defaultSender = process.env.DEFAULT_EMAIL_SENDER;
    }
  }

  /**
   * Send a simple email
   */
  async sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
    replyTo?: string;
  }): Promise<boolean> {
    try {
      const { to, subject, html, text, from, replyTo } = options;
      
      // Format recipients
      const toAddresses = Array.isArray(to) ? to : [to];
      
      const command = new SendEmailCommand({
        Source: from || this.defaultSender,
        Destination: {
          ToAddresses: toAddresses,
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: html,
              Charset: 'UTF-8',
            },
            ...(text && {
              Text: {
                Data: text,
                Charset: 'UTF-8',
              },
            }),
          },
        },
        ...(replyTo && {
          ReplyToAddresses: [replyTo],
        }),
      });

      const response = await this.sesClient.send(command);
      console.log('Email sent successfully:', response.MessageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Send a templated email (useful for campaigns)
   */
  async sendTemplatedEmail(options: {
    to: string | string[];
    templateName: string;
    templateData: Record<string, any>;
    from?: string;
    replyTo?: string;
  }): Promise<boolean> {
    try {
      const { to, templateName, templateData, from, replyTo } = options;
      
      // Format recipients
      const toAddresses = Array.isArray(to) ? to : [to];
      
      const command = new SendTemplatedEmailCommand({
        Source: from || this.defaultSender,
        Destination: {
          ToAddresses: toAddresses,
        },
        Template: templateName,
        TemplateData: JSON.stringify(templateData),
        ...(replyTo && {
          ReplyToAddresses: [replyTo],
        }),
      });

      const response = await this.sesClient.send(command);
      console.log('Templated email sent successfully:', response.MessageId);
      return true;
    } catch (error) {
      console.error('Error sending templated email:', error);
      return false;
    }
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
    try {
      const { destinations, templateName, from, replyTo } = options;
      
      // Format destinations for bulk sending
      const formattedDestinations = destinations.map(({ to, templateData }) => ({
        Destination: {
          ToAddresses: [to],
        },
        ReplacementTemplateData: JSON.stringify(templateData),
      }));
      
      const command = new SendBulkTemplatedEmailCommand({
        Source: from || this.defaultSender,
        Template: templateName,
        DefaultTemplateData: JSON.stringify({}), // Default empty template data
        Destinations: formattedDestinations,
        ...(replyTo && {
          ReplyToAddresses: [replyTo],
        }),
      });

      const response = await this.sesClient.send(command);
      console.log('Bulk templated email sent successfully:', response.Status);
      return true;
    } catch (error) {
      console.error('Error sending bulk templated email:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const emailService = new EmailService();