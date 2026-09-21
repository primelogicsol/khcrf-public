import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/db.js';
import { JWT_SECRET } from '../config/env.js';
import { logger } from '../config/logger.js';

const getGoogleClientId = () => process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { credential } = req.body;
        
        if (process.env.NODE_ENV !== "production") {
            logger.info({ hasCredential: !!credential }, '[Google Auth] Incoming verification request');
        }

        if (!credential) {
            res.status(400).json({ message: 'Google credential is required' });
            return;
        }

        let payload: any = null;
        
        if (credential.startsWith('eyJ')) {
            // It is an ID Token (JWT)
            const clientId = getGoogleClientId();
            const googleClient = new OAuth2Client(clientId);
            if (process.env.NODE_ENV !== "production") {
                logger.info({ audienceTarget: clientId }, '[Google Auth] Verifying ID Token audience');
            }
            const ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: clientId,
            });
            payload = ticket.getPayload();
        } else {
            // It is an Access Token
            if (process.env.NODE_ENV !== "production") {
                logger.info('[Google Auth] Fetching userinfo payload using access token Bearer');
            }
            const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${credential}` }
            });
            
            if (!googleRes.ok) {
                res.status(400).json({ message: 'Failed to fetch user info from Google' });
                return;
            }
            payload = await googleRes.json();
        }

        if (process.env.NODE_ENV !== "production") {
            logger.info({ 
                audienceResult: payload?.aud,
                emailVerified: payload?.email_verified,
                hasEmail: !!payload?.email,
                hasSub: !!payload?.sub
            }, '[Google Auth] Token validation payload parameters');
        }

        if (!payload || !payload.email) {
            res.status(400).json({ message: 'Invalid Google token payload: email is required' });
            return;
        }

        if (payload.email_verified === false) {
            res.status(400).json({ message: 'The selected Google email is not verified.' });
            return;
        }

        const email = payload.email.trim().toLowerCase();
        const googleId = payload.sub || payload.id;
        const name = payload.name || payload.given_name || email.split('@')[0];
        const picture = payload.picture || null;

        if (process.env.NODE_ENV !== "production") {
            logger.info({ email, googleId, name, hasPicture: !!picture }, '[Google Auth] Extracted and normalized Google user details');
        }

        if (!googleId) {
            res.status(400).json({ message: 'Invalid Google token payload: sub/id identifier is required' });
            return;
        }

        // Check if user exists (include purchases for single-session enforcement)
        let user = await prisma.user.findUnique({ 
            where: { email },
            include: { userPurchases: true }
        });

        if (process.env.NODE_ENV !== "production") {
            logger.info({ userFound: !!user, existingGoogleId: user?.googleId }, '[Google Auth] Existing user lookup result');
        }

        if (user) {
            // User exists. Link Google ID if not present
            if (!user.googleId) {
                if (process.env.NODE_ENV !== "production") {
                    logger.info({ userId: user.id }, '[Google Auth] Linking Google ID to existing account');
                }
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        googleId,
                        authProvider: user.authProvider === 'local' ? 'google_and_local' : 'google',
                        // update avatar if they didn't have one
                        avatarUrl: user.avatarUrl || picture
                    },
                    include: { userPurchases: true }
                });
            }
        } else {
            // User does not exist, create a new one safely handling concurrent insertions
            if (process.env.NODE_ENV !== "production") {
                logger.info({ email }, '[Google Auth] Creating new Google OAuth account');
            }
            try {
                user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: '', // No password for OAuth users
                        googleId,
                        authProvider: 'google',
                        avatarUrl: picture,
                        isVerified: true // Google emails are implicitly verified
                    },
                    include: { userPurchases: true }
                });
            } catch (createError: any) {
                if (createError.code === 'P2002') {
                    // Concurrent request created user, fetch and link it
                    if (process.env.NODE_ENV !== "production") {
                        logger.warn({ email }, '[Google Auth] Unique constraint conflict on create, re-fetching user');
                    }
                    user = await prisma.user.findUnique({
                        where: { email },
                        include: { userPurchases: true }
                    });
                    if (!user) {
                        throw createError;
                    }
                    if (!user.googleId) {
                        user = await prisma.user.update({
                            where: { id: user.id },
                            data: {
                                googleId,
                                authProvider: user.authProvider === 'local' ? 'google_and_local' : 'google',
                                avatarUrl: user.avatarUrl || picture
                            },
                            include: { userPurchases: true }
                        });
                    }
                } else {
                    throw createError;
                }
            }
        }

        // Block soft-deleted/suspended users from logging in via Google
        if (user.isTrashed) {
            res.status(403).json({ message: 'Your account has been suspended or disabled. Please contact the administrator.' });
            return;
        }

        const userAgent = req.headers['user-agent'] || 'Unknown';
        const ipAddress = req.ip || req.socket.remoteAddress || 'Unknown';

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
                sessionId: sessionId,
                ipAddress: String(ipAddress),
                device: userAgent
            }
        });

        const token = jwt.sign(
            { userId: user.id, sessionId }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );

        if (process.env.NODE_ENV !== "production") {
            logger.info({ 
                userId: user.id,
                hasSessionId: !!sessionId,
                tokenGenerated: !!token
            }, '[Google Auth] Session established successfully');
        }

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV?.trim() === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, isMember: user.isMember, isAdmin: user.isAdmin, role: user.role } });

    } catch (error: any) {
        console.error('[Google Auth] Execution Failure:', {
            name: error?.name,
            message: error?.message,
            stack: error?.stack,
            code: error?.code,
        });

        // Granular HTTP status classification
        if (error?.message?.includes('Wrong recipient') || error?.message?.includes('Recipient not found') || error?.message?.includes('Invalid token') || error?.message?.includes('Token used too early') || error?.message?.includes('Token used too late')) {
            res.status(401).json({ message: 'Google authentication failed: token is invalid or intended for another client.' });
            return;
        }

        res.status(500).json({ message: 'Google authentication encountered an internal error.', errorType: error?.name || 'InternalError' });
    }
};
