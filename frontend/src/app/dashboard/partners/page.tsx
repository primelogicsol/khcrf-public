"use client";

import { useState, useEffect } from "react";
import { partnerApi } from "@/lib/api";
import DataTable from "@/components/dashboard/DataTable";
import DashboardControls from "@/components/dashboard/DashboardControls";
import { normalizeArray } from "@/lib/normalize";

interface PartnerApp {
  id: string;
  orgName: string;
  contactName: string;
  email: string;
  status: string;
  createdAt: string;
}

export default function PartnersDashboard() {
  const [applications, setApplications] = useState<PartnerApp[]>([]);
  const [filteredApps, setFilteredApps] = useState<PartnerApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    let result = applications;
    if (statusFilter !== "ALL") {
      result = result.filter((app) => app.status === statusFilter);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.orgName.toLowerCase().includes(lower) ||
          app.contactName.toLowerCase().includes(lower) ||
          app.email.toLowerCase().includes(lower),
      );
    }
    setFilteredApps(result);
  }, [applications, searchTerm, statusFilter]);

  const loadApplications = async () => {
    try {
      const data = await partnerApi.getAll();
      setApplications(normalizeArray(data, ["applications", "items", "results", "data"]));
      setFilteredApps(normalizeArray(data, ["filteredapps", "items", "results", "data"]));
    } catch (error) {
      console.error("Failed to load partner applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Organization",
      accessor: "orgName",
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      header: "Contact Person",
      accessor: "contactName",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Status",
      accessor: "status",
      render: (status: string) => {
        let colorClass = "bg-gray-100 text-gray-800";
        if (status === "ACTIVE" || status === "APPROVED")
          colorClass = "bg-green-100 text-green-800";
        if (status === "PENDING") colorClass = "bg-yellow-100 text-yellow-800";
        if (status === "REJECTED") colorClass = "bg-red-100 text-red-800";

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold ${colorClass}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: "Applied Date",
      accessor: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Partner Applications
        </h1>
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
              { value: "APPROVED", label: "Approved" },
              { value: "REJECTED", label: "Rejected" },
              { value: "ACTIVE", label: "Active" },
            ],
            onChange: setStatusFilter,
          },
        ]}
        placeholder="Search partners..."
        primaryAction={{
          label: "Create Partner",
          onClick: () => (window.location.href = "/dashboard/partners/create"),
        }}
      />

      {loading ? (
        <div className="text-center py-10">Loading applications...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            data={filteredApps}
            columns={columns}
            onView={(row: PartnerApp) =>
              (window.location.href = `/dashboard/partners/${row.id}`)
            }
            actions={true}
          />
        </div>
      )}
    </div>
  );
}
