"use client";

import { useState, useEffect } from "react";
import { apprenticeshipApi } from "@/lib/api";
import { FaPlus, FaEdit, FaTrash, FaBriefcase, FaTimes } from "react-icons/fa";
import Input from "@/components/common/Input";
import { normalizeArray } from "@/lib/normalize";

interface Opening {
  id: string;
  title: string;
  description: string;
  location: string;
  type: "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "TEMPORARY";
  duration?: string;
  stipend?: string;
  requirements?: string[];
  status: "OPEN" | "CLOSED";
}

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  location: "",
  type: "FULL_TIME",
  duration: "",
  stipend: "",
  status: "OPEN",
};

export default function ApprenticeshipOpeningsPage() {
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchOpenings();
  }, []);

  const fetchOpenings = async () => {
    try {
      const data = await apprenticeshipApi.getOpenings();
      setOpenings(normalizeArray(data, ["openings", "items", "results", "data"]));
    } catch (error) {
      console.error("Failed to fetch openings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setFormData(INITIAL_FORM_STATE);
    setIsEditing(false);
    setCurrentId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (opening: Opening) => {
    setFormData({
      title: opening.title,
      description: opening.description,
      location: opening.location,
      type: opening.type,
      duration: opening.duration || "",
      stipend: opening.stipend || "",
      status: opening.status,
    });
    setIsEditing(true);
    setCurrentId(opening.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (isEditing && currentId) {
        await apprenticeshipApi.updateOpening(currentId, formData);
      } else {
        await apprenticeshipApi.createOpening(formData);
      }
      await fetchOpenings();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save opening:", error);
      alert("Failed to save opening. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this opening?")) {
      try {
        await apprenticeshipApi.deleteOpening(id);
        await fetchOpenings();
      } catch (error) {
        console.error("Failed to delete opening:", error);
        alert("Failed to delete opening. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 font-manrope">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaBriefcase data-ui-icon  className="" />
            Apprenticeship Openings
          </h1>
          <p className="text-gray-500">
            Manage current apprenticeship opportunities and internships
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/25"
        >
          <FaPlus /> Create New Opening
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading openings...
          </div>
        ) : openings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-semibold mb-2">No openings found</p>
            <p className="text-sm">
              Create your first apprenticeship opening to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                    Title & Description
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {openings.map((opening) => (
                  <tr
                    key={opening.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4 max-w-md">
                      <div className="font-bold text-gray-900 mb-1">
                        {opening.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {opening.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {opening.location}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 uppercase tracking-wide">
                        {opening.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
                          opening.status === "OPEN"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {opening.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(opening)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(opening.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? "Edit Opening" : "Create New Opening"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <Input
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g. Heritage Craft Apprentice"
              />

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all placeholder:text-gray-500"
                  placeholder="Detailed description of the role and responsibilities..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Srinagar, J&K (or Remote)"
                />

                <Input
                  label="Duration (Optional)"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 6 months"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Employment Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="TEMPORARY">Temporary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
                  >
                    <option value="OPEN">Open</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              <Input
                label="Stipend / Salary (Optional)"
                name="stipend"
                value={formData.stipend}
                onChange={handleInputChange}
                placeholder="e.g. ₹15,000 / month"
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-brand-primary hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Opening"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
