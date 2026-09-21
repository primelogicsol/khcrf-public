import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { FaCheck, FaChevronRight, FaChevronLeft } from 'react-icons/fa6';
import SubmissionSuccess from "@/components/common/SubmissionSuccess";

export type EvaluationQuestion = {
    id: string;
    section: string;
    question: string;
    options: { value: number; label: string }[];
};

interface StepWizardEvaluationFormProps {
    questions: EvaluationQuestion[];
    onComplete: (score: number, isEligible: boolean, answers: Record<string, number>) => void;
    onContactSupport?: () => void;
    nextStepLabel?: string;
}

export default function StepWizardEvaluationForm({
    questions,
    onComplete,
    onContactSupport,
    nextStepLabel = "Next Step"
}: StepWizardEvaluationFormProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Store the INDEX of the selected option, not the value
    const handleOptionSelect = (optionIndex: number) => {
        setResponses(prev => ({ ...prev, [currentStep]: optionIndex }));
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsSubmitted(true);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            router.back();
        }
    };

    const calculateScore = () => {
        return Object.entries(responses).reduce((total, [stepStr, optionIndex]) => {
            const step = parseInt(stepStr);
            const question = questions[step];
            if (question && question.options[optionIndex]) {
                return total + question.options[optionIndex].value;
            }
            return total;
        }, 0);
    };

    const currentQuestion = questions[currentStep];
    const isOptionSelected = responses[currentStep] !== undefined;

    if (isSubmitted) {
        const score = calculateScore();
        // KHCRF Framework: Max 25 (5 questions * 5 points)
        const maxScore = 25;
        // Threshold: 33% (approx 8.25 => 9 points)
        const isEligible = score >= 9;

        // Convert responses (index->optionIndex) to a string-keyed record for consistency
        const answersToPass: Record<string, number> = {};
        Object.entries(responses).forEach(([k, v]) => {
            // In backend we expect { questionIndex: value }? 
            // EvaluationFormClient sends { questionIndex: value }.
            // Here responses stores optionIndex.
            // But we probably want to store the VALUE (1,2,5) or the optionIndex?
            // EvaluationPreviewClient maps `evaluation.answers` back to options using `opt.value === answerValue`.
            // So we must store the VALUE.
            const qIndex = parseInt(k);
            const val = questions[qIndex].options[v].value;
            answersToPass[k] = val;
        });


        return (
            <SubmissionSuccess
                type={isEligible ? "success" : "warning"} // Passing type based on eligibility
                title={isEligible ? "Evaluation Successful" : "Not Yet Eligible"}
                message={isEligible
                    ? "The applicant demonstrates baseline readiness for further verification. You are eligible to proceed regarding claim validation."
                    : "The applicant does not currently meet minimum standards for claim validation."
                }
                referenceNumber={`EVAL-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`}
                timeline={[
                    { label: "Evaluation Submitted", status: "completed" },
                    { label: "Score Calculated", status: "completed" },
                    { label: "Eligibility Check", status: "completed" },
                    { label: isEligible ? "Certification Ready" : "Consultation Needed", status: "current" }
                ]}
                summary={[
                    { label: "Total Score", value: `${score} / ${maxScore}` },
                    { label: "Result", value: isEligible ? "Eligible" : "Not Eligible" }
                ]}
                primaryAction={{
                    label: isEligible ? nextStepLabel : "Contact Support",
                    onClick: isEligible ? () => onComplete(score, isEligible, answersToPass) : (onContactSupport || (() => window.location.href = '/contact'))
                }}
            />
        );
    }

    return (
        <div className="min-h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
            {/* Sidebar / Progress */}
            <div className="bg-stone-900 text-white p-8 md:w-1/3 flex flex-col justify-between relative overflow-hidden">
                {/* Pattern Background */}
                {/* Removed background pattern per global rule */}

                <div className="relative z-10">
                    <h2 className="text-2xl font-playfair font-bold mb-6">Evaluation Progress</h2>
                    <div className="space-y-4">
                        {questions.map((q, idx) => (
                            <div key={idx} className={`flex items-center gap-3 ${idx === currentStep ? 'text-brand-primary' : idx < currentStep ? 'text-green-400' : 'text-stone-600'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold 
                                    ${idx === currentStep ? 'border-brand-primary bg-brand-primary/10' :
                                        idx < currentStep ? 'border-green-400 bg-green-400/10' : 'border-stone-700 bg-stone-800'}`}>
                                    {idx < currentStep ? <FaCheck /> : idx + 1}
                                </div>
                                <span className={`text-sm font-medium ${idx === currentStep ? 'font-bold' : ''}`}>
                                    Section {idx + 1}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative z-10 mt-8">
                    <p className="text-stone-400 text-sm">
                        Step {currentStep + 1} of {questions.length}
                    </p>
                    <div className="w-full bg-stone-800 h-2 rounded-full mt-2">
                        <div
                            className="bg-brand-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Question Area */}
            <div className="p-8 md:p-12 md:w-2/3 flex flex-col bg-white">
                <div className="grow">
                    <span data-editorial-accent-text className=" font-bold tracking-widest uppercase text-xs mb-2 block">
                        {currentQuestion.section}
                    </span>
                    <h3 className="text-2xl font-playfair font-bold text-stone-900 mb-8 leading-tight">
                        {currentQuestion.question}
                    </h3>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option, idx) => (
                            <label
                                key={idx}
                                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 group
                                    ${responses[currentStep] === idx
                                        ? 'border-brand-primary bg-brand-primary/5'
                                        : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
                            >
                                <div className="mt-1">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                        ${responses[currentStep] === idx ? 'border-brand-primary' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                        {responses[currentStep] === idx && <div data-editorial-accent-bg className="w-2.5 h-2.5 rounded-full "></div>}
                                    </div>
                                </div>
                                <input
                                    type="radio"
                                    name={`question-${currentStep}`}
                                    className="hidden"
                                    checked={responses[currentStep] === idx}
                                    onChange={() => handleOptionSelect(idx)}
                                />
                                <span className={`text-stone-700 group-hover:text-stone-900 ${responses[currentStep] === idx ? 'font-medium' : ''}`}>
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-10 flex justify-between items-center pt-6 border-t border-gray-100">
                    <button
                        onClick={handlePrevious}
                        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium transition-colors"
                    >
                        <FaChevronLeft /> {currentStep === 0 ? "Back" : "Previous"}
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!isOptionSelected}
                        className={`flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-8 rounded hover:bg-brand-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 disabled:hover:translate-y-0`}
                    >
                        {currentStep === questions.length - 1 ? 'Submit Evaluation' : 'Next Question'}
                        {currentStep < questions.length - 1 && <FaChevronRight />}
                    </button>
                </div>
            </div>
        </div>
    );
}
