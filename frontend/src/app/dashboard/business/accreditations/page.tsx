"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import DashboardControls from "@/components/dashboard/DashboardControls";
import { useRouter } from "next/navigation";
import { FaCertificate, FaSpinner } from "react-icons/fa";
import api from "@/lib/api";

interface Accreditation {
  id: string;
  businessName: string;
  contactPerson: string;
  // type: string; // Not in current schema, we have badges
  status: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function AccreditationsPage() {
  const [data, setData] = useState<Accreditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<Accreditation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/accreditation/all");
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Failed to fetch accreditations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
          item.businessName.toLowerCase().includes(lower) ||
          item.contactPerson.toLowerCase().includes(lower) ||
          (item.user?.email || "").toLowerCase().includes(lower),
      );
    }
    setFilteredData(result);
  }, [data, searchTerm, statusFilter]);

  const columns = [
    { header: "Business Name", accessor: "businessName" },
    { header: "Contact Person", accessor: "contactPerson" },
    {
      header: "Applicant",
      accessor: "user",
      render: (user: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{user?.name || "N/A"}</span>
          <span className="text-xs text-gray-500">{user?.email}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (value: string) => {
        const colors: Record<string, string> = {
          PENDING: "bg-yellow-100 text-yellow-800",
          APPROVED: "bg-green-100 text-green-800",
          REJECTED: "bg-red-100 text-red-800",
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
      header: "Date",
      accessor: "createdAt",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleView = (item: Accreditation) => {
    router.push(`/dashboard/business/accreditations/${item.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaCertificate data-ui-icon  className="" /> Accreditation
          Requests
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Total Applications
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
            {data.filter((a) => a.status === "PENDING").length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Approved
          </p>
          <p className="text-2xl font-black text-green-600 mt-1">
            {data.filter((a) => a.status === "APPROVED").length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Rejected
          </p>
          <p className="text-2xl font-black text-red-600 mt-1">
            {data.filter((a) => a.status === "REJECTED").length}
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
              { value: "APPROVED", label: "Approved" },
              { value: "REJECTED", label: "Rejected" },
            ],
            onChange: setStatusFilter,
          },
        ]}
        placeholder="Search business, contact, or email..."
      />

      <DataTable
        columns={columns}
        data={filteredData}
        actions={true}
        onView={handleView}
      />
    </div>
  );
}
