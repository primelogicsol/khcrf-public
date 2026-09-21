"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

interface Submission {
    id: string;
    score: number;
    tier: string;
    status: string;
    createdAt: string;
}

export default function EvaluationProfilePage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await api.get("/evaluation/my-evaluation");
                setSubmissions(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load your evaluations.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    if (loading) return <div className="min-h-screen flex justify-center items-center"><FaSpinner data-ui-icon  className="animate-spin text-4xl " /></div>;

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">My Evaluation Status</h1>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

            {submissions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-lg mb-4">You haven't submitted any evaluations yet.</p>
                    <a href="/business-support/evaluation/form" className="bg-brand-primary text-white px-6 py-2 rounded hover:bg-brand-dark transition">Start Evaluation</a>
                </div>
            ) : (
                <div className="grid gap-6">
                    {submissions.map(sub => (
                        <div key={sub.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full ${sub.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                            sub.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {sub.status}
                                    </span>
                                    <span className="text-gray-400 text-sm">{new Date(sub.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark">{sub.tier || "Unranked"} Tier</h3>
                                <p className="text-gray-600">Score: {sub.score} / 25</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <span className="text-3xl text-brand-secondary">
                                    {sub.status === 'APPROVED' ? <FaCheckCircle /> : sub.status === 'PENDING' ? <FaClock /> : <FaTimesCircle />}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
