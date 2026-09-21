"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ScrollReveal from "@/components/ScrollReveal";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";
import { TbDeviceLandlinePhone } from "react-icons/tb";
import Input from "@/components/common/Input";
import SubmissionSuccess from "@/components/common/SubmissionSuccess";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { aboutContactHeroFallback } from "@/config/heroFallbacks";
import { cmsService } from "@/services/cmsService";
import { contactApi } from "@/lib/api";
import ContactInfoItem from "@/components/common/ContactInfoItem";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  artisanId: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    address: "KHCRF 2 Darul Zamrood - Gousia Colony Ext,\nZakura - Srinagar,\nJammu & Kashmir India 190006",
    phone: "+91 9419070707\n+91 8899228242\n+91 9149492367\n+91 9596320380",
    email: "info@khcrf.org\npartnerships@khcrf.org",
    mapUrl: "https://maps.google.com/maps?q=5R9F%2BJ4+Srinagar+(Hamadan+Craft+Revival+Foundation+Kashmir)&t=m&z=17&output=embed", // Integrated map
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await cmsService.get("contact");
        if (data && data.content) {
          setContactInfo({
            address:
              data.content.address ||
              "KHCRF 2 Darul Zamrood - Gousia Colony Ext,\nZakura - Srinagar,\nJammu & Kashmir India 190006",
            phone:
              data.content.phone ||
              "+91 9419070707\n+91 8899228242\n+91 9149492367\n+91 9596320380",
            email:
              data.content.email ||
              "info@khcrf.org\npartnerships@khcrf.org",
            mapUrl: data.content.mapUrl || "https://maps.google.com/maps?q=5R9F%2BJ4+Srinagar+(Hamadan+Craft+Revival+Foundation+Kashmir)&t=m&z=17&output=embed",
          });
        }
      } catch (error) {
        console.error("Failed to fetch contact info", error);
      }
    };
    fetchContent();
  }, []);

  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("subject") || "";
  const artisanId = searchParams.get("artisan");
  const artisanName = searchParams.get("name");
  const artisanCraft = searchParams.get("craft");
  const artisanLocation = searchParams.get("location");
  const returnTo = searchParams.get("returnTo");

  const [submissionData, setSubmissionData] = useState<ContactFormData | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: initialSubject,
      artisanId: artisanId || undefined,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await contactApi.submit(data);
      console.log("Form submitted:", data);
      setSubmissionData(data);
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      // Optional: Add toast notification for error
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <UniversalEditorialHero pageKey="contact" fallbackConfig={aboutContactHeroFallback as any} />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <ScrollReveal className="lg:col-span-1 space-y-8">
              <div>
                <h3 className="text-2xl font-black text-brand-dark mb-8">
                  Head Office
                </h3>
                <div className="space-y-6">
                  <ContactInfoItem
                    icon={FaMapMarkerAlt}
                    title="Visit Us"
                    content={contactInfo.address}
                  />
                  <ContactInfoItem
                    icon={FaPhoneAlt}
                    title="Call Us"
                    content={contactInfo.phone}
                  />
                  <ContactInfoItem
                    icon={TbDeviceLandlinePhone}
                    title=""
                    content="+91 1943131113"
                  />
                  <ContactInfoItem
                    icon={FaEnvelope}
                    title="Email Us"
                    content={contactInfo.email}
                  />
                </div>
              </div>

              {/* Map/Map Placeholder */}
              <div className="h-64 rounded-3xl bg-gray-100 overflow-hidden relative shadow-lg">
                {contactInfo.mapUrl ? (
                  <iframe
                    src={(function (url) {
                      if (!url) return "";
                      if (url.includes("<iframe")) {
                        const match = url.match(/src="([^"]+)"/);
                        if (match) return match[1];
                      }
                      if (url.includes("output=embed") || url.includes("google.com/maps/embed")) return url;
                      if (url.includes("google.com/maps")) {
                        return `${url}${url.includes("?") ? "&" : "?"}output=embed`;
                      }
                      return url;
                    })(contactInfo.mapUrl)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    title="Location Map"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-xs p-4 text-center">
                    Google Map Integration (Configure URL in Dashboard)
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal delay={200} className="lg:col-span-2">
              {isSuccess ? (
                <div className="w-full">
                  <SubmissionSuccess
                    title="Message Sent Successfully!"
                    message="Thank you for reaching out to Hamadan Craft Revival Foundation - Kashmir. We have received your message and will get back to you shortly."
                    primaryAction={
                      returnTo ? {
                        label: "Return to Artisan Record",
                        href: returnTo
                      } : {
                        label: "Send Another Message",
                        onClick: () => setIsSuccess(false),
                      }
                    }
                    secondaryAction={
                      returnTo ? {
                        label: "Send Another Message",
                        onClick: () => setIsSuccess(false),
                      } : undefined
                    }
                    summary={
                      submissionData
                        ? [
                            {
                              label: "Name",
                              value: `${submissionData.firstName} ${submissionData.lastName}`,
                            },
                            {
                              label: "Email",
                              value: submissionData.email,
                            },
                            {
                              label: "Subject",
                              value: submissionData.subject,
                            },
                          ]
                        : []
                    }
                  />
                </div>
              ) : (
                <div className="bg-[#fafafa] p-10 md:p-14 rounded-[2.5rem]">
                  <h3 className="text-2xl font-black text-brand-dark mb-8">
                    Send a Message
                  </h3>
                  {initialSubject === 'artisan-contact' && artisanId && artisanName && (
                    <div className="mb-8 p-4 bg-white border border-[#D4AF37]/30 rounded-xl shadow-sm">
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Regarding Artisan</div>
                      <div className="text-lg font-bold text-[#3E2723]">{artisanName}</div>
                      <div className="text-sm font-mono text-gray-600 mt-1">Craftlore Artisan ID: {artisanId}</div>
                      {artisanCraft && <div className="text-sm text-gray-700 mt-1">Craft: {artisanCraft}</div>}
                      {artisanLocation && <div className="text-sm text-gray-700 mt-1">Location: {artisanLocation}</div>}
                    </div>
                  )}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Hidden input for Artisan ID */}
                    <input type="hidden" {...register("artisanId")} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="First Name"
                        placeholder="Enter your first name"
                        className="bg-white"
                        {...register("firstName")}
                        error={errors.firstName?.message}
                      />
                      <Input
                        label="Last Name"
                        placeholder="Enter your last name"
                        className="bg-white"
                        {...register("lastName")}
                        error={errors.lastName?.message}
                      />
                    </div>
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      className="bg-white"
                      {...register("email")}
                      error={errors.email?.message}
                    />
                    <div className="w-full">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Subject
                      </label>
                      <div className="relative">
                        <select
                          {...register("subject")}
                          className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select a subject</option>
                          <option value="General Inquiry">
                            General Inquiry
                          </option>
                          <option value="Partnership">Partnership</option>
                          <option value="Careers">Careers</option>
                          <option value="Press">Press</option>
                          <option value="Notify Me: upcoming publication">Notify Me: upcoming publication</option>
                          <option value="Grants Writing Assistance">Grants Writing Assistance</option>
                          <option value="artisan-contact">Artisan Contact / Collaboration</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                          ▼
                        </div>
                      </div>
                      {errors.subject && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        {...register("message")}
                        className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all resize-none h-40 placeholder:text-gray-500"
                        placeholder="How can we help you?"
                      ></textarea>
                      {errors.message && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-16 bg-brand-dark text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-brand-primary transition-all flex items-center justify-center space-x-2 shadow-xl disabled:opacity-70"
                    >
                      <span>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </span>
                      <FaPaperPlane />
                    </button>
                  </form>
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Contact() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ContactForm />
    </React.Suspense>
  );
}
