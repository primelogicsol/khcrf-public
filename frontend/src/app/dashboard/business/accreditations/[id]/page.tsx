"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import AccreditationDetailsView from "@/components/accreditation/AccreditationDetailsView";
import ImageUpload from "@/components/common/ImageUpload";
import { FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";

export default function AccreditationAdminDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params?.id as string;
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/accreditation/${id}`);
        setApplication(response.data);
      } catch (err) {
        console.error("Error fetching accreditation details:", err);
        showToast("Failed to load application details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, showToast]);

  const handleStatusUpdate = async (status: string) => {
    if (
      !confirm(`Are you sure you want to mark this application as ${status}?`)
    )
      return;

    setUpdating(true);
    try {
      const response = await api.put(`/accreditation/${id}/status`, {
        status,
        adminCertificateUrl: certificateUrl,
      });
      setApplication(response.data.application); // Assuming backend returns { message, application }
      showToast(`Application marked as ${status}`, "success");
      router.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast("Failed to update status", "error");
    } finally {
      setUpdating(false);
      setCertificateUrl(""); // Reset
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-8 text-center text-gray-500">Application not found</div>
    );
  }

  const adminActions = (
    <div className="flex flex-col gap-4">
      {application.status === "PENDING" && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <ImageUpload
            label="Upload Certificate (Required for Approval)"
            value={certificateUrl}
            onChange={setCertificateUrl}
          />
        </div>
      )}

      <div className="flex gap-2">
        {application.status === "PENDING" && (
          <>
            <button
              onClick={() => handleStatusUpdate("APPROVED")}
              disabled={updating}
              className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors shadow-sm font-bold text-sm disabled:opacity-50 ${certificateUrl ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
            >
              <FaCheck /> Approve
            </button>
            <button
              onClick={() => handleStatusUpdate("REJECTED")}
              disabled={updating}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm font-bold text-sm disabled:opacity-50"
            >
              <FaTimes /> Reject
            </button>
          </>
        )}
        {application.status !== "PENDING" && (
          <button
            onClick={() => handleStatusUpdate("PENDING")}
            disabled={updating}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-bold disabled:opacity-50"
          >
            Reopen Review
          </button>
        )}
      </div>
    </div>
  );

  return (
    <AccreditationDetailsView
      application={application}
      backLink="/dashboard/business/accreditations"
      title="Admin Review: Accreditation"
      adminActions={adminActions}
    />
  );
}

// Mock Data for the specific accreditation
