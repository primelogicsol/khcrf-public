"use client";

import React, { useEffect, useState } from "react";
import {
  FaCertificate,
  FaSpinner,
  FaMoneyBillWave,
  FaClock,
  FaArrowRight,
  FaBoxOpen,
  FaShoppingCart,
} from "react-icons/fa";
import api from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

interface CertificationOrder {
  id: string;
  name: string;
  amount: number;
  firstName: string;
  lastName: string;
  email: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  razorpayOrderId?: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<CertificationOrder[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await api.get("/payment/certifications");
        setCertifications(response.data);
      } catch (error) {
        console.error("Failed to fetch certifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    success: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    dispatched: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    processing: "bg-blue-100 text-blue-800",
    printing: "bg-indigo-100 text-indigo-800",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
      </div>
    );
  }

  // Calculate Stats
  const totalCertificates = certifications.length;
  const totalRevenue = certifications
    .filter((c) =>
      ["SUCCESS", "DELIVERED", "DISPATCHED", "PROCESSING", "PRINTING"].includes(
        c.status.toUpperCase(),
      ),
    )
    .reduce((sum, c) => sum + c.amount, 0);
  const pendingOrders = certifications.filter(
    (c) => c.status.toLowerCase() === "pending",
  ).length;
  const recentActivity = certifications.slice(0, 5); // Status sorted by backend usually

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Certifications Overview
        </h1>
        <p className="text-gray-500">
          Welcome to the certification management dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
              Total Issued
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              {totalCertificates}
            </h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-xl">
            <FaCertificate />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
              Total Revenue
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              ₹{totalRevenue.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center text-xl">
            <FaMoneyBillWave />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
              Pending Orders
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              {pendingOrders}
            </h3>
          </div>
          <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center text-xl">
            <FaClock />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Link
          href="/dashboard/business/certifications/packages"
          className="group"
        >
          <div className="bg-gradient-to-br from-brand-primary to-brand-dark p-8 rounded-3xl text-white shadow-lg shadow-brand-primary/25 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Manage Packages</h3>
              <p className="text-white/80 mb-6 max-w-sm">
                Create, edit, and update certification packages offered to
                users.
              </p>
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl font-bold text-sm group-hover:bg-white group-hover:text-brand-primary transition-all">
                Go to Packages <FaArrowRight />
              </span>
            </div>
            <FaBoxOpen className="absolute -bottom-6 -right-6 text-9xl text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </Link>

        <Link href="/dashboard/business/orders" className="group">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group-hover:border-brand-primary/20">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                View Orders
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                Track purchase history, update statuses, and upload
                certificates.
              </p>
              <span className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl font-bold text-gray-900 text-sm group-hover:bg-brand-primary group-hover:text-white transition-all">
                Manage Orders <FaArrowRight />
              </span>
            </div>
            <FaShoppingCart className="absolute -bottom-6 -right-6 text-9xl text-gray-50 rotate-12 group-hover:text-brand-primary/5 transition-colors duration-500" />
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <Link
            href="/dashboard/business/orders"
            className="text-brand-primary font-bold text-sm hover:underline"
          >
            View All
          </Link>
        </div>

        {recentActivity.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentActivity.map((cert) => (
              <div
                key={cert.id}
                className="p-6 hover:bg-gray-50/50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${statusColors[cert.status.toLowerCase()] || "bg-gray-100 text-gray-500"}`}
                  >
                    <FaCertificate />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{cert.name}</h4>
                    <p className="text-sm text-gray-500">
                      Purchased by{" "}
                      <span className="font-medium text-gray-700">
                        {cert.firstName} {cert.lastName}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-1 ${statusColors[cert.status.toLowerCase()] || "bg-gray-100 text-gray-600"}`}
                  >
                    {cert.status}
                  </span>
                  <p className="text-xs text-gray-400">
                    {new Date(cert.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            No recent activity found.
          </div>
        )}
      </div>
    </div>
  );
}
