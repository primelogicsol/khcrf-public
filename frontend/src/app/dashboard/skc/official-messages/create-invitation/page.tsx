"use client";
import React, { useState } from "react";
import { FaArrowLeft, FaPaperPlane, FaUserTie } from "react-icons/fa";
import Link from "next/link";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateInvitationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "", designation: "", institution: "", officialEmail: "",
    country: "", contributorCategory: "Sector Leaders and Experts"
  });
  const [loading, setLoading] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/skc/admin/official-messages/invitations', {
        ...formData,
        status: "SENT",
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
      if (res.data?.success) {
        setCreatedToken(res.data.data.rawToken);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link href="/dashboard/skc/official-messages" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary mb-6">
        <FaArrowLeft /> Back to Official Messages
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-black text-brand-dark flex items-center gap-3 mb-2">
          <FaUserTie data-ui-icon  className="" /> Create Invitation
        </h1>
        <p className="text-sm text-gray-500 mb-8">Generate a unique submission token for a dignitary or institutional representative.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
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
              <label className="block text-sm font-bold mb-1">Official Email</label>
              <input required type="email" value={formData.officialEmail} onChange={e => setFormData({...formData, officialEmail: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Country</label>
              <input required type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Contributor Category</label>
              <select value={formData.contributorCategory} onChange={e => setFormData({...formData, contributorCategory: e.target.value})} className="w-full border rounded-lg px-4 py-2">
                <option value="Foundation and Assessment Leadership">Foundation and Assessment Leadership</option>
                <option value="Government and Public Institutions">Government and Public Institutions</option>
                <option value="Academic, Cultural and Development Institutions">Academic, Cultural and Development Institutions</option>
                <option value="Sector Leaders and Experts">Sector Leaders and Experts</option>
                <option value="Political and Public Policy Perspectives">Political and Public Policy Perspectives</option>
              </select>
            </div>
          </div>
          
          <div className="pt-6 border-t flex justify-end">
            <button disabled={loading} type="submit" className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl flex items-center gap-2">
              {loading ? "Creating..." : <><FaPaperPlane /> Generate Secure Code</>}
            </button>
          </div>
        </form>
      </div>
      
      {createdToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <h2 className="text-2xl font-black text-brand-dark mb-4 text-center">Invitation Generated!</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              This is the secure 16-character submission code. <strong>You will only see this once.</strong> Please copy it securely and provide it to the invitee.
            </p>
            <div className="bg-gray-100 p-4 rounded-xl text-center mb-6 border-2 border-brand-primary/20">
              <code className="text-2xl font-mono font-bold tracking-widest text-brand-primary select-all">{createdToken}</code>
            </div>
            <div className="flex gap-3">
              <button onClick={() => {
                navigator.clipboard.writeText(createdToken);
                alert('Code copied to clipboard!');
              }} className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                Copy Code
              </button>
              <button onClick={() => router.push("/dashboard/skc/official-messages")} className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
