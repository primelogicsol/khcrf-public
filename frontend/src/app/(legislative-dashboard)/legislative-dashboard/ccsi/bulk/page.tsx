"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import {
  FaCloudUploadAlt,
  FaDownload,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

export default function BulkUploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<"UPLOAD" | "PREVIEW" | "SUCCESS">("UPLOAD");
  const [loading, setLoading] = useState(false);

  // Preview Data
  const [stats, setStats] = useState<any>(null);
  const [previewRows, setPreviewRows] = useState<any>(null); // To store valid rows for submission

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data;
          // Send to backend for validation
          const { data } = await api.post("/ccsi/bulk-preview", { rows });
          setStats(data);
          setPreviewRows(data.validRows); // Store valid rows only? Or store all? Backend separates provided validRows
          setStep("PREVIEW");
        } catch (error: any) {
          console.error("Preview Error", error);
          alert("Failed to process file. Please check format.");
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        console.error("CSV Parse Error", error);
        setLoading(false);
        alert("Failed to parse CSV file.");
      },
    });
  };

  const handleSubmitBatch = async () => {
    if (!previewRows || previewRows.length === 0) {
      alert("No valid rows to submit.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/ccsi/bulk-submit", {
        validRows: previewRows, // Backend expects "validRows"
        totalOriginal: stats.total,
        errorCount: stats.errors,
      });
      setStep("SUCCESS");
    } catch (error) {
      console.error("Submit Batch Error", error);
      alert("Failed to submit batch.");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await api.get("/ccsi/template", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ccsi_stakeholder_template.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download Error", error);
      alert("Failed to download template.");
    }
  };

  if (step === "SUCCESS") {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center animate-fadeIn">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full text-green-600 mb-6">
          <FaCheckCircle className="text-5xl" />
        </div>
        <h2 className="text-3xl font-bold font-playfair text-gray-900 mb-4">
          Batch Submitted Successfully!
        </h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Your batch has been queued for processing. {stats?.valid} profiles
          have been added to the registry with status "Submitted".
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push("/legislative-dashboard/ccsi")}
            className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all"
          >
            Go to CCSI Dashboard
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
          >
            Upload Another Batch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 animate-fadeIn">
      <h1 className="text-3xl font-bold font-playfair text-stone-900 mb-2">
        Bulk Stakeholder Upload
      </h1>
      <p className="text-gray-600 mb-8">
        Upload multiple stakeholder profiles via CSV. Please use the official
        template.
      </p>

      {/* Document Upload Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 shadow-sm">
        <h3 className="text-amber-900 font-bold mb-2 flex items-center gap-2">
          <FaExclamationTriangle className="text-amber-600" />
          Document Upload Notice
        </h3>
        <p className="text-amber-800 text-sm mb-3 font-medium">
          Please note that supporting documents are not included in the CSV bulk
          upload process.
        </p>
        <p className="text-amber-800 text-sm">
          This upload is limited to structured profile data only. Required
          documents may be uploaded later through individual stakeholder profile
          pages after verification and approval.
        </p>
      </div>

      {step === "UPLOAD" && (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          {/* Download Template */}
          <div className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-blue-900">
                Step 1: Get the Template
              </h3>
              <p className="text-sm text-blue-700">
                Download the pre-formatted CSV file to ensure correct data
                structure.
              </p>
            </div>
            <button
              onClick={downloadTemplate}
              className="px-4 py-2 bg-white text-blue-700 font-bold rounded-lg border border-blue-200 hover:bg-blue-50 flex items-center gap-2"
            >
              <FaDownload /> Download CSV
            </button>
          </div>

          {/* Template Preview */}
          <div className="mb-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
              <span>CSV Format Preview</span>
              <span className="text-xs text-gray-500 font-normal">
                Scroll horizontally to view all 34 columns
              </span>
            </h3>
            <div className="overflow-x-auto text-sm pb-4 custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap min-w-max border-collapse">
                <thead className="bg-gray-50 text-gray-600 font-bold">
                  <tr>
                    {[
                      "applicant_category",
                      "full_name",
                      "business_name",
                      "guardian_name",
                      "gender",
                      "primary_contact",
                      "alternate_contact",
                      "email",
                      "village",
                      "district",
                      "cluster",
                      "primary_craft",
                      "secondary_craft",
                      "years_experience",
                      "family_lineage",
                      "gi_association",
                      "monthly_capacity",
                      "number_workers",
                      "workshop_address",
                      "workshop_separate",
                      "raw_materials",
                      "tools_used",
                      "geo_captured",
                      "commerce_interest",
                      "selling_outside_district",
                      "bank_account_available",
                      "gst_available",
                      "pricing_records",
                      "production_type",
                      "lead_time",
                      "standard_packaging",
                      "courier_capability",
                      "digital_tools",
                      "digital_payments_ready",
                    ].map((col) => (
                      <th key={col} className="p-3 border-b border-gray-200">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-500 divide-y divide-gray-100 font-mono text-xs">
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3">ARTISAN</td>
                    <td className="p-3">John Doe</td>
                    <td className="p-3">Doe Crafts</td>
                    <td className="p-3">Richard Doe</td>
                    <td className="p-3">Male</td>
                    <td className="p-3">+919876543210</td>
                    <td className="p-3"></td>
                    <td className="p-3">john@example.com</td>
                    <td className="p-3">Srinagar</td>
                    <td className="p-3">Srinagar</td>
                    <td className="p-3">Downtown</td>
                    <td className="p-3">Carpet Weaving</td>
                    <td className="p-3"></td>
                    <td className="p-3">15</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Kashmir Carpet</td>
                    <td className="p-3">5</td>
                    <td className="p-3">3</td>
                    <td className="p-3">123 Craft Lane</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Silk, Wool</td>
                    <td className="p-3">Loom</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Made to Order</td>
                    <td className="p-3">30 Days</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Smartphone</td>
                    <td className="p-3">Yes</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3">BUSINESS</td>
                    <td className="p-3">Jane Smith</td>
                    <td className="p-3">Smith Paper Mache</td>
                    <td className="p-3">Robert Smith</td>
                    <td className="p-3">Female</td>
                    <td className="p-3">+919988776655</td>
                    <td className="p-3"></td>
                    <td className="p-3">jane@example.com</td>
                    <td className="p-3">Anantnag</td>
                    <td className="p-3">Anantnag</td>
                    <td className="p-3">Central</td>
                    <td className="p-3">Paper Mache</td>
                    <td className="p-3">Painting</td>
                    <td className="p-3">8</td>
                    <td className="p-3">No</td>
                    <td className="p-3"></td>
                    <td className="p-3">50</td>
                    <td className="p-3">10</td>
                    <td className="p-3">45 Art Street</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Paper, Paint</td>
                    <td className="p-3">Brushes</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Batch</td>
                    <td className="p-3">15 Days</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Laptop</td>
                    <td className="p-3">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors">
            <FaCloudUploadAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Upload your CSV file
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Drag & drop or browse to select file
            </p>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all inline-flex items-center gap-2"
            >
              Choose File
            </label>
            {file && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg inline-flex items-center gap-2">
                <span className="font-mono text-sm">{file.name}</span>
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <FaTimesCircle />
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <FaSpinner className="animate-spin" />}
              Process & Preview
            </button>
          </div>
        </div>
      )}

      {step === "PREVIEW" && stats && (
        <div className="space-y-8 animate-slideDown">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
              <div className="text-xs font-bold text-gray-500 uppercase">
                Total Rows
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center text-green-700">
              <div className="text-2xl font-bold">{stats.valid}</div>
              <div className="text-xs font-bold uppercase">Valid Records</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center text-red-700">
              <div className="text-2xl font-bold">{stats.errors}</div>
              <div className="text-xs font-bold uppercase">Errors</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg text-center text-amber-700">
              <div className="text-2xl font-bold">{stats.duplicates}</div>
              <div className="text-xs font-bold uppercase">Duplicates</div>
            </div>
          </div>

          {stats.errorRows.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm">
              <h3 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-4">
                <FaExclamationTriangle /> Issues Found ({stats.errors})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-red-50 text-red-800">
                    <tr>
                      <th className="p-3 rounded-tl-lg">Row #</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Issue(s)</th>
                      <th className="p-3 rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-100">
                    {stats.errorRows
                      .slice(0, 10)
                      .map((err: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-3 font-mono">{err.row}</td>
                          <td className="p-3">
                            {err.data?.full_name || "N/A"}
                          </td>
                          <td className="p-3 text-red-600">
                            <ul className="list-disc pl-4">
                              {err.errors.map((e: string, i: number) => (
                                <li key={i}>{e}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="p-3 text-gray-400 italic">Skipped</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {stats.errorRows.length > 10 && (
                  <div className="p-3 text-center text-gray-500 italic bg-gray-50 rounded-b-lg">
                    + {stats.errorRows.length - 10} more errors...
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div>
              <h3 className="font-bold text-gray-900">Ready to Submit?</h3>
              <p className="text-sm text-gray-600">
                Only the <strong>{stats.valid} valid records</strong> will be
                imported. Rows with errors will be discarded.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep("UPLOAD");
                  setFile(null);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all"
              >
                <FaTimesCircle className="inline mr-2" /> Cancel
              </button>
              <button
                onClick={handleSubmitBatch}
                disabled={loading || stats.valid === 0}
                className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <FaSpinner className="animate-spin" />}
                Import {stats.valid} Profiles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
