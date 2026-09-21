import React, { useState, useEffect } from "react";
import { FaSave, FaCog } from "react-icons/fa";
import api from "@/lib/api";

export default function SettingsTab() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/skc/admin/official-messages/settings');
      if (res.data?.success) {
        setSettings(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/api/skc/admin/official-messages/settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error("Failed to save settings", error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-400 font-medium animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FaCog className="text-gray-400" /> Module Configuration
          </h2>
          <p className="text-sm text-gray-500">Manage public visibility, requirements, and default behaviors.</p>
        </div>
      </div>
      
      <form onSubmit={handleSave} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2">Visibility & Access</h3>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" name="invitedSubmissionsEnabled" checked={settings?.invitedSubmissionsEnabled || false} onChange={handleChange} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
              <div>
                <div className="font-medium text-sm text-gray-800">Enable Invited Submissions</div>
                <div className="text-xs text-gray-500">Allow invited users to submit messages</div>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" name="publicRegisterEnabled" checked={settings?.publicRegisterEnabled || false} onChange={handleChange} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
              <div>
                <div className="font-medium text-sm text-gray-800">Public Register Enabled</div>
                <div className="text-xs text-gray-500">Show published messages on the front-end</div>
              </div>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" name="featuredMessagesEnabled" checked={settings?.featuredMessagesEnabled || false} onChange={handleChange} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
              <div>
                <div className="font-medium text-sm text-gray-800">Featured Messages Enabled</div>
                <div className="text-xs text-gray-500">Highlight specific messages at the top</div>
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2">Submission Requirements</h3>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" name="requirePhotograph" checked={settings?.requirePhotograph || false} onChange={handleChange} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
              <div className="font-medium text-sm text-gray-800">Require Photograph</div>
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" name="requireSignedLetter" checked={settings?.requireSignedLetter || false} onChange={handleChange} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
              <div className="font-medium text-sm text-gray-800">Require Signed Letter Upload</div>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" name="requireContributorApproval" checked={settings?.requireContributorApproval || false} onChange={handleChange} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
              <div>
                <div className="font-medium text-sm text-gray-800">Require Contributor Approval</div>
                <div className="text-xs text-gray-500">Must be approved by contributor before publish</div>
              </div>
            </label>
          </div>
          
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? 'Saving...' : <><FaSave /> Save Configuration</>}
          </button>
        </div>
      </form>
    </div>
  );
}
