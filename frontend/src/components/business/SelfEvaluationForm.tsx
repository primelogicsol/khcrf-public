"use client";

import { useState } from "react";
import SubmissionSuccess from "@/components/common/SubmissionSuccess";

export default function SelfEvaluationForm() {
    const [scores, setScores] = useState<Record<string, number>>({});
    const [totalScore, setTotalScore] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleScore = (section: string, value: number) => {
        setScores(prev => {
            const newScores = { ...prev, [section]: value };
            const total = Object.values(newScores).reduce((a, b) => a + b, 0);
            setTotalScore(total);
            return newScores;
        });
    };

    const criteria = [
        {
            id: "authenticity",
            title: "Product Authenticity",
            question: "How do you ensure that the materials used in your products are authentic?",
            options: [
                { val: 1, label: "Use mixed or synthetic materials" },
                { val: 2, label: "Basic compliance with significant gaps" },
                { val: 3, label: "Acceptable practice with some checks" },
                { val: 4, label: "Strong practice aligned with standards" },
                { val: 5, label: "Best-in-class, verifiable authenticity" }
            ]
        },
        {
            id: "quality",
            title: "Product Quality",
            question: "How would you rate the overall quality of your products?",
            options: [
                { val: 1, label: "Inconsistent and unreliable" },
                { val: 2, label: "Basic compliance with gaps" },
                { val: 3, label: "Acceptable quality" },
                { val: 4, label: "Strong quality standards" },
                { val: 5, label: "Exceptional, export-grade quality" }
            ]
        },
        {
            id: "sustainability",
            title: "Sustainability of Production",
            question: "How sustainable are your production processes?",
            options: [
                { val: 1, label: "No focus on sustainability" },
                { val: 2, label: "Minimal sustainable practices" },
                { val: 3, label: "Some sustainable materials used" },
                { val: 4, label: "Strong focus on eco-friendly production" },
                { val: 5, label: "Zero-waste and circular production" }
            ]
        },
        {
            id: "customer_experience",
            title: "Customer Experience",
            question: "How do you ensure a positive customer experience?",
            options: [
                { val: 1, label: "No defined strategy" },
                { val: 2, label: "Basic support only" },
                { val: 3, label: "Satisfactory experience" },
                { val: 4, label: "Proactive and well-managed" },
                { val: 5, label: "Exceptional, personalized service" }
            ]
        },
        {
            id: "fair_trade",
            title: "Fair Trade & Worker Welfare",
            question: "How do you ensure fair wages and safe working conditions?",
            options: [
                { val: 1, label: "No clear policy" },
                { val: 2, label: "Minimum legal compliance" },
                { val: 3, label: "Fair wages with basic safety" },
                { val: 4, label: "Above-market wages and strong safety" },
                { val: 5, label: "Full fair trade compliance" }
            ]
        }
    ];

    if (isSubmitted) {
        // KHCRF Framework: 5 * 5 = 25 max
        // Threshold: 33% => 9 points
        const isEligible = totalScore >= 9;

        return (
            <SubmissionSuccess
                type={isEligible ? "success" : "warning"}
                title={isEligible ? "Evaluation Successful" : "Not Yet Eligible"}
                message={isEligible
                    ? "Congratulations! You meet the baseline readiness requirements for Hamadan Craft Revival Foundation - Kashmir Certification."
                    : "The applicant does not currently meet minimum standards for claim validation."}
                timeline={[
                    { label: "Self Evaluation", status: "completed" },
                    { label: "Formal Application", status: "upcoming" },
                    { label: "Verification", status: "upcoming" },
                    { label: "Certification", status: "upcoming" }
                ]}
                summary={[
                    { label: "Total Score", value: `${totalScore} / 25` },
                    { label: "Status", value: isEligible ? "Eligible" : "Not Yet Eligible" }
                ]}
                primaryAction={isEligible ? {
                    label: "Start Accreditation",
                    href: "/business-support/accreditation/apply"
                } : {
                    label: "Retake Evaluation",
                    onClick: () => {
                        setIsSubmitted(false);
                        setScores({});
                        setTotalScore(0);
                    }
                }}
            />
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-brand-secondary/20">
            <h2 className="text-3xl font-bold text-brand-primary mb-2">Preliminary Self Evaluation</h2>
            <p className="text-gray-600 mb-6">Assess your business against the 5 pillars of the KHCRF Framework. Score 9+ to qualify.</p>
            <p className="text-gray-800 font-bold mb-8 text-lg">Current Score: {totalScore} / 25</p>

            <div className="space-y-10">
                {criteria.map((c) => (
                    <div key={c.id} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{c.title}</h3>
                        <p className="mb-4 text-gray-700 font-medium">{c.question}</p>
                        <div className="space-y-3">
                            {c.options.map((opt) => (
                                <label key={opt.val} className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${scores[c.id] === opt.val ? "bg-brand-secondary/20 border-brand-secondary text-brand-dark font-bold shadow-sm" : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"}`}>
                                    <input
                                        type="radio"
                                        name={c.id}
                                        value={opt.val}
                                        onChange={() => handleScore(c.id, opt.val)}
                                        className="w-5 h-5 mr-3 accent-brand-secondary"
                                    />
                                    {opt.label} <span className="ml-auto text-xs font-semibold text-gray-400">({opt.val} pts)</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={() => { window.scrollTo(0, 0); setIsSubmitted(true); }}
                    disabled={Object.keys(scores).length < 5}
                    className="px-8 py-4 bg-brand-primary text-white text-lg font-bold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    Submit Evaluation
                </button>
            </div>
        </div>
    );
}
