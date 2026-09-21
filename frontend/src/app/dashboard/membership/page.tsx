import MembershipManagementClient from './MembershipManagementClient';

export default function MembershipManagementPage() {
    return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-black text-brand-dark">Membership Management</h1>
                <p className="text-gray-500 mt-2">Manage member applications and statuses.</p>
            </div>

            <MembershipManagementClient />
        </div>
    );
}
