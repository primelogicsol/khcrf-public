"use client";

import React, { useState, useEffect } from "react";
import DataTable from "@/components/dashboard/DataTable";
import JobEditor from "@/components/career/JobEditor";
import Modal from "@/components/common/Modal";
import { careerApi } from "@/lib/api";
import { FaPlus, FaBriefcase, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { normalizeArray } from "@/lib/normalize";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await careerApi.getJobs();
      setJobs(normalizeArray(data, ["jobs", "items", "results", "data"]));
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = () => {
    setEditingJob(null);
    setIsEditorOpen(true);
  };

  const handleEditJob = (job: any) => {
    setEditingJob(job);
    setIsEditorOpen(true);
  };

  const handleDeleteJob = async (id: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      try {
        await careerApi.deleteJob(id);
        fetchJobs();
      } catch (error) {
        console.error("Failed to delete job:", error);
        alert("Failed to delete job");
      }
    }
  };

  const handleEditorSuccess = () => {
    setIsEditorOpen(false);
    fetchJobs();
  };

  const handleViewJob = (job: any) => {
    router.push(`/dashboard/hr/jobs/${job.id}`); // Or slug if you prefer
  };

  // Columns for Jobs Table
  const jobColumns = [
    { header: "Job Title", accessor: "title" },
    { header: "Department", accessor: "department" },
    { header: "Location", accessor: "location" },
    { header: "Type", accessor: "type" },
    {
      header: "Status",
      accessor: "status",
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            status === "OPEN"
              ? "bg-green-100 text-green-800"
              : status === "CLOSED"
                ? "bg-gray-100 text-gray-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      header: "Posted Date",
      accessor: "postedAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBriefcase data-ui-icon  className="" /> Job Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create, edit, and manage job postings.
          </p>
        </div>

        <button
          onClick={handleCreateJob}
          className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-secondary transition-colors flex items-center gap-2"
        >
          <FaPlus /> Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Total Jobs
          </p>
          <p className="text-2xl font-black text-gray-900 mt-1">
            {jobs.length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Open Positions
          </p>
          <p className="text-2xl font-black text-brand-primary mt-1">
            {jobs.filter((j: any) => j.status === "OPEN").length}
          </p>
        </div>
        {/* Placeholder stats */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Views
          </p>
          <p className="text-2xl font-black text-gray-800 mt-1">-</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Closed
          </p>
          <p className="text-2xl font-black text-gray-500 mt-1">
            {jobs.filter((j: any) => j.status === "CLOSED").length}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <DataTable
          columns={jobColumns}
          data={jobs}
          actions={true}
          loading={loading}
          onEdit={handleEditJob}
          onDelete={(row) => handleDeleteJob(row.id)}
          onView={handleViewJob}
          emptyMessage="No job postings found. Create one to get started."
        />
      </div>

      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingJob ? "Edit Job Posting" : "Create New Job Posting"}
      >
        <JobEditor
          initialData={editingJob}
          onSuccess={handleEditorSuccess}
          onCancel={() => setIsEditorOpen(false)}
        />
      </Modal>
    </div>
  );
}
