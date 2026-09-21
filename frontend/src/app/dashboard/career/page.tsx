"use client";

import React, { useState, useEffect } from "react";
import DataTable from "@/components/dashboard/DataTable";
import JobEditor from "@/components/career/JobEditor";
import Modal from "@/components/common/Modal";
import { careerApi } from "@/lib/api";
import { normalizeArray } from "@/lib/normalize";
import {
  FaPlus,
  FaBriefcase,
  FaUsers,
  FaTrash,
  FaEdit,
  FaEye,
} from "react-icons/fa";

export default function CareerPage() {
  const [activeTab, setActiveTab] = useState<"jobs" | "applications">("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
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

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await careerApi.getApplications();
      setApplications(normalizeArray(data, ["applications", "items", "results", "data"]));
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "jobs") fetchJobs();
    else fetchApplications();
  }, [activeTab]);

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

  // Columns for Applications Table
  const appColumns = [
    { header: "Applicant Name", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    {
      header: "Position",
      accessor: "job",
      render: (job: any) => job?.title || "General Talent Pool",
    },
    {
      header: "Date",
      accessor: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      header: "Status",
      accessor: "status",
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            status === "HIRED"
              ? "bg-green-100 text-green-800"
              : status === "REJECTED"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
          }`}
        >
          {status}
        </span>
      ),
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
            className="text-brand-primary hover:underline"
          >
            View Resume
          </a>
        ) : (
          "N/A"
        ),
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Career Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage job postings and view applications
          </p>
        </div>
        {activeTab === "jobs" && (
          <button
            onClick={handleCreateJob}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-secondary transition-colors flex items-center gap-2"
          >
            <FaPlus /> Post New Job
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "jobs"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaBriefcase /> Job Postings
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "applications"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaUsers /> Applications / Talent Pool
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {activeTab === "jobs" ? (
          <DataTable
            columns={jobColumns}
            data={jobs}
            actions={true}
            loading={loading}
            onEdit={handleEditJob}
            onDelete={(row) => handleDeleteJob(row.id)}
            onView={() => {}} // Add view functionality if needed
            emptyMessage="No job postings found. Create one to get started."
          />
        ) : (
          <DataTable
            columns={appColumns}
            data={applications}
            actions={false} // Maybe add view details later
            loading={loading}
            emptyMessage="No applications received yet."
          />
        )}
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
