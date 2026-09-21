"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaShieldAlt,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import GoogleSignInButton from "@/components/common/GoogleSignInButton";

export default function RegisterPage() {
  const router = useRouter();
  const { user, login } = useAuth(); // hook

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[Google Auth] Initializing Google Signup page");
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength += 1;
    if (pass.match(/\d/)) strength += 1;
    if (pass.match(/[^a-zA-Z\d]/)) strength += 1;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, password: val });
    checkPasswordStrength(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/signup", formData);
      setSuccessMsg(
        res.data.message ||
          "Registration successful. Please check your email for the OTP.",
      );
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!otp) {
      setError("Please enter the verification code");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/verify-email", {
        email: formData.email,
        otp,
      });
      const data = res.data;

      if (data.user) {
        login(data.user);
      } else {
        router.replace("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await api.post("/auth/resend-verification", {
        email: formData.email,
      });
      setSuccessMsg(
        res.data.message || "A new verification code has been sent.",
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-black text-brand-dark mb-2 tracking-tight">
          Create Your Account
        </h3>
        <p className="text-stone-600 font-medium text-xs leading-relaxed max-w-sm mx-auto">
          Create an KHCRF account to join our institutional knowledge platform and access research publications, heritage registries, craft intelligence, certification systems, and protected knowledge resources.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center justify-center">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-bold flex items-center justify-center text-center">
          {successMsg}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute top-0 bottom-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUser className="text-stone-400 group-focus-within:text-icon-on-light transition-colors text-sm" />
              </div>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full py-3.5 pl-11 pr-4 bg-stone-50 border border-stone-200 focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-2xl focus:outline-none transition-all font-semibold text-sm text-brand-dark placeholder:text-stone-400/80"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          </div>

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

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
              Create Password
            </label>
            <div className="relative group">
              <div className="absolute top-0 bottom-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="text-stone-400 group-focus-within:text-icon-on-light transition-colors text-sm" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                className="w-full py-3.5 pl-11 pr-12 bg-stone-50 border border-stone-200 focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-2xl focus:outline-none transition-all font-semibold text-sm text-brand-dark placeholder:text-stone-400/80"
                value={formData.password}
                onChange={handlePasswordChange}
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

          {/* Password Requirements Helper Text */}
          <p className="text-[9.5px] text-stone-400/90 font-semibold mt-1 ml-1 leading-relaxed select-none">
            Minimum 8 characters with at least one uppercase letter, one number, and one special character.
          </p>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="flex items-center justify-between mt-2 ml-1 text-[10px] font-bold tracking-wider select-none animate-fade-in-up">
              <div className="flex items-center space-x-1">
                <span className="text-stone-400 uppercase tracking-widest text-[9px]">Strength:</span>
                <span className={`uppercase tracking-widest text-[9px]
                  ${passwordStrength === 1 ? "text-red-500" : ""}
                  ${passwordStrength === 2 ? "text-amber-500" : ""}
                  ${passwordStrength === 3 ? "text-yellow-500" : ""}
                  ${passwordStrength >= 4 ? "text-emerald-500" : ""}
                `}>
                  {passwordStrength === 1 && "Weak"}
                  {passwordStrength === 2 && "Fair"}
                  {passwordStrength === 3 && "Good"}
                  {passwordStrength >= 4 && "Strong"}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4].map((level) => (
                  <span 
                    key={level}
                    className={`text-[12px] leading-none transition-all duration-300 ${
                      passwordStrength >= level
                        ? passwordStrength === 1 
                          ? "text-red-500" 
                          : passwordStrength === 2
                            ? "text-amber-500"
                            : passwordStrength === 3
                              ? "text-yellow-500"
                              : "text-emerald-500"
                        : "text-stone-200"
                    }`}
                  >
                    ●
                  </span>
                ))}
              </div>
            </div>
          )}


          <button
            type="submit"
            disabled={loading}
            className="w-full h-[60px] flex items-center justify-center mt-6 bg-brand-dark text-white rounded-2xl font-semibold text-sm hover:bg-brand-primary hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Account...</span>
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Email Verification Notice */}
          <p className="text-center text-[10px] text-stone-500 font-semibold mt-3.5 select-none">
            We&apos;ll send a verification email to activate your account.
          </p>

          {/* Subtle Agreement Reassurance */}
          <p className="text-center text-[9.5px] text-stone-400 font-semibold mt-1.5 select-none">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-brand-primary">Terms of Use</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline hover:text-brand-primary">Privacy Policy</Link>.
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="relative group">
            <div className="absolute top-0 bottom-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaShieldAlt className="text-gray-400 group-focus-within:text-icon-on-light transition-colors" />
            </div>
            <input
              type="text"
              placeholder="6-Digit Verification Code"
              maxLength={6}
              className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium text-brand-dark placeholder:text-gray-400 tracking-widest text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand-dark text-white rounded-xl font-black uppercase tracking-[0.15em] hover:bg-brand-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying...</span>
              </span>
            ) : (
              "Verify Email"
            )}
          </button>

          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="text-sm font-bold text-gray-400 hover:text-brand-primary transition-colors focus:outline-none"
            >
              Didn't receive the code? Resend
            </button>
          </div>
        </form>
      )}

      {/* Social and Register Links */}
      <div className="mt-8">
        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
          <>
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <div className="relative flex justify-center text-[11px] font-semibold text-stone-400 lowercase tracking-wider">
                <span className="px-4 bg-white">
                  or continue with
                </span>
              </div>
            </div>
            {/* Google SSO Button Container */}
            <div className="w-full flex justify-center">
              <GoogleSignInButton text="continue_with" onSuccess={login} onError={setError} />
            </div>
          </>
        )}

        <p className="text-center text-[10px] text-stone-400 font-semibold mt-2.5 select-none">
          Protected with enterprise-grade authentication.
        </p>

        <p className="text-center text-stone-400 font-semibold text-xs mt-8">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand-dark font-extrabold hover:text-brand-primary hover:underline transition-colors ml-1"
          >
            Sign In &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
