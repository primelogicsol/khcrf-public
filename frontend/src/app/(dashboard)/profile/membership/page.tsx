import MembershipStatusClient from './MembershipStatusClient';

export default function MembershipPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-brand-dark">My Membership</h1>
                <p className="text-gray-500 mt-2">View and manage your membership status.</p>
            </div>

            <MembershipStatusClient />
        </div>
    );
}
