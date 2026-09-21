import React from 'react';
import DonationManagementClient from './DonationManagementClient';

export default function DonationManagementPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Donations</h1>
                <p className="text-gray-500">Manage and track all received donations.</p>
            </div>
            <DonationManagementClient />
        </div>
    );
}
