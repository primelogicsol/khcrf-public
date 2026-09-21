"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FaSpinner, FaArrowLeft, FaCheck, FaXmark, FaCircleExclamation } from "react-icons/fa6";
import { EVALUATION_QUESTIONS } from "@/data/evaluationQuestions";
import { CERTIFICATION_QUESTIONS } from "@/data/certificationQuestions";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface EvaluationDetail {
    id: string;
    businessName: string;
    yearsInOperation: number;
    craftType: string;
    annualRevenue: string;
    website: string;
    score: number;
    tier: string;
    status: string;
    answers: Record<string, number>; // Stored as "0": 1, "1": 3 etc.
    evaluationType: string; // SELF_ASSESSMENT | CERTIFICATION
    createdAt: string;
}

export default function EvaluationPreviewClient() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [evaluation, setEvaluation] = useState<EvaluationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchEvaluation = async () => {
            try {
                // We use the same 'my-evaluation' endpoint but filter locally for now 
                // OR ideally we should have a get-by-id endpoint.
                // Looking at the controller code, there isn't a get-by-id endpoint yet.
                // So I'll fetch all and find the one matching the ID.
                // This is not efficient for scaling but works for now as per current backend.

                const response = await api.get('/evaluation/my-evaluation');
                const found = response.data.find((e: any) => e.id === id);

                if (found) {
                    setEvaluation(found);
                } else {
                    setError("Evaluation not found.");
                }
            } catch (err) {
                console.error("Failed to fetch evaluation details", err);
                setError("Failed to load evaluation details.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvaluation();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen"><FaSpinner data-ui-icon  className="animate-spin text-3xl " /></div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500 font-bold">{error}</div>;
    if (!evaluation) return null;

    const isEligible = evaluation.score >= 9;

    const questions = evaluation.evaluationType === 'CERTIFICATION' ? CERTIFICATION_QUESTIONS : EVALUATION_QUESTIONS;

    return (
        <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-500 hover:text-brand-primary transition-colors mb-4">
                        <FaArrowLeft /> Back to Evaluations
                    </button>
                    <h1 className="text-3xl font-playfair font-bold text-stone-900">
                        {evaluation.evaluationType === 'CERTIFICATION' ? "Certification Evaluation" : "Self-Assessment Details"}
                    </h1>
                    <p className="text-stone-500 mt-1">Submitted on {new Date(evaluation.createdAt).toLocaleDateString()} at {new Date(evaluation.createdAt).toLocaleTimeString()}</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`px-4 py-2 rounded-full font-bold uppercase tracking-widest text-sm shadow-sm
                        ${evaluation.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                            evaluation.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                'bg-blue-50 text-blue-600'}`}>
                        {evaluation.status}
                    </span>
                    <span className="text-xs text-stone-400 mt-1 uppercase tracking-widest">{evaluation.evaluationType?.replace('_', ' ') || 'SELF ASSESSMENT'}</span>
                </div>
            </div>

            {/* Score Card */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <p className="font-bold text-stone-500 uppercase tracking-widest text-sm mb-2">Total Score</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-playfair font-bold text-brand-primary">{evaluation.score}</span>
                        <span className="text-stone-400 text-xl font-medium">/ 25</span>
                    </div>
                </div>

                <div className="h-16 w-px bg-gray-100 hidden md:block"></div>

                <div className="text-center md:text-left">
                    <p className="font-bold text-stone-500 uppercase tracking-widest text-sm mb-2">Eligibility Tier</p>
                    <span className={`text-3xl font-playfair font-bold
                        ${evaluation.tier === 'Gold' ? 'text-yellow-600' :
                            evaluation.tier === 'Silver' ? 'text-stone-500' :
                                'text-orange-600'}`}>
                        {evaluation.tier || 'Bronze'}
                    </span>
                </div>

                <div className="h-16 w-px bg-gray-100 hidden md:block"></div>

                <div className="flex-1 bg-gray-50 p-4 rounded-lg flex items-start gap-3">
                    {isEligible ? <FaCheck className="text-green-500 text-xl mt-1 shrink-0" /> : <FaXmark className="text-red-500 text-xl mt-1 shrink-0" />}
                    <div>
                        <p className={`font-bold ${isEligible ? 'text-green-700' : 'text-red-700'}`}>
                            {isEligible ? "Likely Eligible" : "Action Required"}
                        </p>
                        <p className="text-sm text-stone-600 mt-1 leading-relaxed">
                            {isEligible
                                ? "Your score meets the initial criteria. Proceed to next steps."
                                : "Your score is below the threshold. We recommend reviewing our improvement guidelines."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Q&A List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-playfair font-bold text-xl text-stone-900">Questionnaire Responses</h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {questions.map((q, index) => {
                        const answerValue = evaluation.answers[String(index)];
                        const selectedOption = q.options.find(opt => opt.value === answerValue);

                        return (
                            <div key={q.id} className="p-6 md:p-8 hover:bg-gray-50 transition-colors">
                                <span data-editorial-accent-text className="text-xs font-bold  uppercase tracking-widest mb-2 block">{q.section}</span>
                                <p className="font-medium text-lg text-stone-900 mb-4">{q.question}</p>

                                <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                                    <p className="text-sm text-stone-500 font-bold uppercase mb-2">Your Answer:</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                                            {answerValue}
                                        </div>
                                        <span className="font-medium text-stone-800">{selectedOption?.label || "Not Answered"}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Business Info (Optional, if captured) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-playfair font-bold text-xl text-stone-900">Application Details</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-stone-500 uppercase tracking-widest font-bold mb-1">Business Name</p>
                        <p className="font-medium text-stone-900">{evaluation.businessName || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-stone-500 uppercase tracking-widest font-bold mb-1">Craft Type</p>
                        <p className="font-medium text-stone-900">{evaluation.craftType || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-stone-500 uppercase tracking-widest font-bold mb-1">Years in Operation</p>
                        <p className="font-medium text-stone-900">{evaluation.yearsInOperation || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-stone-500 uppercase tracking-widest font-bold mb-1">Annual Revenue</p>
                        <p className="font-medium text-stone-900">{evaluation.annualRevenue || "N/A"}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-sm text-stone-500 uppercase tracking-widest font-bold mb-1">Website</p>
                        <p className="font-medium text-stone-900">{evaluation.website || "N/A"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
