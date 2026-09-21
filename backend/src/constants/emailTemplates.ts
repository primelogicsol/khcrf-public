export const EmailTemplates = {
    // User Management
    WELCOME: 'welcome',
    WELCOME_BACK: 'welcome-back',
    FORGOT_PASSWORD: 'password-reset-otp',
    EMAIL_VERIFICATION: 'email-verification',
    
    // Notifications & Updates
    NOTIFICATION: 'notification',
    STATUS_UPDATE: 'status-update',
    
    // Certifications
    CERTIFICATION_ISSUED: 'certification-issued',
    CERTIFICATION_INTAKE_CONFIRMATION: 'certification-intake-confirmation',
    // CERTIFICATION_REQUEST_CONFIRMATION: 'certification-request-confirmation', // File does not exist, commenting out
    
    // Applications & Submissions
    APPLICATION_RECEIVED: 'new-application-received', // New Generic Template
    SUBMISSION_UNDER_REVIEW: 'submission-under-review',
    
    // Specific Forms
    CONTACT_CONFIRMATION: 'contact-confirmation',
    DONATION_CONFIRMATION: 'donation-confirmation',
    DONATION_RECEIVED: 'donation-confirmation', // Usage alias
    KIT_REQUEST_CONFIRMATION: 'kit-request-confirmation',
    LEADERSHIP_APPLICATION_CONFIRMATION: 'leadership-application-confirmation',
    MEMBERSHIP_APPLICATION_RECEIVED: 'membership-application-received',
    ACCREDITATION_BADGE_REVIEW: 'accreditation-review-notification', 
    ARTISAN_POLICY_ADVOCACY: 'artisan-rights-campaign', 
    BUSINESS_EVALUATION_CONFIRMATION: 'submission-received-confirmation', // Existing file for evaluations
    BUSINESS_GRANT_SUPPORT: 'new-business-grant-support', // New Specific Template
    CRAFT_POLICY_ADVOCACY: 'policy-advocacy-invitation', 
    TALENT_POOL_RECEIVED: 'application-received', // Reuse generic
} as const;

export type EmailTemplateId = typeof EmailTemplates[keyof typeof EmailTemplates];
