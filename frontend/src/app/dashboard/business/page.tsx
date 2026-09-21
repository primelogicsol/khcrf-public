import Link from "next/link";
import { FaCertificate, FaFileInvoiceDollar } from "react-icons/fa";

const cards = [
    {
        title: "Accreditations",
        description: "Manage business accreditation requests and verifications.",
        link: "/dashboard/business/accreditations",
        icon: FaCertificate,
        color: "bg-purple-100 text-purple-600",
        count: "12 Pending",
    },
    {
        title: "Grant Applications",
        description: "Review and process grant submissions from businesses.",
        link: "/dashboard/business/grants",
        icon: FaFileInvoiceDollar,
        color: "bg-green-100 text-green-600",
        count: "5 New",
    },
];

export default function BusinessSupportPage() {
    return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Business Support</h1>
            <p className="text-gray-600">Manage accreditations, grants, and business resources.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link href={card.link} key={card.title} className="block group">
                            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group-hover:-translate-y-1">
                                <div className="flex items-start justify-between">
                                    <div className={`p-3 rounded-lg ${card.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        {card.count}
                                    </span>
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-gray-900">{card.title}</h3>
                                <p className="mt-1 text-sm text-gray-500">{card.description}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
