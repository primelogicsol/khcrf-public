import React from 'react';
import DonationHistoryClient from './DonationHistoryClient';

export default function DonationHistoryPage() {
    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-black text-gray-900 mb-2">My Donations</h1>
            <p className="text-gray-500 mb-8">View your donation history and impact.</p>
            <DonationHistoryClient />
        </div>
    );
}
