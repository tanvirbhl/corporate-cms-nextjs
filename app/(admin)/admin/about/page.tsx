"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiSave, FiUpload, FiLoader } from "react-icons/fi";

export default function AboutAdminPage() {
  const [formData, setFormData] = useState<any>({
    showHero: true, showMissionVision: true, showChairman: true, showDirector: true, showCeo: false,
    heroTitle: "", heroDescription: "", heroImage: "",
    mission: "", vision: "",
    chairmanName: "", chairmanMessage: "", chairmanImage: "",
    directorName: "", directorMessage: "", directorImage: "",
    ceoName: "", ceoMessage: "", ceoImage: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await axios.get("/api/about");
        if (res.data.success && res.data.data) {
          // Merge fetched data with defaults to ensure all fields exist
          setFormData((prev: any) => ({ ...prev, ...res.data.data }));
        }
      } catch (error) {
        toast.error("Failed to load About page data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = (field: string) => {
    setFormData({ ...formData, [field]: !formData[field] });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, 
        uploadData
      );
      setFormData({ ...formData, [field]: res.data.secure_url });
      toast.success("Image uploaded successfully!");
    } catch (error) { 
      toast.error("Image upload failed"); 
    } finally { 
      setUploadingField(null); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.post("/api/about", formData);
      toast.success("About page updated successfully!");
    } catch (error) {
      toast.error("Failed to update About page");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center"><FiLoader className="animate-spin h-8 w-8 mx-auto text-blue-500" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Manage About Page</h2>
        <button 
          onClick={handleSubmit} 
          disabled={isSaving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
          <span>Save Changes</span>
        </button>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        
        {/* HERO SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-semibold">Hero Section</h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-sm text-slate-600 font-medium">Show Section</span>
              <input type="checkbox" checked={formData.showHero} onChange={() => handleToggle('showHero')} className="w-5 h-5 text-blue-600 rounded" />
            </label>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
              <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full border rounded px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea name="heroDescription" value={formData.heroDescription} onChange={handleChange} rows={3} className="w-full border rounded px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero Image</label>
              <div className="flex items-center space-x-4">
                {formData.heroImage && <img src={formData.heroImage} alt="Hero" className="h-20 rounded" />}
                <label className="bg-slate-100 px-4 py-2 rounded border cursor-pointer hover:bg-slate-200 flex items-center">
                  {uploadingField === 'heroImage' ? <FiLoader className="animate-spin mr-2" /> : <FiUpload className="mr-2" />}
                  Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'heroImage')} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-semibold">Mission & Vision</h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-sm text-slate-600 font-medium">Show Section</span>
              <input type="checkbox" checked={formData.showMissionVision} onChange={() => handleToggle('showMissionVision')} className="w-5 h-5 text-blue-600 rounded" />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Our Mission</label>
              <textarea name="mission" value={formData.mission} onChange={handleChange} rows={5} className="w-full border rounded px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Our Vision</label>
              <textarea name="vision" value={formData.vision} onChange={handleChange} rows={5} className="w-full border rounded px-4 py-2" />
            </div>
          </div>
        </div>

        {/* CEO MESSAGE */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-semibold">CEO's Message</h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-sm text-slate-600 font-medium">Show Section</span>
              <input type="checkbox" checked={formData.showCeo} onChange={() => handleToggle('showCeo')} className="w-5 h-5 text-blue-600 rounded" />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name & Title</label>
                <input type="text" name="ceoName" value={formData.ceoName} onChange={handleChange} placeholder="e.g. John Doe, CEO" className="w-full border rounded px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CEO Image</label>
                <div className="flex items-center space-x-4">
                  {formData.ceoImage && <img src={formData.ceoImage} alt="CEO" className="h-20 rounded" />}
                  <label className="bg-slate-100 px-4 py-2 rounded border cursor-pointer hover:bg-slate-200 flex items-center">
                    {uploadingField === 'ceoImage' ? <FiLoader className="animate-spin mr-2" /> : <FiUpload className="mr-2" />} Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'ceoImage')} />
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea name="ceoMessage" value={formData.ceoMessage} onChange={handleChange} rows={6} className="w-full border rounded px-4 py-2" />
            </div>
          </div>
        </div>

        {/* CHAIRMAN MESSAGE */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-semibold">Chairman's Message</h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-sm text-slate-600 font-medium">Show Section</span>
              <input type="checkbox" checked={formData.showChairman} onChange={() => handleToggle('showChairman')} className="w-5 h-5 text-blue-600 rounded" />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name & Title</label>
                <input type="text" name="chairmanName" value={formData.chairmanName} onChange={handleChange} placeholder="e.g. John Doe, Chairman" className="w-full border rounded px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chairman Image</label>
                <div className="flex items-center space-x-4">
                  {formData.chairmanImage && <img src={formData.chairmanImage} alt="Chairman" className="h-20 rounded" />}
                  <label className="bg-slate-100 px-4 py-2 rounded border cursor-pointer hover:bg-slate-200 flex items-center">
                    {uploadingField === 'chairmanImage' ? <FiLoader className="animate-spin mr-2" /> : <FiUpload className="mr-2" />} Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'chairmanImage')} />
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea name="chairmanMessage" value={formData.chairmanMessage} onChange={handleChange} rows={6} className="w-full border rounded px-4 py-2" />
            </div>
          </div>
        </div>

        {/* DIRECTOR MESSAGE */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-semibold">Director's Message</h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-sm text-slate-600 font-medium">Show Section</span>
              <input type="checkbox" checked={formData.showDirector} onChange={() => handleToggle('showDirector')} className="w-5 h-5 text-blue-600 rounded" />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name & Title</label>
                <input type="text" name="directorName" value={formData.directorName} onChange={handleChange} placeholder="e.g. Jane Smith, Managing Director" className="w-full border rounded px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Director Image</label>
                <div className="flex items-center space-x-4">
                  {formData.directorImage && <img src={formData.directorImage} alt="Director" className="h-20 rounded" />}
                  <label className="bg-slate-100 px-4 py-2 rounded border cursor-pointer hover:bg-slate-200 flex items-center">
                    {uploadingField === 'directorImage' ? <FiLoader className="animate-spin mr-2" /> : <FiUpload className="mr-2" />} Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'directorImage')} />
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea name="directorMessage" value={formData.directorMessage} onChange={handleChange} rows={6} className="w-full border rounded px-4 py-2" />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}