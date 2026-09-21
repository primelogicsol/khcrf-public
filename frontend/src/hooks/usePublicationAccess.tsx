import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

type ModalType = 
  | "NOT_AUTHENTICATED"
  | "NO_APPLICATION"
  | "UNDER_REVIEW"
  | "ADDITIONAL_INFORMATION_REQUIRED"
  | "DECLINED"
  | "INACTIVE";

export function usePublicationAccess(initialAccessState: any = null) {
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [accessState, setAccessState] = useState<{
    hasAccess: boolean;
    state: string;
    submittedAt: string | null;
  } | null>(initialAccessState);

  const checkAccess = async (slug: string, readerPath?: string | null) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/backend/publications/access/${slug}`);
      if (!res.ok) throw new Error("Failed to check access");
      const data = await res.json();
      setAccessState(data);

      if (data.hasAccess && data.state === "APPROVED") {
        window.location.href = readerPath || `/publications/read/${slug}`;
        return true;
      } else {
        switch (data.state) {
          case "NOT_AUTHENTICATED":
            setActiveModal("NOT_AUTHENTICATED");
            break;
          case "NO_APPLICATION":
            setActiveModal("NO_APPLICATION");
            break;
          case "UNDER_REVIEW":
          case "SUBMITTED":
            setActiveModal("UNDER_REVIEW");
            break;
          case "ADDITIONAL_INFORMATION_REQUIRED":
            setActiveModal("ADDITIONAL_INFORMATION_REQUIRED");
            break;
          case "DECLINED":
            setActiveModal("DECLINED");
            break;
          case "EXPIRED":
          case "SUSPENDED":
          case "REVOKED":
          case "INACTIVE":
            setActiveModal("INACTIVE");
            break;
          default:
            setActiveModal("NO_APPLICATION");
        }
        return false;
      }
    } catch (err) {
      console.error("Access verification error:", err);
      setActiveModal("NOT_AUTHENTICATED");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (route: string) => {
    setActiveModal(null);
    if (route) {
      window.location.href = route;
    }
  };

  const modalConfig: Record<ModalType, { title: string; message: string; actions: { label: string; route?: string; primary?: boolean }[] }> = {
    NOT_AUTHENTICATED: {
      title: "Approved Membership Required",
      message: "Full access to KHCRF Press publications is available exclusively to approved KHCRF members. Please sign in to check your membership status or apply for membership to request access.",
      actions: [
        { label: "Sign In", route: "/login", primary: true },
        { label: "Apply for Membership", route: "/about/memberships" },
        { label: "Cancel" }
      ]
    },
    NO_APPLICATION: {
      title: "Membership Required to Read This Publication",
      message: "This publication is maintained as an institutional knowledge resource and is available only to approved KHCRF members. Registration alone does not provide publication access. Please submit a membership application for review.",
      actions: [
        { label: "Apply for Membership", route: "/about/memberships", primary: true },
        { label: "Not Now" }
      ]
    },
    UNDER_REVIEW: {
      title: "Membership Application Under Review",
      message: "Your membership application has been received and is currently under review. Publication access will become available after your membership is approved by an KHCRF administrator. You do not need to submit another application.",
      actions: [
        { label: "Close", primary: true }
      ]
    },
    ADDITIONAL_INFORMATION_REQUIRED: {
      title: "Additional Information Required",
      message: "Your membership application requires additional information before it can be reviewed further. Please open your membership application and provide the requested details.",
      actions: [
        { label: "Update Application", route: "/about/memberships", primary: true },
        { label: "Close" }
      ]
    },
    DECLINED: {
      title: "Membership Access Not Approved",
      message: "Your membership application was not approved for publication access. Please review the decision information associated with your application. Where permitted, you may update or resubmit the application.",
      actions: [
        { label: "View Application", route: "/about/memberships", primary: true },
        { label: "Close" }
      ]
    },
    INACTIVE: {
      title: "Membership Access Is Not Active",
      message: "Your KHCRF membership is not currently active. Please review your membership status or contact KHCRF before attempting to access this publication.",
      actions: [
        { label: "View Membership", route: "/about/memberships", primary: true },
        { label: "Contact KHCRF", route: "/state-of-kashmir-crafts/contact-secretariat" },
        { label: "Close" }
      ]
    }
  };

  const AccessModal = () => {
    if (!activeModal) return null;
    const config = modalConfig[activeModal];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
        <div className="bg-white rounded-3xl max-w-md w-full border border-stone-100 shadow-2xl p-6 space-y-6 transform scale-100 transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stone-800">
              <FaInfoCircle className="text-teal-600 text-xl shrink-0" />
              <h3 className="text-lg font-bold">
                {config.title}
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed pt-2">
              {config.message}
            </p>
            {activeModal === "UNDER_REVIEW" && accessState?.submittedAt && (
              <div className="mt-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 space-y-1">
                <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">
                  Application Status
                </p>
                <p className="text-xs font-semibold text-stone-700">
                  Under Review
                </p>
                <p className="text-[10px] text-stone-400">
                  Submitted On: {new Date(accessState.submittedAt).toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {config.actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleAction(action.route || "")}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  action.primary
                    ? "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-md active:scale-[0.98]"
                    : "bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return {
    loading,
    accessState,
    setAccessState,
    activeModal,
    checkAccess,
    AccessModal,
    setActiveModal
  };
}
