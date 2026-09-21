import MembershipFormClient from "./MembershipFormClient";

export const metadata = {
    title: "Join Hamadan Craft Revival Foundation - Kashmir | Membership Application",
    description: "Become a member of the Hamdan Craft Revival Foundation and support the preservation of Kashmir's artisan heritage.",
};

export default function Page() {
    return (
        <main className="bg-gray-50 min-h-screen py-20">
            <div className="container mx-auto px-4">
                <MembershipFormClient />
            </div>
        </main>
    );
}
