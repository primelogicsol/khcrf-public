'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CertificationCardLayout from '@/components/business-support/CertificationCardLayout';
import StepWizardEvaluationForm from '@/components/business-support/StepWizardEvaluationForm';
import { CERTIFICATION_QUESTIONS } from '@/data/certificationQuestions';
import api from '@/lib/api';
import { useToast } from "@/context/ToastContext";
import { FaCheck } from 'react-icons/fa';

export default function EvaluationClient() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [checkingStatus, setCheckingStatus] = useState(true);
    const [existingSubmission, setExistingSubmission] = useState<any>(null);

    // Check for existing submissions on mount
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await api.get('/evaluation/my-evaluation');
                if (res.data && res.data.length > 0) {
                    // Check if there is any active submission for CERTIFICATION
                    const activeSubmission = res.data.find((sub: any) =>
                        (sub.status === 'PENDING' || sub.status === 'APPROVED') &&
                        sub.evaluationType === 'CERTIFICATION'
                    );

                    if (activeSubmission) {
                        setExistingSubmission(activeSubmission);
                    }
                }
            } catch (error) {
                console.error("Failed to check evaluation status", error);
            } finally {
                setCheckingStatus(false);
            }
        };

        checkStatus();
    }, []);

    const handleComplete = async (score: number, isEligible: boolean, answers: Record<string, number>) => {
        if (!isEligible) {
            showToast("You are not eligible based on your score.", "error");
            // Still allow them to try again or redirect? 
            // For now, let's just warn and maybe not submit to backend if it causes a "PENDING" block?
            // But if they are not eligible, they should probably be told so. 
            // If we don't submit, they can try again immediately.
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.post('/evaluation/submit-evaluation', {
                businessName: "Certification Applicant", // Placeholder or fetch from profile
                score: score,
                answers: answers,
                evaluationType: 'CERTIFICATION'
            });

            if (response.status === 201) {
                if (isEligible) {
                    showToast("Evaluation passed! Redirecting to packages...", "success");
                    router.push('/business-support/certifications/packages');
                } else {
                    showToast("Evaluation submitted. Score below threshold.", "warning");
                    router.push('/business-support/certifications');
                }
            }
        } catch (error) {
            console.error("Submission error", error);
            showToast("Failed to save evaluation.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (checkingStatus) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    if (existingSubmission) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden p-8 md:p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                        <FaCheck className="text-3xl text-blue-600" />
                    </div>

                    <h2 className="text-3xl font-playfair font-bold text-blue-800 mb-2">
                        Certification Application Under Review
                    </h2>
                    <p className="text-xl font-bold text-stone-900 mb-6">Status: {existingSubmission.status}</p>

                    <div className="bg-blue-50 border-l-4 border-blue-500 text-left p-6 rounded-r-lg mb-8">
                        <p className="font-bold text-lg text-blue-800 mb-2">
                            You have already submitted a certification evaluation.
                        </p>
                        <p className="text-stone-700">
                            Your application is currently being processed. You cannot submit a new evaluation while one is pending or approved.
                        </p>
                    </div>

                    <p className="text-stone-600 mb-8 text-left leading-relaxed">
                        You can track the progress of your application in your profile dashboard.
                    </p>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => router.push('/profile/evaluations')}
                            className="bg-brand-primary text-white font-bold py-4 px-10 rounded hover:bg-brand-dark transition-all uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            View My Application
                        </button>
                        <button
                            onClick={() => router.push('/business-support/certifications/packages')}
                            className="bg-white text-brand-primary border-2 border-brand-primary font-bold py-4 px-10 rounded hover:bg-brand-secondary/10 transition-all uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Browse Packages
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <CertificationCardLayout
            title="Certification Evaluation"
            subtitle="Real Time Preliminary Self Evaluation Check"
            maxWidth="max-w-5xl"
        >
            <StepWizardEvaluationForm
                questions={CERTIFICATION_QUESTIONS}
                onComplete={handleComplete}
                nextStepLabel={isSubmitting ? "Submitting..." : "Next: Select Package"}
            />
        </CertificationCardLayout>
    );
}
