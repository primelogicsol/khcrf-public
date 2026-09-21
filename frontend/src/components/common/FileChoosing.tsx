"use client";

import { useState, useRef, ChangeEvent } from "react";
import {
  FaCloudUploadAlt,
  FaFile,
  FaCheckCircle,
  FaTrashAlt,
  FaExclamationCircle,
} from "react-icons/fa";

interface FileChoosingProps {
  label: string;
  subLabel?: string;
  accept?: string;
  onChange?: (file: File | null) => void;
  error?: string;
  required?: boolean;
}

export default function FileChoosing({
  label,
  subLabel = "Drag & drop or click to browse",
  accept = "*",
  onChange,
  error,
  required = false,
  previewUrl,
}: FileChoosingProps & { previewUrl?: string | null }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine effective preview to show
  const effectiveUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : previewUrl;
  const isPdf =
    selectedFile?.type === "application/pdf" ||
    (typeof effectiveUrl === "string" &&
      effectiveUrl?.toLowerCase().endsWith(".pdf")) ||
    (typeof effectiveUrl === "string" && effectiveUrl?.includes(".pdf"));

  const handleFileSelect = (file: File) => {
    if (accept && accept !== "*") {
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      const allowedExtensions = accept
        .split(",")
        .map((ext) => ext.trim().toLowerCase());
      const isImageAllowed = allowedExtensions.includes("image/*");
      const isImageFile = file.type.startsWith("image/");

      if (
        !allowedExtensions.includes(fileExtension) &&
        !(isImageAllowed && isImageFile)
      ) {
        alert(`Invalid file type. Please upload ${accept} files.`);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    }

    setSelectedFile(file);
    if (onChange) {
      onChange(file);
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (onChange) {
      onChange(null);
    }
  };

  const triggerClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative overflow-hidden group rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer 
                ${
                  error
                    ? "border-red-300 bg-red-50"
                    : isDragging
                      ? "border-brand-secondary bg-brand-secondary/5 scale-[1.01] shadow-lg"
                      : effectiveUrl
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300 hover:border-brand-primary/50 hover:bg-gray-50 hover:shadow-md"
                }
                `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerClick}
      >
        {/* Background Animation Element */}
        <div
          className={`absolute inset-0 bg-brand-secondary/5 transform transition-transform duration-500 origin-bottom ${isDragging ? "scale-y-100" : "scale-y-0"}`}
        ></div>

        <div className="relative z-10 p-4 flex flex-col items-center justify-center text-center min-h-[160px]">
          <input
            type="file"
            ref={inputRef}
            onChange={onInputChange}
            accept={accept}
            className="hidden"
          />

          {effectiveUrl ? (
            <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
              {isPdf ? (
                <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-3 relative group-hover:shadow-sm">
                  <iframe
                    src={`https://docs.google.com/gview?url=${effectiveUrl}&embedded=true`}
                    className="w-full h-full pointer-events-none"
                    title="PDF Preview"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
              ) : (
                <div className="w-32 h-32 mb-3 relative">
                  <img
                    src={effectiveUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl shadow-md border-2 border-white"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span className="text-sm font-semibold text-gray-700 truncate max-w-[200px]">
                  {selectedFile ? selectedFile.name : "Uploaded File"}
                </span>
              </div>

              <button
                onClick={removeFile}
                className="mt-3 px-4 py-1.5 bg-white border border-gray-200 shadow-sm rounded-full text-xs font-bold text-red-500 flex items-center gap-2 hover:bg-red-50 hover:border-red-200 transition-colors z-20"
              >
                <FaTrashAlt /> Replace / Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center transition-opacity duration-300">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${isDragging ? "bg-brand-secondary text-white" : "bg-brand-primary/10 text-icon-on-light group-hover:bg-brand-primary group-hover:text-white"}`}
              >
                <FaCloudUploadAlt className="text-2xl" />
              </div>
              <h4 className="font-bold text-gray-700 mb-1 group-hover:text-brand-dark transition-colors">
                {label} {required && <span className="text-red-500">*</span>}
              </h4>
              <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">
                {subLabel}
              </p>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-500 text-xs font-medium px-2 animate-in slide-in-from-top-1">
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
