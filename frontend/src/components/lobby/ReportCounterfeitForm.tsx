"use client";

import { Upload, Send } from "lucide-react";

const ReportCounterfeitForm = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
      <h2 className="text-2xl font-playfair font-bold text-[#050A1E] mb-6 border-b border-slate-100 pb-4">
        Report Counterfeit Product
      </h2>
      <p className="text-slate-600 mb-8 max-w-2xl">
        Help us protect our heritage. Please provide as much detail as possible
        about the suspected counterfeit item. Your report can remain anonymous.
      </p>

      <form 
        className="space-y-6 max-w-2xl"
        onSubmit={(e) => e.preventDefault()}
      >
        <fieldset disabled aria-describedby="service-unavailable-message-counterfeit">
          <div id="service-unavailable-message-counterfeit" className="bg-gray-100 p-4 rounded text-sm text-gray-500 mb-4">
            This reporting service is currently unavailable as the backend systems are being upgraded. 
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Product Name/Type
              </label>
              <input
                type="text"
                placeholder="e.g. Pashmina Shawl"
                className="w-full p-3 border border-slate-300 rounded focus:outline-none opacity-50 cursor-not-allowed bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Location/Shop Name
              </label>
              <input
                type="text"
                placeholder="e.g. Main Market, Shop #12"
                className="w-full p-3 border border-slate-300 rounded focus:outline-none opacity-50 cursor-not-allowed bg-gray-50"
              />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Description of Violation
            </label>
            <textarea
              rows={4}
              placeholder="Describe why you suspect this is fake (e.g. machine made sold as hand-made, wrong labeling, suspicious price)..."
              className="w-full p-3 border border-slate-300 rounded focus:outline-none opacity-50 cursor-not-allowed bg-gray-50"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Upload Evidence (Photos/Videos)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center opacity-50 cursor-not-allowed bg-gray-50">
              <Upload size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">
                Click to upload or drag and drop photos here
              </p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, up to 5MB</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anonymous"
              className="rounded opacity-50 cursor-not-allowed"
            />
            <label htmlFor="anonymous" className="text-sm text-slate-500 cursor-not-allowed">
              Submit Anonymously
            </label>
          </div>

          <button
            type="submit"
            className="bg-gray-400 text-white px-8 py-3 rounded font-bold uppercase tracking-wide shadow-md flex items-center cursor-not-allowed opacity-50"
          >
            <Send size={18} className="mr-2" />
            Submit Report
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default ReportCounterfeitForm;
