import os

dir_path = 'src/app/dashboard/skc/official-messages/components'

tabs = [
    ('InvitationsTab', 'invitations', '', 'Manage dignitaries and institutional invitations'),
    ('SubmissionsTab', 'messages', '?status=SUBMITTED', 'New submissions pending initial review'),
    ('ReviewQueueTab', 'messages', '?reviewQueue=true', 'Messages in identity, authority, or editorial review'),
    ('ScheduledTab', 'messages', '?status=SCHEDULED', 'Messages scheduled for publication'),
    ('PublishedTab', 'messages', '?status=PUBLISHED', 'Live public records'),
    ('ArchivedTab', 'messages', '?status=ARCHIVED', 'Archived, withdrawn, or declined records')
]

template = """import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import api from "@/lib/api";
import { format } from "date-fns";

export default function __NAME__() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/skc/admin/official-messages/__ENDPOINT____QUERY__');
      if (res.data?.success) {
        setItems(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch __NAME__ data", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const term = searchTerm.toLowerCase();
    const name = (item.fullName || item.contributorName || "").toLowerCase();
    const inst = (item.institution || item.organization || "").toLowerCase();
    return name.includes(term) || inst.includes(term);
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">__TITLE__</h2>
          <p className="text-sm text-gray-500">__DESC__</p>
        </div>
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or institution..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Institution</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium animate-pulse">
                  Loading records...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{item.fullName || item.contributorName}</div>
                    <div className="text-xs text-gray-500">{item.designation}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {item.institution || item.organization}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                      {item.status || item.workflowStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {item.createdAt ? format(new Date(item.createdAt), 'MMM d, yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors" title="View">
                        <FaEye />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"""

for name, endpoint, query, desc in tabs:
    content = template.replace('__NAME__', name)
    content = content.replace('__TITLE__', name.replace('Tab', ''))
    content = content.replace('__ENDPOINT__', endpoint)
    content = content.replace('__QUERY__', query)
    content = content.replace('__DESC__', desc)
    with open(f'{dir_path}/{name}.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
