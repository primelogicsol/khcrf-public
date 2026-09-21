"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dashboard/DataTable";
import DashboardControls from "@/components/dashboard/DashboardControls";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { FaHandHoldingUsd, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface Grant {
  id: string;
  applicantName: string;
  organizationName?: string;
  grantAmount: string;
  status: string;
  createdAt: string;
  grantTypes: string[] | string;
}

export default function GrantsPage() {
  const [data, setData] = useState<Grant[]>([]);
  const [filteredData, setFilteredData] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const router = useRouter();

  useEffect(() => {
    fetchGrants();
  }, []);

  useEffect(() => {
    let result = data;
    if (statusFilter !== "ALL") {
      result = result.filter((item) => item.status === statusFilter);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.applicantName.toLowerCase().includes(lower) ||
          (item.organizationName || "").toLowerCase().includes(lower) ||
          item.grantAmount.includes(lower),
      );
    }
    setFilteredData(result);
  }, [data, searchTerm, statusFilter]);

  const fetchGrants = async () => {
    try {
      const res = await api.get("/grant/all"); // Admin route
      setData(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.error("Failed to load grants", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "Applicant", accessor: "applicantName" },
    {
      header: "Organization",
      accessor: "organizationName",
      render: (value: string) => value || "N/A",
    },
    { header: "Requested Amount", accessor: "grantAmount" },
    {
      header: "Status",
      accessor: "status",
      render: (value: string) => {
        const colors: Record<string, string> = {
          UNDER_REVIEW: "bg-blue-100 text-blue-800",
          APPROVED: "bg-green-100 text-green-800",
          REJECTED: "bg-red-100 text-red-800",
          PENDING: "bg-yellow-100 text-yellow-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[value] || "bg-gray-100 text-gray-800"}`}
          >
            {value}
          </span>
        );
      },
    },
    {
      header: "Submission Date",
      accessor: "createdAt",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleView = (item: Grant) => {
    router.push(`/dashboard/business/grants/${item.id}`);
  };

  const handleDelete = async (item: Grant) => {
    if (
      confirm(
        `Are you sure you want to delete application from ${item.applicantName}?`,
      )
    ) {
      try {
        await api.delete(`/grant/${item.id}`);
        setData((prev) => prev.filter((g) => g.id !== item.id));
        setFilteredData((prev) => prev.filter((g) => g.id !== item.id));
        toast.success("Grant application deleted successfully");
      } catch (error) {
        console.error("Failed to delete grant", error);
        toast.error("Failed to delete grant application");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner data-ui-icon  className="animate-spin text-3xl " />
      </div>
    );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaHandHoldingUsd data-ui-icon  className="" /> Grant Applications
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {data.length}
          </span>
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Total Requests
          </p>
          <p className="text-2xl font-black text-gray-900 mt-1">
            {data.length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Pending Review
          </p>
          <p className="text-2xl font-black text-brand-primary mt-1">
            {
              data.filter(
                (g) => g.status === "PENDING" || g.status === "UNDER_REVIEW",
              ).length
            }
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Approved Grants
          </p>
          <p className="text-2xl font-black text-green-600 mt-1">
            {data.filter((g) => g.status === "APPROVED").length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Rejected
          </p>
          <p className="text-2xl font-black text-red-600 mt-1">
            {data.filter((g) => g.status === "REJECTED").length}
          </p>
        </div>
      </div>

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
              { value: "UNDER_REVIEW", label: "Under Review" },
              { value: "APPROVED", label: "Approved" },
              { value: "REJECTED", label: "Rejected" },
            ],
            onChange: setStatusFilter,
          },
        ]}
        placeholder="Search applicant or organization..."
      />

      <DataTable
        columns={columns}
        data={filteredData}
        actions={true}
        onView={handleView}
        onDelete={handleDelete}
        // onEdit is removed as editing isn't primary admin action here, usually Status Update provided in Detail View
      />
    </div>
  );
}
