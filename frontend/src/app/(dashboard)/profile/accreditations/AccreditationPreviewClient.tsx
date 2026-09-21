'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import AccreditationDetailsView from '@/components/accreditation/AccreditationDetailsView';
import { FaSpinner } from 'react-icons/fa';

export function AccreditationPreviewClient() {
    const params = useParams();
    const id = params?.id as string;
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/accreditation/my-applications`);
                const foundApp = response.data?.find((app: any) => app.id === id);
                if (foundApp) {
                    setApplication(foundApp);
                } else {
                    setError("Application not found");
                }
            } catch (err) {
                console.error("Error fetching accreditation details:", err);
                setError("Failed to load application details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-800">{error || "Application not found"}</h3>
            </div>
        );
    }

    return (
        <AccreditationDetailsView
            application={application}
            backLink="/profile/accreditations"
        />
    );
}
