import { prisma } from '../config/db';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

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

const TEMPLATES_DIR = path.resolve(__dirname, '../../email_templates_saved');

type TemplateData = Record<string, any>;

function renderTemplate(html: string, data: TemplateData): string {
    return html.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        const val = data[key];
        return val !== undefined ? String(val) : `{{${key}}}`;
    });
}

function loadTemplate(templateId: string): string | null {
    const safeName = templateId.replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(TEMPLATES_DIR, `${safeName}.html`);
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8');
    }
    return null;
}

export class EmailService {
    /**
     * Sends an email using a local HTML template from email_templates_saved/.
     * Falls back to Resend's template API if no local file is found.
     * @param to Recipient email address
     * @param templateId Template filename (without .html extension)
     * @param data Variables to inject into the template ({{variable}} placeholders)
     * @param scheduledAt ISO 8601 date string for scheduled sending (optional)
     */
    static async sendEmail(to: string, templateId: string, data: TemplateData, scheduledAt?: string) {
        try {
            const localHtml = loadTemplate(templateId);

            const payload: any = {
                from: process.env.EMAIL_FROM || 'Hamadan Craft Revival Foundation <info@khcrf.org>',
                to,
            };

            if (localHtml) {
                // Use local file with variable substitution
                const htmlContent = renderTemplate(localHtml, data);
                
                // Extract subject from <title> or use provided subject
                const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
                payload.subject = data.subject || (titleMatch ? titleMatch[1] : 'Notification from KHCRF');
                payload.html = htmlContent;
                
                console.log(`Sending email to ${to} using local template '${templateId}'...`);
            } else {
                // Fallback: try Resend's cloud template
                console.log(`No local template found for '${templateId}', trying Resend template...`);
                payload.template = {
                    id: templateId,
                    variables: data
                };
                if (data.subject) {
                    payload.subject = data.subject;
                }
            }

            if (scheduledAt) {
                payload.scheduled_at = scheduledAt;
            }
            if (process.env.EMAIL_PROVIDER === 'disabled' || !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder' || process.env.RESEND_API_KEY === 're_test_key') {
                console.log(`[SIMULATED EMAIL] To: ${to}, Subject: ${payload.subject}, Template: ${templateId}`);
                console.log(`[SIMULATED EMAIL] Payload Data:`, data);
                return { id: 'simulated_' + Date.now() };
            }

            const client = getResend();
            const response = await client.emails.send(payload);

            if (response.error) {
                console.error("Resend Error:", response.error);
                throw new Error(response.error.message);
            }

            return response;
        } catch (error) {
            console.error("Email Service Error:", error);
            throw error;
        }
    }

    static getTemplates() {
        try {
            if (fs.existsSync(TEMPLATES_DIR)) {
                return fs.readdirSync(TEMPLATES_DIR)
                    .filter(f => f.endsWith('.html'))
                    .map(f => f.replace('.html', ''));
            }
        } catch (e) { /* ignore */ }
        return [];
    }
}

