"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";
import { careerApi } from "@/lib/api";
import { Job } from "@/types/career";

export default function OpenPositions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await careerApi.getJobs();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs
  const openJobs = jobs.filter(
    (job) => job.status === "OPEN" || job.status === "Open",
  );

  const filteredOpenJobs = openJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      departmentFilter === "All" || job.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const categories = [
    "All",
    ...Array.from(new Set(openJobs.map((j) => j.department))),
  ];

  if (loading) {
    return (
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading open positions...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="open-positions" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-10">
        <div className="text-center mb-12">
          <span className="text-brand-primary font-bold uppercase tracking-widest text-xs bg-brand-primary/5 py-1 px-3 rounded-full">
            Current Opportunities
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-3">
            Open Positions
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Explore opportunities to make a real impact in heritage preservation
            and social innovation
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-12 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative grow w-full">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title or keyword..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto relative">
            <select
              className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent font-medium text-gray-700 cursor-pointer"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Departments" : cat}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filteredOpenJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-primary/20 transition-all duration-300 group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-green-50 text-green-600 text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded border border-green-100 flex items-center gap-1">
                      <FaCheckCircle className="text-[10px]" /> Open Now
                    </span>
                    <span className="text-gray-400 text-xs font-mono font-medium bg-gray-50 px-2 py-1 rounded">
                      {job.jobCode}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-brand-secondary font-medium text-sm mt-1">
                    {job.department}
                  </p>
                </div>
                <div data-ui-icon className="w-12 h-12 bg-brand-primary/5 rounded-xl flex items-center justify-center  text-xl group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                  <FaBriefcase />
                </div>
              </div>

              <div className="space-y-3 mb-8 w-full">
                <div className="flex items-center text-gray-500 text-sm">
                  <FaMapMarkerAlt className="w-4 h-4 mr-2 opacity-70" />{" "}
                  {job.location}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <FaClock className="w-4 h-4 mr-2 opacity-70" /> {job.type}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <span className="font-bold text-gray-700 mr-1">$</span>{" "}
                  {job.salaryRange || "Competitive"}
                </div>
              </div>
              <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                {/* <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <FaUsers /> {job.applicantsCount} applicants
                                </span> */}
                <Link
                  href={`/about/career/${job.slug}`}
                  className="flex items-center gap-2 text-sm font-bold text-icon-on-light hover:text-brand-secondary transition-colors"
                >
                  View & Apply <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredOpenJobs.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
              <FaSearch />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              No open positions found
            </h3>
            <p className="text-gray-500">
              Check back later or join our talent pool.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setDepartmentFilter("All");
              }}
              className="mt-4 text-brand-primary font-bold hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
