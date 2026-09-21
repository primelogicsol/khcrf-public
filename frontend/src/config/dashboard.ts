import {
  FaHome,
  FaBriefcase,
  FaUsers,
  FaNewspaper,
  FaCog,
  FaGraduationCap,
  FaUserTie,
  FaHandHoldingHeart,
  FaHandsHelping,
  FaHandshake,
  FaBook,
  FaLandmark,
  FaUserShield,
  FaEnvelope,
  FaProjectDiagram,
  FaChartLine,
  FaBalanceScale,
  FaCertificate,
  FaImages,
  FaBullhorn,
  FaFileContract,
  FaInbox,
  FaInfoCircle,
  FaClipboardList,
  FaFeatherAlt,
  FaFolderOpen,
} from "react-icons/fa";
import { MdBusinessCenter } from "react-icons/md";

// Define all available roles
// Define all available roles
export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  MEMBERSHIP_MODERATOR: "MEMBERSHIP_MODERATOR",
  DONATIONS_MODERATOR: "DONATIONS_MODERATOR",
  MODERATOR_CAREER: "MODERATOR_CAREER",
  MODERATOR_CERTIFICATIONS: "MODERATOR_CERTIFICATIONS",
  MODERATOR_ACCREDITATION: "MODERATOR_ACCREDITATION",
  MODERATOR_EBOOKS: "MODERATOR_EBOOKS",
  COLLABORATOR_ADVOCACY: "COLLABORATOR_ADVOCACY",
  COLLABORATOR_CAMPAIGNING: "COLLABORATOR_CAMPAIGNING",
  COLLABORATOR_LOBBYING: "COLLABORATOR_LOBBYING",
  COLLABORATOR_EBOOKS: "COLLABORATOR_EBOOKS",
  RESEARCH_CONTRIBUTOR: "RESEARCH_CONTRIBUTOR",
  FIELD_CONTRIBUTOR: "FIELD_CONTRIBUTOR",
  ARTISAN_CONTRIBUTOR: "ARTISAN_CONTRIBUTOR",
  INDUSTRY_CONTRIBUTOR: "INDUSTRY_CONTRIBUTOR",
  POLICY_CONTRIBUTOR: "POLICY_CONTRIBUTOR",
  INSTITUTIONAL_PARTNER: "INSTITUTIONAL_PARTNER",
  MAGAZINE_EDITOR: "MAGAZINE_EDITOR",
};

// Roles that have access to the dashboard
export const DASHBOARD_ACCESS_ROLES = [
  ROLES.ADMIN,
  ROLES.MEMBERSHIP_MODERATOR,
  ROLES.DONATIONS_MODERATOR,
  ROLES.MODERATOR_CAREER,
  ROLES.MODERATOR_CERTIFICATIONS,
  ROLES.MODERATOR_ACCREDITATION,
  ROLES.MODERATOR_EBOOKS,
  ROLES.COLLABORATOR_ADVOCACY,
  ROLES.COLLABORATOR_CAMPAIGNING,
  ROLES.COLLABORATOR_LOBBYING,
  ROLES.RESEARCH_CONTRIBUTOR,
  ROLES.FIELD_CONTRIBUTOR,
  ROLES.ARTISAN_CONTRIBUTOR,
  ROLES.INDUSTRY_CONTRIBUTOR,
  ROLES.POLICY_CONTRIBUTOR,
  ROLES.INSTITUTIONAL_PARTNER,
  ROLES.MAGAZINE_EDITOR,
];

export interface DashboardMenuItem {
  name: string;
  icon?: any;
  path: string;
  children?: DashboardMenuItem[];
  allowedRoles?: string[]; // If undefined, accessible to all authorized dashboard users (or handled by parent)
}

// Helper to allow all dashboard roles (except USER if we want to be explicit, but generally ADMIN has all)
// Actually, for this specific requirement, we want to be very specific.
// Only ADMIN has full access. Others have specific access.

const ALL_MODERATORS_AND_COLLABORATORS = [
    ROLES.ADMIN,
    ROLES.MEMBERSHIP_MODERATOR,
    ROLES.DONATIONS_MODERATOR,
    ROLES.MODERATOR_CAREER,
    ROLES.MODERATOR_CERTIFICATIONS,
    ROLES.MODERATOR_ACCREDITATION,
    ROLES.MODERATOR_EBOOKS,
    ROLES.COLLABORATOR_ADVOCACY,
    ROLES.COLLABORATOR_CAMPAIGNING,
    ROLES.COLLABORATOR_LOBBYING,
    ROLES.COLLABORATOR_EBOOKS,
    ROLES.RESEARCH_CONTRIBUTOR,
    ROLES.FIELD_CONTRIBUTOR,
    ROLES.ARTISAN_CONTRIBUTOR,
    ROLES.INDUSTRY_CONTRIBUTOR,
    ROLES.POLICY_CONTRIBUTOR,
    ROLES.INSTITUTIONAL_PARTNER,
    ROLES.MAGAZINE_EDITOR,
];

const OVERVIEW_ROLES = [
  ROLES.ADMIN,
  ROLES.MEMBERSHIP_MODERATOR,
  ROLES.DONATIONS_MODERATOR,
  ROLES.MODERATOR_CAREER,
  ROLES.MODERATOR_CERTIFICATIONS,
  ROLES.MODERATOR_ACCREDITATION,
  ROLES.MODERATOR_EBOOKS,
  ROLES.COLLABORATOR_ADVOCACY,
  ROLES.COLLABORATOR_CAMPAIGNING,
  ROLES.COLLABORATOR_LOBBYING,
  ROLES.COLLABORATOR_EBOOKS,
  ROLES.MAGAZINE_EDITOR,
];

export const dashboardMenu: DashboardMenuItem[] = [
  { 
    name: "Overview", 
    icon: FaHome, 
    path: "/dashboard",
    allowedRoles: OVERVIEW_ROLES
  },
  {
    name: "Research & Policy",
    icon: FaLandmark,
    path: "/dashboard/hr/legislative",
    allowedRoles: [ROLES.ADMIN, ROLES.COLLABORATOR_LOBBYING],
    children: [
      {
        name: "Legislative Offices",
        path: "/dashboard/hr/legislative",
        icon: FaLandmark,
        allowedRoles: [ROLES.ADMIN, ROLES.COLLABORATOR_LOBBYING],
      },
      {
        name: "CCSI Registry",
        path: "/dashboard/ccsi",
        icon: FaBriefcase,
        allowedRoles: [ROLES.ADMIN, ROLES.COLLABORATOR_LOBBYING],
      },
      { 
          name: "CCE Applications", 
          path: "/dashboard/business/cce-applications",
          icon: FaFileContract,
          allowedRoles: [ROLES.ADMIN]
      },
    ],
  },
  {
    name: "Campaign Operations",
    icon: FaBullhorn,
    path: "/dashboard/campaigns",
    allowedRoles: [ROLES.ADMIN, ROLES.COLLABORATOR_CAMPAIGNING],
    children: [
      {
        name: "Enrollments & Pledges",
        path: "/dashboard/campaigns/enrollments",
        icon: FaUsers,
        allowedRoles: [ROLES.ADMIN, ROLES.COLLABORATOR_CAMPAIGNING],
      },
      {
        name: "Heritage Stories",
        path: "/dashboard/campaigns/stories",
        icon: FaBook,
        allowedRoles: [ROLES.ADMIN, ROLES.COLLABORATOR_CAMPAIGNING, ROLES.MAGAZINE_EDITOR],
      },
    ],
  },
  {
    name: "Publications Hub",
    icon: FaBook,
    path: "/dashboard/business/publications",
    allowedRoles: [
        ROLES.ADMIN, 
        ROLES.MODERATOR_EBOOKS, 
        ROLES.COLLABORATOR_EBOOKS,
        ROLES.RESEARCH_CONTRIBUTOR,
        ROLES.FIELD_CONTRIBUTOR,
        ROLES.ARTISAN_CONTRIBUTOR,
        ROLES.INDUSTRY_CONTRIBUTOR,
        ROLES.POLICY_CONTRIBUTOR,
        ROLES.INSTITUTIONAL_PARTNER,
        ROLES.MAGAZINE_EDITOR
    ],
    children: [
      { 
        name: "Overview", 
        path: "/dashboard/business/publications",
        allowedRoles: ALL_MODERATORS_AND_COLLABORATORS 
      },
      { 
        name: "Publications", 
        path: "/dashboard/business/publications/list",
        allowedRoles: ALL_MODERATORS_AND_COLLABORATORS 
      },
      { 
        name: "Content Studio", 
        path: "/dashboard/business/publications/content-studio",
        allowedRoles: ALL_MODERATORS_AND_COLLABORATORS 
      },
      { 
        name: "My Books", 
        path: "/dashboard/business/publications/my-books",
        allowedRoles: [
          ROLES.RESEARCH_CONTRIBUTOR,
          ROLES.FIELD_CONTRIBUTOR,
          ROLES.ARTISAN_CONTRIBUTOR,
          ROLES.INDUSTRY_CONTRIBUTOR,
          ROLES.POLICY_CONTRIBUTOR,
          ROLES.INSTITUTIONAL_PARTNER,
        ] 
      },
      { 
        name: "Contributor Books", 
        path: "/dashboard/business/publications/contributor-books",
        allowedRoles: [ROLES.ADMIN, ROLES.MODERATOR_EBOOKS] 
      },
      { 
        name: "Categories & Taxonomy", 
        path: "/dashboard/business/publications/categories",
        allowedRoles: [ROLES.ADMIN, ROLES.MODERATOR_EBOOKS, ROLES.MAGAZINE_EDITOR] 
      },
      { 
        name: "Cover Templates", 
        path: "/dashboard/business/publications/cover-templates",
        allowedRoles: [ROLES.ADMIN, ROLES.MODERATOR_EBOOKS, ROLES.MAGAZINE_EDITOR] 
      },

      { 
        name: "Reviews & Publishing", 
        path: "/dashboard/business/publications/reviews",
        allowedRoles: [ROLES.ADMIN, ROLES.MAGAZINE_EDITOR] 
      },
      { 
        name: "SEO & AI Intelligence", 
        path: "/dashboard/business/publications/seo-citations",
        allowedRoles: ALL_MODERATORS_AND_COLLABORATORS 
      },
      { 
        name: "Knowledge Graph", 
        path: "/dashboard/business/publications/knowledge-graph",
        allowedRoles: ALL_MODERATORS_AND_COLLABORATORS 
      },
      { 
        name: "Analytics", 
        path: "/dashboard/business/publications/analytics",
        allowedRoles: [ROLES.ADMIN, ROLES.MODERATOR_EBOOKS, ROLES.MAGAZINE_EDITOR] 
      },
    ],
  },
  {
    name: "Master Artisans",
    icon: FaImages,
    path: "/dashboard/master-artisans",
    allowedRoles: [ROLES.ADMIN, ROLES.MAGAZINE_EDITOR],
    children: [
      {
        name: "Overview",
        path: "/dashboard/master-artisans",
        icon: FaImages,
        allowedRoles: [ROLES.ADMIN, ROLES.MAGAZINE_EDITOR],
      },
      {
        name: "Artisan Registry",
        path: "/dashboard/master-artisans/registry",
        icon: FaUsers,
        allowedRoles: [ROLES.ADMIN, ROLES.MAGAZINE_EDITOR],
      },
      {
        name: "Artisan Nominations",
        path: "/dashboard/master-artisans/nominations",
        icon: FaClipboardList,
        allowedRoles: [ROLES.ADMIN, ROLES.MAGAZINE_EDITOR],
      },
      {
        name: "Stories & Editorial",
        path: "/dashboard/master-artisans/stories",
        icon: FaFeatherAlt,
        allowedRoles: [ROLES.ADMIN, ROLES.MAGAZINE_EDITOR],
      },
      {
        name: "Magazine Issues",
        path: "/dashboard/master-artisans/magazine-issues",
        icon: FaBook,
        allowedRoles: [ROLES.ADMIN, ROLES.MAGAZINE_EDITOR],
      },
      {
        name: "Contributor Apps",
        path: "/dashboard/master-artisans/contributors",
        icon: FaHandshake,
        allowedRoles: [ROLES.ADMIN, ROLES.MAGAZINE_EDITOR],
      },
      {
        name: "Documentation",
        path: "/dashboard/master-artisans/documentation",
        icon: FaFolderOpen,
        allowedRoles: [ROLES.ADMIN, ROLES.MAGAZINE_EDITOR],
      }
    ]
  },
  {
    name: "Business Support",
    icon: MdBusinessCenter,
    path: "/dashboard/business",
    allowedRoles: [
        ROLES.ADMIN, 
        ROLES.MODERATOR_ACCREDITATION, 
        ROLES.MODERATOR_CERTIFICATIONS
    ], 
    children: [
      { 
          name: "Evaluations", 
          path: "/dashboard/business/evaluations",
          allowedRoles: [ROLES.ADMIN] 
      },
      { 
          name: "Accreditations", 
          path: "/dashboard/business/accreditations",
          allowedRoles: [ROLES.ADMIN, ROLES.MODERATOR_ACCREDITATION]
      },
      { 
          name: "Grants", 
          path: "/dashboard/business/grants",
          allowedRoles: [ROLES.ADMIN]
      },
      {
        name: "Certification",
        path: "/dashboard/business/certifications",
        icon: FaCertificate,
        allowedRoles: [ROLES.ADMIN, ROLES.MODERATOR_CERTIFICATIONS],
        children: [
          { name: "Overview", path: "/dashboard/business/certifications" },
          { name: "Orders", path: "/dashboard/business/orders" },
          {
            name: "Packages",
            path: "/dashboard/business/certifications/packages",
          },
        ],
      },
    ],
  },
  {
    name: "About KHCRF",
    icon: FaHandshake,
    path: "/dashboard/membership",
    allowedRoles: [
        ROLES.ADMIN, 
        ROLES.MEMBERSHIP_MODERATOR, 
        ROLES.DONATIONS_MODERATOR,
        // Apprenticeship is under here in the UI, so we need to allow Career moderator if they manage apprenticeship?
        // Wait, Apprenticeship is under About KHCRF in the original sidebar? 
        // Yes: { name: "Apprenticeship", path: "/dashboard/hr/apprenticeship", ... }
        ROLES.MODERATOR_CAREER 
    ],
    children: [
      { 
          name: "Membership", 
          path: "/dashboard/membership", 
          icon: FaUsers,
          allowedRoles: [ROLES.ADMIN, ROLES.MEMBERSHIP_MODERATOR]
      },
      {
        name: "Partner Registry",
        path: "/dashboard/partners",
        icon: FaHandshake,
        allowedRoles: [ROLES.ADMIN]
      },
      {
        name: "Donations",
        path: "/dashboard/donations",
        icon: FaHandHoldingHeart,
        allowedRoles: [ROLES.ADMIN, ROLES.DONATIONS_MODERATOR]
      },
      {
        name: "Apprenticeship",
        path: "/dashboard/hr/apprenticeship",
        icon: FaGraduationCap,
        allowedRoles: [ROLES.ADMIN, ROLES.MODERATOR_CAREER], 
        children: [
          { name: "Applications", path: "/dashboard/hr/apprenticeship" },
          { name: "Openings", path: "/dashboard/hr/apprenticeship/openings" },
        ],
      },
    ],
  },
  {
    name: "Career & HR",
    icon: FaBriefcase,
    path: "/dashboard/hr",
    allowedRoles: [ROLES.ADMIN, ROLES.MODERATOR_CAREER],
    children: [
      { name: "Job Management", path: "/dashboard/hr/jobs" },
      { name: "Applications", path: "/dashboard/hr/applications" },
      { name: "Talent Pool", path: "/dashboard/hr/pool" },
    ],
  },
  {
    name: "CMS & Content",
    icon: FaNewspaper,
    path: "/dashboard/cms",
    allowedRoles: [
        ROLES.ADMIN,
        ROLES.COLLABORATOR_ADVOCACY,
        ROLES.COLLABORATOR_CAMPAIGNING
    ],
    children: [
      { name: "Contact Page", path: "/dashboard/cms/contact", allowedRoles: [ROLES.ADMIN] },
      {
        name: "KHCRF Project",
        path: "/dashboard/cms/hcrf-project",
        icon: FaProjectDiagram,
        allowedRoles: [ROLES.ADMIN]
      },
      {
        name: "Partner Stats",
        path: "/dashboard/cms/partner-stats",
        icon: FaChartLine,
        allowedRoles: [ROLES.ADMIN]
      },
      {
        name: "Leadership",
        path: "/dashboard/cms/leadership",
        icon: FaUserTie,
        allowedRoles: [ROLES.ADMIN]
      },
      {
        name: "Compliance",
        path: "/dashboard/cms/compliance",
        icon: FaBalanceScale,
        allowedRoles: [ROLES.ADMIN]
      },
      {
        name: "Mission Framework",
        path: "/dashboard/cms/mission-framework",
        icon: FaHandsHelping,
        allowedRoles: [ROLES.ADMIN]
      },
      {
        name: "Accreditations",
        path: "/dashboard/cms/accreditations",
        icon: FaCertificate,
        allowedRoles: [ROLES.ADMIN] 
      },
      { name: "Hero Carousel", path: "/dashboard/cms/hero", icon: FaImages, allowedRoles: [ROLES.ADMIN] },
      { 
          name: "Campaigns", 
          path: "/dashboard/cms/campaigns", 
          icon: FaBullhorn,
          allowedRoles: [ROLES.ADMIN, ROLES.COLLABORATOR_CAMPAIGNING]
      },
      { 
          name: "Advocacy", 
          path: "/dashboard/cms/advocacy", 
          icon: FaBullhorn,
          allowedRoles: [ROLES.ADMIN, ROLES.COLLABORATOR_ADVOCACY]
      },
      {
        name: "Submissions",
        path: "/dashboard/contact-submissions",
        icon: FaEnvelope,
        allowedRoles: [ROLES.ADMIN]
      },
    ],
  },
  { 
      name: "User Management", 
      icon: FaUserShield, 
      path: "/dashboard/users",
      allowedRoles: [ROLES.ADMIN]
  },
  {
      name: "Contributor Intake",
      icon: FaInbox,
      path: "/dashboard/contributor-intake",
      allowedRoles: [ROLES.ADMIN, ROLES.MAGAZINE_EDITOR]
  },
  {
    name: "State of Kashmir Craft",
    icon: FaProjectDiagram,
    path: "/dashboard/skc",
    allowedRoles: [ROLES.ADMIN],
    children: [
      {
        name: "Assessment Management",
        path: "/dashboard/skc",
        children: [
          { name: "Overview", path: "/dashboard/skc" },
          { name: "Intelligence", path: "/dashboard/skc/intelligence" },
          { name: "Stakeholders", path: "/dashboard/skc/stakeholders" },
          { name: "Download Center", path: "/dashboard/skc/download-center" },
          { name: "Evidence Repository", path: "/dashboard/skc/evidence-repository" },
          { name: "Advisory Applications", path: "/dashboard/skc/advisory-applications" },
          { name: "Official Messages", path: "/dashboard/skc/official-messages" }
        ]
      },
      {
        name: "Review and Reporting",
        path: "/dashboard/skc/draft-findings",
        children: [
          { name: "Draft Findings", path: "/dashboard/skc/draft-findings" },
          { name: "Validation Round", path: "/dashboard/skc/validation-round" },
          { name: "Expert Review", path: "/dashboard/skc/expert-review" },
          { name: "Final Report Builder", path: "/dashboard/skc/final-report-builder" },
          { name: "Reports Archive", path: "/dashboard/skc/reports-archive" }
        ]
      },
      {
        name: "Governance and Operations",
        path: "/dashboard/skc/audit-logs",
        children: [
          { name: "Audit Logs", path: "/dashboard/skc/audit-logs" },
          { name: "Governance", path: "/dashboard/skc/governance" },
          { name: "Assessment Lifecycle", path: "/dashboard/skc/governance/lifecycle" },
          { name: "Institutions", path: "/dashboard/skc/institutions" },
          { name: "Consultations", path: "/dashboard/skc/consultations" },
          { name: "Hearings", path: "/dashboard/skc/hearings" },
          { name: "Media", path: "/dashboard/skc/media" },
          { name: "Fellowship", path: "/dashboard/skc/fellowship" },
          { name: "FAQ", path: "/dashboard/skc/faq" }
        ]
      }
    ]
  },
  {
    name: "Institutional CMS",
    icon: FaLandmark,
    path: "/dashboard/institutional-cms",
    allowedRoles: [ROLES.ADMIN, ROLES.MAGAZINE_EDITOR],
    children: [
      { name: "Overview", path: "/dashboard/institutional-cms" },
      { name: "Discovery", path: "/dashboard/institutional-cms/discovery" },
      { name: "People", path: "/dashboard/institutional-cms/people" },
      { name: "Knowledge", path: "/dashboard/institutional-cms/knowledge" },
      { name: "Heritage", path: "/dashboard/institutional-cms/heritage" },
      { name: "Media", path: "/dashboard/institutional-cms/media" },
      { name: "Publications", path: "/dashboard/institutional-cms/publications" },
      { name: "Verification", path: "/dashboard/institutional-cms/verification" },
      { name: "Relationships", path: "/dashboard/institutional-cms/relationships" },
      { name: "Sources", path: "/dashboard/institutional-cms/sources" },
      { name: "Workflow", path: "/dashboard/institutional-cms/workflow" },
      { name: "Health", path: "/dashboard/institutional-cms/health" },
      { name: "Participation", path: "/dashboard/institutional-cms/participation" }
    ]
  }
];
