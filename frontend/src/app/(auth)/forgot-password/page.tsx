"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
} from "react-icons/fa";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/forgot-password", {
        email: formData.email.trim().toLowerCase(),
      });
      setSuccessMsg(res.data?.data?.message || res.data?.message || "Reset code sent to your email.");
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.data?.message || err.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    if (!formData.otp || !formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        email: formData.email.trim().toLowerCase(),
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      setSuccessMsg("Password reset successfully. Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.data?.message || err.response?.data?.message || "Failed to reset password");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-black text-brand-dark mb-2 tracking-tight">
          Reset Password
        </h3>
        <p className="text-stone-600 font-medium text-xs leading-relaxed max-w-xs mx-auto">
          {step === 1
            ? "Enter your email to receive a secure password reset code."
            : "Enter the code sent to your email along with your new password."}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center justify-center text-center">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-bold flex items-center justify-center text-center">
          {successMsg}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute top-0 bottom-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaEnvelope className="text-stone-400 group-focus-within:text-icon-on-light transition-colors text-sm" />
              </div>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full py-3.5 pl-11 pr-4 bg-stone-50 border border-stone-200 focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-2xl focus:outline-none transition-all font-semibold text-sm text-brand-dark placeholder:text-stone-400/80"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[60px] flex items-center justify-center mt-6 bg-brand-dark text-white rounded-2xl font-semibold text-sm hover:bg-brand-primary hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sending Code...</span>
              </span>
            ) : (
              "Send Reset Code"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5">
          {/* OTP Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
              Verification Code
            </label>
            <div className="relative group">
              <div className="absolute top-0 bottom-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaShieldAlt className="text-stone-400 group-focus-within:text-icon-on-light transition-colors text-sm" />
              </div>
              <input
                type="text"
                placeholder="6-Digit Verification Code"
                maxLength={6}
                className="w-full py-3.5 pl-11 pr-4 bg-stone-50 border border-stone-200 focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-2xl focus:outline-none transition-all font-semibold text-sm text-brand-dark placeholder:text-stone-400/80 tracking-widest text-center"
                value={formData.otp}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    otp: e.target.value.replace(/\D/g, ""),
                  })
                }
                required
              />
            </div>
          </div>

          {/* New Password Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
              New Password
            </label>
            <div className="relative group">
              <div className="absolute top-0 bottom-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="text-stone-400 group-focus-within:text-icon-on-light transition-colors text-sm" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a new password"
                className="w-full py-3.5 pl-11 pr-12 bg-stone-50 border border-stone-200 focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-2xl focus:outline-none transition-all font-semibold text-sm text-brand-dark placeholder:text-stone-400/80"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-0 bottom-0 right-0 pr-4 flex items-center text-stone-400 hover:text-brand-dark transition-colors cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute top-0 bottom-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="text-stone-400 group-focus-within:text-icon-on-light transition-colors text-sm" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                className="w-full py-3.5 pl-11 pr-12 bg-stone-50 border border-stone-200 focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-2xl focus:outline-none transition-all font-semibold text-sm text-brand-dark placeholder:text-stone-400/80"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[60px] flex items-center justify-center mt-6 bg-brand-dark text-white rounded-2xl font-semibold text-sm hover:bg-brand-primary hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Resetting...</span>
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}

      {/* Redirect link to login */}
      <div className="flex justify-center mt-8">
        <Link
          href="/login"
          className="text-brand-dark font-extrabold hover:text-brand-primary hover:underline transition-colors text-xs"
        >
          Back to Sign In &rarr;
        </Link>
      </div>
    </div>
  );
}
