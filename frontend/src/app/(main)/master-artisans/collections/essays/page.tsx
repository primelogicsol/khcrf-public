'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { collectionEssaysHeroFallback } from '@/config/heroFallbacks';

interface ReferencedObject {
  id: string;
  title: string;
}

interface AuthorProfile {
  name: string;
  role: string;
  institution: string;
  researchAreas: string[];
  biography: string;
  orcid?: string;
}

interface Essay {
  slug: string;
  essayNumber: string;
  title: string;
  subtitle: string;
  essayType: string;
  author: string;
  coAuthors?: string;
  institution: string;
  primaryCraft: string;
  relatedCollection: string;
  researchThemes: string[];
  historicalPeriod: string;
  geographicFocus: string;
  publicationDate: string;
  lastUpdated: string;
  readingTime: string;
  language: string;
  reviewStatus: 'Peer Reviewed' | 'Technical Review' | 'Editorially Reviewed' | 'Artisan-Verified' | 'Research Note' | 'Working Paper';
  status: string;
  doi?: string;
  abstract: string;
  keyQuestions: string[];
  mainText: string;
  bibliography: string[];
  referencedObjects: ReferencedObject[];
  authorProfile: AuthorProfile;
  evidenceClassification: { label: string; details: string }[];
}

export default function CollectionEssays() {
  const [allEssays] = useState<Essay[]>([
    {
      slug: "ro-object-beyond-beauty",
      essayNumber: "KHCRF-CE-2026-001",
      title: "The Object Beyond Beauty",
      subtitle: "Reading Labour, Knowledge, Memory, and Cultural Meaning in Kashmir’s Craft Heritage",
      essayType: "Curatorial Essay",
      author: "Dr. Farooq Mir",
      coAuthors: "Sarah Moore",
      institution: "Kashmir Research Institute",
      primaryCraft: "Multi-Craft",
      relatedCollection: "Heritage Collections",
      researchThemes: ["Material Culture", "Craft Labour", "Cultural Memory", "Object Interpretation"],
      historicalPeriod: "Multi-Period",
      geographicFocus: "Kashmir Valley",
      publicationDate: "July 2026",
      lastUpdated: "July 2026",
      readingTime: "18 Minutes",
      language: "English",
      reviewStatus: "Peer Reviewed",
      status: "Published",
      doi: "10.5072/hcrf.ce.2026.001",
      abstract: "Kashmir’s craft objects are frequently celebrated for beauty, refinement, and technical complexity. Yet their significance extends far beyond their visible surfaces. This essay examines the networks of knowledge, labour, materials, family relationships, workshop discipline, ecological conditions, economic structures, and cultural memory embedded within crafted objects. Through examples drawn from textiles, wood, metal, papier-mâché, and felt traditions, it proposes a more complete way of reading craft—one that recognizes the object as both an artistic achievement and a record of human experience.",
      keyQuestions: [
        "How can we move beyond pure aesthetic appreciation to read craft objects as records of labour?",
        "What role does community and family memory play in transmitting technical knowledge?",
        "How do material constraints shape the artistic choices of artisans across different eras?"
      ],
      mainText: "Craft objects do not speak entirely for themselves. Their meaning emerges through context. A shawl may reveal histories of labour, trade, gender, material knowledge, patronage, colonial exchange, and design migration. A carved walnut panel may preserve workshop lineages, architectural traditions, tool marks, regional aesthetics, and changing relationships between craft and built space. Collection Essays bring these layers together through documented research and informed interpretation. Over the past centuries, Kashmiri craftsmen have engaged with complex material realities, negotiating environmental change and shifting international patron networks. Reading the object as a repository of these transactions changes our understanding of the artifacts preserved in museums today. Rather than isolating them as luxury symbols, we begin to map the human struggles, apprentice timelines, and ecological boundaries that made their execution possible.",
      bibliography: [
        "Mir, Farooq. Craft Pedagogy and Workshop Culture in Srinagar. Kashmir Academic Press, 2022.",
        "Moore, Sarah. Textiles of the Western Himalayas: Trade and Production. London Press, 2019."
      ],
      referencedObjects: [
        { id: "KHCRF-OBJ-2026-0142", title: "Sozni Shawl with Chinar Border" },
        { id: "KHCRF-OBJ-2026-0218", title: "Walnut Panel with Chinar Relief" }
      ],
      authorProfile: {
        name: "Dr. Farooq Mir",
        role: "Senior Scholar & Curator",
        institution: "Kashmir Research Institute",
        researchAreas: ["Material Culture", "Sufi Lineages", "Social History of Srinagar"],
        biography: "Dr. Farooq Mir has spent over two decades researching the socio-economic conditions of traditional craft workshops in Srinagar.",
        orcid: "0000-0002-1823-4456"
      },
      evidenceClassification: [
        { label: "Documented Evidence", details: "Loom registration ledgers from 1895-1920." },
        { label: "Oral Testimony", details: "Interviews with three generations of downtown Srinagar weaving families." }
      ]
    },
    {
      slug: "reading-the-talim",
      essayNumber: "KHCRF-CE-2026-002",
      title: "Reading the Talim",
      subtitle: "Design Language, Memory, and Communication in Kashmir Carpet Workshops",
      essayType: "Technical Essay",
      author: "M. Y. Kani",
      institution: "Srinagar Handloom Association",
      primaryCraft: "Hand-Knotted Carpet",
      relatedCollection: "Workshop Archives",
      researchThemes: ["Technical Knowledge", "Workshop Culture", "Design Evolution", "Knowledge Transmission"],
      historicalPeriod: "19th Century",
      geographicFocus: "Srinagar",
      publicationDate: "June 2026",
      lastUpdated: "June 2026",
      readingTime: "24 Minutes",
      language: "English (Translation Available)",
      reviewStatus: "Technical Review",
      status: "Published",
      doi: "10.5072/hcrf.ce.2026.002",
      abstract: "An examination of talim as a coded design system, a method of workshop communication, and a form of specialized technical knowledge transmitted across generations. The essay explores the historical transition from pictorial graphs to written talim notation scripts.",
      keyQuestions: [
        "What is the mathematical structure behind talim color codes?",
        "How is talim notation read out loud in a traditional double-weaver loom setting?",
        "How does talim mapping prevent design copying by competing workshops?"
      ],
      mainText: "The talim is more than a carpet draft; it is a code. Written in specialized shorthand symbols indicating knot counts, yarn color IDs, and pattern indices, the talim translates visual architecture into sequential commands. Historically, carpet workshops relied on one reader (Talim Khwan) who chanted coordinates to weavers sitting at the loom. This oral recitation created a unique workflow loop that speeded production and ensured precision. By investigating the evolution of these codes, we find early forms of algorithmic design that predated digital punch cards, preserving unique patterns in Srinagar's historic guilds.",
      bibliography: [
        "Kani, M. Y. The Code of the Loom: Deciphering Talim Scripts. Srinagar Publishing, 2024.",
        "Srinagar Guild Registers, Volume IV, 1912."
      ],
      referencedObjects: [
        { id: "KHCRF-OBJ-2026-0012", title: "The Last Signed Talim Manuscript" }
      ],
      authorProfile: {
        name: "M. Y. Kani",
        role: "Master Weaver & Researcher",
        institution: "Srinagar Handloom Association",
        researchAreas: ["Talim Decipherment", "Guild Archives", "Double-Warp Loom Mechanics"],
        biography: "M. Y. Kani is a fifth-generation weaver who has digitized over 200 historical talim transcripts from family workshops."
      },
      evidenceClassification: [
        { label: "Technical Observation", details: "Loom coordinate tracing using digital grid mapping." },
        { label: "Archival Source", details: "Blacksmith forge pricing sheets and tool order slips." }
      ]
    },
    {
      slug: "lives-of-chinar-motif",
      essayNumber: "KHCRF-CE-2026-003",
      title: "The Many Lives of the Chinar Motif",
      subtitle: "A Comparative Study Across Textiles, Wood, Metal, and Painted Craft",
      essayType: "Comparative Study",
      author: "Zahida Amin",
      institution: "State University Fine Arts Dept",
      primaryCraft: "Multi-Craft",
      relatedCollection: "Comparative Collections",
      researchThemes: ["Design Evolution", "Motifs and Symbolism", "Artistic Practice"],
      historicalPeriod: "Multi-Period",
      geographicFocus: "Kashmir Valley",
      publicationDate: "May 2026",
      lastUpdated: "June 2026",
      readingTime: "21 Minutes",
      language: "English",
      reviewStatus: "Peer Reviewed",
      status: "Published",
      doi: "10.5072/hcrf.ce.2026.003",
      abstract: "This essay traces the visual transformation of the Chinar motif across carpet design, Sozni embroidery, Papier-Mâché, walnut carving, copper engraving, and contemporary craft applications. It analyzes how different raw materials influence the outline, complexity, and styling of this emblematic leaf.",
      keyQuestions: [
        "How did the Chinar motif move between woodcarvers and textile weavers?",
        "What stylistic differences distinguish Mughal-era Chinar representations from Dogra-era styles?",
        "How has contemporary graphic design simplified the leaf's organic details?"
      ],
      mainText: "The Chinar leaf (Platanus orientalis) is the defining visual symbol of the Kashmir Valley. Yet its appearance is not uniform. When carved into walnut wood, it gains three-dimensional relief, with folding leaf tips and organic veins. In papier-mâché painting, it is rendered in warm mineral gold, cochineal reds, and lapis blues. In Sozni needlework, the edges are defined by microscopic split-stitches. This comparative essay traces these visual shifts, documenting how the physical properties of each craft medium shape the symbol's cultural meaning.",
      bibliography: [
        "Amin, Zahida. Comparative Ornament in Kashmir Crafts. State University Press, 2023.",
        "Mughal Royal Garden Inventories, Srinagar Archives."
      ],
      referencedObjects: [
        { id: "KHCRF-OBJ-2026-0155", title: "Papier-Mâché Box with Autumn Chinar" },
        { id: "KHCRF-OBJ-2026-0447", title: "Copper Tray with Engraved Chinar" }
      ],
      authorProfile: {
        name: "Zahida Amin",
        role: "Associate Professor of Art History",
        institution: "State University Fine Arts Dept",
        researchAreas: ["Comparative Iconography", "Mughal Art History", "Srinagar Guilds"],
        biography: "Zahida Amin specializes in comparative studies of Islamic and South Asian decorative motifs."
      },
      evidenceClassification: [
        { label: "Museum Record", details: "Mural registers from the Srinagar State Palace Collections." },
        { label: "Published Scholarship", details: "Islamic Art Motif Index databases." }
      ]
    },
    {
      slug: "women-behind-the-needle",
      essayNumber: "KHCRF-CE-2026-004",
      title: "Women Behind the Needle",
      subtitle: "Invisible Labour, Skill, and Household Production in Sozni Embroidery",
      essayType: "Historical Essay",
      author: "Sobia Jan",
      coAuthors: "Dr. Farooq Mir",
      institution: "Kashmir Women Crafts Trust",
      primaryCraft: "Sozni",
      relatedCollection: "Family Collections",
      researchThemes: ["Gender and Labour", "Workshop Culture", "Social History of Srinagar"],
      historicalPeriod: "Late 20th Century",
      geographicFocus: "Ganderbal",
      publicationDate: "April 2026",
      lastUpdated: "July 2026",
      readingTime: "26 Minutes",
      language: "English",
      reviewStatus: "Editorially Reviewed",
      status: "Draft Submitted",
      abstract: "A study of women’s contribution to Kashmir’s embroidery traditions, with attention to home-based work, income, design distribution, skill transmission, household responsibilities, and limited public recognition.",
      keyQuestions: [
        "How is female sozni labor organized within domestic rural households?",
        "What are the historical wage differentials between male workshop masters and female home-workers?",
        "How does domestic labor affect the time allocation of women embroiderers?"
      ],
      mainText: "Sozni needlework is widely celebrated, yet the women who perform the majority of embroidery work inside rural homes are rarely cataloged in official registries. This research investigates the structure of domestic sozni production in Ganderbal, tracing how contracts are distributed by urban middlemen. By shifting focus from the public merchant houses to private domestic spaces, we uncover a vital economic engine driven by female craft skill that underpins the entire Kashmiri textile trade.",
      bibliography: [
        "Jan, Sobia. Women and Embroidery Economies in Ganderbal. Ganderbal Women Trust, 2025.",
        "Social Census of Rural Handcrafts, Kashmir Census Bureau, 1998."
      ],
      referencedObjects: [
        { id: "KHCRF-OBJ-2026-0098", title: "Early Sozni Sampler by Sultan Begum" }
      ],
      authorProfile: {
        name: "Sobia Jan",
        role: "Director of Field Research",
        institution: "Kashmir Women Crafts Trust",
        researchAreas: ["Gender Economics", "Rural Cooperatives", "Sozni Pedagogy"],
        biography: "Sobia Jan has spent a decade organizing artisan cooperatives and documenting women's labor histories in Ganderbal."
      },
      evidenceClassification: [
        { label: "Oral Testimony", details: "Surveys conducted with 84 female home-based embroiderers." },
        { label: "Unresolved", details: "Historical invoice records are incomplete due to private middleman deals." }
      ]
    },
    {
      slug: "pashmina-before-the-loom",
      essayNumber: "KHCRF-CE-2026-005",
      title: "Pashmina Before the Loom",
      subtitle: "Fibre, Ecology, Trade, and the Material Foundations of a Celebrated Textile",
      essayType: "Material Study",
      author: "Prof. Sharon Moore",
      institution: "London Textile University",
      primaryCraft: "Pashmina",
      relatedCollection: "Museum Archive",
      researchThemes: ["Material Culture", "Natural Resources", "Trade and Exchange", "Sustainability"],
      historicalPeriod: "19th Century",
      geographicFocus: "International Collections",
      publicationDate: "March 2026",
      lastUpdated: "March 2026",
      readingTime: "23 Minutes",
      language: "English",
      reviewStatus: "Peer Reviewed",
      status: "Published",
      doi: "10.5072/hcrf.ce.2026.005",
      abstract: "This essay explores the ecological, geographical, pastoral, technical, and commercial systems that shape Pashmina before weaving begins. It details the journey of raw goat underwool from high Ladakh pastures down to Srinagar spinners.",
      keyQuestions: [
        "What biological adaptations cause Ladakh goats to grow fine underwool?",
        "How did historical trade treaties regulate the transport of raw wool to Srinagar?",
        "What are the environmental threats facing Changpa pastoralists today?"
      ],
      mainText: "Before the Kani loom can be set up, the raw pashm fiber must be gathered. Sourced from the Capra Hircus goats raised by Changpa nomads on the high Changthang plateau (over 4,000 meters altitude), this fiber is an ecological marvel. The extreme sub-zero winters cause the goats to grow a microscopic underwool to trap body heat. Once spring arrives, this wool is combed out manually. This essay tracks the wool's commercial journey through sorting, dehairing, spinning, and trade networks, illustrating that Pashmina is fundamentally tied to pastoral ecology.",
      bibliography: [
        "Moore, Sharon. Himalayan Fibres and Ecology. London Textile Press, 2020.",
        "Ladakh Treaty Records, Jammu State Archives, 1842."
      ],
      referencedObjects: [
        { id: "KHCRF-OBJ-2026-0005", title: "Early Indigo-Dyed Pashmina Shawl" }
      ],
      authorProfile: {
        name: "Prof. Sharon Moore",
        role: "Head of Materials Research",
        institution: "London Textile University",
        researchAreas: ["High-Altitude Fibres", "Himalayan Trade Networks", "Sustainability in Textiles"],
        biography: "Prof. Moore is a textile archaeologist who focuses on tracing historic trade pathways of natural wool across Central Asia."
      },
      evidenceClassification: [
        { label: "Technical Observation", details: "Fiber diameter analysis using laboratory microscopes." },
        { label: "Archival Source", details: "Srinagar customs ledger entries from the late Dogra period." }
      ]
    },
    {
      slug: "workshop-as-a-school",
      essayNumber: "KHCRF-CE-2026-006",
      title: "The Workshop as a School",
      subtitle: "Apprenticeship, Observation, Correction, and the Transmission of Craft Knowledge",
      essayType: "Workshop Study",
      author: "Imran Qazi",
      institution: "Downtown Craft School Project",
      primaryCraft: "Walnut Wood",
      relatedCollection: "Rare Objects",
      researchThemes: ["Workshop Culture", "Apprenticeship", "Knowledge Transmission"],
      historicalPeriod: "Early 20th Century",
      geographicFocus: "Srinagar",
      publicationDate: "February 2026",
      lastUpdated: "February 2026",
      readingTime: "20 Minutes",
      language: "English",
      reviewStatus: "Peer Reviewed",
      status: "Published",
      doi: "10.5072/hcrf.ce.2026.006",
      abstract: "An analysis of the workshop as an informal educational institution where technical knowledge, discipline, ethics, terminology, and professional identity are transmitted through practice.",
      keyQuestions: [
        "What are the stages of the traditional Ustad-Shagird apprenticeship?",
        "How is visual and motor correction communicated in a woodcarver workshop?",
        "How have modern vocational training centers altered this lineage system?"
      ],
      mainText: "In traditional Kashmiri woodcarving workshops, knowledge was rarely written down. It was stored in the muscles, eyes, and tools of the craftsmen. An apprentice began by performing simple tasks: sweeping, sharpening chisels, and preparing wild walnut planks. Through years of observation, correction, and progressive practice, the apprentice acquired the skill of deep relief carving. This essay studies this pedagogical model, showing that the workshop functions as a highly structured, informal school with its own vocabulary, ethical rules, and certification methods.",
      bibliography: [
        "Qazi, Imran. Linages of the Chisel. Craft Council Publishing, 2021.",
        "Oral Lineages of Safa Kadal carvers registry."
      ],
      referencedObjects: [
        { id: "KHCRF-OBJ-2026-0033", title: "Walnut Apprentice Practice Panel" }
      ],
      authorProfile: {
        name: "Imran Qazi",
        role: "Researcher & Educator",
        institution: "Downtown Craft School Project",
        researchAreas: ["Vocational Pedagogy", "Walnut Carving Techniques", "Guild Structures"],
        biography: "Imran Qazi coordinates craft education programs in Srinagar and researches historical master-apprentice records."
      },
      evidenceClassification: [
        { label: "Oral Testimony", details: "Interviews with 12 master carvers and their current shagirds." },
        { label: "Technical Observation", details: "Progressive practice boards measured for technical growth markers." }
      ]
    }
  ]);

  const [loading] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEssayType, setSelectedEssayType] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedCraft, setSelectedCraft] = useState('All');
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('All');
  const [selectedGeography, setSelectedGeography] = useState('All');
  const [selectedAuthorType, setSelectedAuthorType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Featured');

  const [activeEssay, setActiveEssay] = useState<Essay | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'text' | 'questions' | 'objects' | 'bibliography' | 'author'>('overview');
  const [currentView, setCurrentView] = useState<'editorial' | 'index' | 'paths'>('editorial');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Reading Paths Dataset
  const readingPaths = [
    {
      title: "Understanding Kashmir Pashmina",
      steps: [
        "1. Pashmina Before the Loom",
        "2. The Language of Pashmina",
        "3. Women Behind the Needle",
        "4. The Global Journey of the Kashmir Shawl",
        "5. Sustainable Pashmina and Contemporary Practice"
      ]
    },
    {
      title: "Inside the Workshop",
      steps: [
        "1. The Workshop as a School",
        "2. Reading the Talim",
        "3. Women and Home-Based Production",
        "4. Tools as Carriers of Knowledge",
        "5. A Workshop Without Apprentices"
      ]
    },
    {
      title: "Objects Across Borders",
      steps: [
        "1. From Workshop to Museum",
        "2. Kashmir Shawls in European Collections",
        "3. Colonial Collecting and Classification",
        "4. Provenance Gaps in Global Collections",
        "5. Digital Reconnection of Dispersed Heritage"
      ]
    },
    {
      title: "Materials and Environment",
      steps: [
        "1. Pashmina Before the Loom",
        "2. Walnut Wood and Forest Heritage",
        "3. Willow Landscapes and Rural Production",
        "4. Natural Dyes and Material Memory",
        "5. When Materials Disappear"
      ]
    },
    {
      title: "Tradition and Innovation",
      steps: [
        "1. Tradition Is Not Repetition",
        "2. Contemporary Kani Practice",
        "3. Digital Design in Traditional Workshops",
        "4. Sustainability and Craft Production",
        "5. Architecture as a New Craft Context"
      ]
    }
  ];

  // Proposal Form State
  const [proposalForm, setProposalForm] = useState({
    title: '',
    subtitle: '',
    essayType: '',
    theme: '',
    craft: '',
    abstract: '',
    methodology: '',
    authorName: '',
    affiliation: '',
    bio: '',
    contact: ''
  });
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProposalSubmitted(true);
    setTimeout(() => {
      setProposalSubmitted(false);
      setProposalForm({
        title: '',
        subtitle: '',
        essayType: '',
        theme: '',
        craft: '',
        abstract: '',
        methodology: '',
        authorName: '',
        affiliation: '',
        bio: '',
        contact: ''
      });
    }, 4000);
  };

  const filteredEssays = allEssays.filter(e => {
    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${e.title} ${e.subtitle} ${e.essayNumber} ${e.author} ${e.institution} ${e.abstract} ${e.primaryCraft} ${e.relatedCollection} ${e.geographicFocus}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Essay Type
    if (selectedEssayType !== 'All' && e.essayType !== selectedEssayType) return false;

    // Research Theme
    if (selectedTheme !== 'All' && !e.researchThemes.includes(selectedTheme)) return false;

    // Craft
    if (selectedCraft !== 'All' && e.primaryCraft !== selectedCraft) return false;

    // Collection Section
    if (selectedCollection !== 'All' && e.relatedCollection !== selectedCollection) return false;

    // Period
    if (selectedPeriod !== 'All' && e.historicalPeriod !== selectedPeriod) return false;

    // Geography
    if (selectedGeography !== 'All' && e.geographicFocus !== selectedGeography) return false;

    // Author Type
    if (selectedAuthorType !== 'All') {
      const isArtisanAuthor = e.authorProfile.role.toLowerCase().includes('artisan') || e.authorProfile.role.toLowerCase().includes('weaver');
      if (selectedAuthorType === 'Artisan' && !isArtisanAuthor) return false;
      if (selectedAuthorType === 'Researcher' && isArtisanAuthor) return false;
    }

    // Status
    if (selectedStatus !== 'All' && e.reviewStatus !== selectedStatus) return false;

    // Language
    if (selectedLanguage !== 'All' && !e.language.includes(selectedLanguage)) return false;

    return true;
  });

  // Sorting
  const sortedEssays = [...filteredEssays].sort((a, b) => {
    if (selectedSort === 'Recently Published') {
      return b.essayNumber.localeCompare(a.essayNumber);
    }
    if (selectedSort === 'Author A–Z') {
      return a.author.localeCompare(b.author);
    }
    if (selectedSort === 'Title A–Z') {
      return a.title.localeCompare(b.title);
    }
    if (selectedSort === 'Craft Tradition') {
      return a.primaryCraft.localeCompare(b.primaryCraft);
    }
    if (selectedSort === 'Publication Year') {
      return b.publicationDate.localeCompare(a.publicationDate);
    }
    return b.essayNumber.localeCompare(a.essayNumber); // Default Featured
  });

  const totalPages = Math.ceil(sortedEssays.length / itemsPerPage);
  const paginatedEssays = sortedEssays.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const featuredEssay = allEssays[0]; // "The Object Beyond Beauty"

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      
      {/* Detailed Modal Registry Sheet */}
      {activeEssay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveEssay(null)}></div>
          <div className="relative z-10 bg-[#FAF9F6] border-2 border-[#3E2723] max-w-4xl w-full p-6 md:p-8 shadow-2xl text-[#2A2A2A] max-h-[95vh] overflow-y-auto custom-scrollbar font-mono rounded-xs" role="dialog" aria-modal="true">
            <button onClick={() => setActiveEssay(null)} className="absolute top-4 right-4 text-[#3E2723]/50 hover:text-[#3E2723] text-xl font-bold font-mono">&times;</button>
            
            <div className="text-center mb-6 border-b border-[#3E2723]/25 pb-4">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-1 font-bold">KHCRF SCHOLARLY ESSAY REGISTRY</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#3E2723] font-bold leading-tight">{activeEssay.title}</h2>
              {activeEssay.subtitle && <p className="text-gray-555 text-xs italic font-serif mt-1">{activeEssay.subtitle}</p>}
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">RECORD: {activeEssay.essayNumber}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">TYPE: {activeEssay.essayType}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">STATUS: {activeEssay.reviewStatus}</span>
              </div>
            </div>

            {/* Modal Tabs navigation */}
            <div className="flex flex-wrap gap-1 border-b border-[#3E2723]/20 pb-3 mb-6 text-[10px] font-mono justify-center">
              {[
                { id: 'overview', label: 'Abstract & Metadata' },
                { id: 'text', label: 'Main Essay Text' },
                { id: 'questions', label: 'Key Questions' },
                { id: 'objects', label: 'Referenced Objects' },
                { id: 'bibliography', label: 'Bibliography & Citation' },
                { id: 'author', label: 'Author Profile' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as 'overview' | 'text' | 'questions' | 'objects' | 'bibliography' | 'author')}
                  className={`px-3 py-1.5 border border-t-2 transition-all ${
                    activeModalTab === tab.id
                      ? 'bg-[#3E2723] text-white border-[#3E2723] border-t-[#D4AF37]'
                      : 'bg-white text-gray-550 border-gray-200 hover:border-[#3E2723]/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Contents */}
            <div className="space-y-6 text-xs text-gray-700 leading-relaxed font-mono">
              
              {/* TAB 1: OVERVIEW */}
              {activeModalTab === 'overview' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Abstract &amp; Scope</h3>
                  <p className="font-sans leading-relaxed text-gray-700">{activeEssay.abstract}</p>
                  
                  <h4 className="text-[#D4AF37] font-bold uppercase text-[9px] mt-4 border-b border-gray-100 pb-1">Archive References</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div><span className="text-gray-400">AUTHOR(S)       :</span> {activeEssay.author} {activeEssay.coAuthors && `& ${activeEssay.coAuthors}`}</div>
                      <div><span className="text-gray-400">AFFILIATION     :</span> {activeEssay.institution}</div>
                      <div><span className="text-gray-400">PRIMARY CRAFT   :</span> {activeEssay.primaryCraft}</div>
                      <div><span className="text-gray-400">RELATED COLLECTION:</span> {activeEssay.relatedCollection}</div>
                    </div>
                    <div className="space-y-1">
                      <div><span className="text-gray-400">HISTORICAL PERIOD:</span> {activeEssay.historicalPeriod}</div>
                      <div><span className="text-gray-400">GEOGRAPHIC FOCUS :</span> {activeEssay.geographicFocus}</div>
                      <div><span className="text-gray-400">PUBLICATION DATE :</span> {activeEssay.publicationDate}</div>
                      <div><span className="text-gray-400">READING TIME     :</span> {activeEssay.readingTime}</div>
                    </div>
                  </div>

                  {activeEssay.doi && (
                    <div className="pt-2 mt-2 border-t border-gray-150">
                      <span className="text-gray-400">PERSISTENT DOI   :</span> <span className="font-bold text-[#3949AB]">{activeEssay.doi}</span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MAIN ESSAY TEXT */}
              {activeModalTab === 'text' && (
                <div className="space-y-4 font-sans text-gray-655 text-sm leading-relaxed max-w-2xl mx-auto">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase font-mono border-b border-[#3E2723]/10 pb-1 mb-3">Essay Reading Panel</h3>
                  <div className="space-y-4 whitespace-pre-line text-gray-700">
                    {activeEssay.mainText}
                  </div>
                  
                  <div className="bg-[#FAF9F6] border border-gray-250 p-4 font-mono text-[9px] mt-6">
                    <span className="text-[#3E2723] font-bold block mb-1">EVIDENCE CLASSIFICATION</span>
                    {activeEssay.evidenceClassification.map((ev, idx) => (
                      <div key={idx} className="mt-1"><span className="text-gray-400 font-bold">{ev.label}:</span> {ev.details}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: KEY QUESTIONS */}
              {activeModalTab === 'questions' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Inquiry Focus</h3>
                  <ul className="space-y-3 bg-[#FAF9F6] p-5 border border-gray-250 text-gray-700 list-decimal pl-6">
                    {activeEssay.keyQuestions.map((q, idx) => (
                      <li key={idx} className="font-medium">{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* TAB 4: REFERENCED OBJECTS */}
              {activeModalTab === 'objects' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Referenced Object-to-Essay Graph</h3>
                  <p className="text-gray-450 italic">The following objects are analyzed directly within this research essay:</p>
                  
                  <div className="space-y-2">
                    {activeEssay.referencedObjects.map((obj, idx) => (
                      <div key={idx} className="p-3 border border-gray-200 bg-white flex justify-between items-center">
                        <div>
                          <span className="text-gray-400 block text-[8px] font-bold uppercase">OBJECT CODE</span>
                          <span className="font-bold text-[#3E2723]">{obj.id}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[8px] font-bold uppercase">OBJECT NAME</span>
                          <span className="font-bold text-gray-600">{obj.title}</span>
                        </div>
                        <button className="text-xs font-bold text-[#3949AB] hover:underline">
                          Open Object Record &rarr;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: BIBLIOGRAPHY */}
              {activeModalTab === 'bibliography' && (
                <div className="space-y-4 font-mono text-[10px] text-gray-700">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Academic Citation Formats</h3>
                  
                  <div className="bg-white border border-gray-200 p-4 space-y-3">
                    <div>
                      <strong className="text-gray-400 text-[8px] block uppercase">Chicago style citation</strong>
                      <span className="text-gray-700 block mt-0.5">{activeEssay.author}. &ldquo;{activeEssay.title}.&rdquo; KHCRF Collection Essays, July 2026. Permanent link: {activeEssay.doi || "hcrf-permanent-url"}.</span>
                    </div>
                    <div>
                      <strong className="text-gray-400 text-[8px] block uppercase font-bold">MLA style citation</strong>
                      <span className="text-gray-700 block mt-0.5">{activeEssay.author}. &ldquo;{activeEssay.title}.&rdquo; KHCRF Collection Essays, July 2026.</span>
                    </div>
                  </div>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 mt-6">Bibliography References</h3>
                  <ul className="list-disc pl-4 space-y-2 text-gray-650">
                    {activeEssay.bibliography.map((bib, idx) => (
                      <li key={idx}>{bib}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* TAB 6: AUTHOR PROFILE */}
              {activeModalTab === 'author' && (
                <div className="space-y-4 font-mono text-[10px] text-gray-700">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Author Profile</h3>
                  
                  <div className="bg-[#FAF9F6] border border-gray-250 p-5 space-y-3">
                    <div>
                      <span className="text-gray-400 uppercase text-[8px] block font-bold">Author Name</span>
                      <span className="font-bold text-[#3E2723] text-sm">{activeEssay.authorProfile.name}</span>
                      <span className="text-gray-500 text-[9px] block">{activeEssay.authorProfile.role} &bull; {activeEssay.authorProfile.institution}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase text-[8px] block font-bold">Biography</span>
                      <p className="font-sans leading-relaxed text-gray-750">{activeEssay.authorProfile.biography}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase text-[8px] block font-bold">Research Specialties</span>
                      <div className="flex gap-1.5 flex-wrap mt-1 text-[8px] uppercase tracking-wider font-bold">
                        {activeEssay.authorProfile.researchAreas.map((area, aIdx) => (
                          <span key={aIdx} className="px-1.5 py-0.5 bg-white border border-gray-250 text-gray-600">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    {activeEssay.authorProfile.orcid && (
                      <div className="pt-2 border-t border-gray-150">
                        <span className="text-gray-400">ORCID IDENTIFIER:</span> <span className="font-bold text-[#3E2723]">{activeEssay.authorProfile.orcid}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            <div className="border-t border-[#D4AF37]/30 pt-6 text-center space-y-4 font-mono mt-6">
              <p className="text-[9px] uppercase tracking-widest text-gray-400 leading-relaxed font-mono">
                Access to full microscopic logs and high-definition material spectra is reserved for supportive members.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/about/memberships" className="bg-[#D4AF37] text-[#3E2723] hover:bg-white px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors border border-[#D4AF37] font-mono">
                  Become a Member
                </Link>
                <button onClick={() => setActiveEssay(null)} className="border border-[#3E2723] hover:bg-[#3E2723]/5 text-[#3E2723] px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Archive
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <UniversalEditorialHero pageKey="collection-essays" fallbackConfig={collectionEssaysHeroFallback as any} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Scholarly Statement */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            This page functions as the <strong>scholarly interpretation layer</strong> of the entire KHCRF Collections archive. It does <strong>not</strong> resemble a blog, magazine feed, newsroom, or generic article directory. Collection Essays explain the meaning of objects, collections, techniques, materials, motifs, workshop traditions, provenance histories, and contemporary developments through rigorous, accessible scholarship.
          </p>
          <p className="text-gray-755 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            Collection Essays provide the intellectual and interpretive framework of the KHCRF Collections archive. Written by researchers, curators, artisans, conservators, historians, designers, and subject specialists, these essays move beyond object description to examine the wider histories, practices, relationships, and ideas embodied within Kashmir’s craft heritage. Each essay is connected to documented objects, collections, artisans, workshops, techniques, motifs, places, oral histories, and archival sources. Together, they transform the Collections section from a catalogue of objects into a structured body of knowledge.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Explore Essays
            </a>
            <a href="#proposal-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Submit an Essay Proposal
            </a>
            <a href="#methodology" className="text-[#3E2723] hover:underline font-bold py-2.5">
              Read Editorial &amp; Research Standards &rarr;
            </a>
          </div>
        </div>

        {/* Featured Essay Card */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED COLLECTION ESSAY
          </div>
          
          <div className="max-w-4xl font-mono">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
              Essay Record: {featuredEssay.essayNumber}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              {featuredEssay.title}
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-550 mb-4">
              {featuredEssay.subtitle}
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans text-gray-655">
              {featuredEssay.abstract}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 font-mono text-[10px] border-t border-b border-gray-250 py-3 bg-gray-55 px-4">
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Essay Type</span>
                <span className="font-bold text-[#3E2723]">{featuredEssay.essayType}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Author</span>
                <span className="font-bold text-[#3E2723]">{featuredEssay.author}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Reading Time</span>
                <span className="font-bold text-[#3E2723]">{featuredEssay.readingTime}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Review Status</span>
                <span className="font-bold text-[#D4AF37] font-bold">{featuredEssay.reviewStatus}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveEssay(featuredEssay); setActiveModalTab('text'); }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                Read Essay &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Why Document Essays Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 font-bold">Interpreting Objects Through Research</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
              Craft objects do not speak entirely for themselves. Their meaning emerges through context. A shawl may reveal histories of labour, trade, gender, material knowledge, patronage, colonial exchange, and design migration. A carved walnut panel may preserve workshop lineages, architectural traditions, tool marks, regional aesthetics, and changing relationships between craft and built space.
            </p>
            <p className="text-gray-605 text-sm leading-relaxed font-sans">
              Collection Essays bring these layers together through documented research and informed interpretation.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Research Themes Examined:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans font-mono">
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>individual objects &amp; collections</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>craft traditions &amp; technical processes</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>workshop lineages &amp; apprenticeship</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>materials &amp; natural resources</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>motifs &amp; symbols</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>patronage, collecting, &amp; global trade</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>conservation &amp; restoration</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>gender, labour, &amp; craft sustainability</li>
            </ul>
          </div>
        </section>

        {/* Archive Overview Dashboard */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Registry Overview
          </div>
          <div className="mb-8 font-mono">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2 font-bold font-serif">Collection Essays Overview</h3>
            <p className="text-white/60 text-xs">
              LIVE SCHOLARLY INDEX &amp; PEER-REVIEWED METADATA
            </p>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left border-b border-white/10 pb-8 mb-8">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Published Essays</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">94</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Contributing Authors</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">61</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono">Collections Interpreted</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">38</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Craft Traditions</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">12</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Peer-Reviewed Essays</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">42</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Research Institutions</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">17</span>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left font-mono">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Long-Form Essays</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">36</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Object Studies</span>
              <span className="text-xl font-serif font-semibold text-white/80">28</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Comparative Studies</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">19</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Conservation Studies</span>
              <span className="text-xl font-serif font-semibold text-white/80">11</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Artisan Authors</span>
              <span className="text-xl font-serif font-semibold text-white/80">24</span>
            </div>
            <div className="last:border-0">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">With Bibliographies</span>
              <span className="text-lg font-serif font-semibold text-[#D4AF37] block leading-tight font-mono">94</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            KHCRF Collection Essays &bull; Showing {sortedEssays.length} Cataloged Papers
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 uppercase self-center mr-2 font-mono">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('editorial'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'editorial' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-550 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Editorial Showcase
            </button>
            <button 
              onClick={() => { setCurrentView('index'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'index' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Research Index
            </button>
            <button 
              onClick={() => { setCurrentView('paths'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'paths' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Thematic Reading Paths
            </button>
          </div>
        </div>

        {/* Search and Discovery Layout */}
        <section className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filters Sidebar */}
          {currentView !== 'paths' && (
            <div className="w-full lg:w-1/4 bg-white border border-[#3E2723]/10 p-6 shadow-xs sticky top-4 z-10 font-sans">
              <h3 className="font-serif text-lg text-[#3E2723] mb-6 pb-2 border-b border-gray-100 flex items-center justify-between font-bold">
                <span>Filter Archive</span>
                <button 
                  onClick={() => {
                    setSelectedEssayType('All');
                    setSelectedTheme('All');
                    setSelectedCraft('All');
                    setSelectedCollection('All');
                    setSelectedPeriod('All');
                    setSelectedGeography('All');
                    setSelectedAuthorType('All');
                    setSelectedStatus('All');
                    setSelectedLanguage('All');
                    setSelectedSort('Featured');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="text-[10px] text-[#3949AB] hover:underline font-bold uppercase tracking-wider font-mono"
                >
                  Reset
                </button>
              </h3>

              <div className="space-y-6 text-xs">
                {/* Search Field */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Search Field</label>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search essays by title, author, craft, collection, object, artisan, motif, material, period, place, or research theme..."
                    className="w-full border border-gray-200 px-3 py-2 text-xs rounded-none bg-[#FAF9F6] text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  />
                </div>

                {/* Essay Type */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Essay Type</label>
                  <select 
                    value={selectedEssayType}
                    onChange={(e) => { setSelectedEssayType(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Types</option>
                    <option value="Curatorial Essay">Curatorial Essay</option>
                    <option value="Collection Introduction">Collection Introduction</option>
                    <option value="Object Study">Object Study</option>
                    <option value="Technical Essay">Technical Essay</option>
                    <option value="Historical Essay">Historical Essay</option>
                    <option value="Comparative Study">Comparative Study</option>
                    <option value="Material Study">Material Study</option>
                    <option value="Motif Study">Motif Study</option>
                    <option value="Provenance Essay">Provenance Essay</option>
                    <option value="Conservation Essay">Conservation Essay</option>
                    <option value="Workshop Study">Workshop Study</option>
                    <option value="Artisan Reflection">Artisan Reflection</option>
                    <option value="Contemporary Practice">Contemporary Practice</option>
                    <option value="Critical Commentary">Critical Commentary</option>
                    <option value="Research Note">Research Note</option>
                    <option value="Exhibition Essay">Exhibition Essay</option>
                  </select>
                </div>

                {/* Research Theme */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Research Theme</label>
                  <select 
                    value={selectedTheme}
                    onChange={(e) => { setSelectedTheme(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Themes</option>
                    <option value="Craft History">Craft History</option>
                    <option value="Artistic Practice">Artistic Practice</option>
                    <option value="Technical Knowledge">Technical Knowledge</option>
                    <option value="Workshop Culture">Workshop Culture</option>
                    <option value="Apprenticeship">Apprenticeship</option>
                    <option value="Material Culture">Material Culture</option>
                    <option value="Natural Resources">Natural Resources</option>
                    <option value="Design Evolution">Design Evolution</option>
                    <option value="Motifs and Symbolism">Motifs and Symbolism</option>
                    <option value="Gender and Labour">Gender and Labour</option>
                    <option value="Trade and Exchange">Trade and Exchange</option>
                    <option value="Patronage">Patronage</option>
                    <option value="Colonial History">Colonial History</option>
                    <option value="Museum Collections">Museum Collections</option>
                    <option value="Provenance">Provenance</option>
                    <option value="Conservation">Conservation</option>
                    <option value="Cultural Identity">Cultural Identity</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Contemporary Innovation">Contemporary Innovation</option>
                    <option value="Heritage Policy">Heritage Policy</option>
                  </select>
                </div>

                {/* Craft Tradition */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Craft Tradition</label>
                  <select 
                    value={selectedCraft}
                    onChange={(e) => { setSelectedCraft(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Crafts</option>
                    <option value="Hand-Knotted Carpet">Hand-Knotted Carpet</option>
                    <option value="Pashmina">Pashmina</option>
                    <option value="Kani">Kani</option>
                    <option value="Sozni">Sozni</option>
                    <option value="Crewel">Crewel</option>
                    <option value="Papier-Mâché">Papier-Mâché</option>
                    <option value="Walnut Wood">Walnut Wood</option>
                    <option value="Copperware">Copperware</option>
                    <option value="Namda">Namda</option>
                    <option value="Willow Wicker">Willow Wicker</option>
                    <option value="Chain Stitch">Chain Stitch</option>
                    <option value="Multi-Craft">Multi-Craft</option>
                  </select>
                </div>

                {/* Collection Section */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Collection Section</label>
                  <select 
                    value={selectedCollection}
                    onChange={(e) => { setSelectedCollection(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Sections</option>
                    <option value="Heritage Collections">Heritage Collections</option>
                    <option value="Signature Masterpieces">Signature Masterpieces</option>
                    <option value="Museum Archive">Museum Archive</option>
                    <option value="Rare Objects">Rare Objects</option>
                    <option value="Contemporary Excellence">Contemporary Excellence</option>
                    <option value="Family Collections">Family Collections</option>
                    <option value="Workshop Archives">Workshop Archives</option>
                    <option value="Comparative Collections">Comparative Collections</option>
                  </select>
                </div>

                {/* Historical Period */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Historical Period</label>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => { setSelectedPeriod(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Periods</option>
                    <option value="Contemporary">Contemporary</option>
                    <option value="Late 20th Century">Late 20th Century</option>
                    <option value="Mid 20th Century">Mid 20th Century</option>
                    <option value="Early 20th Century">Early 20th Century</option>
                    <option value="19th Century">19th Century</option>
                    <option value="18th Century">18th Century</option>
                    <option value="Earlier">Earlier</option>
                    <option value="Multi-Period">Multi-Period</option>
                  </select>
                </div>

                {/* Author Type */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Author Type</label>
                  <select 
                    value={selectedAuthorType}
                    onChange={(e) => { setSelectedAuthorType(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Authors</option>
                    <option value="Artisan">Artisan</option>
                    <option value="Researcher">Researcher</option>
                  </select>
                </div>

                {/* Review Status */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Review Status</label>
                  <select 
                    value={selectedStatus}
                    onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Peer Reviewed">Peer Reviewed</option>
                    <option value="Technical Review">Technical Review</option>
                    <option value="Editorially Reviewed">Editorially Reviewed</option>
                    <option value="Artisan-Verified">Artisan-Verified</option>
                    <option value="Research Note">Research Note</option>
                    <option value="Working Paper">Working Paper</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Sort Order</label>
                  <select 
                    value={selectedSort}
                    onChange={(e) => { setSelectedSort(e.target.value); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="Featured">Featured</option>
                    <option value="Recently Published">Recently Published</option>
                    <option value="Author A–Z">Author A–Z</option>
                    <option value="Title A–Z">Title A–Z</option>
                    <option value="Craft Tradition">Craft Tradition</option>
                    <option value="Publication Year">Publication Year</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Results Area */}
          <div className={`w-full ${currentView === 'paths' ? 'lg:w-full' : 'lg:w-3/4'}`}>

            {loading ? (
              <div className="py-20 text-center text-gray-505 font-serif font-bold">Loading essays...</div>
            ) : (
              <>
                {/* 1. EDITORIAL SHOWCASE VIEW */}
                {currentView === 'editorial' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedEssays.map((e, i) => (
                      <div 
                        key={i} 
                        className="bg-white border-2 border-[#3E2723]/35 py-8 px-6 hover:bg-[#3E2723]/5 transition-all duration-300 group flex flex-col justify-between shadow-sm relative grid-ledger font-mono text-xs"
                      >
                        <div>
                          {/* Accession ID & Reading Time header */}
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
                            <span>{e.essayNumber}</span>
                            <span>{e.readingTime}</span>
                          </div>

                          {/* Essay Type & Craft */}
                          <div className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                            {e.essayType.toUpperCase()} &bull; {e.primaryCraft.toUpperCase()}
                          </div>

                          {/* Title */}
                          <h3 
                            onClick={() => { setActiveEssay(e); setActiveModalTab('overview'); }}
                            className="text-xl md:text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {e.title}
                          </h3>

                          {e.subtitle && (
                            <h4 className="text-xs font-serif italic text-gray-500 mt-1 leading-snug mb-3">
                              {e.subtitle}
                            </h4>
                          )}

                          <p className="text-gray-655 text-xs leading-relaxed mb-4 font-sans line-clamp-3 mt-3">
                            {e.abstract}
                          </p>

                          {/* Themes indicator */}
                          <div className="relative pl-4 mb-4 border-l-2 border-[#D4AF37]/50 font-mono text-[10px] leading-relaxed my-4">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                              Research Themes
                            </span>
                            <span className="font-bold text-[#3E2723]">
                              {e.researchThemes.join(' · ')}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[#3E2723]/25 text-[9px] font-mono mb-3 select-none">
                            ─────╱╲──╱────╲╱─────
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-mono">
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-[#3E2723] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">
                              {e.reviewStatus.toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => { setActiveEssay(e); setActiveModalTab('text'); }}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Read Essay &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. RESEARCH INDEX VIEW */}
                {currentView === 'index' && (
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm animate-fadeIn">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Essay No</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Title & Research Scope</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Author</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Type</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Craft</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Date</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Review Status</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">DOI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700">
                        {paginatedEssays.map((e, idx) => (
                          <tr key={idx} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => { setActiveEssay(e); setActiveModalTab('overview'); }}>
                            <td className="p-4 font-mono font-bold text-gray-500 whitespace-nowrap">{e.essayNumber}</td>
                            <td className="p-4">
                              <div className="font-serif font-bold text-[#3E2723] text-sm hover:text-[#D4AF37] transition-colors">{e.title}</div>
                              <div className="text-[10px] text-gray-400 font-light truncate max-w-xs">{e.subtitle}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap font-bold">{e.author}</td>
                            <td className="p-4 whitespace-nowrap">{e.essayType}</td>
                            <td className="p-4 whitespace-nowrap">{e.primaryCraft}</td>
                            <td className="p-4 text-center whitespace-nowrap font-mono">{e.publicationDate}</td>
                            <td className="p-4 whitespace-nowrap font-mono">{e.reviewStatus}</td>
                            <td className="p-4 text-center whitespace-nowrap font-mono">{e.doi || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3. THEMATIC READING PATHS VIEW */}
                {currentView === 'paths' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn font-mono text-xs text-[#3E2723]">
                    {readingPaths.map((path, idx) => (
                      <div key={idx} className="bg-white border-2 border-[#3E2723] p-6 shadow-md flex flex-col justify-between">
                        <div>
                          <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest block mb-1">GUIDED SCHOLARLY JOURNEY</span>
                          <h4 className="font-serif text-lg font-bold mb-4 border-b border-gray-150 pb-2 text-[#3E2723]">{path.title}</h4>
                          <ul className="space-y-2 text-gray-650 text-[11px] mb-6">
                            {path.steps.map((step, sIdx) => (
                              <li key={sIdx} className="flex gap-2">
                                <span className="text-[#D4AF37] font-bold">&bull;</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button className="w-full bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] py-2.5 font-bold uppercase tracking-widest text-[10px] transition-colors font-mono">
                          Begin Reading Path &rarr;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {currentView !== 'paths' && totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-gray-100 font-mono">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-555 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
                >
                  &larr;
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 text-sm font-bold transition-colors ${
                        currentPage === i + 1 ? 'bg-[#D4AF37] text-white' : 'border border-gray-200 text-gray-555 hover:border-[#D4AF37]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="w-10 h-10 border border-gray-305 flex items-center justify-center text-gray-555 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>

        </section>

        {/* Documentation Methodology */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-16" id="methodology">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            How KHCRF Collection Essays Are Developed
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
            Collection Essays are developed through documented research, object study, fieldwork, archival investigation, artisan consultation, museum records, technical analysis, and scholarly literature. The review process depends on the essay type and may include subject experts, artisans, conservators, historians, curators, technical specialists, or editorial reviewers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Publication Workflow</h3>
              <ol className="list-decimal pl-4 space-y-2 text-xs text-gray-600 font-mono">
                <li>Topic identification</li>
                <li>Essay proposal</li>
                <li>Abstract review</li>
                <li>Research scope approval</li>
                <li>Source and object identification</li>
                <li>Author assignment</li>
                <li>Draft development</li>
                <li>Technical or scholarly review</li>
                <li>Artisan verification where appropriate</li>
                <li>Fact-checking &amp; Citation review</li>
                <li>Rights clearance &amp; Author revision</li>
                <li>Editorial approval and final publication</li>
              </ol>
            </div>
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Editorial Principles</h3>
              <ul className="list-disc pl-4 space-y-2 text-xs text-gray-600 font-sans">
                <li>evidence-based interpretation</li>
                <li>clear distinction between fact and argument</li>
                <li>complete attribution &amp; respectful representation of artisans</li>
                <li>no invented historical claims or unsupported object dating</li>
                <li>transparent uncertainty &amp; disclosure of provenance gaps</li>
                <li>preservation of traditional terminology</li>
                <li>acknowledgement of conflicting interpretations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Research & Educational Use */}
        <section className="bg-white border border-[#3E2723]/25 p-8 md:p-10 mb-16 rounded-xs shadow-sm">
          <h2 className="text-2xl font-serif text-[#3E2723] mb-4 font-bold">Using Collection Essays</h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
            The archive may support university teaching, museum interpretation, craft history research, heritage policy, conservation education, design studies, material culture research, doctoral and postgraduate study, exhibition development, and public scholarship.
          </p>
          <div className="flex gap-4 font-mono">
            <Link href="mailto:research@khcrf.org" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Request Research Support
            </Link>
            <a href="#proposal-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Use Essays in Education
            </a>
          </div>
        </section>

        {/* Essay Proposal Form Section */}
        <section id="proposal-section" className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block mb-1 font-mono">Contribute to the Collection Essays Archive</span>
            <h2 className="text-3xl font-serif text-[#3E2723] font-bold">Submit Essay Proposal</h2>
            <p className="text-gray-500 text-xs font-mono mt-1">KHCRF welcomes essay proposals from artisans, researchers, curators, conservators, and historians.</p>
          </div>

          <div className="bg-[#FAF9F6] p-6 md:p-8 border border-gray-250">
            {proposalSubmitted ? (
              <div className="text-center py-8 font-mono">
                <h3 className="text-lg font-bold text-green-600 mb-2">Proposal Received</h3>
                <p className="text-xs text-gray-500">Thank you. The KHCRF Editorial Committee will verify your abstract and methodology against our research themes.</p>
              </div>
            ) : (
              <form onSubmit={handleProposalSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Proposed Essay Title *</label>
                    <input 
                      required 
                      type="text" 
                      value={proposalForm.title}
                      onChange={(e) => setProposalForm({...proposalForm, title: e.target.value})}
                      placeholder="e.g. Design Migration along Jhelum canals"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Essay Type *</label>
                    <input 
                      required 
                      type="text" 
                      value={proposalForm.essayType}
                      onChange={(e) => setProposalForm({...proposalForm, essayType: e.target.value})}
                      placeholder="e.g. Curatorial Essay, Material Study"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Research Theme *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.theme}
                      onChange={(e) => setProposalForm({...proposalForm, theme: e.target.value})}
                      placeholder="e.g. Material Culture, Labour History"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Primary Craft *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.craft}
                      onChange={(e) => setProposalForm({...proposalForm, craft: e.target.value})}
                      placeholder="e.g. Hand-Knotted Carpet"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Author Name *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.authorName}
                      onChange={(e) => setProposalForm({...proposalForm, authorName: e.target.value})}
                      placeholder="Author Credentials"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Institutional Affiliation</label>
                    <input 
                      type="text" 
                      value={proposalForm.affiliation}
                      onChange={(e) => setProposalForm({...proposalForm, affiliation: e.target.value})}
                      placeholder="e.g. State University"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Abstract (120-250 words) *</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={proposalForm.abstract}
                    onChange={(e) => setProposalForm({...proposalForm, abstract: e.target.value})}
                    placeholder="Clearly outline the subject, research problem, scope, evidence, central argument, and significance..."
                    className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Proposed Methodology</label>
                    <textarea 
                      rows={2} 
                      value={proposalForm.methodology}
                      onChange={(e) => setProposalForm({...proposalForm, methodology: e.target.value})}
                      placeholder="e.g. Fieldwork interviews, chemical dye analysis, archival reviews..."
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Author Bio &amp; Contact *</label>
                    <textarea 
                      required
                      rows={2} 
                      value={proposalForm.bio}
                      onChange={(e) => setProposalForm({...proposalForm, bio: e.target.value})}
                      placeholder="Brief academic/professional biography and contact coordinates..."
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#3E2723] hover:bg-[#D4AF37] text-white hover:text-[#3E2723] font-bold uppercase tracking-widest transition-colors font-mono"
                >
                  Submit Essay Proposal
                </button>
              </form>
            )}
          </div>
        </section>

      </div>

      {/* FOOTER STATEMENT */}
      <footer className="bg-[#3E2723] py-16 px-4 md:px-10 text-white/90">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
          <p className="font-serif italic text-lg leading-relaxed text-white/80 max-w-3xl mx-auto font-mono">
            &ldquo;KHCRF Collection Essays deepen the understanding of Kashmir’s craft heritage by connecting objects with the people, places, materials, techniques, histories, and ideas that give them meaning. Through documented research and responsible interpretation, the archive ensures that collections are not only preserved, but also studied, questioned, explained, and continually understood anew.&rdquo;
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
        </div>
      </footer>

    </main>
  );
}
