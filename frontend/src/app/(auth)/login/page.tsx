"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaExclamationCircle,
} from "react-icons/fa";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import GoogleSignInButton from "@/components/common/GoogleSignInButton";

function LoginForm() {
  const { user, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[Google Auth] Initializing Google Login page");
    }
  }, []);

  const handleBack = () => {
    const backRouteMap: Record<string, string> = {
      "/about/memberships/join": "/about/memberships",
    };
    const destination =
      redirect && backRouteMap[redirect]
        ? backRouteMap[redirect]
        : "/";
    router.push(destination);
  };
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log('LOGIN HTTP RESPONSE', {
        status: response.status,
        payload: response.data,
      });

      const user = response.data?.user || response.data?.data?.user;

      if (!user) {
        console.error('INVALID LOGIN RESPONSE CONTRACT', response.data);
        setError('Login succeeded, but the server returned an invalid user response.');
        return;
      }

      

      // Use the project’s existing auth context to store user and handle redirect
      login(user);
    } catch (error: any) {
      if (error.isAxiosError) {
        console.error('LOGIN HTTP FAILURE', {
          message: error.message,
          code: error.code,
          url: `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`,
          method: error.config?.method,
          status: error.response?.status,
          response: error.response?.data,
        });

        const status = error.response?.status;

        if (!error.response) {
          setError('Authentication service is unavailable.');
        } else if (status === 401) {
          setError('Incorrect email or password.');
        } else if (status === 403) {
          setError('This account is not authorized.');
        } else if (status === 429) {
          setError('Too many login attempts. Please try again later.');
        } else {
          setError(
            error.response?.data?.message ??
            `Authentication failed with HTTP ${status}.`
          );
        }
      } else {
        console.error('POST-LOGIN CLIENT FAILURE', {
          errorType: error?.constructor?.name,
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          isAxiosError: error.isAxiosError,
        });
        setError(
          error instanceof Error
            ? `Login processing failed: ${error.message}`
            : 'Login processing failed.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black text-brand-dark mb-1 tracking-tight">
          Sign In
        </h3>
        <p className="text-stone-500 font-bold text-[10px] uppercase tracking-widest mb-3 flex items-center justify-center space-x-1.5 select-none">
          <FaLock className="text-[9px] text-stone-400 shrink-0" />
          <span>KHCRF Institutional Portal</span>
        </p>
        <p className="text-stone-600 font-medium text-xs leading-relaxed max-w-sm mx-auto">
          Access your KHCRF account to continue to research publications, heritage registries, craft intelligence, certification systems, and institutional knowledge resources.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-xs font-bold flex items-center space-x-3 shadow-xs">
          <FaExclamationCircle className="text-base shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
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
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-stone-400 hover:text-brand-primary transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute top-0 bottom-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaLock className="text-stone-400 group-focus-within:text-icon-on-light transition-colors text-sm" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="w-full py-3.5 pl-11 pr-11 bg-stone-50 border border-stone-200 focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-2xl focus:outline-none transition-all font-semibold text-sm text-brand-dark placeholder:text-stone-400/80"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute top-0 bottom-0 right-0 pr-4 flex items-center text-stone-400 hover:text-brand-dark transition-colors cursor-pointer text-sm"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[60px] flex items-center justify-center mt-6 bg-brand-dark text-white rounded-2xl font-semibold text-sm hover:bg-brand-primary hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center space-x-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying Credentials...</span>
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Subtle Security Reassurance */}
        <div className="flex items-center justify-center space-x-1.5 mt-4 text-[10px] text-stone-500 font-bold uppercase tracking-wider select-none">
          <FaLock className="text-[9px] text-emerald-600 shrink-0" />
          <span>AES-256 Encrypted Connection</span>
        </div>
      </form>

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
          Don't have an institutional account?{" "}
          <Link
            href="/register"
            className="text-brand-dark font-extrabold hover:text-brand-primary hover:underline transition-colors ml-1"
          >
            Create Account &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-stone-400">Loading portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
