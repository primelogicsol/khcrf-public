"use client";

import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaUserShield,
  FaDownload,
  FaTimes,
  FaSpinner,
  FaCheck,
  FaBuilding,
} from "react-icons/fa";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import ImageUpload from "@/components/common/ImageUpload";
import { useToast } from "@/context/ToastContext";

interface Listing {
  id: string;
  createdAt: string;
  status: string;
  adminCertificateUrl?: string;
  businessProfile?: {
    businessName: string;
    address?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
  user?: {
    name: string;
    email: string;
  };
  type: string;
  // Add other fields as necessary
}

export default function CertificationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params?.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/listing/${id}`);
        setListing(response.data);
        if (response.data.adminCertificateUrl) {
          setCertificateUrl(response.data.adminCertificateUrl);
        }
      } catch (err) {
        console.error("Error fetching listing details:", err);
        showToast("Failed to load listing details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, showToast]);

  const handleStatusUpdate = async (status: string) => {
    if (
      !confirm(`Are you sure you want to mark this certification as ${status}?`)
    )
      return;

    setUpdating(true);
    try {
      const response = await api.put(`/listing/${id}/status`, {
        status,
        adminCertificateUrl: certificateUrl,
      });
      setListing(response.data.listing);
      showToast(`Certification marked as ${status}`, "success");
      router.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast("Failed to update status", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-8 text-center text-gray-500">
        Certification Order not found
      </div>
    );
  }

  const businessName =
    listing.businessProfile?.businessName ||
    listing.user?.name ||
    "Unknown Business";
  const contactEmail =
    listing.businessProfile?.contactEmail || listing.user?.email || "N/A";

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/business/certifications"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">
            Order Details{" "}
            <span className="text-gray-500 font-normal">
              #{listing.id.substring(0, 8)}
            </span>
          </h1>
          <p className="text-sm text-gray-600">
            Placed on {new Date(listing.createdAt).toLocaleDateString()} •{" "}
            {listing.status}
          </p>
        </div>
        <div className="flex gap-3">
          {/* Status Badge */}
          <div
            className={`px-4 py-2 rounded-lg text-sm font-bold ${
              listing.status === "APPROVED"
                ? "bg-green-100 text-green-700"
                : listing.status === "REJECTED"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {listing.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Admin Actions Application */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Admin Review
            </h3>

            {listing.status === "PENDING" && (
              <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <ImageUpload
                  label="Upload Compliance Certificate (Required for Approval)"
                  value={certificateUrl}
                  onChange={setCertificateUrl}
                />
              </div>
            )}

            {listing.status === "APPROVED" && listing.adminCertificateUrl && (
              <div className="mb-6 bg-green-50 p-4 rounded-xl border border-green-200">
                <p className="text-green-800 font-bold mb-2">
                  Certificate Issued
                </p>
                <a
                  href={listing.adminCertificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-primary underline break-all"
                >
                  {listing.adminCertificateUrl}
                </a>
              </div>
            )}

            <div className="flex gap-4">
              {listing.status === "PENDING" && (
                <>
                  <button
                    onClick={() => handleStatusUpdate("APPROVED")}
                    disabled={updating || !certificateUrl}
                    className={`flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-colors font-bold disabled:opacity-50 ${certificateUrl ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                  >
                    <FaCheck /> Approve & Issue Certificate
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("REJECTED")}
                    disabled={updating}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-bold disabled:opacity-50"
                  >
                    <FaTimes /> Reject
                  </button>
                </>
              )}
              {listing.status !== "PENDING" && (
                <button
                  onClick={() => handleStatusUpdate("PENDING")}
                  disabled={updating}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-bold disabled:opacity-50"
                >
                  Reopen Review
                </button>
              )}
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Business Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">
                  Business Name
                </p>
                <p className="font-semibold text-gray-900">{businessName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">
                  Contact Email
                </p>
                <p className="font-semibold text-gray-900">{contactEmail}</p>
              </div>
              {listing.businessProfile?.contactPhone && (
                <div>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <p className="font-semibold text-gray-900">
                    {listing.businessProfile.contactPhone}
                  </p>
                </div>
              )}
              {listing.businessProfile?.address && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">
                    Address
                  </p>
                  <p className="font-semibold text-gray-900">
                    {listing.businessProfile.address}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Payment & Summary (Static for now as Listing model might differ) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-black mb-4">
              Certification Type
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-brand-primary text-white rounded-lg">
                <FaUserShield className="text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {listing.type || "Standard Certification"}
                </p>
                <p className="text-xs text-gray-500">
                  Verified by Hamadan Craft Revival Foundation - Kashmir
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
