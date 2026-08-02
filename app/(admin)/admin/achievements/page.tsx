"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiTrash2, FiUpload, FiLoader } from "react-icons/fi";

export default function AchievementsAdminPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/achievements");
      if (res.data.success) setAchievements(res.data.data);
    } catch (error) {
      toast.error("Failed to load achievements");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAchievements(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, 
        formData
      );
      
      await axios.post("/api/achievements", { 
        imageUrl: res.data.secure_url, 
        title: "New Achievement", 
        subtitle: "Milestone",
        sortOrder: achievements.length 
      });
      
      toast.success("Achievement added!");
      fetchAchievements();
    } catch (e) { 
      toast.error("Upload failed"); 
    } finally { 
      setIsUploading(false); 
    }
  };

  const updateAchievement = async (id: string, field: string, value: any) => {
    try {
      await axios.put(`/api/achievements/${id}`, { [field]: value });
      fetchAchievements();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const deleteAchievement = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await axios.delete(`/api/achievements/${id}`);
      toast.success("Deleted successfully");
      fetchAchievements();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Achievements Gallery</h2>
        <label className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer hover:bg-slate-800 transition-colors">
          {isUploading ? <FiLoader className="animate-spin" /> : <FiUpload />}
          <span>Upload Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
        </label>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Subtitle</th>
              <th className="p-4">Order</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center"><FiLoader className="animate-spin mx-auto h-6 w-6 text-blue-500" /></td></tr>
            ) : achievements.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">No achievements added yet.</td></tr>
            ) : (
              achievements.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-4">
                    <img src={item.imageUrl} alt={item.title} className="w-20 h-12 object-cover rounded shadow-sm" />
                  </td>
                  <td className="p-4">
                    <input className="border rounded px-2 py-1 w-full" value={item.title} onChange={(e) => updateAchievement(item._id, 'title', e.target.value)} />
                  </td>
                  <td className="p-4">
                    <input className="border rounded px-2 py-1 w-full" value={item.subtitle} onChange={(e) => updateAchievement(item._id, 'subtitle', e.target.value)} />
                  </td>
                  <td className="p-4">
                    <input type="number" className="border rounded w-16 px-2 py-1" value={item.sortOrder} onChange={(e) => updateAchievement(item._id, 'sortOrder', parseInt(e.target.value))} />
                  </td>
                  <td className="p-4 text-red-500 cursor-pointer text-lg">
                    <FiTrash2 className="hover:text-red-700" onClick={() => deleteAchievement(item._id)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}