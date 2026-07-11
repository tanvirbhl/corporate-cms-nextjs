"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiPlus, FiSave, FiTrash2, FiUpload, FiLoader, FiX } from "react-icons/fi";

export default function SliderAdminPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchSlides = async () => {
    setIsLoading(true);
    const res = await axios.get("/api/slider");
    setSlides(res.data.data);
    setIsLoading(false);
  };

  useEffect(() => { fetchSlides(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
      await axios.post("/api/slider", { 
        imageUrl: res.data.secure_url, 
        title: "New Slide", 
        description: "Add details here...",
        sortOrder: slides.length 
      });
      toast.success("Slide added!");
      fetchSlides();
    } catch (e) { toast.error("Upload failed"); } 
    finally { setIsUploading(false); }
  };

  const updateSlide = async (id: string, field: string, value: any) => {
    await axios.put(`/api/slider/${id}`, { [field]: value });
    fetchSlides();
  };

return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Home Slider</h2>
        {/* ... Upload Button ... */}
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Description</th> {/* ADDED */}
              <th className="p-4">Order</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((slide) => (
              <tr key={slide._id} className="border-b">
                <td className="p-4"><img src={slide.imageUrl} className="w-20 h-12 object-cover rounded" /></td>
                <td className="p-4">
                  <input 
                    className="border rounded px-2 py-1 w-full" 
                    value={slide.title} 
                    onChange={(e) => updateSlide(slide._id, 'title', e.target.value)} 
                  />
                </td>
                {/* ADDED DESCRIPTION INPUT */}
                <td className="p-4">
                  <textarea 
                    className="border rounded px-2 py-1 w-full" 
                    value={slide.description || ''} 
                    onChange={(e) => updateSlide(slide._id, 'description', e.target.value)}
                    rows={2}
                  />
                </td>
                <td className="p-4">
                  <input type="number" className="border rounded w-16 px-2 py-1" value={slide.sortOrder} onChange={(e) => updateSlide(slide._id, 'sortOrder', parseInt(e.target.value))} />
                </td>
                <td className="p-4 text-red-500 cursor-pointer text-lg">
                  <FiTrash2 onClick={() => axios.delete(`/api/slider/${slide._id}`).then(fetchSlides)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}