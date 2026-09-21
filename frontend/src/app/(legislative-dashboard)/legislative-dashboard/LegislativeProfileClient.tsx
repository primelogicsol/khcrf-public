"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  FaPlus,
  FaBullhorn,
  FaMapMarkerAlt,
  FaFileAlt,
  FaEye,
  FaPen,
  FaTimes,
  FaLandmark,
} from "react-icons/fa";
import Link from "next/link";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Select from "@/components/common/Select";
import FileChoosing from "@/components/common/FileChoosing";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(
  () => import("@/components/common/RichTextEditor"),
  { ssr: false },
);
import LegislativeOverviewSetup from "./overview-setup/LegislativeOverviewSetup";

interface Office {
  id: string;
  representativeName: string;
  designation?: string;
  constituency: string;
  district: string;
  party?: string;
  termStart?: string;
  termEnd?: string;
  legislativeBody?: string;
  officialEmail?: string;
  contactNumber?: string;
  officeAddress?: string;
  officialWebsite?: string;
  artisanPopulation?: string;
  artisanPresence?: string;
  username: string;
  officeImageUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "BLACKLISTED";
  posts: BlogPost[];

  knownCraft?: string;
  socialHandle?: string;
  hcrfSupport?: boolean;
  craftSectors?: string[];
  craftClusters?: string;
  orgTypes?: string[];
  craftIssues?: string[];
  engagementSummary?: string;
  priorityAreas?: string;
  supportRequests?: string[];
  overviewConfig?: any;
  referralCode?: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
}

export default function LegislativeProfileClient() {
  const [office, setOffice] = useState<Office | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("identity");

  const searchParams = useSearchParams();
  const router = useRouter();
  const { uploadFile, isUploading } = useFileUpload();

  // Profile Edit Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    watch: watchProfile,
  } = useForm({
    defaultValues: {
      knownCraft: "",
      socialHandle: "",
      hcrfSupport: false,

      representativeName: "",
      designation: "",
      constituency: "",
      district: "",
      party: "",
      termStart: "",
      termEnd: "",
      legislativeBody: "",
      officialEmail: "",
      contactNumber: "",
      officeAddress: "",
      officialWebsite: "",

      artisanPresence: "No",
      artisanPopulation: "",
      craftSectors: [] as string[],
      craftClusters: "",
      orgTypes: [] as string[],

      craftIssues: [] as string[],
      engagementSummary: "",
      priorityAreas: "",
      supportRequests: [] as string[],
      overviewConfig: {
        impactStats: {
          totalStakeholders: { isAuto: true, value: 0 },
          verifiedProfiles: { isAuto: true, value: 0 },
          underEvaluation: { isAuto: true, value: 0 },
          commerceInterest: { isAuto: true, value: 0 },
        },
        officeMessage: "",
        craftComposition: [],
        economicIndicators: [],
        caseStatus: [],
      },
      referralCode: "",
    },
  });

  // Post Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      tags: [] as string[],
      documents: [] as string[],
      isPinned: false,
    },
  });

  const formValues = watch();

  useEffect(() => {
    fetchOffice();
  }, []);

  useEffect(() => {
    if (office && searchParams.get("tab") === "overview") {
      openEditProfileModal(office);
      setActiveTab("overview");

      // Remove param from URL quietly
      router.replace("/legislative-dashboard");
    }
  }, [office, searchParams, router]);

  const toggleArrayItem = (field: any, value: string) => {
    const current = (watchProfile as any)(field) || [];
    const updated = current.includes(value)
      ? current.filter((item: string) => item !== value)
      : [...current, value];
    setProfileValue(field, updated, { shouldValidate: true });
  };

  const fetchOffice = async () => {
    try {
      const { data } = await api.get("/legislative/my-office");
      setOffice(data);
    } catch (error) {
      console.error("Fetch office error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditProfileModal = (o: Office) => {
    setProfileValue("knownCraft", o.knownCraft || "");
    setProfileValue("socialHandle", o.socialHandle || "");
    setProfileValue("hcrfSupport", o.hcrfSupport || false);

    setProfileValue("representativeName", o.representativeName || "");
    setProfileValue("designation", o.designation || "");
    setProfileValue("constituency", o.constituency || "");
    setProfileValue("district", o.district || "");
    setProfileValue("party", o.party || "");
    setProfileValue("termStart", o.termStart || "");
    setProfileValue("termEnd", o.termEnd || "");
    setProfileValue("legislativeBody", o.legislativeBody || "");
    setProfileValue("officialEmail", o.officialEmail || "");
    setProfileValue("contactNumber", o.contactNumber || "");
    setProfileValue("officeAddress", o.officeAddress || "");
    setProfileValue("officialWebsite", o.officialWebsite || "");

    setProfileValue("artisanPresence", o.artisanPresence || "No");
    setProfileValue("artisanPopulation", o.artisanPopulation || "");
    setProfileValue("craftSectors", o.craftSectors || []);
    setProfileValue("craftClusters", o.craftClusters || "");
    setProfileValue("orgTypes", o.orgTypes || []);

    setProfileValue("craftIssues", o.craftIssues || []);
    setProfileValue("engagementSummary", o.engagementSummary || "");
    setProfileValue("priorityAreas", o.priorityAreas || "");
    setProfileValue("supportRequests", o.supportRequests || []);

    if (o.overviewConfig) {
      setProfileValue("overviewConfig", o.overviewConfig);
    } else {
      setProfileValue("overviewConfig", {
        impactStats: {
          totalStakeholders: { isAuto: true, value: 0 },
          verifiedProfiles: { isAuto: true, value: 0 },
          underEvaluation: { isAuto: true, value: 0 },
          commerceInterest: { isAuto: true, value: 0 },
        },
        officeMessage: "",
        craftComposition: [],
        economicIndicators: [],
        caseStatus: [],
      });
    }

    setProfileValue("referralCode", o.referralCode || "");
    setIsEditingProfile(true);
  };

  const openCreateModal = () => {
    setEditingPost(null);
    reset({ title: "", content: "", tags: [], documents: [], isPinned: false });
    setIsCreating(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    reset({
      title: post.title,
      content: post.content,
      tags: post.tags,
      documents: [], // Handle documents if needed, likely separate in API or need to fetch/map
      isPinned: false, // Add isPinned to BlogPost interface if missing or map it
    });
    // Assuming post has isPinned, need to verify interface. If not in interface, default false.
    setIsCreating(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/legislative/posts/${postId}`);
      alert("Post deleted successfully");
      fetchOffice();
    } catch (error) {
      console.error("Delete post error", error);
      alert("Failed to delete post");
    }
  };

  const onSubmitPost = async (data: any) => {
    if (!office) return;
    try {
      if (editingPost) {
        await api.put(`/legislative/posts/${editingPost.id}`, {
          ...data,
          isPublished: true, // Or keep existing status
        });
        alert("Post updated successfully!");
      } else {
        await api.post("/legislative/posts", {
          officeId: office.id,
          ...data,
          isPublished: true,
        });
        alert("Post published successfully!");
      }
      setIsCreating(false);
      setEditingPost(null);
      reset();
      fetchOffice(); // Refresh posts
    } catch (error) {
      console.error("Save post error", error);
      alert("Failed to save post");
    }
  };

  const onSubmitProfile = async (data: any) => {
    try {
      await api.put("/legislative/my-office", data);
      alert("Profile updated successfully!");
      setIsEditingProfile(false);
      fetchOffice();
    } catch (error) {
      console.error("Update profile error", error);
      alert("Failed to update profile");
    }
  };

  const handleGenerateReferralCode = async () => {
    try {
      const { data } = await api.post("/legislative/my-office/referral-code");
      setOffice(data);
      alert("Referral code generated successfully!");
    } catch (error: any) {
      console.error("Generate referral code error", error);
      alert(error.response?.data?.error || "Failed to generate referral code");
    }
  };

  const toggleTag = (tag: string) => {
    const current = formValues.tags || [];
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    setValue("tags", updated);
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading office profile...
      </div>
    );

  if (!office) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaLandmark className="text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Register Legislative Office
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Are you an elected representative? Apply for a verified office blog to
          communicate with your constituency.
        </p>
        <Link
          href="/research/lobbying/register"
          className="inline-block px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all"
        >
          Register Now
        </Link>
      </div>
    );
  }

  if (office.status === "PENDING") {
    return (
      <div className="bg-yellow-50 rounded-3xl p-8 border border-yellow-100 text-center">
        <h3 className="text-xl font-bold text-yellow-800 mb-2">
          Application Pending
        </h3>
        <p className="text-yellow-700">
          Your office registration is currently under review by our
          administrators.
        </p>
        <div className="mt-4 text-sm font-medium text-yellow-800">
          Ref: {office.id} | Constituency: {office.constituency}
        </div>
      </div>
    );
  }

  if (office.status === "REJECTED") {
    return (
      <div className="bg-red-50 rounded-3xl p-8 border border-red-100 text-center">
        <h3 className="text-xl font-bold text-red-800 mb-2">
          Application Rejected
        </h3>
        <p className="text-red-700">
          Your registration was not approved. Please contact support for
          details.
        </p>
      </div>
    );
  }

  if (office.status === "BLACKLISTED") {
    return (
      <div className="bg-red-50 rounded-3xl p-8 border border-red-100 text-center">
        <h3 className="text-xl font-bold text-red-800 mb-2">
          Account Suspended
        </h3>
        <p className="text-red-700">
          Your office account has been suspended by the administrator due to
          detailed reports or policy violations. You cannot create new posts or
          edit your profile at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaLandmark data-ui-icon  className="" /> {office.constituency}{" "}
            Office
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
            <span>
              <span className="font-bold text-gray-700">
                {office.representativeName}
              </span>{" "}
              (Official Blog)
            </span>
            <span className="hidden md:inline">•</span>
            <span>{office.district}</span>
            {office.legislativeBody && (
              <>
                <span className="hidden md:inline">•</span>
                <span>{office.legislativeBody}</span>
              </>
            )}
            <span className="hidden md:inline">•</span>
            <span>Artisan Pop: {office.artisanPopulation || "N/A"}</span>
          </div>
          <a
            href={`/legislative-office/${office.username}`}
            target="_blank"
            className="text-sm text-brand-primary hover:underline mt-2 inline-block"
          >
            View Public Page ↗
          </a>
          <div className="mt-4 p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10 inline-flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Referral Code:
            </span>
            <span className="text-lg font-mono font-bold text-brand-primary">
              {office.referralCode || "N/A"}
            </span>
            {office.referralCode ? (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(office.referralCode || "");
                  alert("Referral code copied!");
                }}
                className="p-1.5 hover:bg-brand-primary/10 rounded-lg text-brand-primary transition-all"
                title="Copy Code"
              >
                <FaFileAlt className="text-sm" />
              </button>
            ) : (
              <button
                onClick={handleGenerateReferralCode}
                className="px-3 py-1 bg-brand-primary text-white text-[10px] font-bold uppercase rounded-lg hover:bg-brand-dark transition-all"
              >
                Generate
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (office) {
                openEditProfileModal(office);
              }
            }}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <FaPen /> Edit Profile
          </button>
          <button
            onClick={openCreateModal}
            className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all flex items-center gap-2"
          >
            <FaPlus /> New Post
          </button>
        </div>
      </div>

      {/* Office Image Update Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-brand-primary/20 shrink-0">
            {office.officeImageUrl ? (
              <img
                src={office.officeImageUrl}
                alt="Office"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <FaLandmark className="text-3xl" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Office Public Display Picture
            </h3>
            <p className="text-sm text-gray-500">
              This image will appear on the Lobbying Public Page.
            </p>
          </div>
        </div>
        <div>
          <FileChoosing
            label={office.officeImageUrl ? "Change Photo" : "Upload Photo"}
            subLabel=""
            accept=".jpg,.png,.jpeg"
            onChange={async (file) => {
              if (file) {
                try {
                  if (confirm("Upload and update office picture?")) {
                    const url = await uploadFile(file);
                    await api.put("/legislative/my-office", {
                      officeImageUrl: url,
                    });
                    fetchOffice();
                    alert("Office picture updated!");
                  }
                } catch (e) {
                  console.error(e);
                  alert("Update failed");
                }
              }
            }}
          />
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] shadow-xl animate-fadeIn flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Edit Profile Details
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-6 overflow-x-auto scrollbar-hide whitespace-nowrap">
              {["identity", "craft", "engagement", "overview", "settings"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeTab === tab
                        ? "border-brand-primary text-brand-primary"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab === "identity" && "Office Identity"}
                    {tab === "craft" && "Craft Profile"}
                    {tab === "engagement" && "Engagement"}
                    {tab === "overview" && "Overview Setup"}
                    {tab === "settings" && "Settings"}
                  </button>
                ),
              )}
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
              <form
                id="profileForm"
                onSubmit={handleProfileSubmit(onSubmitProfile)}
                className="space-y-6"
              >
                {/* --- TAB 1: IDENTITY --- */}
                {activeTab === "identity" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Legislator’s Full Name"
                        {...registerProfile("representativeName")}
                      />
                      <Select
                        label="Designation"
                        {...registerProfile("designation")}
                        options={[
                          { value: "", label: "Select One..." },
                          { value: "MLA", label: "MLA" },
                          { value: "MP", label: "MP" },
                          { value: "MLC", label: "MLC" },
                          { value: "Minister", label: "Minister" },
                          { value: "Other", label: "Other" },
                        ]}
                      />
                      <Input
                        label="Constituency"
                        {...registerProfile("constituency")}
                      />
                      <Input
                        label="District"
                        {...registerProfile("district")}
                      />
                      <Input
                        label="Constituency Referral Code"
                        {...registerProfile("referralCode")}
                        placeholder="e.g. REP-CON-RAND"
                      />
                      <div className="md:col-span-2">
                        <Select
                          label="Legislative Body"
                          {...registerProfile("legislativeBody")}
                          options={[
                            { value: "", label: "Select..." },
                            {
                              value: "Legislative Assembly",
                              label: "Legislative Assembly",
                            },
                            {
                              value: "Parliament (Lok Sabha)",
                              label: "Parliament (Lok Sabha)",
                            },
                            {
                              value: "Parliament (Rajya Sabha)",
                              label: "Parliament (Rajya Sabha)",
                            },
                            {
                              value: "Legislative Council",
                              label: "Legislative Council",
                            },
                          ]}
                        />
                      </div>
                      <Input
                        label="Party Affiliation"
                        {...registerProfile("party")}
                      />
                      <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        <Input
                          label="Current Term Start"
                          type="date"
                          {...registerProfile("termStart")}
                        />
                        <Input
                          label="Current Term End"
                          type="date"
                          {...registerProfile("termEnd")}
                        />
                      </div>
                      <Input
                        label="Official Email"
                        {...registerProfile("officialEmail")}
                      />
                      <Input
                        label="Contact Number"
                        {...registerProfile("contactNumber")}
                      />
                      <div className="md:col-span-2">
                        <Input
                          label="Office Address"
                          {...registerProfile("officeAddress")}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Input
                          label="Official Website"
                          {...registerProfile("officialWebsite")}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB 2: CRAFT PROFILE --- */}
                {activeTab === "craft" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <label className="block text-sm font-bold text-gray-900 mb-4">
                        Artisan Presence in Constituency
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="Yes"
                            {...registerProfile("artisanPresence")}
                            className="w-5 h-5 text-brand-primary"
                          />
                          <span className="text-gray-700 font-medium">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="No"
                            {...registerProfile("artisanPresence")}
                            className="w-5 h-5 text-brand-primary"
                          />
                          <span className="text-gray-700 font-medium">No</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Input
                          label="Artisan Population"
                          {...registerProfile("artisanPopulation")}
                          placeholder="e.g. 1500 or Select Range..."
                          list="profile-population-options"
                        />
                        <datalist id="profile-population-options">
                          <option value="0–500" />
                          <option value="500–2,000" />
                          <option value="2,000–10,000" />
                          <option value="10,000+" />
                        </datalist>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Primary Crafts Represented
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Pashmina",
                            "Carpet",
                            "Kani",
                            "Sozni Embroidery",
                            "Papier-mâché",
                            "Walnut Wood",
                            "Copperware",
                            "Willow / Wicker",
                            "Wool / Tweed",
                          ].map((craft) => (
                            <button
                              key={craft}
                              type="button"
                              onClick={() =>
                                toggleArrayItem("craftSectors", craft)
                              }
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                (watchProfile("craftSectors") || []).includes(
                                  craft,
                                )
                                  ? "bg-brand-primary text-white border-brand-primary"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              {craft}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Input
                      label="Known Craft Clusters (Areas)"
                      {...registerProfile("craftClusters")}
                      placeholder="e.g. Zadibal, Eidgah"
                    />

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Artisan Organization Types
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          "Cooperatives",
                          "Self-Help Groups",
                          "NGOs",
                          "Informal artisan groups",
                          "Individual home-based",
                        ].map((item) => (
                          <label
                            key={item}
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={(
                                watchProfile("orgTypes") || []
                              ).includes(item)}
                              onChange={() => toggleArrayItem("orgTypes", item)}
                              className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary"
                            />
                            <span className="text-sm text-gray-600 font-medium">
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB 3: ENGAGEMENT --- */}
                {activeTab === "engagement" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Craft-Related Issues Observed
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          "Raw material access and pricing",
                          "Counterfeit and imitation goods",
                          "Access to welfare schemes",
                          "Credit and financial inclusion",
                          "Export or market barriers",
                          "Infrastructure limitations",
                          "Skill continuity concerns",
                          "Disaster or crisis impact",
                        ].map((item) => (
                          <label
                            key={item}
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={(
                                watchProfile("craftIssues") || []
                              ).includes(item)}
                              onChange={() =>
                                toggleArrayItem("craftIssues", item)
                              }
                              className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary"
                            />
                            <span className="text-sm text-gray-600 font-medium">
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Textarea
                      label="Summary of Recent Engagement"
                      {...registerProfile("engagementSummary")}
                      placeholder="Description of actions taken..."
                      className="h-32"
                    />

                    <Textarea
                      label="Priority Areas (Next 6-12 Months)"
                      {...registerProfile("priorityAreas")}
                      placeholder="Brief outline of focus areas..."
                      className="h-24"
                    />

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Support Requests from KHCRF
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          "Policy brief or background note",
                          "Constituency craft documentation",
                          "Stakeholder consultation support",
                          "Data or research inputs",
                          "Awareness or information dissemination",
                        ].map((item) => (
                          <label
                            key={item}
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={(
                                watchProfile("supportRequests") || []
                              ).includes(item)}
                              onChange={() =>
                                toggleArrayItem("supportRequests", item)
                              }
                              className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary"
                            />
                            <span className="text-sm text-gray-600 font-medium">
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB 4: SETTINGS (EXTRA) --- */}
                {activeTab === "settings" && (
                  <div className="space-y-6 animate-fadeIn">
                    <Input
                      label="Known Craft (Simple Text)"
                      placeholder="e.g. Pashmina, Carpet"
                      {...registerProfile("knownCraft")}
                    />
                    <Input
                      label="Social Media Handle"
                      placeholder="@username"
                      {...registerProfile("socialHandle")}
                    />
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <input
                        type="checkbox"
                        id="hcrfSupport"
                        {...registerProfile("hcrfSupport")}
                        className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                      />
                      <label
                        htmlFor="hcrfSupport"
                        className="text-sm font-bold text-gray-700 cursor-pointer select-none"
                      >
                        I publicly support KHCRF initiatives
                      </label>
                    </div>
                  </div>
                )}

                {/* --- TAB 5: OVERVIEW SETUP --- */}
                {activeTab === "overview" && (
                  <LegislativeOverviewSetup
                    register={registerProfile}
                    watch={watchProfile}
                    setValue={setProfileValue}
                  />
                )}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="px-6 py-2.5 font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileSubmit(onSubmitProfile)}
                className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal/Form */}
      {isCreating && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {editingPost ? "Edit Post" : "Create New Post"}
            </h3>
            <button
              onClick={() => setIsCreating(false)}
              className="text-gray-400 hover:text-red-500"
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmitPost)} className="space-y-6">
            {/* ... form fields ... */}
            {/* (kept fields as is, just ensuring context) */}
            <Input
              label="Title"
              placeholder="Update on..."
              {...register("title", { required: true })}
            />
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Content
              </label>
              <RichTextEditor
                value={watch("content")}
                onChange={(val) => setValue("content", val)}
                placeholder="Write your update here..."
              />
            </div>
            {/* ... rest of form ... */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Office Work Update",
                  "Notice",
                  "Meeting Summary",
                  "Completed Matter",
                  "Ongoing Matter",
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${formValues.tags.includes(tag) ? "bg-brand-primary text-white border-brand-primary" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isPinned")}
                  className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary"
                />
                Pin to Top
              </label>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Supporting Documents
              </label>
              <FileChoosing
                label="Upload PDF/Images"
                subLabel="Optional: Attach official notices or photos"
                accept=".pdf,.jpg,.png"
                onChange={async (file) => {
                  if (file) {
                    try {
                      const url = await uploadFile(file);
                      const currentDocs = formValues.documents || [];
                      setValue("documents", [...currentDocs, url]);
                    } catch (e) {
                      alert("Upload failed");
                    }
                  }
                }}
              />
              {formValues.documents && formValues.documents.length > 0 && (
                <div className="mt-2 space-y-1">
                  {formValues.documents.map((url: string, i: number) => (
                    <div
                      key={i}
                      className="text-xs text-green-600 flex items-center justify-between bg-green-50 p-2 rounded"
                    >
                      <span className="truncate max-w-[200px]">
                        {url.split("/").pop()}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setValue(
                            "documents",
                            formValues.documents.filter(
                              (_: any, idx: number) => idx !== i,
                            ),
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3 bg-brand-primary text-white font-bold rounded-xl shadow hover:shadow-lg transition-all"
            >
              {isUploading
                ? "Uploading..."
                : editingPost
                  ? "Update Post"
                  : "Publish Post"}
            </button>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FaBullhorn /> Recent Posts
          </h3>
        </div>
        {office.posts && office.posts.length > 0 ? (
          office.posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {post.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag: any) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded uppercase font-bold tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div
                    className="text-gray-600 text-sm line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-gray-400 font-medium whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(post)}
                      className="text-brand-primary hover:bg-brand-primary/10 px-2 py-1 rounded text-xs font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-500 hover:bg-red-50 px-2 py-1 rounded text-xs font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400">
            No posts yet. Create your first update!
          </div>
        )}
      </div>
    </div>
  );
}
