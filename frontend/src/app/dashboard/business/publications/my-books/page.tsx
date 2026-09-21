"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaSearch, FaEdit, FaBook, FaSpinner, FaFilter } from "react-icons/fa";
import api from "@/lib/api";

export default function MyBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Safely extract display string from any field (Prisma includes return nested objects)
  const str = (val: any, fallback = "—"): string => {
    if (!val) return fallback;
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    if (typeof val === "object") return val.name || val.label || val.title || val.slug || fallback;
    return fallback;
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await api.get(`/publications/my?${params.toString()}`);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">My Books</h1>
          <p className="text-sm text-stone-500">Manage your submitted publications</p>
        </div>
        <Link
          href="/dashboard/business/publications/add"
          className="bg-brand-primary hover:bg-brand-dark text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
        >
          <FaPlus /> Add New Book
        </Link>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchBooks()}
            placeholder="Search by title..."
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
          <h3 className="text-lg font-bold text-brand-dark mb-2">No books yet</h3>
          <p className="text-sm text-stone-500 mb-6">Start by adding your first publication.</p>
          <Link
            href="/dashboard/business/publications/add"
            className="bg-brand-primary hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2"
          >
            <FaPlus /> Add New Book
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-stone-200/65 rounded-3xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left px-6 py-3 font-bold uppercase tracking-wider text-[10px] text-stone-500">Title</th>
                <th className="text-left px-6 py-3 font-bold uppercase tracking-wider text-[10px] text-stone-500">Category</th>
                <th className="text-left px-6 py-3 font-bold uppercase tracking-wider text-[10px] text-stone-500">Status</th>
                <th className="text-left px-6 py-3 font-bold uppercase tracking-wider text-[10px] text-stone-500">Created</th>
                <th className="text-right px-6 py-3 font-bold uppercase tracking-wider text-[10px] text-stone-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-stone-100 hover:bg-stone-50/50">
                  <td className="px-6 py-4 font-semibold text-brand-dark">{book.title}</td>
                  <td className="px-6 py-4 text-stone-500">{str(book.category, "General")}</td>
                  <td className="px-6 py-4">{statusBadge(str(book.publishedStatus, "DRAFT"))}</td>
                  <td className="px-6 py-4 text-stone-500">{new Date(book.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/business/publications/add?edit=${book.id}`}
                      className="text-icon-on-light hover:text-brand-dark inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
                    >
                      <FaEdit /> Edit
                    </Link>
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
