"use client";

import Link from "next/link";
import { FaArrowLeft, FaBookOpen, FaCalendarAlt } from "react-icons/fa";

export default function GlobalUpcomingPublicationsPage() {
  const upcoming = [
    {
      title: "Best Practices for Pashmina Authentication",
      subtitle: "A technical and practical guide",
      audience: "Buyers, Artisans, Exporters, Policymakers",
      status: "In Preparation",
      release: "Q4 2026",
      category: "Best Practices",
      slug: "best-practices",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Sustainable Dyeing Techniques",
      subtitle: "Minimizing ecological footprints in Kashmir Handlooms",
      audience: "Artisans, Manufacturers, Environmental Agencies",
      status: "Drafting",
      release: "Q1 2027",
      category: "Best Practices",
      slug: "best-practices",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Ergonomics and Health for Loom Weavers",
      subtitle: "Preventative care and loom adjustments",
      audience: "Artisans, Cooperatives, Health Workers",
      status: "Data Collection",
      release: "Q2 2027",
      category: "Best Practices",
      slug: "best-practices",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Digital Marketing for Rural Artisan Collectives",
      subtitle: "Building brand presence on a budget",
      audience: "Artisan Groups, NGOs, Marketers",
      status: "In Preparation",
      release: "Q3 2027",
      category: "Best Practices",
      slug: "best-practices",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Packaging Guidelines for Fragile Handicrafts",
      subtitle: "Securing Papier-Mâché and Walnut Wood for export",
      audience: "Exporters, Logisticians, Artisans",
      status: "Drafting",
      release: "Q4 2027",
      category: "Best Practices",
      slug: "best-practices",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Ethical Sourcing of Raw Materials",
      subtitle: "Supply chain transparency in Pashmina and Silk",
      audience: "Manufacturers, Certifying Bodies",
      status: "Planning",
      release: "Q1 2028",
      category: "Best Practices",
      slug: "best-practices",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Sustainable Livelihoods in Artisan Clusters",
      subtitle: "Field Insights from 5 Districts",
      audience: "NGOs, Researchers, Philanthropists",
      status: "Data Collection",
      release: "Q2 2027",
      category: "Case Studies",
      slug: "case-studies",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Revival of the Kani Weaving Cooperative",
      subtitle: "A success story in collective bargaining",
      audience: "Cooperatives, Government, Academics",
      status: "In Preparation",
      release: "Q1 2027",
      category: "Case Studies",
      slug: "case-studies",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Blockchain Traceability in the Carpet Industry",
      subtitle: "How GI tags were digitized in Kashmir",
      audience: "Tech Partners, Certifying Agencies, Exporters",
      status: "Drafting",
      release: "Q3 2027",
      category: "Case Studies",
      slug: "case-studies",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Artisan-to-Consumer Direct Retail Models",
      subtitle: "Bypassing intermediaries for fair pricing",
      audience: "Artisans, Retail Platforms, Economists",
      status: "Peer Review",
      release: "Q4 2026",
      category: "Case Studies",
      slug: "case-studies",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Impact of Micro-Finance on Women Embroiderers",
      subtitle: "Empowerment through Sozni and Crewel crafts",
      audience: "Financial Institutions, NGOs, Sociologists",
      status: "Data Collection",
      release: "Q2 2027",
      category: "Case Studies",
      slug: "case-studies",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Crafting Post-Crisis",
      subtitle: "Resilience in artisan families during economic shocks",
      audience: "Policymakers, Researchers, Aid Agencies",
      status: "Planning",
      release: "Q4 2027",
      category: "Case Studies",
      slug: "case-studies",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Historical Trajectories of Walnut Wood Carving",
      subtitle: "Evolution of motifs from 18th to 21st century",
      audience: "Historians, Academics, Museums",
      status: "Peer Review",
      release: "Q4 2026",
      category: "Research Papers",
      slug: "research-papers",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Economic Impact of Counterfeit Craft",
      subtitle: "Quantitative analysis of lost revenues in J&K",
      audience: "Economists, Policymakers, Trade Bodies",
      status: "Data Analysis",
      release: "Q2 2027",
      category: "Research Papers",
      slug: "research-papers",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Supply Chain Traceability in Pashmina Production",
      subtitle: "From nomadic herders to luxury boutiques",
      audience: "Researchers, Trade Authorities",
      status: "Drafting",
      release: "Q1 2027",
      category: "Research Papers",
      slug: "research-papers",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Socio-Economic Mobility among Craft Cooperatives",
      subtitle: "A comparative decade study",
      audience: "Sociologists, Government Agencies",
      status: "Data Collection",
      release: "Q3 2027",
      category: "Research Papers",
      slug: "research-papers",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Climate Change Impact on Willow Wicker Availability",
      subtitle: "Ecological shifts affecting wetland resources",
      audience: "Environmentalists, Artisans, Researchers",
      status: "In Preparation",
      release: "Q4 2027",
      category: "Research Papers",
      slug: "research-papers",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Gender Dynamics in the Sozni Embroidery Workforce",
      subtitle: "Unpaid labor and formalization",
      audience: "Academics, Labor Orgs, NGOs",
      status: "Planning",
      release: "Q1 2028",
      category: "Research Papers",
      slug: "research-papers",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "The Encyclopedia of Kashmir Crafts",
      subtitle: "Volume I: Textiles and Weaves",
      audience: "Global Libraries, Researchers, Collectors",
      status: "Editing",
      release: "Q3 2027",
      category: "Knowledge Books",
      slug: "knowledge-books",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Master Artisans of the Valley",
      subtitle: "Biographical insights and techniques",
      audience: "General Public, Students, Heritage Enthusiasts",
      status: "Drafting",
      release: "Q4 2027",
      category: "Knowledge Books",
      slug: "knowledge-books",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "The Art of Papier-Mâché",
      subtitle: "From raw material to masterpiece",
      audience: "Art Historians, Practitioners, Museums",
      status: "In Preparation",
      release: "Q1 2028",
      category: "Knowledge Books",
      slug: "knowledge-books",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Traditional Dyeing Recipes of Kashmir",
      subtitle: "Documenting lost botanical formulas",
      audience: "Dyers, Conservationists, Textile Students",
      status: "Data Collection",
      release: "Q2 2028",
      category: "Knowledge Books",
      slug: "knowledge-books",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Motifs and Meanings",
      subtitle: "Decoding Kashmiri Carpet Designs",
      audience: "Designers, Collectors, Academics",
      status: "Drafting",
      release: "Q3 2028",
      category: "Knowledge Books",
      slug: "knowledge-books",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "History of the Silk Route Trade",
      subtitle: "Kashmir's strategic role in global craft exchange",
      audience: "Historians, Trade Orgs, General Public",
      status: "Planning",
      release: "Q4 2028",
      category: "Knowledge Books",
      slug: "knowledge-books",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Geographical Indications & Global IP",
      subtitle: "Securing Kashmir's Heritage",
      audience: "Legal Experts, Trade Bodies, Government",
      status: "Drafting",
      release: "Q1 2027",
      category: "Policy Briefs",
      slug: "policy-briefs",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Export Subsidies and Artisan Welfare",
      subtitle: "Proposing a dual-benefit framework",
      audience: "Policymakers, Exporters, Trade Unions",
      status: "In Preparation",
      release: "Q4 2026",
      category: "Policy Briefs",
      slug: "policy-briefs",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Fair Wage Implementation in Craft Sectors",
      subtitle: "Standardizing compensation across GI crafts",
      audience: "Labor Departments, Cooperatives, NGOs",
      status: "Data Collection",
      release: "Q2 2027",
      category: "Policy Briefs",
      slug: "policy-briefs",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Tax Exemptions for Heritage Artisans",
      subtitle: "Fiscal strategies for craft preservation",
      audience: "Finance Ministry, Artisan Guilds, Economists",
      status: "Drafting",
      release: "Q3 2027",
      category: "Policy Briefs",
      slug: "policy-briefs",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Environmental Standards for Dyeing Facilities",
      subtitle: "Regulatory frameworks for water management",
      audience: "Environmental Protection Agencies, Industry",
      status: "In Preparation",
      release: "Q4 2027",
      category: "Policy Briefs",
      slug: "policy-briefs",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Anti-Counterfeiting Legislation",
      subtitle: "Protecting authentic crafts at retail borders",
      audience: "Customs Officials, Legal Experts, Brands",
      status: "Planning",
      release: "Q1 2028",
      category: "Policy Briefs",
      slug: "policy-briefs",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Luxury Consumer Trends in North America",
      subtitle: "Demand forecasting for authentic Pashmina",
      audience: "Exporters, Global Brands, Retailers",
      status: "Data Collection",
      release: "Q1 2027",
      category: "Market Intelligence",
      slug: "market-intelligence",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "European Trade Regulations 2027",
      subtitle: "Compliance requirements for Kashmir handicrafts",
      audience: "Exporters, Trade Bodies, Supply Chain Managers",
      status: "Drafting",
      release: "Q2 2027",
      category: "Market Intelligence",
      slug: "market-intelligence",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Middle East Export Opportunities",
      subtitle: "Growing markets for Walnut Wood Carvings",
      audience: "Export Councils, Distributors, Investors",
      status: "In Preparation",
      release: "Q3 2027",
      category: "Market Intelligence",
      slug: "market-intelligence",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "E-Commerce Penetration in South Asia",
      subtitle: "Digital sales models for Kashmiri carpets",
      audience: "Retail Platforms, Exporters, Artisans",
      status: "Data Analysis",
      release: "Q4 2027",
      category: "Market Intelligence",
      slug: "market-intelligence",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Millennial Sentiment on Sustainable Craft",
      subtitle: "Global willingness-to-pay for ethical goods",
      audience: "Marketers, Global Brands, NGOs",
      status: "Drafting",
      release: "Q1 2028",
      category: "Market Intelligence",
      slug: "market-intelligence",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "High-Net-Worth Buyers in Asian Markets",
      subtitle: "Targeting ultra-luxury segments with Kani Shawls",
      audience: "Luxury Brands, Boutique Owners",
      status: "Planning",
      release: "Q2 2028",
      category: "Market Intelligence",
      slug: "market-intelligence",
      icon: <FaBookOpen className="text-xl" />,
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 mt-10 mb-32">
        <div className="mb-12 text-center">
          <Link href="/publications" className="inline-flex text-xs font-black text-gray-400 hover:text-brand-primary uppercase tracking-widest items-center gap-2 mb-6">
            <FaArrowLeft /> Back to Library
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-brand-dark leading-tight mb-4">
            Upcoming <span className="text-brand-primary">Releases</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
            The KHCRF Editorial Board is actively curating and preparing a rigorous pipeline of new research and guidelines to support the craft ecosystem across all disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--card-left-accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-4">
                <Link href={`/publications/${item.slug}`} className="text-[10px] font-black text-white bg-brand-dark px-3 py-1 rounded-full uppercase tracking-widest hover:bg-brand-primary transition-colors">
                  {item.category}
                </Link>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {item.release}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-brand-dark mb-2 leading-snug">{item.title}</h3>
              <p className="text-sm font-semibold text-gray-500 mb-4 flex-1">{item.subtitle}</p>
              
              <div className="mt-auto pt-4 border-t border-gray-50 mb-4">
                <p className="text-[11px] font-medium text-gray-400">
                  <span className="font-bold text-gray-600">Status:</span> {item.status}
                </p>
                <p className="text-[11px] font-medium text-gray-400 mt-1">
                  <span className="font-bold text-gray-600">Audience:</span> {item.audience}
                </p>
              </div>
              
              <Link
                href="/about/contact?subject=Notify Me: upcoming publication"
                className="w-full py-3 bg-gray-50 text-brand-dark rounded-xl hover:bg-brand-primary hover:text-white transition-all text-[11px] font-black uppercase tracking-wider block text-center border border-gray-100"
              >
                <FaCalendarAlt className="inline-block mr-2" /> Notify Me
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
