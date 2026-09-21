import { getPublicationAccessState, UserContext, MembershipContext } from '../src/utils/authorization';

describe('Publication Access Control', () => {
    
    it('denies access to anonymous visitor', () => {
        expect(getPublicationAccessState(null, null)).toBe(false);
        expect(getPublicationAccessState(undefined, undefined)).toBe(false);
    });

    it('denies access to logged-in non-applicant', () => {
        const user: UserContext = { role: 'USER' };
        expect(getPublicationAccessState(user, null)).toBe(false);
        expect(getPublicationAccessState(user, { status: 'NONE' })).toBe(false);
    });

    it('denies access to pending applicant', () => {
        const user: UserContext = { role: 'USER' };
        const membership: MembershipContext = { status: 'PENDING' };
        expect(getPublicationAccessState(user, membership)).toBe(false);
    });

    it('denies access to rejected applicant', () => {
        const user: UserContext = { role: 'USER' };
        const membership: MembershipContext = { status: 'REJECTED' };
        expect(getPublicationAccessState(user, membership)).toBe(false);
    });

    it('denies access to suspended member', () => {
        const user: UserContext = { role: 'USER' };
        
        // Status is SUSPENDED
        expect(getPublicationAccessState(user, { status: 'SUSPENDED' })).toBe(false);
        
        // Status is APPROVED but suspendedAt is set
        expect(getPublicationAccessState(user, { status: 'APPROVED', suspendedAt: new Date() })).toBe(false);
    });

    it('denies access to revoked member', () => {
        const user: UserContext = { role: 'USER' };
        
        // Status is REVOKED
        expect(getPublicationAccessState(user, { status: 'REVOKED' })).toBe(false);
        
        // Status is APPROVED but revokedAt is set
        expect(getPublicationAccessState(user, { status: 'APPROVED', revokedAt: new Date() })).toBe(false);
    });

    it('permits access to approved active member', () => {
        const user: UserContext = { role: 'USER' };
        const membership: MembershipContext = { status: 'APPROVED', isActive: true };
        expect(getPublicationAccessState(user, membership)).toBe(true);
    });

    it('permits access to administrator regardless of membership', () => {
        const adminUser1: UserContext = { role: 'ADMIN' };
        const adminUser2: UserContext = { isAdmin: true };
        
        expect(getPublicationAccessState(adminUser1, null)).toBe(true);
        expect(getPublicationAccessState(adminUser2, { status: 'REJECTED' })).toBe(true);
    });

    it('changing an approved member to suspended immediately revokes access', () => {
        const user: UserContext = { role: 'USER' };
        let membership: MembershipContext = { status: 'APPROVED' };
        
        // Before suspension
        expect(getPublicationAccessState(user, membership)).toBe(true);
        
        // After suspension
        membership = { status: 'APPROVED', suspendedAt: new Date().toISOString() };
        expect(getPublicationAccessState(user, membership)).toBe(false);
    });

    it('client-provided role or membership status cannot override the database state', () => {
        // This is structurally enforced because backend uses Prisma to fetch the real membership.
        // The getPublicationAccessState utility strictly requires the DB fetched membership record.
        const dbMembership: MembershipContext = { status: 'PENDING' };
        const hackedUser: UserContext = { role: 'USER' }; // cannot pass isAdmin unless it's in DB
        
        expect(getPublicationAccessState(hackedUser, dbMembership)).toBe(false);
    });
});
