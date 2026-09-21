'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentAssessmentPhase } from '@/lib/skc/timeline';
import { 
  FaUniversity, FaUserGraduate, FaComments, 
  FaLandmark, FaSearch, FaFilePdf, FaShareAlt, 
  FaCheckCircle, FaDownload,
  FaShieldAlt, FaUserCheck, FaPenNib, FaArchive, FaArrowRight,
  FaQuoteLeft
} from 'react-icons/fa';
import api from '@/lib/api';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { officialMessagesHeroFallback } from '@/config/heroFallbacks';

export default function OfficialMessagesPage() {
  const phase = getCurrentAssessmentPhase();
  const isPreLaunch = phase === 'PRE_LAUNCH';
  const isConsultationOpen = phase === 'PUBLIC_PARTICIPATION_OPEN' || phase === 'HEARINGS_IN_PROGRESS';
  const isConsultationClosed = phase === 'REVIEW_IN_PROGRESS' || phase === 'EXPERT_REVIEW' || phase === 'FINAL_PUBLICATION';
  const [messages, setMessages] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, institutions: 0, verified: 0, countries: 0 });
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST');
  const [viewMode, setViewMode] = useState('GRID');

  useEffect(() => {
    // Parse URL parameters for categories
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      if (categoryParam) {
        setSelectedCategory(decodeURIComponent(categoryParam));
        // Scroll to register
        setTimeout(() => {
          document.getElementById('message-register')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/skc/official-messages');
      if (res.data?.success) {
        setMessages(res.data.data);
        
        const published = res.data.data;
        const institutions = new Set(published.map((m: any) => m.institution || m.organization).filter(Boolean));
        const verified = published.filter((m: any) => m.isVerified).length;
        const countriesRegions = new Set(published.map((m: any) => m.country || m.district).filter(Boolean));
        
        setStats({
          total: published.length,
          institutions: institutions.size,
          verified: verified,
          countries: countriesRegions.size
        });
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Update URL without reload
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('category', encodeURIComponent(categoryId));
      window.history.pushState({}, '', url);
      document.getElementById('message-register')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredMessages = messages.filter(m => {
    if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return false;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        (m.fullName || m.contributorName)?.toLowerCase().includes(lowerSearch) ||
        (m.institution || m.organization)?.toLowerCase().includes(lowerSearch) ||
        m.title?.toLowerCase().includes(lowerSearch)
      );
    }
    return true;
  }).sort((a, b) => {
    if (sortOrder === 'NEWEST') return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    if (sortOrder === 'OLDEST') return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    if (sortOrder === 'ALPHABETICAL') return (a.fullName || a.contributorName || "").localeCompare(b.fullName || b.contributorName || "");
    return 0;
  });

  const categories = [
    { id: 'Foundation and Assessment Leadership', icon: FaLandmark, desc: 'Messages from KHCRF leadership, the Assessment Secretariat and Advisory Council.', param: 'Foundation and Assessment Leadership' },
    { id: 'Government and Public Institutions', icon: FaUniversity, desc: 'Messages from departments, public authorities and statutory institutions.', param: 'Government and Public Institutions' },
    { id: 'Academic, Cultural and Development Institutions', icon: FaArchive, desc: 'Messages from universities, museums, heritage organizations and development agencies.', param: 'Academic, Cultural and Development Institutions' },
    { id: 'Sector Leaders and Experts', icon: FaUserGraduate, desc: 'Messages from artisans, scholars, exporters, designers, economists and policy specialists.', param: 'Sector Leaders and Experts' },
    { id: 'Political and Public Policy Perspectives', icon: FaComments, desc: 'Formally submitted perspectives from political parties, elected representatives and policy actors.', param: 'Political and Public Policy Perspectives' }
  ];

  const featuredMessages = messages.filter(m => m.isFeatured);

  return (
    <div className="bg-hcrf-surface-muted min-h-screen pb-20">
      
      {/* 1. Hero Section */}
      <UniversalEditorialHero 
        pageKey="official-messages" 
        fallbackConfig={officialMessagesHeroFallback as any} 
      />

      {/* 2. Programme statistics */}
      <section className="py-12 bg-white border-b border-hcrf-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl font-black text-hcrf-navy-900 mb-2">{stats.total}</div>
              <div className="text-xs uppercase tracking-wider font-bold text-hcrf-text-secondary">Published Messages</div>
            </div>
            <div className="p-4 border-l border-hcrf-border">
              <div className="text-4xl font-black text-hcrf-navy-900 mb-2">{stats.institutions}</div>
              <div className="text-xs uppercase tracking-wider font-bold text-hcrf-text-secondary">Institutions Represented</div>
            </div>
            <div className="p-4 border-l border-hcrf-border">
              <div className="text-4xl font-black text-hcrf-navy-900 mb-2">{stats.verified}</div>
              <div className="text-xs uppercase tracking-wider font-bold text-hcrf-text-secondary">Contributors Verified</div>
            </div>
            <div className="p-4 border-l border-hcrf-border">
              <div className="text-4xl font-black text-hcrf-navy-900 mb-2">{stats.countries}</div>
              <div className="text-xs uppercase tracking-wider font-bold text-hcrf-text-secondary">Countries & Regions Represented</div>
            </div>
          </div>
          {stats.total === 0 && (
            <div className="text-center mt-8 text-sm text-hcrf-text-secondary font-medium">
              Institutional invitations are currently being issued.
            </div>
          )}
        </div>
      </section>

      {/* 3. Purpose and safeguards */}
      <section className="py-20 bg-hcrf-surface-muted">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h3 className="text-3xl font-black text-hcrf-navy-900 mb-6">Why These Messages Matter</h3>
              <p className="text-hcrf-text-primary leading-relaxed font-medium mb-6 text-lg">
                These messages help establish an accountable public record around the State of Kashmir Crafts Assessment 2026–2027 Assessment. They demonstrate institutional awareness, encourage broad participation and place sector concerns, evidence and policy priorities within a transparent consultation framework.
              </p>
              <p className="text-hcrf-text-primary leading-relaxed font-medium text-lg">
                Each contribution is reviewed for authorship, institutional authority, relevance and publication consent before appearing on this platform.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-hcrf-border">
                <FaUserCheck className="text-hcrf-brown-700 text-2xl mb-4" />
                <h4 className="font-bold text-hcrf-navy-900 mb-2 text-lg">Verified Identity</h4>
                <p className="text-sm text-hcrf-text-secondary leading-relaxed">Contributor identity, role and institutional authority are reviewed before publication.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-hcrf-border">
                <FaCheckCircle className="text-hcrf-brown-700 text-2xl mb-4" />
                <h4 className="font-bold text-hcrf-navy-900 mb-2 text-lg">Contributor Approval</h4>
                <p className="text-sm text-hcrf-text-secondary leading-relaxed">No message is published until the contributor approves the final version.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-hcrf-border">
                <FaPenNib className="text-hcrf-brown-700 text-2xl mb-4" />
                <h4 className="font-bold text-hcrf-navy-900 mb-2 text-lg">Editorial Integrity</h4>
                <p className="text-sm text-hcrf-text-secondary leading-relaxed">Formatting and language may be improved without altering meaning or intent.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-hcrf-border">
                <FaArchive className="text-hcrf-brown-700 text-2xl mb-4" />
                <h4 className="font-bold text-hcrf-navy-900 mb-2 text-lg">Public Record</h4>
                <p className="text-sm text-hcrf-text-secondary leading-relaxed">Each published message receives a permanent reference number and archival record.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Message Categories */}
      <section className="py-20 bg-white border-y border-hcrf-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat, idx) => {
              const count = messages.filter(m => m.category === cat.id).length;
              return (
                <div key={idx} className="bg-hcrf-surface-muted border border-hcrf-border p-6 rounded-xl flex flex-col items-center text-center hover:shadow-md transition">
                  <cat.icon className="text-4xl text-hcrf-brown-700 mb-6" />
                  <h4 className="font-bold text-hcrf-navy-900 mb-3 text-sm leading-tight">{cat.id}</h4>
                  <p className="text-xs text-hcrf-text-secondary mb-6 flex-grow leading-relaxed">{cat.desc}</p>
                  <div className="text-3xl font-black text-hcrf-navy-900 mb-1">{count}</div>
                  <div className="text-[10px] uppercase font-bold text-hcrf-text-secondary mb-4 tracking-wider">Published</div>
                  <button onClick={() => handleCategoryClick(cat.id)} className="text-sm font-bold text-hcrf-brown-700 hover:text-hcrf-brown-900 transition">View category →</button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Invited Dignitary Submission Section */}
      <section className="py-24 bg-hcrf-surface-muted">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-hcrf-brown-900 rounded-2xl overflow-hidden shadow-xl flex flex-col lg:flex-row">
            {/* Left Column - Info */}
            <div className="lg:w-1/2 p-10 lg:p-14 text-white">
              <h3 className="text-3xl font-black mb-6">Submit an Invited Official Message</h3>
              <p className="text-lg text-white/90 font-medium leading-relaxed mb-10">
                Dignitaries, institutional representatives, sector leaders and invited experts may submit a signed message, official photograph and supporting institutional information through a secure verification process.
              </p>
              
              <div className="hidden sm:flex items-center text-xs font-bold uppercase tracking-wider text-hcrf-brown-300 gap-3">
                <span>Invitation verified</span>
                <FaArrowRight className="text-[10px]" />
                <span>Message submitted</span>
                <FaArrowRight className="text-[10px]" />
                <span>Editorial review</span>
                <FaArrowRight className="text-[10px]" />
                <span>Approval</span>
                <FaArrowRight className="text-[10px]" />
                <span>Publication</span>
              </div>
            </div>
            
            {/* Right Column - Action Panel */}
            <div className="lg:w-1/2 bg-white p-10 lg:p-14 flex flex-col justify-center border-l border-hcrf-border">
              <div className="space-y-4">
                <Link href="/state-of-kashmir-crafts/official-messages/invitation" className="button-primary block w-full py-4 text-center rounded-lg font-bold shadow-md text-lg">
                  Access Invitation
                </Link>
                <Link href="/state-of-kashmir-crafts/official-messages/request-invitation" className="button-light border border-gray-300 block w-full py-4 text-center rounded-lg font-bold hover:bg-gray-50 transition text-lg">
                  Request Official Submission Access
                </Link>
              </div>
              <div className="mt-8 pt-8 border-t border-hcrf-border flex flex-col gap-3">
                <Link href="/state-of-kashmir-crafts/official-messages/submission-guidelines" className="text-sm font-bold text-hcrf-brown-700 hover:underline flex items-center gap-2">
                  <FaArrowRight className="text-xs" /> View Submission Guidelines
                </Link>
                <Link href="/state-of-kashmir-crafts/contact-secretariat" className="text-sm font-bold text-hcrf-brown-700 hover:underline flex items-center gap-2">
                  <FaArrowRight className="text-xs" /> Contact Secretariat
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Featured Messages */}
      {featuredMessages.length > 0 && (
        <section className="py-20 bg-white border-b border-hcrf-border">
          <div className="container mx-auto px-4 max-w-7xl">
            <h3 className="text-2xl font-black text-hcrf-navy-900 mb-10">Featured Messages</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredMessages.slice(0, 3).map((msg: any, idx: number) => (
                <div key={msg.id} className={`bg-hcrf-surface-muted p-8 rounded-xl shadow-sm border border-hcrf-border flex flex-col ${idx === 0 ? 'lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center' : ''}`}>
                  <div className={`flex flex-col gap-4 ${idx === 0 ? 'items-start' : 'items-center text-center'}`}>
                    {msg.portraitUrl ? (
                      <img src={msg.portraitUrl} alt={msg.contributorName} className={`${idx === 0 ? 'w-24 h-24' : 'w-20 h-20'} rounded-full object-cover border-4 border-white shadow-sm`} />
                    ) : (
                      <div className={`${idx === 0 ? 'w-24 h-24 text-3xl' : 'w-20 h-20 text-2xl'} rounded-full bg-hcrf-brown-700/10 flex items-center justify-center text-hcrf-brown-700 font-bold border-4 border-white shadow-sm`}>
                        {msg.contributorName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-xl text-hcrf-navy-900 flex items-center gap-2 justify-center lg:justify-start">
                        {msg.contributorName} {msg.isVerified && <FaCheckCircle className="text-blue-500 text-sm" title="Verified Authorship" />}
                      </h4>
                      <div className="text-sm text-hcrf-text-secondary font-medium mt-1">{msg.designation}</div>
                      <div className="text-sm font-bold text-hcrf-brown-700 mt-1">{msg.organization}</div>
                    </div>
                  </div>
                  
                  <div className={`flex flex-col flex-grow ${idx === 0 ? '' : 'mt-6 pt-6 border-t border-hcrf-border'}`}>
                    <span className="bg-white text-hcrf-text-secondary text-[10px] font-bold px-2 py-1 rounded uppercase w-fit mb-4 border border-hcrf-border">{msg.category}</span>
                    <div className="text-hcrf-text-primary italic mb-6 flex-grow leading-relaxed text-lg">"{msg.excerpt || msg.title}"</div>
                    <div className="flex flex-wrap justify-between items-center pt-4 border-t border-hcrf-border gap-4 mt-auto">
                      <div className="text-xs text-hcrf-text-secondary font-bold uppercase tracking-wider">{new Date(msg.publishedAt).toLocaleDateString()}</div>
                      <div className="flex gap-2">
                        <Link href={`/state-of-kashmir-crafts/official-messages/${msg.slug}`} className="text-xs font-bold bg-hcrf-brown-700 text-white px-4 py-2 rounded hover:bg-hcrf-brown-900 transition">Read Full</Link>
                        {msg.formattedPdfUrl && <a href={msg.formattedPdfUrl} target="_blank" className="text-xs font-bold bg-white text-hcrf-text-primary border border-hcrf-border px-4 py-2 rounded hover:bg-gray-50 transition flex items-center gap-2"><FaFilePdf /> PDF</a>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Public Message Register */}
      <section id="message-register" className="py-20 bg-hcrf-surface-muted">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Register Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-hcrf-border pb-6">
            <div className="max-w-2xl">
              <h3 className="text-3xl font-black text-hcrf-navy-900 mb-3">Public Message Register</h3>
              <p className="text-hcrf-text-secondary font-medium text-lg">Search and review verified messages published as part of the State of Kashmir Crafts Assessment 2026–2027 Assessment.</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-hcrf-border mb-8 flex flex-wrap gap-4 items-center">
            <div className="flex-grow min-w-[240px] relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search contributors or institutions..." 
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-hcrf-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hcrf-brown-500 text-sm font-medium"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="py-2.5 px-4 bg-gray-50 border border-hcrf-border rounded-lg text-sm font-bold text-hcrf-text-primary focus:outline-none focus:ring-2 focus:ring-hcrf-brown-500 min-w-[200px]"
              value={selectedCategory}
              onChange={e => handleCategoryClick(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
            </select>
            
            <select 
              className="py-2.5 px-4 bg-gray-50 border border-hcrf-border rounded-lg text-sm font-bold text-hcrf-text-primary focus:outline-none focus:ring-2 focus:ring-hcrf-brown-500"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="ALPHABETICAL">Alphabetical (A-Z)</option>
            </select>
            
            {searchTerm || selectedCategory !== 'ALL' || sortOrder !== 'NEWEST' ? (
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); setSortOrder('NEWEST'); }}
                className="text-sm font-bold text-hcrf-text-secondary hover:text-hcrf-navy-900"
              >
                Clear Filters
              </button>
            ) : null}
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-sm font-bold text-hcrf-text-primary bg-white px-4 py-2 rounded-lg border border-hcrf-border">
              {filteredMessages.length} published {filteredMessages.length === 1 ? 'message' : 'messages'}
            </div>
            <div className="text-xs font-bold text-hcrf-text-secondary uppercase tracking-wider">
              Registry last updated: {messages.length > 0 ? new Date(messages[0].publishedAt).toLocaleDateString() : 'Not yet published'}
            </div>
          </div>

          {messages.length === 0 && !loading ? (
            /* 2-Column Empty State Layout */
            <div className="bg-white border border-hcrf-border rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
              <div className="md:w-1/2 p-10 lg:p-14 bg-hcrf-surface-muted flex flex-col justify-center">
                <FaArchive className="text-4xl text-hcrf-brown-300 mb-6" />
                <h3 className="text-2xl font-black text-hcrf-navy-900 mb-4 leading-tight">The Public Message Register Is Being Prepared</h3>
                <p className="text-hcrf-text-secondary mb-6 font-medium leading-relaxed">
                  Verified institutional and invited messages will appear here after identity confirmation, editorial review and contributor approval.
                </p>
                <p className="text-hcrf-text-secondary mb-8 font-medium leading-relaxed">
                  Each published contribution will include an official profile, message text, publication date and permanent reference number.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/state-of-kashmir-crafts/official-messages/submission-guidelines" className="button-secondary-dark !text-hcrf-navy-900 !border-hcrf-border hover:!bg-white px-6 py-2.5 rounded font-bold text-sm text-center">
                    View Submission Guidelines
                  </Link>
                  <Link href="/state-of-kashmir-crafts/official-messages/request-invitation" className="button-primary px-6 py-2.5 rounded font-bold text-sm text-center">
                    Request an Invitation
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 p-10 lg:p-14 border-l border-hcrf-border flex flex-col justify-center bg-white relative">
                <div className="absolute top-6 right-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">What will appear here</div>
                
                {/* Mock Card */}
                <div className="border border-gray-100 rounded-xl p-6 bg-gray-50/50 opacity-60">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div>
                      <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 w-48 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-3 w-20 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Message Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMessages.map((msg: any) => (
                <div key={msg.id} className="bg-white p-6 rounded-xl shadow-sm border border-hcrf-border hover:shadow-md transition flex flex-col">
                  <div className="mb-5 flex items-start gap-4">
                     {msg.portraitUrl ? (
                      <img src={msg.portraitUrl} alt={msg.contributorName} className="w-14 h-14 rounded-full object-cover border border-hcrf-border" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-hcrf-brown-700/10 flex items-center justify-center text-hcrf-brown-700 font-bold text-xl">
                        {msg.contributorName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-hcrf-navy-900 mb-1">{msg.contributorName} {msg.isVerified && <FaCheckCircle className="inline text-blue-500 text-xs" />}</h4>
                      <div className="text-xs text-hcrf-text-secondary mb-1">{msg.designation}</div>
                      <div className="text-xs font-bold text-hcrf-brown-700">{msg.organization}</div>
                    </div>
                  </div>
                  <span className="inline-block bg-gray-50 text-hcrf-text-secondary text-[10px] font-bold px-2 py-1.5 rounded uppercase mb-4 border border-hcrf-border w-fit">{msg.category}</span>
                  <div className="text-sm text-hcrf-text-primary mb-6 flex-grow line-clamp-4 leading-relaxed">"{msg.excerpt || msg.title}"</div>
                  <div className="flex justify-between items-center pt-4 border-t border-hcrf-border mt-auto">
                    <div className="text-[10px] text-hcrf-text-secondary uppercase font-bold tracking-wider">{new Date(msg.publishedAt).toLocaleDateString()}</div>
                    <div className="flex gap-2">
                      <Link href={`/state-of-kashmir-crafts/official-messages/${msg.slug}`} className="text-xs font-bold text-hcrf-brown-700 hover:underline">Read Message</Link>
                      {msg.formattedPdfUrl && <a href={msg.formattedPdfUrl} target="_blank" className="text-xs font-bold text-hcrf-text-secondary hover:text-hcrf-brown-700 transition border-l border-hcrf-border pl-2"><FaFilePdf /></a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 10. Transparency Section */}
      <section className="py-20 bg-white border-t border-hcrf-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-black text-hcrf-navy-900 mb-4">Transparency and Editorial Governance</h3>
              <p className="text-hcrf-text-secondary leading-relaxed font-medium mb-8">
                Every published contribution forms part of the official public record of the State of Kashmir Crafts Assessment 2026–2027 Assessment.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/state-of-kashmir-crafts/official-messages/editorial-policy" className="text-sm font-bold text-hcrf-brown-700 hover:underline flex items-center gap-2"><FaArrowRight className="text-xs" /> Read Editorial Policy</Link>
                <Link href="/state-of-kashmir-crafts/official-messages/submission-guidelines" className="text-sm font-bold text-hcrf-brown-700 hover:underline flex items-center gap-2"><FaArrowRight className="text-xs" /> Read Submission Guidelines</Link>
                <Link href="/privacy-policy#official-message-submissions" className="text-sm font-bold text-hcrf-brown-700 hover:underline flex items-center gap-2"><FaArrowRight className="text-xs" /> Read Privacy Notice</Link>
                <Link href="/state-of-kashmir-crafts/official-messages/archival-policy" className="text-sm font-bold text-hcrf-brown-700 hover:underline flex items-center gap-2"><FaArrowRight className="text-xs" /> Read Archival Policy</Link>
              </div>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-hcrf-surface-muted p-6 rounded-xl border border-hcrf-border">
                <h4 className="font-bold text-hcrf-navy-900 mb-2">Contributor Ownership</h4>
                <p className="text-sm text-hcrf-text-secondary leading-relaxed">The contributor retains ownership of the views and statements expressed.</p>
              </div>
              <div className="bg-hcrf-surface-muted p-6 rounded-xl border border-hcrf-border">
                <h4 className="font-bold text-hcrf-navy-900 mb-2">Editorial Control</h4>
                <p className="text-sm text-hcrf-text-secondary leading-relaxed">KHCRF may correct grammar, formatting and accessibility issues, but may not change substantive meaning without approval.</p>
              </div>
              <div className="bg-hcrf-surface-muted p-6 rounded-xl border border-hcrf-border">
                <h4 className="font-bold text-hcrf-navy-900 mb-2">Non-Endorsement</h4>
                <p className="text-sm text-hcrf-text-secondary leading-relaxed">Publication does not imply agreement or endorsement by KHCRF, the Assessment Secretariat, Advisory Council or participating institutions.</p>
              </div>
              <div className="bg-hcrf-surface-muted p-6 rounded-xl border border-hcrf-border">
                <h4 className="font-bold text-hcrf-navy-900 mb-2">Permanent Archive</h4>
                <p className="text-sm text-hcrf-text-secondary leading-relaxed">Published messages receive a unique reference number and remain available as part of the assessment archive.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Final CTA */}
      <section className="py-24 bg-hcrf-navy-950 text-white text-center border-t-8 border-hcrf-brown-700">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-black mb-6">Contribute to the Official Public Record</h2>
          <p className="text-lg text-gray-300 font-medium leading-relaxed mb-10">
            Invited dignitaries, institutional representatives and sector leaders may submit a verified message before the public consultation opens.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/state-of-kashmir-crafts/official-messages/invitation" className="button-primary px-8 py-4 rounded-[14px] font-bold w-full sm:w-auto transition shadow-xl">
              Submit an Invited Message
            </Link>
            <Link href="/state-of-kashmir-crafts/official-messages/request-invitation" className="button-secondary-dark border-2 px-8 py-4 rounded-[14px] font-bold w-full sm:w-auto transition">
              Request an Invitation
            </Link>
            <Link href="/state-of-kashmir-crafts/contact-secretariat" className="button-light px-8 py-4 rounded-[14px] font-bold w-full sm:w-auto transition shadow-xl">
              Contact the Assessment Secretariat
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
