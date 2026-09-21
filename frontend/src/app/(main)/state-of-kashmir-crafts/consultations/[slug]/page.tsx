export const dynamic = 'force-dynamic';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaTag, FaHashtag, FaFileAlt, 
  FaCheckCircle, FaSpinner, FaArrowLeft, FaHistory, FaFolderOpen
} from 'react-icons/fa';

async function safeFetch(path: string) {
  const url = path.startsWith('http') ? path : `http://localhost:${process.env.PORT || 4000}/api${path.replace(/^\/api\/backend/, '').replace(/^\/api/, '')}`;
  try {
    const response = await fetch(url, { next: { revalidate: 0 } });
    if (!response.ok) return null;
    const json = await response.json();
    if (json && json.status === 'success' && json.data) {
      if (json.data.success !== undefined) {
        return json.data;
      }
      return { success: true, data: json.data };
    }
    return json;
  } catch (error) {
    console.error("Error fetching", url, error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const res = await safeFetch('/api/public/skc/activities');
  const activities = res?.data?.activities || res?.activities || [];
  const activity = activities.find((a: any) => a.slug === slug);
  if (!activity) {
    notFound();
  }
  return { title: activity.title };
}

export default async function ConsultationOutcomePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const res = await safeFetch('/api/public/skc/activities');
  const activities = res?.data?.activities || res?.activities || [];
  
  const activity = activities.find((a: any) => a.slug === slug);

  if (!activity) {
    notFound();
  }

  const activityDate = activity.startAt 
    ? new Date(activity.startAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
    : 'Date Pending';

  const locationString = activity.venueName || (activity.virtualPlatform ? `Virtual (${activity.virtualPlatform})` : 'Online Portal');

  return (
    <main className="w-full bg-gray-50 min-h-screen pb-20 pt-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/state-of-kashmir-crafts/consultation-tracker" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary mb-8 transition">
          <FaArrowLeft /> Back to Consultation Tracker
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-full border border-gray-200">
              {activity.status?.replace('_', ' ')}
            </span>
            <span className="text-sm font-bold text-gray-400">Record ID: {activity.id || 'N/A'}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-brand-dark mb-8 leading-tight">
            {activity.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-10">
            <div className="flex items-start gap-3">
              <FaCalendarAlt className="text-brand-primary text-xl mt-0.5" />
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Date</div>
                <div className="text-sm font-bold text-gray-800">{activityDate} (IST)</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-brand-primary text-xl mt-0.5" />
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Venue</div>
                <div className="text-sm font-bold text-gray-800">{locationString}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaTag className="text-brand-primary text-xl mt-0.5" />
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Event Type</div>
                <div className="text-sm font-bold text-gray-800">{activity.type?.replace('_', ' ') || 'Consultation'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-black text-brand-dark mb-4 border-b border-gray-100 pb-2">Outcome Summary</h2>
              {activity.outcomeSummary ? (
                <div className="prose prose-sm max-w-none text-gray-600 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: activity.outcomeSummary }} />
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-xl font-semibold flex items-center justify-center">
                  Outcome Pending Publication
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-black text-brand-dark mb-4 border-b border-gray-100 pb-2">Outputs & Key Takeaways</h2>
              {activity.outputs?.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 text-gray-600 font-medium">
                  {activity.outputs.map((output: string, i: number) => (
                    <li key={i}>{output}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic text-sm">No specific outputs recorded.</p>
              )}
            </section>

            <section>
              <h2 className="text-xl font-black text-brand-dark mb-4 border-b border-gray-100 pb-2">Decisions & Approvals</h2>
              {activity.decisions?.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 text-gray-600 font-medium">
                  {activity.decisions.map((decision: string, i: number) => (
                    <li key={i}>{decision}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic text-sm">No formal decisions recorded.</p>
              )}
            </section>

            <section>
              <h2 className="text-xl font-black text-brand-dark mb-4 border-b border-gray-100 pb-2">Evidence & Documents</h2>
              {activity.documents?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activity.documents.map((doc: any, i: number) => (
                    <a key={i} href={doc.url || '#'} className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-brand-primary transition group">
                      <FaFolderOpen className="text-gray-400 group-hover:text-brand-primary transition" />
                      <span className="text-sm font-bold text-gray-700 group-hover:text-brand-primary transition">{doc.title || `Document ${i + 1}`}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">No evidence files attached.</p>
              )}
            </section>
            
            <section>
              <h2 className="text-xl font-black text-brand-dark mb-4 border-b border-gray-100 pb-2">Assessment Lifecycle</h2>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <FaCheckCircle className={activity.nextStageEnabled ? "text-green-500" : "text-gray-400"} />
                  <span className="text-sm font-bold text-gray-800">
                    Next Stage Transferred: <span className={activity.nextStageEnabled ? "text-green-600" : "text-gray-500"}>{activity.nextStageEnabled ? "Enabled" : "Pending"}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaHistory className="text-gray-400" />
                  <span className="text-sm font-bold text-gray-800">
                    Audit Trail: <span className="text-gray-500 font-normal">Tracked via Internal Registry</span>
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
