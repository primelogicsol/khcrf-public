import React from "react";
import Link from "next/link";
import { FaArrowLeft, FaFilePdf, FaInfoCircle, FaClock, FaCalendarAlt, FaCogs } from "react-icons/fa";

export const metadata = {
  title: "Compiled Messages PDF | State of Kashmir Crafts",
};

export default function CompiledMessagesPage() {
  // In a real application, this would be determined by user authentication state
  const isAdmin = false;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/state-of-kashmir-crafts/official-messages" className="inline-flex items-center gap-2 text-brand-secondary hover:text-brand-primary font-bold transition mb-8">
          <FaArrowLeft /> Back to Download Center
        </Link>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-sm">
          <div className="mb-10 text-center border-b border-gray-100 pb-10">
            <FaFilePdf data-ui-icon  className="text-6xl  mx-auto mb-6 opacity-50" />
            <h1 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">Compiled Messages PDF</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This consolidated PDF will be generated after official, institutional, and stakeholder messages are received, verified, and published.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-center">
              <FaInfoCircle className="text-gray-400 text-2xl mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Status</h3>
              <p className="text-sm text-gray-600 font-medium">Not Generated Yet</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-center">
              <FaClock className="text-gray-400 text-2xl mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Current Stage</h3>
              <p className="text-sm text-gray-600 font-medium">Awaiting Published Messages</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-center">
              <FaCalendarAlt className="text-gray-400 text-2xl mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Availability</h3>
              <p className="text-sm text-gray-600 font-medium">After consultation period closes</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl flex gap-4 items-start mb-10">
            <FaInfoCircle className="text-yellow-600 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-800 mb-1">Public Note</h3>
              <p className="text-sm text-yellow-700">
                The compiled messages PDF is not available yet. It will be published once the message collection is complete and verified.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/state-of-kashmir-crafts/official-messages" className="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition text-center">
              Back to Download Center
            </Link>
            <Link href="/state-of-kashmir-crafts/official-messages" className="px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition shadow-md text-center">
              View Official Messages
            </Link>
          </div>

          {isAdmin && (
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-4">Admin Controls</p>
              <button className="px-6 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-md flex items-center justify-center gap-2 mx-auto">
                <FaCogs /> Generate Compilation PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
