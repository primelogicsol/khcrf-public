"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardControls from "@/components/dashboard/DashboardControls";
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaCalendarAlt,
  FaSearch,
  FaDownload, // Added for CSV Export
} from "react-icons/fa";
import { exportToCsv } from "@/utils/exportCsv";
import { normalizeArray } from "@/lib/normalize";

interface Member {
  id: string;
  userId: string;
  fullName: string;
  membershipType: string;
  status: string;
  createdAt: string;
  dob: string;
  gender: string;
  nationality: string;
  phone: string;
  email?: string; // Sometimes flattened from user
  country: string;
  state: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  user: {
    email: string;
    name: string;
  };
}

export default function MembershipManagementClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    let result = members;

    if (statusFilter !== "ALL") {
      result = result.filter((m) => m.status === statusFilter);
    }
    if (typeFilter !== "ALL") {
      result = result.filter((m) => m.membershipType === typeFilter);
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.fullName.toLowerCase().includes(lowerTerm) ||
          m.user.email.toLowerCase().includes(lowerTerm) ||
          m.membershipType.toLowerCase().includes(lowerTerm),
      );
    }

    setFilteredMembers(result);
  }, [members, searchTerm, statusFilter, typeFilter]);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get("/membership");
      setMembers(normalizeArray(data, ["members", "items", "results", "data"]));
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    if (
      !confirm(`Are you sure you want to mark this application as ${status}?`)
    )
      return;

    setUpdatingId(id);
    try {
      const payload: any = { status };
      if (status === 'APPROVED') {
        payload.applicationStatus = 'APPROVED';
        payload.membershipStatus = 'ACTIVE';
        payload.permissions = ['MAGAZINE_ACCESS'];
      } else if (status === 'REJECTED') {
        payload.applicationStatus = 'REJECTED';
        payload.membershipStatus = 'INACTIVE';
        payload.permissions = [];
      }
      
      await api.put(`/membership/${id}/status`, payload);
      // Update local state
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status, ...payload } : m)),
      );
      if (selectedMember && selectedMember.id === id) {
        setSelectedMember((prev) => (prev ? { ...prev, status, ...payload } : null));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <DashboardControls
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        filters={[
          {
            key: "status",
            value: statusFilter,
            options: [
              { value: "ALL", label: "All Status" },
              { value: "PENDING", label: "Pending" },
              { value: "APPROVED", label: "Approved" },
              { value: "REJECTED", label: "Rejected" },
            ],
            onChange: setStatusFilter,
          },
          {
            key: "type",
            value: typeFilter,
            options: [
              { value: "ALL", label: "All Types" },
              { value: "INDIVIDUAL", label: "Individual" },
              { value: "INSTITUTIONAL", label: "Institutional" },
              { value: "CORPORATE", label: "Corporate" },
              { value: "STUDENT", label: "Student" },
            ],
            onChange: setTypeFilter,
          },
        ]}
        placeholder="Search by name, email or type..."
      />
      <div className="flex justify-end mb-4">
        <button
          onClick={() =>
            exportToCsv("membership_applications", filteredMembers)
          }
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-brand-primary transition-all shadow-sm"
          title="Export to CSV"
        >
          <FaDownload /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Applied On
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No memberships found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900">
                          {member.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {member.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary">
                        {member.membershipType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider
                                            ${
                                              member.status === "APPROVED"
                                                ? "bg-green-100 text-green-700"
                                                : member.status === "PENDING"
                                                  ? "bg-yellow-100 text-yellow-700"
                                                  : "bg-red-100 text-red-700"
                                            }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(() => {
                        const dateValue = member.appliedAt ?? member.submittedAt ?? member.createdAt;
                        return dateValue && !Number.isNaN(Date.parse(dateValue))
                          ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateValue))
                          : "—";
                      })()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors"
                          title="View Details"
                        >
                          <FaEye className="text-xs" />
                        </button>

                        {member.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                updateStatus(member.id, "APPROVED")
                              }
                              disabled={updatingId === member.id}
                              className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
                              title="Approve"
                            >
                              <FaCheck className="text-xs" />
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(member.id, "REJECTED")
                              }
                              disabled={updatingId === member.id}
                              className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                              title="Reject"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Details Modal */}
        {selectedMember && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-1">
                      Application Details
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Review member submission information
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaTimes className="text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Basic Info */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FaIdCard /> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                          Full Name
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedMember.fullName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                          Date of Birth
                        </p>
                        <p className="font-semibold text-gray-900">
                          {new Date(selectedMember.dob).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                          Gender
                        </p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {selectedMember.gender}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                          Nationality
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedMember.nationality}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                          Email
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedMember.email || selectedMember.user.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                          Phone
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedMember.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FaMapMarkerAlt /> Address
                    </h3>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-800">
                        {selectedMember.streetAddress}
                      </p>
                      <p className="text-gray-600">
                        {selectedMember.city}, {selectedMember.state} -{" "}
                        {selectedMember.postalCode}
                      </p>
                      <p className="text-gray-600 font-bold">
                        {selectedMember.country}
                      </p>
                    </div>
                  </div>

                  {/* Membership & Payment */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FaGlobe /> Membership & Payment
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                          Plan Applied
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-primary/10 text-brand-primary uppercase">
                          {selectedMember.membershipType}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                          Payment Method
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedMember.paymentMethod}
                        </p>
                      </div>
                      {selectedMember.razorpayPaymentId && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                            Transaction ID (Razorpay)
                          </p>
                          <p className="font-mono text-sm bg-white p-2 rounded border border-gray-200">
                            {selectedMember.razorpayPaymentId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                {selectedMember.status === "PENDING" ? (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(selectedMember.id, "REJECTED")
                      }
                      disabled={updatingId === selectedMember.id}
                      className="px-6 py-3 rounded-xl font-bold text-red-600 bg-white border border-red-100 hover:bg-red-50 transition-colors"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() =>
                        updateStatus(selectedMember.id, "APPROVED")
                      }
                      disabled={updatingId === selectedMember.id}
                      className="px-6 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 transition-colors"
                    >
                      Approve & Activate
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
