"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaBoxOpen } from "react-icons/fa";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Textarea from "@/components/common/Textarea";
import Modal from "@/components/common/Modal";
import api from "@/lib/api"; // Assuming api is the axios instance
import toast from "react-hot-toast";

interface CertificatePackage {
  id: string;
  name: string;
  description?: string;
  price: number;
  features?: any;
  validity?: string;
  annualFee?: number;
}

export default function CertificatePackagesPage() {
  const [packages, setPackages] = useState<CertificatePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPackage, setCurrentPackage] =
    useState<CertificatePackage | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    annualFee: "",
    validity: "",
    features: "", // Comma separated for simplicity in this version
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/certificate-packages");
      setPackages(res.data);
    } catch (error) {
      console.error("Failed to fetch packages", error);
      toast.error("Failed to load packages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (pkg?: CertificatePackage) => {
    if (pkg) {
      setCurrentPackage(pkg);
      setFormData({
        name: pkg.name,
        description: pkg.description || "",
        price: pkg.price.toString(),
        annualFee: pkg.annualFee?.toString() || "0",
        validity: pkg.validity || "",
        features: Array.isArray(pkg.features)
          ? pkg.features.join(", ")
          : (pkg.features as string) || "",
      });
    } else {
      setCurrentPackage(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        annualFee: "",
        validity: "",
        features: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPackage(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        ...formData,
        price: parseFloat(formData.price),
        annualFee: parseFloat(formData.annualFee || "0"),
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
      };

      if (currentPackage) {
        await api.put(
          `/certificate-packages/${currentPackage.id}`,
          dataToSubmit,
        );
        toast.success("Package updated successfully");
      } else {
        await api.post("/certificate-packages", dataToSubmit);
        toast.success("Package created successfully");
      }
      fetchPackages();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save package", error);
      toast.error("Failed to save package");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      await api.delete(`/certificate-packages/${id}`);
      toast.success("Package deleted successfully");
      fetchPackages();
    } catch (error) {
      console.error("Failed to delete package", error);
      toast.error("Failed to delete package");
    }
  };

  return (
    <div className="p-6 md:p-8 w-full min-h-screen bg-gray-50/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Certificate Packages
          </h1>
          <p className="text-gray-500">
            Manage certification tiers and packages offered.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={<FaPlus />}>
          Add New Package
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <FaBoxOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            No Packages Found
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Get started by creating your first certificate package.
          </p>
          <Button onClick={() => handleOpenModal()} variant="secondary">
            Create Package
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                <div className="text-right">
                  <div className="text-xl font-bold text-brand-primary">
                    ₹{pkg.price.toLocaleString()}
                  </div>
                  {pkg.annualFee !== undefined && (
                    <div className="text-xs text-gray-500 font-medium">
                      + ₹{pkg.annualFee.toLocaleString()} / year
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                {pkg.description || "No description provided."}
              </p>

              <div className="mb-4 flex-1">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Features
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {Array.isArray(pkg.features) &&
                    pkg.features
                      .slice(0, 3)
                      .map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span className="truncate">{feature}</span>
                        </li>
                      ))}
                  {Array.isArray(pkg.features) && pkg.features.length > 3 && (
                    <li className="text-xs text-brand-primary font-medium pl-3">
                      +{pkg.features.length - 3} more
                    </li>
                  )}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2 mt-auto">
                <button
                  onClick={() => handleOpenModal(pkg)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentPackage ? "Edit Package" : "Create New Package"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Package Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Gold Tier Certification"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
            <Input
              label="Annual Fee (₹)"
              name="annualFee"
              type="number"
              value={formData.annualFee}
              onChange={handleChange}
              placeholder="0.00"
            />
            <Input
              label="Validity (e.g. 1 Year)"
              name="validity"
              value={formData.validity}
              onChange={handleChange}
              placeholder="e.g. 1 Year"
            />
          </div>

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Short description of the package..."
          />

          <Textarea
            label="Features (Comma separated)"
            name="features"
            value={formData.features}
            onChange={handleChange}
            rows={3}
            placeholder="Feature 1, Feature 2, Feature 3..."
            subtext="Enter features separated by commas."
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {currentPackage ? "Update Package" : "Create Package"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
