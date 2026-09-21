"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import {
  FaSpinner,
  FaArrowLeft,
  FaPrint,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaStore,
  FaIndustry,
  FaFileAlt,
  FaEdit,
  FaTrash,
  FaKey,
} from "react-icons/fa";
import Link from "next/link";

export default function CCSIProfileView() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/ccsi/profile/${params.id}`);
        setProfile(data);
      } catch (error) {
        console.error("Fetch Profile Error", error);
        // Handle error (e.g., redirect or show message)
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProfile();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner data-ui-icon  className="animate-spin text-3xl " />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-gray-700">Profile Not Found</h2>
        <Link
          href="/legislative-dashboard/ccsi/list"
          className="text-brand-primary hover:underline mt-4 inline-block"
        >
          Return to List
        </Link>
      </div>
    );
  }

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        {Icon && <Icon className="text-icon-on-light" />}
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  const Field = ({ label, value }: any) => (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </label>
      <div className="text-gray-900 font-medium wrap-break-word">
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </div>
    </div>
  );

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this profile? This action cannot be undone.",
      )
    )
      return;

    try {
      await api.delete(`/ccsi/profile/${params.id}`);
      alert("Profile deleted successfully.");
      router.push("/legislative-dashboard/ccsi/list");
    } catch (error) {
      console.error("Delete Error", error);
      alert("Failed to delete profile.");
    }
  };

  const handleEdit = () => {
    // Redirect to intake form with edit mode
    router.push(`/legislative-dashboard/ccsi/intake?id=${params.id}`);
  };

  const handleApproveJurisdiction = async () => {
    if (
      !confirm(
        "Are you sure you want to officially confirm this profile's jurisdiction alignment?",
      )
    )
      return;
    try {
      await api.put(`/ccsi/profile/${params.id}/approve-jurisdiction`);
      alert("Jurisdiction confirmed successfully.");
      setProfile((prev: any) => ({ ...prev, status: "JURISDICTION_APPROVED" }));
    } catch (error: any) {
      console.error("Jurisdiction Approval Error", error);
      alert(error.response?.data?.message || "Failed to approve jurisdiction.");
    }
  };

  const handleApproveReferral = async () => {
    if (
      !confirm(
        "Are you sure you want to approve this referral and issue a code?",
      )
    )
      return;
    try {
      const { data } = await api.put(
        `/ccsi/profile/${params.id}/approve-referral`,
      );
      alert("Referral approved and code issued successfully.");
      setProfile(data.profile);
    } catch (error: any) {
      console.error("Referral Approval Error", error);
    }
  };

  const handleApproveProfile = async () => {
    if (!confirm("Are you sure you want to approve and verify this profile?"))
      return;
    try {
      await api.put(`/ccsi/profile/${params.id}/status`, {
        status: "VERIFIED",
      });
      alert("Profile verified successfully.");
      setProfile((prev: any) => ({ ...prev, status: "VERIFIED" }));
    } catch (error: any) {
      console.error("Profile Approval Error", error);
      alert(error.response?.data?.message || "Failed to approve profile.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 animate-fadeIn">
      <div className="flex justify-between items-center mb-8 print:hidden flex-wrap gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors font-bold"
        >
          <FaArrowLeft /> Back
        </button>
        <div className="flex flex-wrap gap-3">
          {profile.status === "PENDING_JURISDICTION" && (
            <button
              onClick={handleApproveJurisdiction}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark flex items-center gap-2 font-bold shadow"
            >
              <FaCheckCircle /> Approve Jurisdiction
            </button>
          )}
          {profile.referralStatus !== "activated" &&
            (profile.referralStatus === "pending_activation" ||
              profile.status === "PENDING_ACTIVATION") && (
              <button
                onClick={handleApproveReferral}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark flex items-center gap-2 font-bold shadow"
              >
                <FaKey /> Approve Referral
              </button>
            )}
          {profile.status !== "VERIFIED" && (
            <button
              onClick={handleApproveProfile}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark flex items-center gap-2 font-bold shadow"
            >
              <FaCheckCircle /> Approve Profile
            </button>
          )}
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center gap-2 font-bold"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 font-bold"
          >
            <FaTrash /> Delete
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <FaPrint /> Print
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Main Content */}
        <div className="flex-1 w-full">
          {/* Header */}
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold
                                ${
                                  profile.status === "VERIFIED"
                                    ? "bg-green-100 text-green-700"
                                    : profile.referralStatus === "activated"
                                      ? "bg-purple-100 text-purple-700"
                                      : profile.status === "SUBMITTED"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
              >
                {profile.referralStatus === "activated"
                  ? "Referral Approved"
                  : profile.referralStatus === "pending_activation" ||
                      profile.status === "PENDING_ACTIVATION"
                    ? "Referral Requested"
                    : profile.status}
              </span>
            </div>
            <h1 className="text-3xl font-bold font-playfair text-gray-900">
              {profile.fullName}
            </h1>
            <p className="text-gray-500 mt-2">
              {profile.businessName || "Individual Artisan"}
            </p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field label="Tracking Code" value={profile.applicationCode} />
              <Field label="Contact" value={profile.primaryContact} />
              <Field label="District" value={profile.district} />
              <Field label="Craft" value={profile.primaryCraft} />
              <Field label="Category" value={profile.applicantCategory} />
              {profile.referralCode && (
                <Field label="Referral Code" value={profile.referralCode} />
              )}
            </div>
          </div>

          <Section title="Personal & Location Details" icon={FaUser}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field label="Guardian Name" value={profile.fatherName} />
              <Field label="Gender" value={profile.gender} />
              <Field label="Email" value={profile.email} />
              <Field label="Village" value={profile.village} />
              <Field label="Cluster" value={profile.clusterName} />
            </div>
          </Section>

          <Section title="Craft & Production" icon={FaIndustry}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field label="Secondary Craft" value={profile.secondaryCraft} />
              <Field label="Experience (Yrs)" value={profile.yearsExperience} />
              <Field
                label="Family Lineage"
                value={profile.familyLineage ? "Yes" : "No"}
              />
              <Field label="GI Check" value={profile.giAssociation} />
              <Field label="Monthly Capacity" value={profile.monthlyCapacity} />
              <Field label="Num. Workers" value={profile.numberOfWorkers} />
              <Field label="Raw Materials" value={profile.rawMaterials} />
              <Field label="Tools Used" value={profile.toolsUsed} />
              <Field label="Workshop Address" value={profile.workshopAddress} />
              <Field
                label="Separate Workshop"
                value={profile.workshopSeparate ? "Yes" : "No"}
              />
            </div>
          </Section>

          {profile.isCommerceInterested && (
            <Section title="Digital Commerce Readiness" icon={FaStore}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field
                  label="Selling Outside District"
                  value={profile.sellingOutsideDistrict}
                />
                <Field
                  label="Bank Account"
                  value={profile.bankAccountAvailable}
                />
                <Field label="GST" value={profile.gstAvailable} />
                <Field label="Pricing Records" value={profile.pricingRecords} />
                <Field label="Production Type" value={profile.productionType} />
                <Field
                  label="Stock Availability"
                  value={profile.stockAvailability}
                />
                <Field label="Lead Time" value={profile.leadTime} />
                <Field label="Packaging" value={profile.standardPackaging} />
                <Field
                  label="Courier Capable"
                  value={profile.courierCapability}
                />
                <Field
                  label="Smartphone/Internet"
                  value={profile.digitalTools}
                />
                <Field
                  label="Digital Payments"
                  value={profile.digitalPaymentsReady}
                />
              </div>
            </Section>
          )}

          <Section title="Documents" icon={FaFileAlt}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Add document download links here if URLs are stored */}
              {[
                "docGovId",
                "docArtisanCard",
                "docGiCertificate",
                "docGst",
                "docUdyam",
                "docInstitution",
              ].map(
                (docKey) =>
                  profile[docKey] && (
                    <a
                      key={docKey}
                      href={profile[docKey]}
                      target="_blank"
                      rel="noreferrer"
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                    >
                      <div className="text-2xl text-red-500 mb-2">
                        <FaFileAlt className="mx-auto" />
                      </div>
                      <div className="text-xs font-bold text-gray-600 uppercase">
                        {docKey.replace("doc", "")}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        Click to View
                      </div>
                    </a>
                  ),
              )}
              {!profile.docGovId && !profile.docArtisanCard && (
                <div className="text-gray-400 italic col-span-3">
                  No documents uploaded.
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
