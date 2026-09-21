import PartnerFormClient from "./PartnerFormClient";

export const metadata = {
    title: "Join Partner Network | Hamadan Craft Revival Foundation - Kashmir",
    description: "Collaborate with KHCRF to empower Kashmir's artisans and preserve craft heritage.",
};

export default function PartnerJoinPage() {
    return (
        <main className="bg-gray-50 min-h-screen py-20 font-sans ">
            <div className="container mx-auto px-4">
                <PartnerFormClient />
            </div>
        </main>
    );
}
