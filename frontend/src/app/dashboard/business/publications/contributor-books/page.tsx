"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaSpinner, FaBook, FaFilter, FaCheck } from "react-icons/fa";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ContributorBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await api.get(`/publications/contributor-books?${params.toString()}`);
      const payload = res.data?.data ?? res.data;
      setBooks(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error(err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, publishedStatus: string) => {
    try {
      await api.put(`/publications/${id}/contributor-status`, { publishedStatus });
      toast.success(`Book status updated to ${publishedStatus}`);
      fetchBooks();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-stone-100 text-stone-700",
      PUBLISHED: "bg-green-100 text-green-800",
      ARCHIVED: "bg-red-100 text-red-800",
    };
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[status] || "bg-stone-100 text-stone-700"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Contributor Books</h1>
        <p className="text-sm text-stone-500">Review and manage books submitted by contributors</p>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchBooks()}
            placeholder="Search by title or contributor..."
            className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-primary"
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <button
          onClick={fetchBooks}
          className="bg-stone-100 hover:bg-stone-200 border border-stone-200 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
        >
          <FaFilter /> Filter
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <FaSpinner data-ui-icon  className="animate-spin text-3xl " />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200/65 rounded-3xl">
          <FaBook className="text-5xl text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-brand-dark mb-2">No contributor books</h3>
          <p className="text-sm text-stone-500">Contributor-submitted books will appear here.</p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200/65 rounded-3xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left px-6 py-3 font-bold uppercase tracking-wider text-[10px] text-stone-500">Title</th>
                <th className="text-left px-6 py-3 font-bold uppercase tracking-wider text-[10px] text-stone-500">Contributor</th>
                <th className="text-left px-6 py-3 font-bold uppercase tracking-wider text-[10px] text-stone-500">Status</th>
                <th className="text-left px-6 py-3 font-bold uppercase tracking-wider text-[10px] text-stone-500">Created</th>
                <th className="text-right px-6 py-3 font-bold uppercase tracking-wider text-[10px] text-stone-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-stone-100 hover:bg-stone-50/50">
                  <td className="px-6 py-4 font-semibold text-brand-dark">{book.title}</td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{book.contributor?.name || "Unknown"}</span>
                    <span className="text-stone-400 text-[10px] block">{book.contributor?.email}</span>
                  </td>
                  <td className="px-6 py-4">{statusBadge(book.publishedStatus)}</td>
                  <td className="px-6 py-4 text-stone-500">{new Date(book.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={book.publishedStatus}
                      onChange={(e) => handleStatusChange(book.id, e.target.value)}
                      className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-brand-primary"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
