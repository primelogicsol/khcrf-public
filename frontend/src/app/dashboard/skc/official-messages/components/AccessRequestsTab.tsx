import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaEye, FaSpinner } from "react-icons/fa";
import api from "@/lib/api";

export default function AccessRequestsTab() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/skc/admin/official-messages/access-requests');
      if (res.data?.success) {
        setRequests(res.data.data);
      } else {
        setError("Failed to load access requests.");
      }
    } catch (err) {
      setError("Failed to load access requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    const reason = window.prompt(`Please enter a note/reason for ${action}ing this request:`);
    if (reason === null) return; // Cancelled
    
    try {
      const endpoint = `/api/skc/admin/official-messages/access-requests/${id}/${action}`;
      await api.patch(endpoint, action === 'approve' ? { notes: reason } : { reason });
      loadRequests();
    } catch (err) {
      alert(`Failed to ${action} request.`);
    }
  };

  if (loading) return <div className="p-10 flex justify-center text-gray-500"><FaSpinner className="animate-spin text-3xl" /></div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Access Requests</h2>
      {requests.length === 0 ? (
        <div className="p-8 bg-gray-50 text-center rounded-xl border border-gray-100 text-gray-500">
          No access requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {req.status}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{req.referenceNumber}</span>
                </div>
                <h3 className="font-bold text-gray-900">{req.fullName}</h3>
                <p className="text-sm text-gray-600 mb-1">{req.designation} at {req.institution}</p>
                <p className="text-sm text-gray-500 mb-3">{req.officialEmail}</p>
                
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mb-4">
                  <span className="font-bold block mb-1">Reason:</span>
                  {req.reasonForRequest}
                </div>
              </div>
              
              {req.status === 'PENDING' && (
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button onClick={() => handleAction(req.id, 'approve')} className="flex-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                    <FaCheckCircle /> Approve
                  </button>
                  <button onClick={() => handleAction(req.id, 'reject')} className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                    <FaTimesCircle /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
