'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function ConfigCMS() {
  const [config, setConfig] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/skc/config');
      setConfig(res.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch configs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleUpdate = async (key: string, value: any, description: string) => {
    try {
      await api.post(`/api/skc/config/${key}`, { value, description });
      alert(`Config ${key} updated!`);
      fetchConfigs();
    } catch (err: any) {
      alert(`Failed to update config ${key}: ` + err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">SKC Configuration Management</h1>

      {loading && <p>Loading configurations...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-8">
          <ConfigEditor 
            configKey="workflowSteps" 
            title="Workflow Steps (JSON)" 
            existingData={config.find(c => c.key === 'workflowSteps')}
            onSave={(val: any, desc: string) => handleUpdate('workflowSteps', val, desc)} 
          />
          <ConfigEditor 
            configKey="participationGroups" 
            title="Participation Groups (JSON)" 
            existingData={config.find(c => c.key === 'participationGroups')}
            onSave={(val: any, desc: string) => handleUpdate('participationGroups', val, desc)} 
          />
        </div>
      )}
    </div>
  );
}

function ConfigEditor({ configKey, title, existingData, onSave }: any) {
  const [jsonStr, setJsonStr] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (existingData) {
      setJsonStr(JSON.stringify(existingData.value, null, 2));
      setDesc(existingData.description || '');
    } else {
      setJsonStr('[]');
    }
  }, [existingData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(jsonStr);
      onSave(parsed, desc);
    } catch (err: any) {
      alert('Invalid JSON: ' + err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow border">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">Key: {configKey}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold mb-1">Description (Internal)</label>
          <input type="text" className="w-full border p-2 rounded" value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div>
          <label className="block font-bold mb-1">JSON Value</label>
          <textarea 
            className="w-full border p-2 rounded font-mono text-sm h-64"
            value={jsonStr}
            onChange={e => setJsonStr(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded font-bold">
          Save {title}
        </button>
      </form>
    </div>
  );
}
