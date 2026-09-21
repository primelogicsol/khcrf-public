"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";

import {
  FaArrowRight,
  FaClipboardCheck,
  FaFileContract,
  FaSpinner,
} from "react-icons/fa6";
import { FaExclamationTriangle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Input from "@/components/common/Input";
import { uploadFile } from "@/lib/cloudinary";
import toast from "react-hot-toast";

export default function ProfileDashboard() {
  const { user, login, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ evaluations: 0, submissions: 0 });
  const [ccsiProfile, setCcsiProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isRequestingReferral, setIsRequestingReferral] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", email: user.email || "" });
      setPreviewUrl(null);
    }
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [evalRes, subRes, ccsiRes] = await Promise.all([
          api.get("/evaluation/my-evaluation"),
          api.get("/listing/my-listings"),
          api.get("/ccsi/my-profile").catch(() => ({ data: null })),
        ]);
        setStats({
          evaluations: evalRes.data.length,
          submissions: subRes.data.length,
        });
        setCcsiProfile(ccsiRes.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setUploading(true);
    try {
      let avatarUrl = undefined;
      if (avatarFile) {
        const uploadedUrl = await uploadFile(avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      const response = await api.put("/auth/profile", {
        name: formData.name,
        avatarUrl,
      });

      // responseFormatter wraps as { data: { user } } — unwrap safely
      const updatedUser =
        response.data?.data?.user ?? response.data?.user ?? response.data;
      if (updatedUser?.id) {
        login(updatedUser);
      }
      setIsEditing(false);
      setAvatarFile(null);
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
      setUploading(false);
    }
  };

  const handleRequestReferralCode = async () => {
    setIsRequestingReferral(true);
    try {
      await api.post("/ccsi/request-referral");
      // Update local state to reflect the requested status
      setCcsiProfile((prev: Record<string, unknown> | null) => ({
        ...prev,
        referralStatus: "pending_activation", // or whatever the backend sets it to initially
        referralCode: "PENDING", // Temporary placeholder to trigger the next UI state
      }));
    } catch (error) {
      console.error("Failed to request referral code", error);
      toast.error("Failed to request referral code. Please try again later.");
    } finally {
      setIsRequestingReferral(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner data-ui-icon  className="animate-spin text-3xl " />
      </div>
    );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {user?.avatarUrl && !isEditing ? (
            <Image
              src={user.avatarUrl}
              alt="Profile"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border-2 border-brand-primary"
            />
          ) : null}
          <div>
            <h1 className="text-3xl font-playfair font-bold text-stone-900">
              Welcome back, {user?.name}
            </h1>
            <p className="text-stone-600 mt-2">
              Here is an overview of your activity and current status.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors"
        >
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-slideDown">
          <h2 className="text-xl font-bold font-playfair text-stone-900 mb-4">
            Edit Profile
          </h2>

          <div className="mb-6 flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
              {previewUrl || user?.avatarUrl ? (
                <Image
                  src={previewUrl || user?.avatarUrl || ""}
                  alt="Preview"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-xs text-center px-2">
                  No Image
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: Square JPG, PNG. Max 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Input
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                disabled
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-red-500">* Email cannot be changed</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <FaSpinner className="animate-spin" />}
              {uploading ? "Uploading..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* CCSI Registration Resume Banner */}
      {ccsiProfile &&
        ccsiProfile.isCommerceInterested &&
        (!ccsiProfile.referralCode || !ccsiProfile.isProfileCompleted) && (
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 flex flex-col items-start gap-4">
            {!ccsiProfile.referralCode && !ccsiProfile.referralStatus ? (
              // State 1: No referral code yet and not requested
              <>
                <div className="w-full">
                  <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2 mb-3">
                    <FaExclamationTriangle /> Complete Your CCSI Registration
                  </h3>
                  <div className="text-amber-700 text-sm space-y-3">
                    <p>
                      Your initial CCSI application has been successfully
                      submitted.
                    </p>
                    <p>
                      To activate your Digital Commerce profile, a valid KHCRF
                      Constituency Craft & Stakeholder Intake (CCSI) referral
                      code issued by your local constituency office is required.
                    </p>
                    <p>
                      Once you receive the referral code, you may return to your
                      dashboard to complete your Digital Commerce profile.
                    </p>
                  </div>
                </div>
                {/* Button connected to handler function */}
                <button
                  className="px-6 py-3 bg-brand-secondary text-white font-bold rounded-lg shadow hover:bg-brand-dark transition flex items-center justify-center disabled:opacity-50"
                  onClick={handleRequestReferralCode}
                  disabled={isRequestingReferral}
                >
                  {isRequestingReferral ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Requesting...
                    </>
                  ) : (
                    "Request Referral Code"
                  )}
                </button>
              </>
            ) : ccsiProfile.referralStatus === "pending_activation" ? (
              // State 2: Referral Requested – Awaiting Office Approval
              <>
                <div className="w-full">
                  <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2 mb-3">
                    <span className="text-xl">⏳</span> Digital Commerce Status:
                    Referral Request Pending
                  </h3>
                  <div className="text-amber-700 text-sm space-y-3">
                    <p>
                      Your request for a Digital Commerce referral code has been
                      recorded.
                    </p>
                    <p>
                      Our office is currently reviewing your application. Once
                      approved, your referral code will appear here, and you can
                      complete your Commerce profile.
                    </p>
                    <p>You will be notified once the review is complete.</p>
                  </div>
                </div>
              </>
            ) : (
              // State 3: Referral Code Issued (Activated)
              <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2 mb-3">
                    <span className="text-xl">🔐</span> Digital Commerce Status:
                    Referral Code Issued
                  </h3>
                  <div className="text-amber-700 text-sm space-y-3">
                    <p className="font-bold text-lg bg-brand-primary/10 text-brand-primary p-2 rounded w-fit border border-brand-primary/20">
                      Code: {ccsiProfile.referralCode}
                    </p>
                    <p>
                      Your Constituency Referral Code has been issued and is
                      available in your profile.
                    </p>
                    <p>
                      You may now proceed to activate your Digital Commerce
                      profile from your dashboard.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    router.push(
                      ccsiProfile.legislativeOffice
                        ? `/legislative-office/${ccsiProfile.legislativeOffice.username}/register?resume=true&referralCode=${ccsiProfile.referralCode}`
                        : `/register?resume=true&referralCode=${ccsiProfile.referralCode}`,
                    )
                  }
                  className="whitespace-nowrap px-6 py-3 bg-brand-primary text-white font-bold rounded-lg shadow hover:bg-brand-dark transition flex items-center"
                >
                  Activate Digital Commerce Profile{" "}
                  <FaArrowRight className="inline ml-2" />
                </button>
              </div>
            )}
          </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">
              Evaluations
            </p>
            <h3 className="text-4xl font-playfair font-bold text-stone-900 mt-1">
              {stats.evaluations}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            <FaClipboardCheck />
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">
              Submissions
            </p>
            <h3 className="text-4xl font-playfair font-bold text-stone-900 mt-1">
              {stats.submissions}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            <FaFileContract />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold font-playfair text-stone-900">
            Account Details
          </h2>
        </div>
        <div className="p-6 pt-0 flex flex-col gap-4 text-stone-600">
          <p>
            Your dynamic dashboard navigation is on the left sidebar. The menus
            will unlock and update automatically as you unlock new services or
            progress through certifications and accreditations.
          </p>
        </div>
      </div>
    </div>
  );
}
