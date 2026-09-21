import React from 'react';

interface CertificationCardLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export default function CertificationCardLayout({
    title,
    subtitle,
    children,
    maxWidth = "max-w-3xl"
}: CertificationCardLayoutProps) {
    return (
        <div className=" min-h-screen py-10 px-4">
            <div className={`${maxWidth} mx-auto bg-white rounded-lg shadow-lg overflow-hidden`}>
                {/* Header */}
                <div className="bg-brand-secondary text-white p-6 text-center">
                    <h1 className="text-2xl font-bold mb-2">{title}</h1>
                    <p className="opacity-90">{subtitle}</p>
                </div>

                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
