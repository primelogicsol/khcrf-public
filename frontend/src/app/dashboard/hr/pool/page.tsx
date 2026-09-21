"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { useRouter } from "next/navigation";
import { FaUsers, FaEnvelopeOpenText, FaFileAlt } from "react-icons/fa";
import { careerApi } from "@/lib/api";

export default function TalentPoolPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const data = await careerApi.getApplications();
      // Filter: only show applications that are NOT linked to a job (General Talent Pool)
      const pool = data.filter((app: any) => !app.job && !app.jobId);
      setCandidates(pool);
    } catch (error) {
      console.error("Failed to fetch talent pool:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const columns = [
    { header: "Candidate Name", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    {
      header: "Resume",
      accessor: "resumeUrl",
      render: (url: string) =>
        url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-icon-on-light hover:text-brand-secondary underline text-sm font-semibold"
          >
            <FaFileAlt className="mr-1" /> View PDF
          </a>
        ) : (
          <span className="text-gray-400 text-xs">No Resume</span>
        ),
    },
    {
      header: "Joined",
      accessor: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      header: "Status",
      accessor: "status",
      render: (status: string) => {
        const colors: Record<string, string> = {
          NEW: "bg-blue-100 text-blue-800",
          CONTACTED: "bg-yellow-100 text-yellow-800",
          RESERVED: "bg-purple-100 text-purple-800",
          INTERVIEWING: "bg-green-100 text-green-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-800"}`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const handleView = (item: any) => {
    // router.push(`/dashboard/hr/pool/${item.id}`);
    if (item.id) router.push(`/dashboard/hr/pool/${item.id}`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUsers data-ui-icon  className="" /> Talent Pool
        </h1>
        <div className="flex gap-2">
          <button
            onClick={fetchCandidates}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
          {/* <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/20">
                        <FaEnvelopeOpenText /> Email Campaign
                    </button> */}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Total Candidates
          </p>
          <p className="text-2xl font-black text-gray-900 mt-1">
            {candidates.length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            New This Week
          </p>
          {/* Placeholder for weekly stats calculation */}
          <p className="text-2xl font-black text-brand-primary mt-1">-</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={candidates}
        actions={true}
        onView={handleView}
        loading={loading}
        emptyMessage="No candidates in the talent pool."
      />
    </div>
  );
}
