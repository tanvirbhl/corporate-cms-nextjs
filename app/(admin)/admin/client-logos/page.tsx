"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiTrash2, FiUpload, FiLoader } from "react-icons/fi";

export default function ClientLogosAdminPage() {
  const [logos, setLogos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchLogos = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/client-logos");
      if (res.data.success) setLogos(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch logos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    );

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
      );
      await axios.post("/api/client-logos", {
        imageUrl: res.data.secure_url,
        name: "New Client",
        sortOrder: logos.length,
      });
      toast.success("Logo added successfully!");
      fetchLogos();
    } catch (e) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const updateLogo = async (id: string, field: string, value: any) => {
    try {
      await axios.put(`/api/client-logos/${id}`, { [field]: value });
      fetchLogos();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const deleteLogo = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/client-logos/${id}`);
      toast.success("Logo deleted");
      fetchLogos();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Client Logos</h2>
        <label className="bg-brand-accent text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer hover:bg-blue-600 transition-colors">
          {isUploading ? <FiLoader className="animate-spin" /> : <FiUpload />}
          <span>Upload Logo</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Logo Image</th>
              <th className="p-4">Client Name</th>
              <th className="p-4">Order</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center">
                  <FiLoader className="animate-spin mx-auto h-6 w-6 text-brand-accent" />
                </td>
              </tr>
            ) : logos.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No logos added yet.
                </td>
              </tr>
            ) : (
              logos.map((logo) => (
                <tr key={logo._id} className="border-b">
                  <td className="p-4">
                    <div className="w-24 h-12 bg-gray-50 border rounded flex items-center justify-center p-2">
                      <img
                        src={logo.imageUrl}
                        alt={logo.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <input
                      className="border rounded px-3 py-2 w-full focus:ring-1 focus:ring-brand-accent outline-none"
                      value={logo.name}
                      onChange={(e) =>
                        updateLogo(logo._id, "name", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      className="border rounded w-20 px-3 py-2 focus:ring-1 focus:ring-brand-accent outline-none"
                      value={logo.sortOrder}
                      onChange={(e) =>
                        updateLogo(
                          logo._id,
                          "sortOrder",
                          parseInt(e.target.value),
                        )
                      }
                    />
                  </td>
                  <td className="p-4 text-red-500 cursor-pointer text-lg">
                    <FiTrash2
                      className="hover:text-red-700"
                      onClick={() => deleteLogo(logo._id)}
                    />
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
