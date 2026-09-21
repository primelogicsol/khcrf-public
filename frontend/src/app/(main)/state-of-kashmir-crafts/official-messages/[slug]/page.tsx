'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { FaArrowLeft, FaCheckCircle, FaFilePdf, FaShareAlt, FaPrint, FaQuoteLeft, FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

export default function OfficialMessageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchMessage(params.slug as string);
    }
  }, [params.slug]);

  const fetchMessage = async (slug: string) => {
    try {
      const res = await api.get(`/api/skc/official-messages/${slug}`);
      if (res.data?.success) {
        setMessage(res.data.data);
      } else {
        router.push('/state-of-kashmir-crafts/official-messages');
      }
    } catch (error) {
      console.error("Failed to load message", error);
      router.push('/state-of-kashmir-crafts/official-messages');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: message.title,
        text: `Read the official message by ${message.contributorName} on the State of Kashmir Crafts Assessment 2026–2027.`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!message) return null;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* 1. Header & Navigation */}
      <div className="bg-brand-dark text-white py-6 border-b-4 border-brand-secondary print:hidden">
        <div className="container mx-auto px-4 max-w-5xl flex items-center gap-4">
          <Link href="/state-of-kashmir-crafts/official-messages" className="text-gray-300 hover:text-white transition flex items-center gap-2 text-sm font-bold">
            <FaArrowLeft /> Back to Message Register
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-8">
              <span data-editorial-accent-text className="inline-block bg-brand-secondary/10  text-xs font-black px-3 py-1.5 rounded uppercase tracking-wider mb-4 border border-brand-secondary/30">
                {message.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-brand-dark leading-tight mb-6">
                {message.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium border-b border-gray-100 pb-6">
                <span className="flex items-center gap-1"><FaCalendarAlt /> Published {new Date(message.publishedAt).toLocaleDateString()}</span>
                {message.country || message.district ? <span className="flex items-center gap-1"><FaMapMarkerAlt /> {message.district || message.country}</span> : null}
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-600">ID: {message.referenceNumber}</span>
              </div>
            </div>

            <div className="prose max-w-none text-gray-800 leading-relaxed text-lg">
              <FaQuoteLeft className="text-4xl text-gray-200 mb-4 float-left mr-4" />
              <div dangerouslySetInnerHTML={{ __html: message.body.replace(/\n/g, '<br/>') }} />
            </div>

            {message.translatedBody && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-400">English Translation</h3>
                <div className="prose max-w-none text-gray-600 italic">
                  <div dangerouslySetInnerHTML={{ __html: message.translatedBody.replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          {/* Contributor Profile */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
            <div className="flex flex-col items-center text-center mb-6">
              {message.portraitUrl ? (
                <img src={message.portraitUrl} alt={message.contributorName} className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 shadow-sm mb-4" />
              ) : (
                <div data-ui-icon className="w-32 h-32 rounded-full bg-brand-primary/10 flex items-center justify-center  text-4xl mb-4">
                  {message.contributorName.charAt(0)}
                </div>
              )}
              
              <h2 className="text-xl font-black text-gray-900 mb-1 flex items-center justify-center gap-2">
                {message.contributorName} 
                {message.isVerified && <FaCheckCircle className="text-blue-500 text-lg" title="Verified Authorship" />}
              </h2>
              <div className="text-gray-600 font-medium mb-1">{message.designation}</div>
              <div data-ui-icon className=" font-bold flex items-center justify-center gap-2">
                {message.organization && <><FaBuilding /> {message.organization}</>}
              </div>
            </div>

            {message.biography && (
              <div className="mb-6 pt-6 border-t border-gray-100 text-sm text-gray-600 leading-relaxed">
                {message.biography}
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
              {message.formattedPdfUrl && (
                <a href={message.formattedPdfUrl} target="_blank" className="flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-secondary transition w-full">
                  <FaFilePdf /> Download PDF
                </a>
              )}
              <div className="flex gap-2">
                <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-200 transition">
                  <FaPrint /> Print
                </button>
                <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-200 transition">
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>
          </div>
          
          {/* Transparency Notice */}
          <div className="bg-gray-100 p-5 rounded-xl border border-gray-200 text-xs text-gray-500 leading-relaxed font-medium">
            <p className="mb-3"><strong>Non-Endorsement Principle:</strong> Publication of this message does not imply endorsement by the Hamadan Craft Revival Foundation, the Assessment Secretariat, or the Advisory Council.</p>
            <p>This message forms part of the permanent public record of the State of Kashmir Crafts Assessment 2026–2027 Assessment.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
