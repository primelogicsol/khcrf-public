import React from "react";
import {
  FaUser,
  FaCertificate,
  FaFileUpload,
  FaCheck,
  FaArrowLeft,
  FaBuilding,
  FaIndustry,
} from "react-icons/fa";
import Input from "@/components/common/Input";
import Link from "next/link";
// import { AccreditationApplication } from '@/types'; // Function signature placeholder

interface AccreditationApplication {
  id: string;
  businessName: string;
  contactPerson: string;
  emailAddress: string;
  phoneNumber: string;
  businessAddress: string;
  badges: string[]; // JSON array in DB
  businessDescription: string;
  productionMethods: string;
  documentation: string[]; // JSON array in DB
  otherDocumentation?: string | null; // Allow null
  status: string;
  createdAt: string | Date;
}

interface AccreditationDetailsViewProps {
  application: AccreditationApplication;
  onBack?: () => void;
  title?: string;
  backLink?: string;
  adminActions?: React.ReactNode;
}

const AccreditationDetailsView: React.FC<AccreditationDetailsViewProps> = ({
  application,
  onBack,
  title = "Accreditation Details",
  backLink,
  adminActions,
}) => {
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {backLink ? (
            <Link
              href={backLink}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </Link>
          ) : onBack ? (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
          ) : null}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {application.businessName}
            </h1>
            <p className="text-sm text-gray-500">
              {title} #{application.id.slice(-6)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200 flex items-center gap-1`}
          >
            <FaCheck className="text-xs" /> Paid
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[application.status] || "bg-gray-100 text-gray-800"}`}
          >
            {application.status}
          </span>
          {adminActions}
        </div>
      </div>

      {/* Application Data */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            Application Information
          </h2>
        </div>

        <div className="p-8 space-y-10">
          {/* Business Info */}
          <div className="animate-fade-in-up">
            <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2 flex items-center gap-2">
              <FaUser data-ui-icon  className=" text-sm" /> Business
              Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Business Name"
                value={application.businessName}
                disabled
              />
              <Input
                label="Contact Person"
                value={application.contactPerson}
                disabled
              />
              <Input label="Email" value={application.emailAddress} disabled />
              <Input label="Phone" value={application.phoneNumber} disabled />
              <div className="md:col-span-2">
                <label className="block text-gray-800 font-bold mb-3 text-sm">
                  Address
                </label>
                <textarea
                  className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700"
                  rows={2}
                  disabled
                  value={application.businessAddress}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="animate-fade-in-up">
            <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2 flex items-center gap-2">
              <FaBuilding data-ui-icon  className=" text-sm" /> Business
              Profile
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-800 font-bold mb-2 text-sm">
                  Business Description
                </label>
                <p className="p-4 bg-gray-50 rounded-xl text-gray-700 border border-gray-200 whitespace-pre-wrap">
                  {application.businessDescription}
                </p>
              </div>
              <div>
                <label className="block text-gray-800 font-bold mb-2 text-sm">
                  Production Methods
                </label>
                <p className="p-4 bg-gray-50 rounded-xl text-gray-700 border border-gray-200 whitespace-pre-wrap">
                  {application.productionMethods}
                </p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="animate-fade-in-up">
            <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2 flex items-center gap-2">
              <FaCertificate data-ui-icon  className=" text-sm" />{" "}
              Requested Badges
            </h3>
            <div className="flex flex-wrap gap-3">
              {application.badges &&
                application.badges.map((badge, idx) => (
                  <span
 data-ui-icon                   key={idx}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10  rounded-full font-bold text-sm border border-brand-primary/20"
                  >
                    <FaCheck className="text-xs" /> {badge}
                  </span>
                ))}
            </div>
          </div>

          {/* Documents */}
          <div className="animate-fade-in-up">
            <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2 flex items-center gap-2">
              <FaFileUpload data-ui-icon  className=" text-sm" />{" "}
              Documentation
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {application.documentation &&
                  application.documentation.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <FaCheck className="text-green-500 mr-3" />
                      <span className="text-gray-700 font-medium">{doc}</span>
                    </div>
                  ))}
              </div>
              {application.otherDocumentation && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Additional Documents
                  </span>
                  <span className="text-gray-900 font-medium">
                    {application.otherDocumentation}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccreditationDetailsView;
