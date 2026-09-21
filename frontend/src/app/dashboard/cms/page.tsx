"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dashboard/DataTable";
import api from "@/lib/api";
import { FaSpinner, FaExclamationCircle } from "react-icons/fa";

const columns = [
    { header: "Title", accessor: "title" },
    { header: "Category", accessor: "category" },
    { header: "Author", accessor: "author" },
    {
        header: "Status",
        accessor: "status",
        render: (value: string) => {
            const colors: Record<string, string> = {
                Published: "bg-green-100 text-green-800",
                PUBLISHED: "bg-green-100 text-green-800",
                Draft: "bg-gray-100 text-gray-800",
                DRAFT: "bg-gray-100 text-gray-800",
                Scheduled: "bg-blue-100 text-blue-800",
                SCHEDULED: "bg-blue-100 text-blue-800",
            };
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[value] || "bg-gray-100 text-gray-800"}`}>
                    {value}
                </span>
            );
        }
    },
    { header: "Date", accessor: "date" },
];

export default function CMSPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/cms/posts")
            .then((res) => {
                const data = res.data?.data ?? res.data;
                setPosts(Array.isArray(data) ? data : []);
            })
            .catch((err: any) => setError(err.response?.data?.message || "Unable to load CMS content."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-48">
            <FaSpinner data-ui-icon  className="animate-spin  text-3xl" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-48 space-y-3">
            <FaExclamationCircle className="text-red-400 text-2xl" />
            <p className="text-gray-500 font-medium text-sm">{error}</p>
        </div>
    );

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
                <button className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-secondary transition-colors">
                    Create Post
                </button>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-sm font-medium">
                    No content records found.
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={posts}
                    actions={true}
                    onView={(row) => console.log("View post", row)}
                    onEdit={(row) => console.log("Edit post", row)}
                    onDelete={(row) => console.log("Delete post", row)}
                />
            )}
        </div>
    );
}
