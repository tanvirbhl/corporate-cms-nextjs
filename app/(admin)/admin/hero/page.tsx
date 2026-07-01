"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { heroSchema, HeroFormValues } from "@/schemas/hero";
import { FiLoader, FiSave, FiUpload } from "react-icons/fi";
import { CldUploadButton } from "next-cloudinary";

export default function HeroAdminPage() {
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
  });

  const imageUrl = watch("imageUrl");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/hero");
        if (response.data.data) {
          const { title, subtitle, buttonText, buttonHref, imageUrl, isVisible } = response.data.data;
          setValue("title", title);
          setValue("subtitle", subtitle);
          setValue("buttonText", buttonText);
          setValue("buttonHref", buttonHref);
          setValue("imageUrl", imageUrl);
          setValue("isVisible", isVisible);
        }
      } catch (error) {
        toast.error("Failed to load hero content");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setValue]);

  const onSubmit = async (data: HeroFormValues) => {
    try {
      await axios.post("/api/hero", data);
      toast.success("Hero section updated successfully!");
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><FiLoader className="animate-spin text-2xl text-brand-accent" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-6">Hero Banner Management</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input {...register("title")} className="w-full border rounded p-2" />
          {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <textarea {...register("subtitle")} className="w-full border rounded p-2" rows={3} />
          {errors.subtitle && <p className="text-red-500 text-xs">{errors.subtitle.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Button Text</label>
            <input {...register("buttonText")} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Button Link</label>
            <input {...register("buttonHref")} className="w-full border rounded p-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <div className="flex items-center gap-4">
            <input 
              {...register("imageUrl")} 
              readOnly 
              className="w-full border rounded p-2 bg-gray-50" 
              placeholder="Upload an image to get the URL" 
            />
            <CldUploadButton
              options={{ maxFiles: 1 }}
              onSuccess={(result: any) => {
                setValue("imageUrl", result.info.secure_url);
                toast.success("Image uploaded successfully!");
              }}
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition-colors"
            >
              <FiUpload /> Upload
            </CldUploadButton>
          </div>
          {imageUrl && (
            <div className="mt-2">
              <img src={imageUrl} alt="Preview" className="h-20 w-auto rounded border" />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded font-medium hover:bg-brand-accent transition-all"
        >
          {isSubmitting ? <FiLoader className="animate-spin" /> : <FiSave />}
          Save Changes
        </button>
      </form>
    </div>
  );
}