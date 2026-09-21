'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface FeatureData {
  id: string;
  artisanId: string;
  linkedStoryId?: string;
  headline?: string;
  summary?: string;
  featureImage?: string;
  status: string;
  accessLevel: string;
  startsAt?: string;
  endsAt?: string;
  version: number;
}

export default function EditFeature() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FeatureData | null>(null);

  useEffect(() => {
    const fetchFeature = async () => {
      try {
        const res = await fetch(`/api/master-artisans/admin/features/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch feature details');
        }
        const data = await res.json();
        const feature = data.data || data;
        
        // Format dates for input
        const formatForInput = (dateString?: string) => {
          if (!dateString) return '';
          return new Date(dateString).toISOString().slice(0, 16);
        };

        setFormData({
          ...feature,
          startsAt: formatForInput(feature.startsAt),
          endsAt: formatForInput(feature.endsAt),
          linkedStoryId: feature.linkedStoryId || '',
          headline: feature.headline || '',
          summary: feature.summary || '',
          featureImage: feature.featureImage || '',
        });
      } catch (err: any) {
        setError(err.message || 'Error loading feature');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchFeature();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        linkedStoryId: formData.linkedStoryId || undefined,
        startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : undefined,
        endsAt: formData.endsAt ? new Date(formData.endsAt).toISOString() : undefined,
      };

      const res = await fetch(`/api/master-artisans/admin/features/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error('Conflict: The record has been modified by another user. Please refresh and try again.');
        }
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update feature');
      }

      router.push('/dashboard/master-artisans/featured-artisan');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExpire = async () => {
    if (!confirm('Are you sure you want to expire this feature?')) return;
    try {
      const res = await fetch(`/api/master-artisans/admin/features/${id}/expire`, {
        method: 'POST',
      });
      if (!res.ok) {
        throw new Error('Failed to expire feature');
      }
      router.push('/dashboard/master-artisans/featured-artisan');
    } catch (err: any) {
      alert(err.message || 'An error occurred while expiring');
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!formData) return <div className="p-6">Feature not found or error occurred. {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Feature</h1>
        <Link href="/dashboard/master-artisans/featured-artisan" className="text-blue-600 hover:underline">
          Back to List
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Artisan ID *</label>
          <input
            type="text"
            name="artisanId"
            required
            value={formData.artisanId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Linked Story ID</label>
          <input
            type="text"
            name="linkedStoryId"
            value={formData.linkedStoryId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Headline</label>
          <input
            type="text"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Summary</label>
          <textarea
            name="summary"
            rows={3}
            value={formData.summary}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Feature Image URL</label>
          <input
            type="text"
            name="featureImage"
            value={formData.featureImage}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Access Level</label>
            <select
              name="accessLevel"
              value={formData.accessLevel}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            >
              <option value="PUBLIC">PUBLIC</option>
              <option value="REGISTERED_USERS">REGISTERED_USERS</option>
              <option value="MEMBERS_ONLY">MEMBERS_ONLY</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="datetime-local"
              name="startsAt"
              value={formData.startsAt}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="datetime-local"
              name="endsAt"
              value={formData.endsAt}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            />
          </div>
        </div>
        
        <div>
           <input type="hidden" name="version" value={formData.version} />
        </div>

        <div className="pt-4 flex justify-between">
          <button
            type="button"
            onClick={handleExpire}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Expire Feature
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
