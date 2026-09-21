"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { FaSpinner } from 'react-icons/fa';

export default function InvitationAccessPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    const cleanToken = token.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (cleanToken.length !== 16) {
      setError("Enter the complete 16-character invitation code.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await api.post(`/skc/official-messages/invitations/verify`, { code: cleanToken });
      // Response shape: { status: 'success', data: { success: true, data: { applicantName, ... } } }
      if (res.data?.status === 'success') {
        router.push(`/state-of-kashmir-crafts/official-messages/submit`);
      } else {
        const inner = res.data?.data?.data || res.data?.data || res.data;
        setError(inner?.error || "We could not verify this invitation code. Check the code and try again.");
      }
    } catch (err: any) {
      const inner = err.response?.data?.data?.data || err.response?.data?.data || err.response?.data;
      const msg = inner?.error || inner?.message || "";
      if (!msg && (err.message === 'Network Error' || err.name === 'TypeError')) {
        setError("We could not reach the invitation service. Please check your connection and try again.");
      } else {
        setError(msg || "An error occurred verifying your code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-hcrf-surface-muted min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white p-10 rounded-xl shadow-sm border border-hcrf-border text-center">
          <h1 className="text-3xl font-black text-hcrf-navy-900 mb-6">Access Your Invitation</h1>
          <p className="text-hcrf-text-secondary mb-8">Enter the secure 16-character code issued by the KHCRF Assessment Secretariat to begin or resume your official message submission.</p>
          
          <input 
            type="text" 
            placeholder="XXXX-XXXX-XXXX-XXXX" 
            value={token}
            onChange={(e) => {
               // Auto-format with dashes for display
               let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
               if (val.length > 16) val = val.substring(0, 16);
               const formatted = val.match(/.{1,4}/g)?.join('-') || val;
               setToken(formatted);
            }}
            className="w-full text-center text-xl tracking-widest p-4 border border-hcrf-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hcrf-brown-500 mb-2 font-mono font-bold text-hcrf-text-primary uppercase"
          />
          
          <div className="h-6 mb-4 flex items-center justify-center">
            {error && <span className="text-red-500 text-sm font-bold">{error}</span>}
          </div>
          
          <button 
            onClick={handleVerify}
            disabled={loading || token.replace(/[^a-zA-Z0-9]/g, '').length < 16}
            className="button-primary w-full py-4 rounded-lg text-lg font-bold flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Verify Invitation Code"}
          </button>
          
          <div className="mt-8 pt-8 border-t border-hcrf-border text-sm flex flex-col gap-2">
            <Link href="/state-of-kashmir-crafts/official-messages/request-invitation" className="text-hcrf-brown-700 font-bold hover:underline">I don't have a secure code (Request Access)</Link>
            <Link href="/state-of-kashmir-crafts/contact-secretariat" className="text-hcrf-text-secondary font-bold hover:underline">I need technical assistance</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
