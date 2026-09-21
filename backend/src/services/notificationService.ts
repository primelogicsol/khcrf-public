import { prisma } from '../config/db';
import { Resend } from 'resend';

let resendClient: Resend | null = null;
function getResend(): Resend {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || process.env.EMAIL_PROVIDER === 'disabled' || apiKey === 're_placeholder' || apiKey === 're_test_key') {
        throw new Error("Email delivery is disabled: valid RESEND_API_KEY is not configured.");
    }
    if (!resendClient) {
        resendClient = new Resend(apiKey);
    }
    return resendClient;
}

export class NotificationService {
  /**
   * Send a standard transactional email
   */
  static async sendEmail(to: string, subject: string, html: string) {
    try {
      if (process.env.EMAIL_PROVIDER === 'disabled' || !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder' || process.env.RESEND_API_KEY === 're_test_key') {
          console.log(`[SIMULATED NOTIFICATION EMAIL] To: ${to}, Subject: ${subject}`);
          return { id: 'simulated_' + Date.now() };
      }
      const client = getResend();
      const data = await client.emails.send({
        from: 'KHCRF Notifications <noreply@khcrf.org>',
        to: [to],
        subject: subject,
        html: html,
      });
      return data;
    } catch (error) {
      console.error('Email Notification Error (non-fatal):', error);
      return { id: 'failed_' + Date.now(), error };
    }
  }

  /**
   * Alert admins of a critical system event (e.g. data anomaly)
   */
  static async alertAdmins(subject: string, message: string) {
    // In reality, this would fetch all admin emails from the DB
    const adminEmails = ['admin@khcrf.org'];
    
    for (const email of adminEmails) {
      await this.sendEmail(email, `CRITICAL: ${subject}`, `<p>${message}</p>`);
    }
  }
}
