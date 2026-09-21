import AccreditationFormClient from "./AccreditationFormClient";

export const metadata = {
    title: 'Apply for Accreditation | KHCRF',
    description: 'Apply for KHCRF Recognition Badge to showcase your commitment to ethical trade and craftsmanship.',
};

export default function ApplyForAccreditationPage() {
    return (
        <main className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <AccreditationFormClient />
            </div>
        </main>
    );
}
