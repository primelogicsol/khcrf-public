import React from "react";
import Link from "next/link";
import { AssessmentCycle2026 } from '@/config/assessmentCycle';
import { generateEngagementSnapshot } from '@/lib/skc/engagement/ConsultationExperimentEngine';
import { getDistrictEngagementBreakdown } from '@/lib/skc/engagement/DistrictEngagementBreakdown';
import {
  getAssessmentStatusPresentation,
  getEnrollmentStatusLabel,
} from '@/lib/skc/assessment/statusPresentation';
import { notFound } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaUniversity,
  FaFileAlt,
  FaFolderOpen,
  FaMicrophone,
  FaHammer,
  FaBuilding,
  FaGlobe,
  FaStore,
  FaUserGraduate,
  FaUser,
  FaLandmark,
  FaComments,
  FaChartBar,
  FaArrowRight,
} from "react-icons/fa";

const districtData: Record<string, { name: string; stakeholdersTarget: number; institutionsTarget: number }> = {
  srinagar: { name: "Srinagar", stakeholdersTarget: 75, institutionsTarget: 10 },
  anantnag: { name: "Anantnag", stakeholdersTarget: 60, institutionsTarget: 8 },
  baramulla: { name: "Baramulla", stakeholdersTarget: 55, institutionsTarget: 7 },
  budgam: { name: "Budgam", stakeholdersTarget: 65, institutionsTarget: 6 },
  bandipora: { name: "Bandipora", stakeholdersTarget: 40, institutionsTarget: 4 },
  ganderbal: { name: "Ganderbal", stakeholdersTarget: 45, institutionsTarget: 4 },
  kulgam: { name: "Kulgam", stakeholdersTarget: 40, institutionsTarget: 3 },
  kupwara: { name: "Kupwara", stakeholdersTarget: 45, institutionsTarget: 4 },
  pulwama: { name: "Pulwama", stakeholdersTarget: 50, institutionsTarget: 5 },
  shopian: { name: "Shopian", stakeholdersTarget: 35, institutionsTarget: 3 },
};

export function generateStaticParams() {
  return Object.keys(districtData).map((slug: any) => ({ slug }));
}

export default async function DistrictDashboardPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug.toLowerCase();
  const district = districtData[slug];

  if (!district) notFound();

  const engagementSnapshot = generateEngagementSnapshot();
  const districtEngagement = engagementSnapshot.districts[district.name] || 0;
  const districtBreakdown = getDistrictEngagementBreakdown(engagementSnapshot, district.name);

  const registrationStage = AssessmentCycle2026.registration;
  const registrationStatus = getAssessmentStatusPresentation(registrationStage.status);
  const enrollmentStatusLabel = getEnrollmentStatusLabel(registrationStage.status);

  const districtBreakdownRows = [
    { label: "Artisans", value: districtBreakdown.artisans, icon: FaHammer },
    { label: "Manufacturers", value: districtBreakdown.manufacturers, icon: FaBuilding },
    { label: "Exporters", value: districtBreakdown.exporters, icon: FaGlobe },
    { label: "Retailers", value: districtBreakdown.retailers, icon: FaStore },
    { label: "Youth", value: districtBreakdown.youth, icon: FaUserGraduate },
    { label: "Citizens", value: districtBreakdown.citizens, icon: FaUser },
    { label: "Researchers", value: districtBreakdown.researchers, icon: FaFileAlt },
    { label: "Institutional Engagement", value: districtBreakdown.institutions, icon: FaLandmark },
    { label: "Other Participants", value: districtBreakdown.otherParticipants, icon: FaUsers },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans text-brand-dark">
      <section className="universal-hero text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div data-editorial-accent-text className="flex items-center gap-3 font-bold uppercase tracking-widest text-sm mb-6">
              <FaMapMarkerAlt />
              <span>District Intelligence Dashboard</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">{district.name} District</h1>
            <p className="text-xl text-gray-300 mb-12 font-medium">State of Kashmir Crafts Assessment 2026–2027 Assessment</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-sm">
                <div className="text-sm text-gray-300 font-bold mb-2 uppercase tracking-wide">Verified Registry Target</div>
                <div className="text-4xl font-black text-white">{district.stakeholdersTarget}</div>
              </div>
              <div className="bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-sm">
                <div className="text-sm text-gray-300 font-bold mb-2 uppercase tracking-wide">Institution Registry Target</div>
                <div className="text-4xl font-black text-white">{district.institutionsTarget}</div>
              </div>
              <div className={`${registrationStatus.heroPanelClass} p-6 rounded-2xl border backdrop-blur-sm flex flex-col justify-center transition-all duration-300`}>
                <div className={`text-sm font-bold mb-2 uppercase tracking-wide ${registrationStatus.heroLabelClass}`}>Status</div>
                <div className="flex items-start gap-2.5">
                  <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${registrationStatus.heroDotClass}`} aria-hidden="true" />
                  <div>
                    <div className="text-xl font-black text-white leading-tight">{enrollmentStatusLabel}</div>
                    <div className={`text-xs font-bold mt-2 ${registrationStatus.heroLabelClass}`}>
                      Roadmap status: {registrationStatus.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center p-4 border-r border-gray-100 last:border-0 hidden md:block">
              <FaUsers className="mx-auto text-3xl text-gray-300 mb-3" />
              <div className="text-2xl font-black text-brand-dark">{districtEngagement.toLocaleString()}</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Stakeholder Engagement</div>
            </div>
            <div className="text-center p-4 border-r border-gray-100">
              <FaUniversity className="mx-auto text-3xl text-gray-300 mb-3" />
              <div className="text-2xl font-black text-brand-dark">0 <span className="text-sm text-gray-400">/ {district.institutionsTarget}</span></div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Verified Institutions</div>
            </div>
            <div className="text-center p-4 border-r border-gray-100">
              <FaFileAlt className="mx-auto text-3xl text-gray-300 mb-3" />
              <div className="text-2xl font-black text-brand-dark">0</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Consultation Responses</div>
            </div>
            <div className="text-center p-4 border-r border-gray-100">
              <FaFolderOpen className="mx-auto text-3xl text-gray-300 mb-3" />
              <div className="text-2xl font-black text-brand-dark">0</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Evidence Files</div>
            </div>
            <div className="text-center p-4">
              <FaMicrophone className="mx-auto text-3xl text-gray-300 mb-3" />
              <div className="text-2xl font-black text-brand-dark">0</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Hearings Conducted</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black flex items-center gap-3">
                    <FaHammer data-ui-icon className="" /> {district.name} Craft Coverage
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {["Pashmina", "Papier-Mâché", "Sozni", "Walnut Wood", "Copperware", "Chain Stitch", "Khatamband"].map((craft: any) => (
                    <div key={craft} className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-center hover:border-brand-primary transition">
                      <div className="font-bold text-gray-800 mb-1">{craft}</div>
                      <div className="text-xs font-bold text-brand-primary bg-brand-primary/5 inline-block px-2 py-1 rounded">0 Verified Participants</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
                  <FaComments data-ui-icon className="" /> Consultation Themes
                </h2>
                <p className="text-gray-500 text-sm mb-6">Dynamic theme extraction from verified {district.name} submissions.</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {["Livelihoods", "Market Access", "Training", "Tourism", "Exports", "Youth", "Authenticity", "GI Protection"].map((theme: any) => (
                    <span key={theme} className="px-4 py-2 bg-gray-50 border border-gray-200 text-sm font-bold text-gray-600 rounded-[12px]">{theme}</span>
                  ))}
                </div>

                <div className="bg-gray-50 p-6 rounded-xl text-center border border-dashed border-gray-300">
                  <p className="text-gray-500 font-medium">No verified consultation submissions yet. Themes will appear as substantive submissions are received.</p>
                </div>
              </div>

              <div className="bg-brand-dark text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><FaComments className="text-9xl" /></div>
                <h2 className="text-2xl font-black mb-6 relative z-10">What We Heard From {district.name}</h2>
                <div className="bg-white/10 p-6 rounded-xl border border-white/10 relative z-10 backdrop-blur-md">
                  <p className="text-gray-300 text-sm italic">Verified quotes, testimonies, and qualitative themes from {district.name} will appear here as the assessment receives substantive contributions.</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                  <FaChartBar data-ui-icon className="" /> {district.name} Findings
                </h2>
                <div className="space-y-4">
                  {["Draft Findings", "Validation Comments", "Final Findings"].map((step: any) => (
                    <div key={step} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50 opacity-60">
                      <span className="font-bold text-gray-700">{step}</span>
                      <span className="text-xs font-bold px-3 py-1 bg-gray-200 text-gray-500 rounded-[10px]">Pending</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-black mb-2">District Engagement Breakdown</h3>
                <p className="text-xs text-gray-400 font-semibold mb-6">Analytical distribution of the current {district.name} engagement total.</p>
                <div className="space-y-3">
                  {districtBreakdownRows.map((sh: any) => (
                    <div key={sh.label} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3 text-gray-600 font-medium group-hover:text-brand-primary transition">
                        <sh.icon className="text-gray-400 group-hover:text-brand-secondary" />
                        {sh.label}
                      </div>
                      <div className="font-black text-gray-800">{sh.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-black">
                  <span className="text-gray-500 uppercase tracking-wide">District Total</span>
                  <span className="text-brand-dark">{districtBreakdown.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-black mb-4 flex items-center gap-2"><FaFolderOpen data-ui-icon className=""/> Evidence Repository</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Reports", "Photos", "Videos", "Research", "Documents"].map((doc: any) => (
                    <span key={doc} className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{doc}</span>
                  ))}
                </div>

                <hr className="border-gray-100 mb-6" />

                <h3 className="text-lg font-black mb-4 flex items-center gap-2"><FaLandmark data-ui-icon className=""/> District Institutions</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Universities", "Associations", "Govt Offices", "Media", "Civil Society"].map((inst: any) => (
                    <span key={inst} className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{inst}</span>
                  ))}
                </div>

                <hr className="border-gray-100 mb-6" />

                <h3 className="text-lg font-black mb-4 flex items-center gap-2"><FaMicrophone data-ui-icon className=""/> Public Hearings</h3>
                <ul className="space-y-2 text-sm font-medium text-gray-600">
                  <li className="flex items-center gap-2"><FaArrowRight className="text-gray-300 text-xs"/> Upcoming Hearings</li>
                  <li className="flex items-center gap-2"><FaArrowRight className="text-gray-300 text-xs"/> Past Hearings</li>
                  <li className="flex items-center gap-2"><FaArrowRight className="text-gray-300 text-xs"/> Hearing Summaries</li>
                  <li className="flex items-center gap-2"><FaArrowRight className="text-gray-300 text-xs"/> Recordings</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-brand-primary to-brand-dark p-8 rounded-3xl shadow-xl text-white text-center">
                <h3 className="text-2xl font-black mb-2">Represent {district.name}</h3>
                <p className="text-sm text-gray-300 mb-8 leading-relaxed">Ensure the voice of your district is included in the State of Kashmir Crafts Assessment 2026–2027 Assessment.</p>

                <div className="space-y-3">
                  <Link href="/state-of-kashmir-crafts/stakeholder-registry" className="block w-full py-3 bg-white text-brand-dark font-black rounded-xl hover:bg-brand-secondary transition shadow-md">Register</Link>
                  <Link href="/state-of-kashmir-crafts/evidence-repository" className="block w-full py-3 bg-white/10 border border-white/20 text-white font-black rounded-xl hover:bg-white/20 transition">Submit Evidence</Link>
                  <Link href="/state-of-kashmir-crafts/public-hearings" className="block w-full py-3 bg-white/10 border border-white/20 text-white font-black rounded-xl hover:bg-white/20 transition">Join Public Hearing</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
