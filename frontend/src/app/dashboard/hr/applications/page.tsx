"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { useRouter } from "next/navigation";
import { FaUserTie, FaFileAlt } from "react-icons/fa";
import { careerApi } from "@/lib/api";

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await careerApi.getApplications();
      // Filter: only show applications that are linked to a job (Job Applications)
      // If the API returns 'job' as an object or id, check it.
      // Based on previous code, likely 'job' relation is returned.
      // Let's filter client-side.
      const jobApps = data.filter((app: any) => app.job || app.jobId);
      setApplications(jobApps);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const columns = [
    { header: "Candidate Name", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    {
      header: "Applied For",
      accessor: "job",
      render: (job: any) => job?.title || "N/A",
    },
    {
      header: "Date Applied",
      accessor: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
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
      header: "Status",
      accessor: "status",
      render: (status: string) => {
        const colors: Record<string, string> = {
          NEW: "bg-blue-100 text-blue-800",
          INTERVIEWING: "bg-yellow-100 text-yellow-800",
          REJECTED: "bg-red-100 text-red-800",
          HIRED: "bg-green-100 text-green-800",
          REVIEWING: "bg-purple-100 text-purple-800",
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
    // router.push(`/dashboard/hr/applications/${item.id}`);
    // For now, maybe just show an alert or open a modal if I had one.
    // Or if the [id] page exists, assume I'll fix it later or it's static.
    // I'll leave the push but comment it if the page isn't ready, or just let it try.
    // User has [id] folder, so likely expects a detail page.
    // Ensuring item.id exists.
    if (item.id) router.push(`/dashboard/hr/applications/${item.id}`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserTie data-ui-icon  className="" /> Job Applications
        </h1>
        <div className="flex gap-2">
          <button
            onClick={fetchApplications}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Total Applications
          </p>
          <p className="text-2xl font-black text-gray-900 mt-1">
            {applications.length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Pending Review
          </p>
          <p className="text-2xl font-black text-brand-primary mt-1">
            {applications.filter((a: any) => a.status === "NEW").length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Interviews
          </p>
          <p className="text-2xl font-black text-yellow-600 mt-1">
            {
              applications.filter((a: any) => a.status === "INTERVIEWING")
                .length
            }
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Hired
          </p>
          <p className="text-2xl font-black text-green-600 mt-1">
            {applications.filter((a: any) => a.status === "HIRED").length}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={applications}
        actions={true}
        onView={handleView}
        loading={loading}
        emptyMessage="No job applications found."
      />
    </div>
  );
}
