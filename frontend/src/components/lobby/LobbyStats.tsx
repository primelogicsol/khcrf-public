import { globalStatistics } from "@/config/statistics";
import {
  ShieldCheck,
  FileText,
  Globe,
  Users,
  Hammer,
  MapPin,
} from "lucide-react";

const LobbyStats = () => {
  return (
    <div className="bg-white py-12 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Message Card */}
          <div className="bg-[#050A1E] text-white p-8 rounded-lg shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FileText size={120} />
            </div>
            <h3 className="text-xl font-bold font-playfair mb-4 text-[#ca8a04]">
              Message from the Legislator
            </h3>
            <blockquote className="text-lg font-light leading-relaxed italic z-10 relative">
              "Committed to supporting our artisans, protecting GI crafts,
              enhancing cluster development, and combating counterfeit goods for
              a sustainable craft economy."
            </blockquote>
          </div>

          {/* Stats Card */}
          <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-[#050A1E] font-bold text-lg mb-6 border-b border-slate-200 pb-2">
              Constituency Craft Overview
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Users className="text-[#ca8a04] mt-1 mr-3 h-5 w-5" />
                <div>
                  <span className="block font-bold text-slate-800 text-lg">
                    {globalStatistics.artisanHouseholds > 0 ? `${globalStatistics.artisanHouseholds}+` : '0'}
                  </span>
                  <span className="text-slate-600 text-sm">
                    Artisan Households
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <Hammer className="text-[#ca8a04] mt-1 mr-3 h-5 w-5" />
                <div>
                  <span className="block font-bold text-slate-800 text-lg">
                    Key Crafts
                  </span>
                  <span className="text-slate-600 text-sm">
                    Pashmina, Carpets, Woodwork
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <Globe className="text-[#ca8a04] mt-1 mr-3 h-5 w-5" />
                <div>
                  <span className="block font-bold text-slate-800 text-lg">
                    3 GI-Certified Products
                  </span>
                  <span className="text-slate-600 text-sm">5 Export Hubs</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            {
              label: "Craft Cluster Visits",
              value: "18",
              color: "bg-[#050A1E]",
            },
            { label: "Industry Meetings", value: "12", color: "bg-[#050A1E]" },
            { label: "Welfare Sessions", value: "24", color: "bg-[#050A1E]" },
            {
              label: "Counterfeit Cases Escalated",
              value: "9",
              color: "bg-red-800",
            }, // Red for alert/warning
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 p-4 rounded shadow-sm flex items-center justify-between"
            >
              <span className="text-sm font-semibold text-slate-700 w-2/3">
                {stat.label}
              </span>
              <span
                className={`text-white font-bold px-3 py-1 rounded text-lg ${stat.color}`}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LobbyStats;
