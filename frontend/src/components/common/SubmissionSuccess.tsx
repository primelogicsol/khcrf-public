import React from "react";
import { FaCheckCircle, FaFileDownload, FaArrowRight, FaHome, FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";

interface TimelineStep {
    label: string;
    status: "completed" | "current" | "upcoming";
}

interface ActionButton {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    variant?: "primary" | "secondary" | "outline";
}

interface SubmissionSuccessProps {
    title: string;
    message: string;
    referenceNumber?: string;
    timeline?: TimelineStep[];
    summary?: { label: string; value: string | React.ReactNode }[];
    primaryAction?: ActionButton;
    secondaryAction?: ActionButton;
    downloadAction?: ActionButton;
    type?: "success" | "warning"; // Added type prop
}

export default function SubmissionSuccess({
    title,
    message,
    referenceNumber,
    timeline = [
        { label: "Application Submitted", status: "completed" },
        { label: "Internal Review", status: "upcoming" },
        { label: "Follow-up Communication", status: "upcoming" },
        { label: "Decision & Next Steps", status: "upcoming" }
    ],
    summary,
    primaryAction,
    secondaryAction,
    downloadAction,
    type = "success" // Default to success
}: SubmissionSuccessProps) {
    const isSuccess = type === "success";

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fadeIn font-manrope">
            {/* Header */}
            <div className="bg-white p-8 md:p-12 text-center border-b border-gray-50">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isSuccess ? "bg-green-50" : "bg-red-50"}`}>
                    {isSuccess ? (
                        <FaCheckCircle className="text-5xl text-green-500" />
                    ) : (
                        <FaExclamationTriangle className="text-5xl text-red-500" />
                    )}
                </div>
                <h2 className={`text-3xl font-extrabold mb-3 ${isSuccess ? "text-gray-900" : "text-red-700"}`}>{title}</h2>
                <p className="text-gray-600 text-lg max-w-lg mx-auto">{message}</p>
            </div>

            <div className="p-8 md:p-12 bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    {/* Timeline */}
                    <div className="md:col-span-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">What Happens Next</h3>
                        <div className="space-y-6 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200 -z-10"></div>

                            {timeline.map((step, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 bg-white ${step.status === "completed"
                                        ? (isSuccess ? "border-green-500 text-green-500" : "border-red-500 text-red-500")
                                        : step.status === "current"
                                            ? "border-brand-primary text-icon-on-light animate-pulse"
                                            : "border-gray-300 text-gray-300"
                                        }`}>
                                        <div className={`w-2.5 h-2.5 rounded-full ${step.status === "completed"
                                            ? (isSuccess ? "bg-green-500" : "bg-red-500")
                                            : step.status === "current"
                                                ? "bg-editorial-accent"
                                                : "bg-transparent"
                                            }`}></div>
                                    </div>
                                    <span className={`font-medium ${step.status === "completed" || step.status === "current" ? "text-gray-900" : "text-gray-400"
                                        }`}>{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Box */}
                    <div className="md:col-span-7">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Application Summary</h3>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full max-w-full overflow-hidden box-border">
                            <div className="space-y-4">
                                {referenceNumber && (
                                    <div className="pb-4 border-b border-gray-100 mb-4">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Transaction/Ref ID</div>
                                        <div className="font-mono text-lg font-bold text-gray-900">{referenceNumber}</div>
                                    </div>
                                )}

                                {summary && summary.length > 0 && (
                                    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[max-content_minmax(0,1fr)] sm:gap-x-6 sm:gap-y-4 items-center">
                                        {summary.map((item, idx) => (
                                            <div key={idx} className="flex flex-col sm:contents gap-1">
                                                <span className="text-gray-500 text-sm font-medium">{item.label}</span>
                                                <span className="text-gray-900 font-semibold text-left min-w-0 break-words [overflow-wrap:anywhere]">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center items-center">
                    {downloadAction && (
                        <button
                            onClick={downloadAction.onClick}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm w-full md:w-auto justify-center"
                        >
                            <FaFileDownload /> {downloadAction.label}
                        </button>
                    )}

                    {secondaryAction && (
                        secondaryAction.href ? (
                            <Link href={secondaryAction.href} className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm w-full md:w-auto justify-center">
                                {secondaryAction.label}
                            </Link>
                        ) : (
                            <button onClick={secondaryAction.onClick} className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm w-full md:w-auto justify-center">
                                {secondaryAction.label}
                            </button>
                        )
                    )}

                    {primaryAction && (
                        primaryAction.href ? (
                            <Link href={primaryAction.href} className="px-8 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2 w-full md:w-auto justify-center">
                                {primaryAction.label} <FaArrowRight />
                            </Link>
                        ) : (
                            <button onClick={primaryAction.onClick} className="px-8 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2 w-full md:w-auto justify-center">
                                {primaryAction.label} <FaArrowRight />
                            </button>
                        )
                    )}
                </div>

                <div className="mt-8 text-center border-t border-gray-200 pt-6">
                    <Link href="/" className="text-gray-500 hover:text-brand-primary text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                        <FaHome /> Return to Home
                    </Link>
                    <p className="text-xs text-gray-400 mt-2">A confirmation email has been sent to your registered email address.</p>
                </div>
            </div>
        </div>
    );
}
