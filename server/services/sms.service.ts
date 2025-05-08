import axios from 'axios';

/**
 * SMS Service using Dialpad API
 */
class SMSService {
  private apiKey: string;
  private apiUrl: string;
  private defaultPhoneNumber: string | null = null;

  constructor() {
    // Ensure we have the required environment variables
    if (!process.env.DIALPAD_API_KEY) {
      throw new Error('DIALPAD_API_KEY environment variable is required');
    }
    if (!process.env.DIALPAD_API_URL) {
      throw new Error('DIALPAD_API_URL environment variable is required');
    }

    this.apiKey = process.env.DIALPAD_API_KEY;
    this.apiUrl = process.env.DIALPAD_API_URL;

    // Optional default sender phone number
    if (process.env.DEFAULT_SMS_PHONE) {
      this.defaultPhoneNumber = process.env.DEFAULT_SMS_PHONE;
    }
  }

  /**
   * Send a single SMS message
   */
  async sendSMS(options: {
    to: string;
    message: string;
    from?: string;
  }): Promise<boolean> {
    try {
      const { to, message, from } = options;
      
      // Make sure we have a sender phone number
      const senderPhone = from || this.defaultPhoneNumber;
      if (!senderPhone) {
        throw new Error('Sender phone number is required');
      }

      // Prepare request to Dialpad API
      const response = await axios.post(
        `${this.apiUrl}/messages`,
        {
          from: senderPhone,
          to: to,
          text: message,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('SMS sent successfully:', response.data);
      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
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
    const { messages, from } = options;
    
    // Make sure we have a sender phone number
    const senderPhone = from || this.defaultPhoneNumber;
    if (!senderPhone) {
      throw new Error('Sender phone number is required');
    }

    let successCount = 0;
    let failureCount = 0;

    // Process messages in batches of 10 for better performance
    const batchSize = 10;
    const batches = [];
    
    for (let i = 0; i < messages.length; i += batchSize) {
      batches.push(messages.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const promises = batch.map(({ to, message }) => 
        this.sendSMS({ to, message, from: senderPhone })
          .then(result => {
            if (result) successCount++;
            else failureCount++;
            return result;
          })
      );

      await Promise.all(promises);
    }

    return {
      success: failureCount === 0,
      successCount,
      failureCount,
    };
  }

  /**
   * Check SMS delivery status (if the API supports it)
   */
  async checkDeliveryStatus(messageId: string): Promise<{
    status: string;
    timestamp: string;
  }> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/messages/${messageId}/status`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return {
        status: response.data.status,
        timestamp: response.data.timestamp,
      };
    } catch (error) {
      console.error('Error checking SMS delivery status:', error);
      return {
        status: 'unknown',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Export a singleton instance
export const smsService = new SMSService();