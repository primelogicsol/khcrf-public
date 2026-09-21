"use client";
import { getBaseUrl, getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaCalendarAlt, FaMapMarkerAlt, FaVideo, FaDownload, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaHistory } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function HearingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [hearing, setHearing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const [accessData, setAccessData] = useState<any>(null);
  const [loadingAccess, setLoadingAccess] = useState(false);

  // Registration form state
  const [showRegForm, setShowRegForm] = useState(false);
  const [regData, setRegData] = useState({
    fullName: '', email: '', phone: '', organization: '', designation: '', 
    stakeholderCategory: '', district: '', craftInterest: '', attendanceType: 'IN_PERSON', accessibilityReq: '', consent: false
  });
  const [regStatus, setRegStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [regMessage, setRegMessage] = useState('');

  // Fetch access data when hearing is loaded and user is authenticated
  useEffect(() => {
    if (hearing && user) {
        setLoadingAccess(true);
        api.get(`/skc/hearings/public/${hearing.id}/access`)
            .then(res => {
                if (res.data.success) {
                    setAccessData({ status: 'OPEN', meetingLink: res.data.data.meetingLink });
                }
            })
            .catch(err => {
                if (err.response?.status === 403) {
                    if (err.response.data.opensAt) {
                        setAccessData({ status: 'LOCKED', opensAt: err.response.data.opensAt });
                    } else if (err.response.data.error === 'Meeting has concluded.') {
                        setAccessData({ status: 'CLOSED' });
                    } else if (err.response.data.error === 'You are not registered for this hearing.') {
                        setAccessData(null); // not registered
                    }
                }
            })
            .finally(() => setLoadingAccess(false));
    }
  }, [hearing, user]);

  useEffect(() => {
    const API_BASE_URL = getBaseUrlNoApi();
    fetch(`/api/backend/skc/hearings/public/${slug}`)
      .then(res => res.json())
      .then(data => {
        let actualHearing = null;
        if (data.success) {
          actualHearing = data.data;
        } else if (data.status === 'success' && data.data) {
          actualHearing = data.data.success ? data.data.data : data.data;
        }
        setHearing(actualHearing);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.consent) {
       setRegMessage("You must consent to the terms to register.");
       setRegStatus('ERROR');
       return;
    }
    setRegStatus('LOADING');
    try {
       const API_BASE_URL = getBaseUrlNoApi();
       const payload = { ...regData, email: user?.email };
       const res = await fetch(`/api/backend/skc/hearings/public/${hearing.id}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
       });
       const data = await res.json();
       if (data.success) {
          setRegStatus('SUCCESS');
          setRegMessage(`Registration successful. Your Reference Number is: ${data.data.referenceNumber}`);
       } else {
          setRegStatus('ERROR');
          setRegMessage(data.error || "Failed to register.");
       }
    } catch (err) {
       setRegStatus('ERROR');
       setRegMessage("An unexpected error occurred.");
    }
  };

  if (loading) return <div className="text-center py-40 font-bold text-gray-500">Loading Hearing Details...</div>;
  if (!hearing) return <div className="text-center py-40 font-bold text-red-500">Hearing not found.</div>;

  return (
    <main className="w-full bg-gray-50 min-h-screen pt-32 pb-20">
       <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/state-of-kashmir-crafts/public-hearings" className="inline-flex items-center gap-2 text-icon-on-light font-bold hover:underline mb-8">
             <FaArrowLeft /> Back to Calendar
          </Link>

          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 mb-10">
             <div className="flex items-center gap-3 mb-6">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                   hearing.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' :
                   hearing.status === 'ONGOING' ? 'bg-red-100 text-red-700' :
                   'bg-brand-secondary/10 text-brand-secondary'
                }`}>
                   {hearing.status}
                </span>
                {hearing.district && (
                   <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                      <FaMapMarkerAlt /> {hearing.district}
                   </span>
                )}
             </div>
             <h1 className="text-3xl md:text-5xl font-black text-brand-dark mb-6">{hearing.title}</h1>
             
             <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-600 mb-8 pb-8 border-b border-gray-100">
                {hearing.date && (
                   <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-brand-secondary text-lg" />
                      <span>
                         {new Date(hearing.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                         {hearing.startAt && ` • ${new Date(hearing.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </span>
                   </div>
                )}
                {hearing.venueName && (
                   <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-brand-secondary text-lg" />
                      <span>{hearing.venueName}</span>
                   </div>
                )}
                {hearing.formatId === 'virtual' || hearing.meetingLink ? (
                   <div className="flex items-center gap-2">
                      <FaVideo className="text-brand-secondary text-lg" />
                      <span>Virtual/Hybrid Access</span>
                   </div>
                ) : null}
             </div>

             <div className="prose prose-lg max-w-none text-gray-700 mb-12">
                {hearing.purpose && (
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-brand-dark mb-3">Hearing Purpose</h3>
                        <p>{hearing.purpose}</p>
                    </div>
                )}
                
                {hearing.regionalCoverageLabel && (
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-brand-dark mb-3">Geographic Scope</h3>
                        <p>{hearing.regionalCoverageLabel}</p>
                    </div>
                )}
                
                {hearing.stakeholderCategories && hearing.stakeholderCategories.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-brand-dark mb-3">Eligible Stakeholder Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {hearing.stakeholderCategories.map((cat: string, i: number) => (
                                <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">{cat}</span>
                            ))}
                        </div>
                    </div>
                )}
                
                {hearing.assessmentQuestions && hearing.assessmentQuestions.length > 0 && (
                    <div className="mb-8 bg-brand-primary/5 p-6 rounded-xl border border-brand-primary/10">
                        <h3 className="text-xl font-bold text-brand-dark mb-4">Core Assessment Questions</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            {hearing.assessmentQuestions.map((q: string, i: number) => (
                                <li key={i} className="text-gray-800 font-medium">{q}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {hearing.capacity > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-brand-dark mb-3">Participant Capacity</h3>
                        <p>{hearing.capacity} registered participants</p>
                    </div>
                )}

                {!hearing.purpose && <div className="whitespace-pre-wrap">{hearing.description}</div>}
             </div>

             {/* Access Controls */}
             <div className="mt-10" id="register">
                {(() => {
                   if (hearing.status === 'COMPLETED') return null; // handled below

                   if (!user) {
                      return (
                         <div className="bg-brand-primary/5 p-8 rounded-2xl border border-brand-primary/20 text-center">
                            <h3 className="text-2xl font-black text-brand-dark mb-2">Attend this Hearing</h3>
                            <p className="text-gray-600 mb-6">You must be a registered stakeholder to attend KHCRF hearings.</p>
                            <Link href={`/login?redirect=/state-of-kashmir-crafts/public-hearings/${slug}`} className="px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition shadow-lg inline-block">
                               Sign In to Register
                            </Link>
                         </div>
                      );
                   }

                   // User is logged in. Let's check registration status via our local state
                   if (!accessData) {
                      if (loadingAccess) {
                         return <div className="p-8 text-center text-gray-500 font-bold">Checking access status...</div>;
                      }

                      // Not registered for this hearing
                      if (!showRegForm) {
                         return (
                            <div className="bg-white border border-gray-200 shadow-sm p-8 rounded-2xl text-center">
                               <h3 className="text-2xl font-black text-brand-dark mb-2">Hearing Registration</h3>
                               <p className="text-gray-600 mb-6">You are authenticated as {user.email}. Register specifically for this hearing.</p>
                               <button onClick={() => setShowRegForm(true)} className="px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition shadow-lg">
                                  Register for this Hearing
                               </button>
                            </div>
                         );
                      }

                      // Show registration form
                      return (
                         <div className="bg-white border border-gray-200 shadow-xl p-8 rounded-2xl">
                            <h3 className="text-2xl font-black text-brand-dark mb-6">Hearing Registration</h3>
                            
                            {regStatus === 'SUCCESS' ? (
                               <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 text-center">
                                  <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
                                  <h4 className="text-xl font-bold mb-2">Registration Confirmed</h4>
                                  <p className="font-medium">{regMessage}</p>
                                  <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-bold text-sm">
                                     View Access Panel
                                  </button>
                               </div>
                            ) : (
                               <form onSubmit={submitRegistration} className="space-y-6">
                                  {regStatus === 'ERROR' && (
                                     <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-3 font-medium">
                                        <FaExclamationTriangle /> {regMessage}
                                     </div>
                                  )}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                                        <input required type="text" value={regData.fullName} onChange={e => setRegData({...regData, fullName: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-primary" />
                                     </div>
                                     <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                                        <input required disabled type="email" value={user.email} className="w-full p-4 bg-gray-100 border border-gray-300 rounded-xl outline-none text-gray-500 cursor-not-allowed" />
                                     </div>
                                     <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Organization</label>
                                        <input type="text" value={regData.organization} onChange={e => setRegData({...regData, organization: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-primary" />
                                     </div>
                                     <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Attendance Type *</label>
                                        <select value={regData.attendanceType} onChange={e => setRegData({...regData, attendanceType: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-primary">
                                           <option value="IN_PERSON">In Person</option>
                                           <option value="VIRTUAL">Virtual</option>
                                        </select>
                                     </div>
                                  </div>
                                  <div className="pt-4 border-t border-gray-100">
                                     <label className="flex items-start gap-3 cursor-pointer">
                                        <input required type="checkbox" checked={regData.consent} onChange={e => setRegData({...regData, consent: e.target.checked})} className="mt-1 w-5 h-5 accent-brand-primary" />
                                        <span className="text-sm text-gray-600">I consent to the KHCRF processing my data for the purpose of managing this public hearing. I understand that my participation may be recorded.</span>
                                     </label>
                                  </div>
                                  <button disabled={regStatus === 'LOADING'} type="submit" className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition disabled:opacity-50">
                                     {regStatus === 'LOADING' ? 'Submitting...' : 'Submit Registration'}
                                  </button>
                               </form>
                            )}
                         </div>
                      );
                   }

                   // User is registered
                   return (
                      <div className="bg-brand-dark p-8 rounded-2xl border border-gray-800 text-center text-white shadow-xl relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-secondary"></div>
                         
                         <div className="flex justify-center mb-4">
                            <span className="bg-white/10 text-brand-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                               <FaCheckCircle /> Registration Confirmed
                            </span>
                         </div>
                         
                         {accessData.status === 'CLOSED' ? (
                            <>
                               <h3 className="text-2xl font-black mb-2">Public Hearing Closed</h3>
                               <p className="text-gray-400">This hearing has concluded.</p>
                            </>
                         ) : accessData.status === 'OPEN' ? (
                            <>
                               <h3 className="text-2xl font-black mb-2">Public Hearing Access</h3>
                               <p className="text-gray-300 mb-6">Your registration has been verified. The hearing is now open.</p>
                               {accessData.meetingLink ? (
                                  <a href={accessData.meetingLink} target="_blank" rel="noreferrer" className="px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition shadow-[0_0_20px_rgba(200,30,80,0.4)] inline-block">
                                     Join Public Hearing
                                  </a>
                               ) : (
                                  <div className="bg-white/10 p-4 rounded-xl text-brand-primary font-bold">
                                     No virtual meeting link was provided for this hearing.
                                  </div>
                               )}
                            </>
                         ) : (
                            <>
                               <h3 className="text-2xl font-black mb-2">Public Hearing Access</h3>
                               <p className="text-gray-400 mb-2">Meeting access opens 5 minutes before the scheduled hearing.</p>
                               {accessData.opensAt && (
                                  <p className="text-brand-primary font-bold text-lg mb-6">
                                     Access Opens: {new Date(accessData.opensAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
                                  </p>
                               )}
                               <button disabled className="px-8 py-4 bg-white/5 text-white/50 font-bold rounded-xl border border-white/10 cursor-not-allowed inline-block">
                                  Access Locked
                               </button>
                            </>
                         )}
                      </div>
                   );
                })()}
             </div>

             {hearing.status === 'COMPLETED' && hearing.summary && (
                <div className="mt-12 pt-12 border-t border-gray-200">
                   <h3 className="text-2xl font-black text-brand-dark mb-6"><FaHistory data-ui-icon  className="inline mr-2 " /> Post-Hearing Archive</h3>
                   <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                      <p className="text-gray-700 mb-6">{hearing.summary}</p>
                      
                      {hearing.downloads && hearing.downloads.length > 0 && (
                         <div>
                            <h4 className="font-bold text-gray-900 mb-4">Official Downloads</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {hearing.downloads.map((d: any) => (
                                  <a key={d.id} href={d.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-primary transition">
                                     <FaDownload data-ui-icon  className="" />
                                     <span className="font-bold text-sm text-gray-800">{d.title}</span>
                                  </a>
                               ))}
                            </div>
                         </div>
                      )}
                   </div>
                </div>
             )}

          </div>
       </div>
    </main>
  );
}
