import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { EmailService } from '../services/emailService.js';
import { EmailTemplates } from '../constants/emailTemplates.js';
import { requireString } from "../utils/routeHelpers";

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, subject, message, artisanId } = req.body;

    if (!firstName || !lastName || !email || !subject || !message) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        firstName,
        lastName,
        email,
        subject,
        message,
        artisanId,
        status: "PENDING",
      },
    });

    // Send Confirmation Email
    EmailService.sendEmail(email, EmailTemplates.CONTACT_CONFIRMATION, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        subject: subject,
        message: message
    }).catch(err => console.error("Failed to send contact confirmation email:", err));

    res.status(201).json({
      message: "Contact form submitted successfully",
      submission,
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getContactSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteContactSubmission = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Submission ID is required" });
    }

    const existing = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Submission not found" });
    }

    await prisma.contactSubmission.delete({
      where: { id },
    });

    res.status(200).json({ message: "Contact submission deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact submission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markContactRead = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Submission ID is required" });
    }

    const existing = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Submission not found" });
    }

    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: { status: "READ" },
    });

    res.status(200).json({ message: "Contact submission marked as read", submission: updated });
  } catch (error) {
    console.error("Error marking contact submission as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
