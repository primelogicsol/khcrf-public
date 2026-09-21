"use client";

import Modal from "./Modal";
import { FaExclamationTriangle } from "react-icons/fa";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isWarning?: boolean; // If true, shows warning icon and red confirm button
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isWarning = false,
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        {isWarning && (
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-3xl">
              <FaExclamationTriangle />
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 ${
              isWarning
                ? "bg-red-500 hover:bg-red-600 shadow-red-500/25"
                : "bg-brand-primary hover:bg-brand-primary/90 shadow-brand-primary/25"
            }`}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
