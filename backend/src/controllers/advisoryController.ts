import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { createAuditLog } from "../utils/auditLogger.js";
import { upload } from "../middleware/cvUploadMiddleware.js"; // shared — avoids circular dep with advisoryRoutes
import multer from "multer";
import { requireString } from "../utils/routeHelpers";

export const applyAdvisor = (req: Request, res: Response) => {
  upload.single("cvFile")(req, res, async (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ message: "The selected CV exceeds the 5 MB limit." });
        }
      }
      if (err.message === "Only PDF files are allowed") {
        return res.status(415).json({ message: "Please upload a PDF file." });
      }
      return res.status(400).json({ message: "File upload failed." });
    }

    try {
      const { fullName, email, phone, category, organization, district, statement, consentAccepted, advisoryScope } = req.body;
      
      // Server-side validation
      if (!fullName || !email || !category || !statement || !advisoryScope) {
        return res.status(400).json({ message: "Please review the highlighted fields and try again." });
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Please review the highlighted fields and try again." });
      }

      if (advisoryScope !== "KHCRF" && !district) {
        return res.status(400).json({ message: "Please review the highlighted fields and try again." });
      }

      if (statement.length < 50) {
        return res.status(400).json({ message: "Please review the highlighted fields and try again." });
      }

      if (consentAccepted !== "true" && consentAccepted !== true) {
        return res.status(400).json({ message: "Please review the highlighted fields and try again." });
      }

      if (!["KHCRF", "SKC", "BOTH"].includes(advisoryScope)) {
        return res.status(400).json({ message: "Invalid advisory scope." });
      }

      // Check duplicate
      const existing = await prisma.advisoryApplication.findFirst({
        where: { email, advisoryScope: advisoryScope }
      });
      if (existing) {
        return res.status(409).json({ message: "An advisory application with these details already exists." });
      }

      // Generate Reference Number using count — safe and consistent
      const count = await prisma.advisoryApplication.count();
      const referenceNumber = `ADV-2026-${String(count + 1).padStart(6, '0')}`;

      let cvFileUrl = null;
      let cvFileName = null;
      let cvFileSize = null;
      let cvMimeType = null;

      if (req.file) {
        cvFileUrl = `/secure_uploads/${req.file.filename}`;
        cvFileName = req.file.originalname;
        cvFileSize = req.file.size;
        cvMimeType = req.file.mimetype;
      }

      const newApp = await prisma.advisoryApplication.create({
        data: {
          referenceNumber,
          fullName,
          advisoryScope: advisoryScope,
          category,
          organization: organization || null,
          email,
          phone: phone || null,
          district: district || null,
          statement: statement,
          cvFileUrl,
          cvOriginalFilename: cvFileName,
          cvMimeType,
          cvSizeBytes: cvFileSize,
          consentAccepted: true,
          consentAcceptedAt: new Date(),
          status: "SUBMITTED"
        }
      });

      res.status(201).json({ 
        success: true,
        referenceNumber: newApp.referenceNumber,
        status: newApp.status,
        submittedAt: newApp.submittedAt
      });
    } catch (error: any) {
      console.error("Error applying for advisory council:", error);
      res.status(500).json({ 
        success: false,
        message: "We could not complete your submission at this time. Please try again shortly."
      });
    }
  });
};

export const getAdvisors = async (req: Request, res: Response) => {
  try {
    const { status, category, district, advisoryScope } = req.query;
    
    const whereClause: any = {};
    if (status) whereClause.status = String(status);
    if (category) whereClause.category = String(category);
    if (district) whereClause.district = String(district);
    if (advisoryScope) whereClause.advisoryScope = String(advisoryScope);

    const applications = await prisma.advisoryApplication.findMany({
      where: whereClause,
      orderBy: { submittedAt: 'desc' }
    });

    res.status(200).json(applications);
  } catch (error: any) {
    console.error("Error fetching advisory applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAdvisorStatus = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const { status, internalNotes } = req.body;

    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;
    if (internalNotes !== undefined) dataToUpdate.internalNotes = internalNotes;

    const appBefore = await prisma.advisoryApplication.findUnique({ where: { id } });
    if (!appBefore) return res.status(404).json({ message: "Not found" });

    const updatedApp = await prisma.advisoryApplication.update({
      where: { id },
      data: dataToUpdate
    });

    if (status && status !== appBefore.status) {
      await createAuditLog({
        module: 'Advisory',
        recordType: 'AdvisoryApplication',
        recordId: id,
        action: 'advisory_status_update',
        previousValue: appBefore.status,
        newValue: status,
        notes: dataToUpdate.internalNotes,
        req
      });
    } else if (internalNotes !== undefined && internalNotes !== appBefore.internalNotes) {
      await createAuditLog({
        module: 'Advisory',
        recordType: 'AdvisoryApplication',
        recordId: id,
        action: 'advisory_note_update',
        previousValue: appBefore.internalNotes || '',
        newValue: internalNotes,
        req
      });
    }

    res.status(200).json({ message: "Updated successfully", application: updatedApp });
  } catch (error: any) {
    console.error("Error updating advisory application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
