import DonationFormClient from "./DonationFormClient";

export const metadata = {
    title: "Donate to Hamadan Craft Revival Foundation - Kashmir | Support Artisan Heritage",
    description: "Your contribution helps preserve Kashmir's rich handicraft traditions and empowers artisans.",
};

export default function DonationPage() {
    return (
        <main className="bg-gray-50 min-h-screen py-20 font-sans ">
            <div className="container mx-auto px-4">
                <DonationFormClient />
            </div>
        </main>
    );
}
