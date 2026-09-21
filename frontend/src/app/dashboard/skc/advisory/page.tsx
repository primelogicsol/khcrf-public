'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { FaUserShield, FaSpinner } from 'react-icons/fa';

export default function AdvisoryDashboard() {
  const [members, setMembers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersRes, appsRes] = await Promise.all([
        api.get('/api/skc/advisory/members').catch(() => ({ data: { data: [] } })),
        api.get('/api/advisory').catch(() => ({ data: [] }))
      ]);
      setMembers(membersRes.data.data || []);
      setApplications(appsRes.data || appsRes.data.data || []);
    } catch (err: any) {
      console.error("Failed to load advisory data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/api/advisory/${id}/status`, { status });
      fetchData();
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleCreateMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      status: formData.get('status') as string,
      bio: formData.get('bio') as string,
    };
    try {
      await api.post('/api/skc/advisory/members', data);
      (e.target as HTMLFormElement).reset();
      fetchData();
    } catch (err: any) {
      alert("Failed to create member: " + err.message);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-3">
        <FaUserShield data-ui-icon  className="" /> Advisory Applications Dashboard
      </h1>

      {loading ? <p><FaSpinner className="animate-spin" /> Loading...</p> : (
        <div className="grid grid-cols-1 gap-8">
          
          <div className="bg-white p-6 rounded shadow overflow-x-auto">
            <h2 className="font-bold mb-4">Advisory Applications</h2>
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app.id} className="p-4 border rounded bg-gray-50 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-lg text-brand-dark">{app.fullName}</span>
                      <span className="ml-3 text-xs bg-brand-primary/10 text-brand-primary px-2 py-1 rounded font-bold">{app.advisoryScope}</span>
                      <div className="text-xs text-gray-500 font-mono mt-1">{app.referenceNumber} • {new Date(app.submittedAt).toLocaleDateString()}</div>
                    </div>
                    <span className="text-xs uppercase font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">{app.status}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-2">
                    <div><strong>Email:</strong> {app.email}</div>
                    <div><strong>Phone:</strong> {app.phone || 'N/A'}</div>
                    <div><strong>Category:</strong> {app.category}</div>
                    <div><strong>Organization:</strong> {app.organization || 'N/A'}</div>
                  </div>
                  
                  <div className="mt-2">
                    <strong>Statement of Interest:</strong>
                    <p className="text-sm bg-white p-3 border rounded mt-1 text-gray-700 whitespace-pre-wrap">{app.statement}</p>
                  </div>
                  
                  {app.cvOriginalFilename && (
                    <div className="mt-2">
                      <strong>Resume:</strong>
                      <a href={`${app.cvFileUrl}`} target="_blank" rel="noreferrer" className="text-brand-primary ml-2 hover:underline text-sm font-bold">
                        📄 {app.cvOriginalFilename}
                      </a>
                    </div>
                  )}
                  
                  <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t">
                    <button onClick={() => handleUpdateAppStatus(app.id, 'APPROVED_HCRF')} className="text-xs bg-green-500 text-white px-3 py-2 rounded font-bold shadow-sm hover:bg-green-600">Approve KHCRF</button>
                    <button onClick={() => handleUpdateAppStatus(app.id, 'APPROVED_SKC')} className="text-xs bg-blue-500 text-white px-3 py-2 rounded font-bold shadow-sm hover:bg-blue-600">Approve SKC</button>
                    <button onClick={() => handleUpdateAppStatus(app.id, 'APPROVED_BOTH')} className="text-xs bg-purple-500 text-white px-3 py-2 rounded font-bold shadow-sm hover:bg-purple-600">Approve BOTH</button>
                    <button onClick={() => handleUpdateAppStatus(app.id, 'MORE_INFORMATION_REQUIRED')} className="text-xs bg-amber-500 text-white px-3 py-2 rounded font-bold shadow-sm hover:bg-amber-600">Need Info</button>
                    <button onClick={() => handleUpdateAppStatus(app.id, 'NOT_SELECTED')} className="text-xs bg-red-500 text-white px-3 py-2 rounded font-bold shadow-sm hover:bg-red-600">Reject</button>
                  </div>
                </div>
              ))}
              {applications.length === 0 && <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded text-center">No applications found.</p>}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
