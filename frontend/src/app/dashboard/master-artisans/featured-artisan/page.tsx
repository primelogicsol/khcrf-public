'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Feature {
  id: string;
  artisanId: string;
  linkedStoryId?: string;
  headline?: string;
  summary?: string;
  featureImage?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'EXPIRED';
  accessLevel: 'PUBLIC' | 'REGISTERED_USERS' | 'MEMBERS_ONLY';
  startsAt?: string;
  endsAt?: string;
  updatedAt?: string;
  version: number;
}

export default function FeaturedArtisansList() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchFeatures = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/master-artisans/admin/features');
      if (!res.ok) {
        throw new Error('Failed to fetch features');
      }
      const data = await res.json();
      setFeatures(data.data || data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleExpire = async (id: string) => {
    if (!confirm('Are you sure you want to expire this feature?')) return;
    try {
      const res = await fetch(`/api/master-artisans/admin/features/${id}/expire`, {
        method: 'POST',
      });
      if (!res.ok) {
        throw new Error('Failed to expire feature');
      }
      await fetchFeatures();
    } catch (err: any) {
      alert(err.message || 'An error occurred while expiring');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Featured Artisans</h1>
        <Link
          href="/dashboard/master-artisans/featured-artisan/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Feature
        </Link>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : features.length === 0 ? (
        <div>No features found.</div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artisan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Headline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linked Story</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ver</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {features.map((feature) => (
                <tr key={feature.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feature.artisanId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feature.headline || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${feature.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                        feature.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' : 
                        feature.status === 'EXPIRED' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {feature.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Start: {feature.startsAt ? new Date(feature.startsAt).toLocaleDateString() : '-'}</div>
                    <div>End: {feature.endsAt ? new Date(feature.endsAt).toLocaleDateString() : '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.linkedStoryId || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.accessLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.updatedAt ? new Date(feature.updatedAt).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.version}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/dashboard/master-artisans/featured-artisan/${feature.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Edit
                    </Link>
                    {feature.status !== 'EXPIRED' && (
                      <button onClick={() => handleExpire(feature.id)} className="text-red-600 hover:text-red-900">
                        Expire
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
