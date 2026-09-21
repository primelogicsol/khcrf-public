export type FormCategory = 
    | "PUBLIC_SUBMISSION_FORM"
    | "AUTHENTICATION_FORM"
    | "MEMBERSHIP_FORM"
    | "APPLICATION_FORM"
    | "ADMIN_CREATE_FORM"
    | "ADMIN_EDIT_FORM"
    | "SETTINGS_FORM"
    | "UPLOAD_FORM"
    | "SEARCH_FILTER_FORM"
    | "INLINE_MUTATION_CONTROL"
    | "MULTI_STEP_FORM"
    | "PAYMENT_FORM"
    | "MODAL_FORM"
    | "DISABLED_LIFECYCLE_FORM"
    | "DISPLAY_COMPONENT_NOT_A_FORM";

export type AccessRole = 
    | "PUBLIC"
    | "AUTHENTICATED"
    | "MEMBER"
    | "EDITOR"
    | "ADMIN";

export type FormAuditEntry = {
  id: string;
  route: string;
  name: string;
  category: FormCategory;
  accessRole: AccessRole;
  submitSelector?: string;
  endpoint?: string;
  expectedDatabaseTarget?: string;
  expectedDashboardRoute?: string;
  supportsUploads?: boolean;
  lifecycleControlled?: boolean;
};

export const formRegistry: FormAuditEntry[] = [
  {
    id: "login",
    route: "/login",
    name: "LoginPage",
    category: "AUTHENTICATION_FORM",
    accessRole: "PUBLIC",
    submitSelector: "button[type='submit']",
    endpoint: "/auth/login",
    expectedDatabaseTarget: "User",
    expectedDashboardRoute: "/dashboard"
  },
  {
    id: "register",
    route: "/register",
    name: "RegisterPage",
    category: "AUTHENTICATION_FORM",
    accessRole: "PUBLIC",
    submitSelector: "button[type='submit']",
    endpoint: "/auth/signup",
    expectedDatabaseTarget: "User",
    expectedDashboardRoute: "/dashboard"
  },
  {
    id: "forgot-password",
    route: "/forgot-password",
    name: "ForgotPasswordPage",
    category: "AUTHENTICATION_FORM",
    accessRole: "PUBLIC",
    submitSelector: "button[type='submit']",
    endpoint: "/auth/forgot-password"
  },
  {
    id: "membership-join",
    route: "/about/memberships/join",
    name: "MembershipFormClient",
    category: "MEMBERSHIP_FORM",
    accessRole: "PUBLIC",
    submitSelector: "button[type='submit']",
    endpoint: "/membership/my-membership",
    expectedDatabaseTarget: "Membership",
    expectedDashboardRoute: "/dashboard/ccsi"
  },
  {
    id: "stakeholder-register",
    route: "/dashboard/skc/institutions", // Example route where it's used
    name: "StakeholderProfileForm",
    category: "PUBLIC_SUBMISSION_FORM",
    accessRole: "PUBLIC",
    submitSelector: "button[type='submit']",
    endpoint: "/api/backend/skc/stakeholders/register",
    expectedDatabaseTarget: "StakeholderProfile"
  },
  {
    id: "institution-register",
    route: "/state-of-kashmir-crafts/participating-institutions",
    name: "InstitutionRegistrationForm",
    category: "PUBLIC_SUBMISSION_FORM",
    accessRole: "PUBLIC",
    submitSelector: "button[type='submit']",
    endpoint: "/api/backend/skc/institutions/register",
    expectedDatabaseTarget: "InstitutionRegistration"
  },
  {
    id: "evidence-submit",
    route: "/state-of-kashmir-crafts/evidence-repository",
    name: "EvidenceRepositoryClient",
    category: "PUBLIC_SUBMISSION_FORM",
    accessRole: "PUBLIC",
    submitSelector: "button[type='submit']",
    endpoint: "/api/skc/evidence/public/metrics?cycle=2026",
    expectedDatabaseTarget: "EvidenceSubmission"
  },
  {
    id: "advisory-apply",
    route: "/state-of-kashmir-crafts/advisory-council",
    name: "AdvisorForm",
    category: "APPLICATION_FORM",
    accessRole: "PUBLIC",
    submitSelector: "button[type='submit']",
    endpoint: "/advisory/apply",
    expectedDatabaseTarget: "AdvisoryApplication",
    supportsUploads: true
  },
  {
    id: "fellowship-apply",
    route: "/state-of-kashmir-crafts/become-a-fellow",
    name: "BecomeAFellowPage",
    category: "APPLICATION_FORM",
    accessRole: "PUBLIC",
    submitSelector: "button[type='submit']",
    endpoint: "/api/skc/fellowships/register",
    expectedDatabaseTarget: "FellowshipApplication",
    supportsUploads: true
  },
  {
    id: "business-register",
    route: "/components/business/BusinessRegistrationForm",
    name: "BusinessRegistrationForm",
    category: "APPLICATION_FORM",
    accessRole: "PUBLIC",
    submitSelector: "button[type='submit']",
    endpoint: undefined,
    expectedDatabaseTarget: "BusinessRegistration"
  }
];
