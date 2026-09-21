"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { FaPlus, FaSearch, FaBook, FaTrash, FaEdit } from "react-icons/fa";
import Image from "next/image";
import { toast } from "react-hot-toast";

import { useAuth } from "@/context/AuthContext";

/**
 * @deprecated This route has been superseded by the KPS Publications Hub.
 * Redirecting immediately to /dashboard/business/publications
 */
export default function MyPublicationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  useEffect(() => {
    router.replace("/dashboard/business/publications");
  }, [router]);

  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchMyPublications = async () => {
    if (!user) return;
    try {
      // Filter by author name to show only their books
      const res = await api.get("/publications", {
        params: { author: user.name },
      });
      setPublications(res.data);
    } catch (error) {
      console.error("Failed to fetch publications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyPublications();
    }
  }, [user]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this publication?")) return;

    try {
      await api.delete(`/publications/${id}`);
      toast.success("Publication deleted");
      setPublications((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      toast.error("Failed to delete publication");
    }
  };

  const filteredPubs = publications.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Publications</h1>
          <p className="text-gray-500 text-sm">
            Manage the books and guides you have published.
          </p>
        </div>
        <Link
          href="/profile/publications/add"
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/25"
        >
          <FaPlus /> New Publication
        </Link>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPubs.map((pub) => (
            <div
              key={pub.id}
              className="bg-white p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-all shadow-sm hover:shadow-md flex flex-col md:flex-row gap-4"
            >
              <div className="w-full md:w-24 h-32 md:h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                {pub.imagePath ? (
                  <Image
                    src={`/assets/publications/${pub.imagePath}`}
                    alt={pub.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <FaBook size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {pub.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${pub.type === "WRITTEN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      {pub.type || "PDF"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{pub.published}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {pub.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-brand-primary">
                    ₹{pub.price}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleDelete(pub.id, e)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    <Link
                      href={`/profile/publications/add?edit=${pub.id}`}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredPubs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <FaBook size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500">
                You haven't published any books yet.
              </p>
              <Link
                href="/profile/publications/add"
                className="text-brand-primary hover:underline mt-2 inline-block"
              >
                Start your first book
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
