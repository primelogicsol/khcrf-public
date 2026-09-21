import { AlertOctagon, CheckCircle2, Clock } from "lucide-react";

const alerts = [
  {
    title: "Counterfeit Pashmina Shawls Detected in Ganderbal",
    date: "March 20, 2024",
    location: "Ganderbal",
    desc: "Fake Pashmina shawls have been found at a local market in Ganderbal. Samples are pending lab testing.",
    status: "Under Investigation",
    statusColor: "bg-[#b91c1c]", // Red for investigation
    image:
      "https://images.unsplash.com/photo-1605634563891-9c1753c23363?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Fake Kashmiri Papier-mâché Items Seized in Srinagar",
    date: "March 10, 2024",
    location: "Srinagar",
    desc: "Imitation Kashmiri Papier-mâché items resembling the traditional craft style were seized.",
    status: "Proven Fake",
    statusColor: "bg-[#166534]", // Green for concluded/proven
    image:
      "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=1964&auto=format&fit=crop",
  },
  {
    title: "Suspicious Kani Shawls Found in Anantnag",
    date: "March 18, 2024",
    location: "Anantnag",
    desc: "Questionable Kani shawls, alleged to be crafted with non-traditional methods are under scrutiny.",
    status: "Under Investigation",
    statusColor: "bg-[#b91c1c]",
    image:
      "https://images.unsplash.com/photo-1628153434542-6e2c38865882?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Busted: Fake Walnut Wood Crafts in Budgam",
    date: "March 3, 2024",
    location: "Budgam",
    desc: "A counterfeit network producing fake walnut wood crafts has been dismantled in Budgam.",
    status: "Proven Fake",
    statusColor: "bg-[#166534]",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2072&auto=format&fit=crop",
  },
];

const CounterfeitList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-50 p-2 rounded border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span>Counterfeit Alerts</span>
        <div className="flex space-x-4">
          <span>47 Reported</span>
          <span>14 Proven</span>
          <span>25 Tracking</span>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6"
          >
            <div className="w-full md:w-48 h-32 md:h-auto shrink-0 rounded overflow-hidden relative">
              <img
                src={alert.image}
                alt={alert.title}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-0 left-0 text-white text-[10px] font-bold px-2 py-1 uppercase ${alert.statusColor}`}
              >
                {alert.status}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-[#050A1E] text-lg mb-1">
                {alert.title}
              </h3>
              <div className="text-xs text-slate-500 mb-2 flex items-center space-x-2">
                <span>{alert.date}</span>
                <span>•</span>
                <span>{alert.location}</span>
              </div>
              <p className="text-slate-600 text-sm mb-4">{alert.desc}</p>

              <div className="flex justify-end">
                <button className="bg-[#fcd34d] hover:bg-[#fbbf24] text-[#78350f] px-4 py-1.5 rounded font-bold text-xs uppercase tracking-wide shadow-sm transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounterfeitList;
