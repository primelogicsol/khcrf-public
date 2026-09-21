"use client";
import React, { useState } from "react";
import { FaArrowLeft, FaPlus, FaBook } from "react-icons/fa";
import Link from "next/link";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AddManualPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "", designation: "", institution: "", officialEmail: "",
    country: "", contributorCategory: "Sector Leaders and Experts",
    title: "", fullBody: "", excerpt: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Need a category to link to
      const catRes = await api.get('/api/skc/admin/official-messages/categories');
      const cats = catRes.data?.data || [];
      const cat = cats.find((c: any) => c.title === formData.contributorCategory) || cats[0];
      
      if (!cat) {
        alert("No categories found in system!");
        setLoading(false);
        return;
      }

      const res = await api.post('/api/skc/admin/official-messages/messages', {
        ...formData,
        categoryId: cat.id,
        workflowStatus: "SUBMITTED",
        identityStatus: "APPROVED", // Manual adds are often pre-approved
        authorityStatus: "VERIFIED"
      });
      if (res.data?.success) {
        alert("Manual message added to Review Queue!");
        router.push("/dashboard/skc/official-messages");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add manual message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link href="/dashboard/skc/official-messages" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary mb-6">
        <FaArrowLeft /> Back to Official Messages
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-black text-brand-dark flex items-center gap-3 mb-2">
          <FaBook data-ui-icon  className="" /> Add Manual Record
        </h1>
        <p className="text-sm text-gray-500 mb-8">Insert a physical letter, archival statement, or manually received message into the system.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold mb-1">Full Name</label>
              <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Designation</label>
              <input required type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Institution</label>
              <input required type="text" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Email</label>
              <input required type="email" value={formData.officialEmail} onChange={e => setFormData({...formData, officialEmail: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Country</label>
              <input required type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Category</label>
              <select value={formData.contributorCategory} onChange={e => setFormData({...formData, contributorCategory: e.target.value})} className="w-full border rounded-lg px-4 py-2">
                <option value="Foundation and Assessment Leadership">Foundation and Assessment Leadership</option>
                <option value="Government and Public Institutions">Government and Public Institutions</option>
                <option value="Academic, Cultural and Development Institutions">Academic, Cultural and Development Institutions</option>
                <option value="Sector Leaders and Experts">Sector Leaders and Experts</option>
                <option value="Political and Public Policy Perspectives">Political and Public Policy Perspectives</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <label className="block text-sm font-bold mb-1">Message Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-1">Full Message Body</label>
            <textarea required rows={6} value={formData.fullBody} onChange={e => setFormData({...formData, fullBody: e.target.value})} className="w-full border rounded-lg px-4 py-2"></textarea>
          </div>
          
          <div className="pt-6 border-t flex justify-end">
            <button disabled={loading} type="submit" className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl flex items-center gap-2">
              {loading ? "Adding..." : <><FaPlus /> Add to System</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
