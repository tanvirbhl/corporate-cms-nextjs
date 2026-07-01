"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { siteSettingsSchema, SiteSettingsFormValues } from "@/schemas/settings";
import { FiLoader, FiSave } from "react-icons/fi";

export default function SettingsAdminPage() {
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/settings");
        if (response.data.data) {
          const { siteName, email, phone, address, socialLinks } = response.data.data;
          setValue("siteName", siteName);
          setValue("email", email);
          setValue("phone", phone);
          setValue("address", address);
          setValue("socialLinks", socialLinks);
        }
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setValue]);

  const onSubmit = async (data: SiteSettingsFormValues) => {
    try {
      await axios.post("/api/settings", data);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><FiLoader className="animate-spin text-2xl text-brand-accent" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-6">Site Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Site Name</label>
            <input {...register("siteName")} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input {...register("email")} className="w-full border rounded p-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input {...register("phone")} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input {...register("address")} className="w-full border rounded p-2" />
          </div>
        </div>

        {/* Social Links */}
        <h3 className="text-lg font-semibold pt-4">Social Media</h3>
        <div className="space-y-2">
            <input {...register("socialLinks.facebook")} placeholder="Facebook URL" className="w-full border rounded p-2" />
            <input {...register("socialLinks.linkedin")} placeholder="LinkedIn URL" className="w-full border rounded p-2" />
            <input {...register("socialLinks.github")} placeholder="GitHub URL" className="w-full border rounded p-2" />
        </div>

        <button type="submit" disabled={isSubmitting} className="mt-4 flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded font-medium hover:bg-brand-accent transition-all">
          {isSubmitting ? <FiLoader className="animate-spin" /> : <FiSave />}
          Save Changes
        </button>
      </form>
    </div>
  );
}