import { ChevronRight, Filter } from "lucide-react";

const UpdatesSidebar = () => {
  return (
    <div className="bg-[#f0f9ff] p-0 md:p-0 rounded-lg">
      {/* We can use specific styling here, but aiming for the look in the image which is a sidebar on the left */}

      {/* Quick Links Section */}
      <div className="bg-[#1e3a8a] text-white p-4 rounded-t-lg shadow-md hidden">
        {/* Note: In the image, the sidebar header is blue, but we need to stick to the new theme. 
              However, to keep it distinct, maybe use the Dark Brown #050a1e */}
      </div>

      <div className="bg-[#050A1E] text-white p-4 items-center rounded-t-lg">
        <h3 className="font-bold text-lg">Quick Links</h3>
      </div>
      <div className="bg-white border-x border-b border-slate-200 rounded-b-lg mb-8 shadow-sm">
        <ul className="divide-y divide-slate-100">
          {[
            "Cluster Visit Reports",
            "Policy Statements",
            "Meeting Alerts",
            "Public Notices",
          ].map((item, i) => (
            <li key={i}>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-[#050A1E] transition-colors text-sm font-medium"
              >
                <ChevronRight size={14} className="mr-2 text-[#ca8a04]" />
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Filter Section */}
      <div className="bg-[#e0e7ff] p-4 rounded-t-lg flex items-center justify-between">
        <h3 className="font-bold text-[#050A1E] text-lg">Filter Updates</h3>
      </div>
      <div className="bg-slate-50 border-x border-b border-slate-200 rounded-b-lg p-4 shadow-sm space-y-4">
        <div>
          <select className="w-full p-2 border border-slate-300 rounded text-sm text-slate-600 focus:outline-none focus:border-[#050A1E]">
            <option>By Category</option>
          </select>
        </div>
        <div>
          <select className="w-full p-2 border border-slate-300 rounded text-sm text-slate-600 focus:outline-none focus:border-[#050A1E]">
            <option>By Craft Type</option>
          </select>
        </div>
        <div>
          <select className="w-full p-2 border border-slate-300 rounded text-sm text-slate-600 focus:outline-none focus:border-[#050A1E]">
            <option>All</option>
          </select>
        </div>
        <div>
          <select className="w-full p-2 border border-slate-300 rounded text-sm text-slate-600 focus:outline-none focus:border-[#050A1E]">
            <option>Year: 2024 (All)</option>
          </select>
        </div>

        <button className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white py-2 rounded font-bold text-sm transition-colors cursor-pointer">
          {/* Note: The button in the image is blue. Changing to brand primary for consistency or keeping it distinct? 
                  The user asked to remove blue. So let's use the brand primary. */}
        </button>
        <button className="w-full bg-[#050A1E] hover:bg-[#451d06] text-white py-2 rounded font-bold text-sm transition-colors cursor-pointer flex justify-center items-center">
          <Filter size={14} className="mr-2" /> Filter
        </button>
      </div>
    </div>
  );
};

export default UpdatesSidebar;
