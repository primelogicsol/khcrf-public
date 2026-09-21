import React, { useState } from "react";
import { uploadFile } from "@/lib/cloudinary";
import { FaCloudUploadAlt, FaImage, FaTrash } from "react-icons/fa";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-gray-900 mb-2">
        {label}
      </label>

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-video max-h-[200px] flex items-center justify-center">
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleRemove}
              type="button"
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              title="Remove Image"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div
            className={`
                        border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-colors
                        ${error ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-brand-primary hover:bg-brand-primary/5"}
                    `}
          >
            {uploading ? (
              <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
            ) : (
              <>
                <FaCloudUploadAlt className="text-3xl text-gray-400" />
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-700">
                    Click to upload
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG (max 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
