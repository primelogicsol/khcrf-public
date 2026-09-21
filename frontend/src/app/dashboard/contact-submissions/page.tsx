"use client";
"use strict";

import { useState, useEffect } from "react";
import { contactApi } from "@/lib/api";
import { FaEnvelope, FaSearch, FaFilter, FaTrash, FaCheck } from "react-icons/fa";
import { normalizeArray } from "@/lib/normalize";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface ContactSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const data = await contactApi.getAll();
      setSubmissions(normalizeArray(data, ["submissions", "items", "results", "data"]));
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/contact/${deleteTarget.id}`);
      setSubmissions(prev => prev.filter(s => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      console.error("Failed to delete submission", err);
      toast.error('Failed to delete submission.');
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkAsRead = async (sub: ContactSubmission) => {
    try {
      await api.put(`/contact/${sub.id}`);
      setSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'READ' } : s));
    } catch (err: any) {
      console.error("Failed to mark as read", err);
      toast.error('Failed to mark as read.');
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesFilter = filter === "ALL" || sub.status === filter;
    const matchesSearch =
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaEnvelope data-ui-icon  className="" />
            Contact Submissions
          </h1>
          <p className="text-gray-500">
            Manage incoming messages from the contact form
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FaFilter className="text-gray-400" />
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:bg-gray-50 bg-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="READ">Read</option>
            <option value="REPLIED">Replied</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading submissions...
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No submissions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Subject
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Message
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubmissions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {sub.firstName} {sub.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{sub.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {sub.subject}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">
                      {sub.message}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          sub.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : sub.status === "READ"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {sub.status === "PENDING" && (
                          <button
                            onClick={() => handleMarkAsRead(sub)}
                            className="p-2 text-green-600 hover:text-white transition bg-white border border-green-200 rounded-lg hover:bg-green-500"
                            title="Mark as Read"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="text-brand-primary hover:text-brand-dark font-medium text-sm transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setDeleteTarget(sub)}
                          className="p-2 text-red-500 hover:text-white transition bg-white border border-red-200 rounded-lg hover:bg-red-500"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="text-xl font-black text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the submission from <span className="font-bold">{deleteTarget.firstName} {deleteTarget.lastName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Message Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative">
            <button 
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <h2 className="text-2xl font-black text-brand-dark mb-6 pr-8">
              {selectedSubmission.subject}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">From</p>
                <p className="text-sm font-medium text-gray-900">{selectedSubmission.firstName} {selectedSubmission.lastName}</p>
                <p className="text-sm text-brand-primary">{selectedSubmission.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm text-gray-600">{new Date(selectedSubmission.createdAt).toLocaleString()}</p>
                <p className="text-xs mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    selectedSubmission.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
                    selectedSubmission.status === "READ" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                  }`}>
                    {selectedSubmission.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[150px] mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Message Content</p>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed font-medium bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                {selectedSubmission.message}
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button 
                onClick={() => setSelectedSubmission(null)} 
                className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-brand-primary transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
