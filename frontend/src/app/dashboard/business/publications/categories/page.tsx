"use client";

import CategoryManagement from "@/components/dashboard/publications/CategoryManagement";
import Link from "next/link";
import { FaArrowLeft, FaLayerGroup } from "react-icons/fa";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-stone-50/40">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link
            href="/dashboard/business/publications"
            className="p-2 text-gray-500 hover:bg-stone-100 rounded-xl transition-colors"
          >
            <FaArrowLeft size={14} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <FaLayerGroup className="text-white text-sm" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900">Knowledge Domain Taxonomy</h1>
              <p className="text-[10px] text-gray-400">
                15-domain classification system powering KHCRF's public filters, SEO pages, and knowledge graph
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <CategoryManagement />
      </div>
    </div>
  );
}
