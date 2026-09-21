"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { cmsService } from "@/services/cmsService";
import { toast } from "react-hot-toast";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import { FaSave, FaUpload } from "react-icons/fa";
import { useRef } from "react";

interface ContactContent {
  address: string;
  phone: string;
  email: string;
  mapUrl?: string; // Google Maps Embed URL
}

export default function ContactEditor() {
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<ContactContent>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        
        if (parsed && typeof parsed === 'object') {
          if (parsed.address) setValue("address", parsed.address);
          if (parsed.phone) setValue("phone", parsed.phone);
          if (parsed.email) setValue("email", parsed.email);
          if (parsed.mapUrl) setValue("mapUrl", parsed.mapUrl);
          toast.success("JSON imported successfully! Don't forget to save.");
        } else {
          toast.error("Invalid file format. Please upload a JSON object.");
        }
      } catch (error) {
        toast.error("Failed to parse JSON file. Ensure it is valid JSON.");
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await cmsService.get("contact");
      if (data && data.content) {
        setValue("address", data.content.address || "");
        setValue("phone", data.content.phone || "");
        setValue("email", data.content.email || "");
        setValue("mapUrl", data.content.mapUrl || "");
      } else {
        setValue(
          "address",
          "KHCRF LANE 2\nGousia Colony Ext Zakoora\nSrinagar 19006 India",
        );
        setValue("phone", "889922824\nMon-Sat, 9am - 5pm");
        setValue(
          "email",
          "info@khcrf.org\npartnerships@khcrf.org",
        );
        setValue("mapUrl", "https://maps.google.com/maps?q=Hamadan+craft+Revival+Foundation,+KHCRF+LANE+2+Gousia+Colony+Ext+Zakoora+Srinagar+19006+India&t=m&z=15&output=embed");
      }
    } catch (error) {
      console.error("Failed to load content", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ContactContent) => {
    try {
      await cmsService.update("contact", {
        title: "Contact Page",
        content: data,
      });
      toast.success("Content updated successfully");
    } catch (error) {
      console.error("Failed to update content", error);
      toast.error("Failed to update content");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Contact Page Content</h1>
        <div>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border-2 border-brand-primary text-brand-primary px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-primary/5 transition-all shadow-sm"
            title="Upload JSON file to replace contact info"
          >
            <FaUpload /> Upload JSON
          </button>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <Textarea
          label="Address (lines separated by newlines)"
          {...register("address")}
          rows={5}
        />

        <Textarea
          label="Phone Section (lines separated by newlines)"
          {...register("phone")}
          rows={4}
        />

        <Textarea
          label="Email Section (lines separated by newlines)"
          {...register("email")}
          rows={4}
        />

        <div className="w-full">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Google Map Embed URL (src)
          </label>
          <input
            type="text"
            {...register("mapUrl")}
            placeholder="https://www.google.com/maps/embed?..."
            className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all placeholder:text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Paste the 'src' attribute from the Google Maps Embed code here.
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isSubmitting}
            icon={<FaSave />}
            className="w-full sm:w-auto"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
