import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { requireString } from "../utils/routeHelpers";

// Create a new job posting
export const createJob = async (req: Request, res: Response) => {
    try {
        const {
            title,
            department,
            location,
            type,
            salaryRange,
            description,
            responsibilities,
            requirements,
            status,
            slug,
            jobCode
        } = req.body;

        const newJob = await prisma.jobPosting.create({
            data: {
                title,
                department,
                location,
                type,
                salaryRange,
                description,
                responsibilities,
                requirements,
                status: status || 'OPEN',
                slug,
                jobCode
            }
        });

        res.status(201).json(newJob);
    } catch (error: any) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: error.message || 'Failed to create job posting' });
    }
};

// Get all jobs (with optional filters)
export const getJobs = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;

        const whereClause: any = {};
        if (status) {
            whereClause.status = status as string;
        }

        const jobs = await prisma.jobPosting.findMany({
            where: whereClause,
            orderBy: {
                postedAt: 'desc'
            }
        });

        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};

// Get single job by ID or Slug
export const getJobById = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);

        const job = await prisma.jobPosting.findFirst({
            where: {
                OR: [
                    { id: id },
                    { slug: id }
                ]
            }
        });

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        console.error('Error fetching job details:', error);
        res.status(500).json({ error: 'Failed to fetch job details' });
    }
};

// Update job posting
export const updateJob = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const data = req.body;

        const updatedJob = await prisma.jobPosting.update({
            where: { id },
            data
        });

        res.json(updatedJob);
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ error: 'Failed to update job' });
    }
};

// Delete job posting
export const deleteJob = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);

        await prisma.jobPosting.delete({
            where: { id }
        });

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ error: 'Failed to delete job' });
    }
};

// Submit application (Talent Pool or specific Job)
export const submitApplication = async (req: Request, res: Response) => {
    try {
        const {
            jobId,
            fullName,
            email,
            phone,
            resumeUrl,
            coverLetter,
            linkedinProfile,
            portfolioUrl
        } = req.body;

        const application = await prisma.jobApplication.create({
            data: {
                jobId: jobId || null,
                fullName,
                email,
                phone,
                resumeUrl,
                coverLetter,
                linkedinProfile,
                portfolioUrl
            }
        });

        res.status(201).json(application);
    } catch (error: any) {
        console.error('Error submitting application:', error);
        res.status(500).json({ error: error.message || 'Failed to submit application' });
    }
};

// Get all applications (Admin only)
export const getApplications = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.query;

        const whereClause: any = {};
        if (jobId) {
            whereClause.jobId = jobId as string;
        }

        const applications = await prisma.jobApplication.findMany({
            where: whereClause,
            include: {
                job: {
                    select: {
                        title: true,
                        jobCode: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};

// Update application status
export const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status } = req.body;

        const updatedApplication = await prisma.jobApplication.update({
            where: { id },
            data: { status }
        });

        res.json(updatedApplication);
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ error: 'Failed to update application status' });
    }
};

// Get single application by ID
export const getApplicationById = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);

        const application = await prisma.jobApplication.findUnique({
            where: { id },
            include: {
                job: {
                    select: {
                        title: true,
                        jobCode: true
                    }
                }
            }
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        console.error('Error fetching application details:', error);
        res.status(500).json({ error: 'Failed to fetch application details' });
    }
};
