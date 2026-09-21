import { Request, Response } from 'express';
import { EmailService } from '../services/emailService.js';
import { prisma } from '../config/db.js';

export const sendEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { to, userId, template, data } = req.body;

        if (!template) {
            res.status(400).json({ error: "Template name is required" });
            return;
        }

        let recipientEmail = to;

        // If userId is provided, look up the user's email
        if (!recipientEmail && userId) {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });
            if (user && user.email) {
                recipientEmail = user.email;
            } else {
                res.status(404).json({ error: "User or email not found" });
                return;
            }
        }

        if (!recipientEmail) {
            res.status(400).json({ error: "Recipient email ('to') or 'userId' is required" });
            return;
        }

        // scheduledAt should be in ISO 8601 format (e.g. 2023-09-05T12:00:00.000Z)
        // Resend allows scheduling up to 72 hours in advance.
        const scheduledAt = req.body.scheduledAt;

        const result = await EmailService.sendEmail(recipientEmail, template, data || {}, scheduledAt);

        res.status(200).json({
            message: "Email sent successfully",
            id: (result as any).data?.id || (result as any).id
        });

    } catch (error: any) {
        console.error("Email Controller Error:", error);
        res.status(500).json({ error: error.message || "Failed to send email" });
    }
};

export const getTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
        const templates = EmailService.getTemplates();
        res.status(200).json(templates);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch templates" });
    }
};
