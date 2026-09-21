
import {
    FaUser,
    FaHammer,
    FaMoneyBillWave,
    FaCheckCircle,
    FaClock,
    FaFileAlt,
    FaArrowLeft,
    FaShieldAlt,
    FaProjectDiagram,
    FaFileContract
} from "react-icons/fa";

export interface GrantApplication {
    id: string;
    status: string;
    createdAt: string;

    applicantName: string;
    organizationName?: string;
    applicantType: string;
    otherApplicantType?: string;
    contactNumber: string;
    email: string;

    village: string;
    district: string;
    state: string;
    country: string;
    postalCode: string;

    primaryCraft: string;
    experienceYears: string;
    artisansInvolved: string;
    businessStage: string;
    certificationStatus: string;

    grantTypes: string[];
    grantAmount: string;
    grantPurpose: string[];

    briefDescription: string;
    projectDescription: string;
    livelihoodImpact: string;
    heritageContribution: string;

    budgetTools?: string;
    budgetMaterials?: string;
    budgetLabor?: string;
    budgetMarketing?: string;
    budgetOther?: string;
    timeline: string;

    previousGrants: string;
    previousGrantDetails?: string;
    progressUpdates: string;
}

interface GrantDetailsViewProps {
    grant: GrantApplication;
    onBack: () => void;
    title?: string;
    extraHeaderContent?: React.ReactNode;
}

export default function GrantDetailsView({ grant, onBack, title = "Grant Application Details", extraHeaderContent }: GrantDetailsViewProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED": return "bg-green-100 text-green-800 border-green-200";
            case "REJECTED": return "bg-red-100 text-red-800 border-red-200";
            case "UNDER_REVIEW": return "bg-blue-100 text-blue-800 border-blue-200";
            default: return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
    };

    const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-brand-secondary shadow-sm">
                    <Icon size={18} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    const Field = ({ label, value, fullWidth = false }: { label: string, value: any, fullWidth?: boolean }) => (
        <div className={`${fullWidth ? "col-span-12" : "col-span-12 md:col-span-6 lg:col-span-4"}`}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="font-medium text-gray-800 text-sm break-words">{value || "N/A"}</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto pb-12 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <button
                        onClick={onBack}
                        className="flex items-center text-gray-500 hover:text-brand-primary mb-2 transition-colors text-sm font-medium"
                    >
                        <FaArrowLeft className="mr-2" /> Back
                    </button>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h1>
                    <p className="text-gray-500 text-sm mt-1">Submitted on {new Date(grant.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                    {extraHeaderContent}
                    <div className={`px-4 py-2 rounded-full border text-sm font-bold flex items-center gap-2 ${getStatusColor(grant.status)}`}>
                        {grant.status === "APPROVED" ? <FaCheckCircle /> : grant.status === "PENDING" ? <FaClock /> : <FaFileAlt />}
                        {grant.status}
                    </div>
                </div>
            </div>

            <Section title="Applicant Information" icon={FaUser}>
                <div className="grid grid-cols-12 gap-y-6 gap-x-4">
                    <Field label="Applicant Name" value={grant.applicantName} />
                    <Field label="Organization" value={grant.organizationName} />
                    <Field label="Applicant Type" value={grant.applicantType} />
                    <Field label="Other Type" value={grant.otherApplicantType} />
                    <Field label="Contact Number" value={grant.contactNumber} />
                    <Field label="Email Address" value={grant.email} />

                    <div className="col-span-12 mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-bold text-gray-800 mb-4 block">Address Details</p>
                        <div className="grid grid-cols-12 gap-y-4 gap-x-4">
                            <Field label="Village / Locality" value={grant.village} />
                            <Field label="District" value={grant.district} />
                            <Field label="State" value={grant.state} />
                            <Field label="Country" value={grant.country} />
                            <Field label="Postal Code" value={grant.postalCode} />
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="Craft & Business Details" icon={FaHammer}>
                <div className="grid grid-cols-12 gap-y-6 gap-x-4">
                    <Field label="Primary Craft" value={grant.primaryCraft} />
                    <Field label="Experience (Years)" value={grant.experienceYears} />
                    <Field label="Artisans Involved" value={grant.artisansInvolved} />
                    <Field label="Business Stage" value={grant.businessStage} />
                    <Field label="Certification Status" value={grant.certificationStatus} />
                </div>
            </Section>

            <Section title="Grant Information" icon={FaMoneyBillWave}>
                <div className="grid grid-cols-12 gap-y-6 gap-x-4">
                    <Field label="Grant Types" value={Array.isArray(grant.grantTypes) ? grant.grantTypes.join(", ") : grant.grantTypes} fullWidth />
                    <Field label="Grant Amount Requested" value={grant.grantAmount} />
                    <Field label="Grant Purpose" value={Array.isArray(grant.grantPurpose) ? grant.grantPurpose.join(", ") : grant.grantPurpose} fullWidth />
                </div>
            </Section>

            <Section title="Project Description" icon={FaProjectDiagram}>
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Brief Description</p>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border border-gray-100">{grant.briefDescription}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detailed Project Description</p>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border border-gray-100">{grant.projectDescription}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Livelihood Impact</p>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border border-gray-100">{grant.livelihoodImpact}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Heritage Contribution</p>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border border-gray-100">{grant.heritageContribution}</p>
                    </div>
                </div>
            </Section>

            <Section title="Budget Overview" icon={FaFileContract}>
                <div className="grid grid-cols-12 gap-y-6 gap-x-4">
                    <Field label="Tools & Equipment" value={grant.budgetTools} />
                    <Field label="Materials" value={grant.budgetMaterials} />
                    <Field label="Labor & Training" value={grant.budgetLabor} />
                    <Field label="Marketing" value={grant.budgetMarketing} />
                    <Field label="Other Costs" value={grant.budgetOther} />
                    <Field label="Timeline" value={grant.timeline} />
                </div>
            </Section>

            <Section title="Support & Compliance" icon={FaShieldAlt}>
                <div className="grid grid-cols-12 gap-y-6 gap-x-4">
                    <Field label="Previous Grants" value={grant.previousGrants} />
                    <Field label="Previous Grant Details" value={grant.previousGrantDetails} fullWidth />
                    <Field label="Willing to Share Updates" value={grant.progressUpdates} />
                </div>
            </Section>
        </div>
    );
}
