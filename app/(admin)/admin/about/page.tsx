"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { aboutSchema, AboutFormValues } from "@/schemas/about";
import { FiLoader, FiSave, FiUpload } from "react-icons/fi";
import { CldUploadButton } from "next-cloudinary";

export default function AboutAdminPage() {
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
  });

  const imageUrl = watch("imageUrl");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/about");
        if (response.data.data) {
          const { title, content, imageUrl } = response.data.data;
          setValue("title", title);
          setValue("content", content);
          setValue("imageUrl", imageUrl);
        }
      } catch (error) {
        toast.error("Failed to load about section");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setValue]);

  const onSubmit = async (data: AboutFormValues) => {
    try {
      await axios.post("/api/about", data);
      toast.success("About section updated successfully!");
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><FiLoader className="animate-spin text-2xl" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-6">About Us Management</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input {...register("title")} className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea {...register("content")} className="w-full border rounded p-2" rows={6} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <div className="flex items-center gap-4">
            <input {...register("imageUrl")} readOnly className="w-full border rounded p-2 bg-gray-50" />
            <CldUploadButton
              options={{ maxFiles: 1 }}
              onSuccess={(result: any) => setValue("imageUrl", result.info.secure_url)}
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              <FiUpload /> Upload
            </CldUploadButton>
          </div>
          {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 h-20 rounded border" />}
        </div>

        <button type="submit" disabled={isSubmitting} className="bg-brand-primary text-white px-6 py-2 rounded font-medium">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}