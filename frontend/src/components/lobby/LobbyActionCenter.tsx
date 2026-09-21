import Link from "next/link";
import {
  Newspaper,
  ClipboardCheck,
  FileBarChart,
  AlertOctagon,
} from "lucide-react";

const actions = [
  {
    title: "Legislative Updates",
    icon: <Newspaper size={24} />,
    color: "bg-[#050A1E]",
    hoverColor: "hover:bg-[#451d06]",
    href: "/lobby/legislative-updates",
  },
  {
    title: "Register as Stakeholder",
    icon: <ClipboardCheck size={24} />,
    color: "bg-[#ca8a04]", // Gold highlight
    hoverColor: "hover:bg-[#a16207]",
    href: "/lobby/stakeholder-intake",
  },
  {
    title: "Craft Policy Reports",
    icon: <FileBarChart size={24} />,
    color: "bg-[#050A1E]",
    hoverColor: "hover:bg-[#451d06]",
    href: "/lobby/craft-policy",
  },
  {
    title: "Report Counterfeit",
    icon: <AlertOctagon size={24} />,
    color: "bg-[#991b1b]", // Red for alert
    hoverColor: "hover:bg-[#7f1d1d]",
    href: "/lobby/counterfeit-alert",
  },
];

const LobbyActionCenter = () => {
  return (
    <div className="bg-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {actions.map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className={`${action.color} ${action.hoverColor} text-white py-4 px-6 rounded shadow-md flex items-center justify-center space-x-3 transition-colors duration-200 w-full`}
            >
              {action.icon}
              <span className="font-bold text-sm uppercase tracking-wide">
                {action.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LobbyActionCenter;
