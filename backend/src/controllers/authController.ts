import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/db.js';
import { EmailService } from '../services/emailService.js';
import { EmailTemplates } from '../constants/emailTemplates.js';

import { JWT_SECRET } from '../config/env.js';

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            if (existingUser.isVerified) {
                res.status(400).json({ message: 'User already exists' });
                return;
            }
            // If user exists but not verified, we'll update the record with new info and new OTP
            // This acts as a "restart signup" for those who didn't verify
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate 6-digit OTP
        const otp = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
        // OTP expires in 15 minutes
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

        let user;
        if (existingUser && !existingUser.isVerified) {
            user = await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    name,
                    password: hashedPassword,
                    otp,
                    otpExpiresAt
                }
            });
        } else {
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    isVerified: false,
                    otp,
                    otpExpiresAt
                },
            });
        }

        // Send OTP via email
        try {
            await EmailService.sendEmail(
                user.email,
                EmailTemplates.EMAIL_VERIFICATION, // maps to 'email-verification-otp'
                {
                    first_name: user.name.split(' ')[0] || user.name,
                    otp: otp,
                    subject: 'Verify your KHCRF Account'
                }
            );
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            res.status(500).json({ message: 'Account created but failed to send verification email. Please request a new OTP.' });
            return;
        }

        res.status(201).json({ message: 'Registration successful. Please verify your email.', userId: user.id });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const ipAddress = req.ip || req.socket.remoteAddress || 'Unknown';

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const user = await prisma.user.findUnique({ 
            where: { email },
            include: { userPurchases: true } // Check for purchases
        });

        if (!user) {
            console.log('[AUTH DEBUG LOG]', JSON.stringify({
                normalizedEmail: email,
                userFound: false,
                dbHost: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0]
            }));
            res.status(401).json({ message: 'Incorrect email or password' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        console.log('[AUTH DEBUG LOG]', JSON.stringify({
            normalizedEmail: email,
            userFound: !!user,
            userId: user?.id,
            isAdmin: user?.isAdmin,
            bcryptPrefixValid: user?.password?.startsWith('$2b$') || user?.password?.startsWith('$2a$'),
            compareResult: isPasswordValid,
            dbHost: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0]
        }));

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Incorrect email or password' });
            return;
        }

        // Block soft-deleted/suspended users from logging in
        if (user.isTrashed) {
            res.status(403).json({ message: 'Your account has been suspended or disabled. Please contact the administrator.' });
            return;
        }

        // Block unverified users from logging in
        if (!user.isVerified) {
            res.status(403).json({ 
                message: 'Your email is not verified. Please verify your email to log in.',
                requiresVerification: true,
                email: user.email 
            });
            return;
        }

        // Single Session Logic for Purchasers
        let sessionId = null;
        if (user.userPurchases.length > 0) {
            sessionId = crypto.randomUUID();
            // Update user with new session ID (invalidates old ones)
            await prisma.user.update({
                where: { id: user.id },
                data: { currentSessionId: sessionId }
            });
        }

        // Record Login History
        await prisma.loginHistory.create({
            data: {
                userId: user.id,
                sessionId: sessionId, // Store session ID
                ipAddress: String(ipAddress),
                device: userAgent
            }
        });

        const token = jwt.sign(
            { userId: user.id, sessionId }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV?.trim() === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Trigger Welcome Back Email (Immediate)
        // Fire and forget - don't await to avoid blocking response
        EmailService.sendEmail(
            user.email,
            EmailTemplates.WELCOME_BACK,
            {
                name: user.name,
                email: user.email,
                login_time: new Date().toLocaleTimeString(),
                location: "India",
                DASHBOARD_LINK: "https://khcrf.org/dashboard",
                SECURE_LINK: "https://khcrf.org/profile"
            }
        )
            .catch(err => console.error("Failed to send welcome back email:", err));

        res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, isMember: user.isMember,isAdmin: user.isAdmin,role:user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, isMember: true, isAdmin: true, role: true, avatarUrl: true }
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.userId;
        const { name, avatarUrl } = req.body;

        if (!name && !avatarUrl) {
            res.status(400).json({ message: 'At least one field (name or avatarUrl) is required' });
            return;
        }

        const dataToUpdate: any = {};
        if (name) dataToUpdate.name = name;
        if (avatarUrl) dataToUpdate.avatarUrl = avatarUrl;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate,
            select: { id: true, name: true, email: true, avatarUrl: true, isMember: true, isAdmin: true, role: true }
        });

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Return success even if user not found to prevent email enumeration
            res.json({ message: 'If an account with that email exists, an OTP has been sent.' });
            return;
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
        // OTP expires in 15 minutes
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                otp,
                otpExpiresAt,
            },
        });

        // Send OTP via email
        try {
            await EmailService.sendEmail(
                user.email,
                EmailTemplates.FORGOT_PASSWORD,
                {
                    first_name: user.name.split(' ')[0] || user.name,
                    otp: otp,
                    // optional: passing subject as we discussed in emailService.ts
                    subject: 'Your Password Reset OTP - KHCRF'
                }
            );
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
            // Optionally, we could clear the OTP here if email fails, but it will just expire anyway
            res.status(500).json({ message: 'Failed to send OTP email. Please try again later.' });
            return;
        }

        res.json({ message: 'If an account with that email exists, an OTP has been sent.' });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            res.status(400).json({ message: 'Email, OTP, and new password are required' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.error(`Reset password failed: EMAIL_NOT_FOUND for email=${email}`);
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        if (user.otp !== otp) {
            console.error(`Reset password failed: OTP_MISMATCH for email=${email}. Expected=${user.otp}, Received=${otp}`);
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        if (!user.otpExpiresAt) {
            console.error(`Reset password failed: OTP_ALREADY_USED or never set for email=${email}`);
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        if (user.otpExpiresAt < new Date()) {
            console.error(`Reset password failed: OTP_EXPIRED for email=${email}. Expired at ${user.otpExpiresAt}`);
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                otp: null,
                otpExpiresAt: null,
            },
        });

        res.json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400).json({ message: 'Email and OTP are required' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.error(`Verify email failed: EMAIL_NOT_FOUND for email=${email}`);
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        if (user.otp !== otp) {
            console.error(`Verify email failed: OTP_MISMATCH for email=${email}. Expected=${user.otp}, Received=${otp}`);
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        if (!user.otpExpiresAt) {
            console.error(`Verify email failed: OTP_ALREADY_USED or never set for email=${email}`);
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        if (user.otpExpiresAt < new Date()) {
            console.error(`Verify email failed: OTP_EXPIRED for email=${email}. Expired at ${user.otpExpiresAt}`);
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        // Mark as verified and log them in
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                otp: null,
                otpExpiresAt: null,
            },
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV?.trim() === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Trigger Welcome Email (Scheduled 5 mins later) now that they are verified
        const fiveMinutesLater = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        EmailService.sendEmail(
            user.email,
            EmailTemplates.WELCOME,
            {
                name: user.name,
                DASHBOARD_LINK: "https://khcrf.org/profile",
                UNSUBSCRIBE_LINK: "https://khcrf.org/unsubscribe"
            },
            fiveMinutesLater
        ).catch(err => console.error("Failed to schedule welcome email:", err));

        res.json({ 
            message: 'Email verified successfully', 
            user: { 
                id: updatedUser.id, 
                name: updatedUser.name, 
                email: updatedUser.email, 
                isMember: updatedUser.isMember,
                isAdmin: updatedUser.isAdmin,
                role: updatedUser.role
            } 
        });

    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const resendVerificationOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (user.isVerified) {
            res.status(400).json({ message: 'Email is already verified' });
            return;
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
        // OTP expires in 15 minutes
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                otp,
                otpExpiresAt,
            },
        });

        try {
            await EmailService.sendEmail(
                user.email,
                EmailTemplates.EMAIL_VERIFICATION, // maps to 'email-verification-otp'
                {
                    first_name: user.name.split(' ')[0] || user.name,
                    otp: otp,
                    subject: 'Verify your KHCRF Account'
                }
            );
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            res.status(500).json({ message: 'Failed to resend OTP email. Please try again later.' });
            return;
        }

        res.json({ message: 'Verification OTP has been resent.' });

    } catch (error) {
        console.error('Resend verification OTP error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
