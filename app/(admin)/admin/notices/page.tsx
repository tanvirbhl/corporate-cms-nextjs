"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiTrash2, FiUpload, FiLoader, FiFileText } from "react-icons/fi";

export default function NoticesAdminPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/notices");
      if (res.data.success) setNotices(res.data.data);
    } catch (error) {
      toast.error("Failed to load notices");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!title || !description) {
      toast.error("Please enter a title and description first");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    
    try {
      // Using /auto/upload allows both images and raw documents (PDF, DOCX)
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, 
        formData
      );
      
      await axios.post("/api/notices", { 
        title,
        description,
        fileUrl: res.data.secure_url, 
        fileName: file.name
      });
      
      toast.success("Notice published!");
      setTitle("");
      setDescription("");
      fetchNotices();
    } catch (e) { 
      toast.error("Upload failed"); 
    } finally { 
      setIsUploading(false); 
    }
  };

  const deleteNotice = async (id: string) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await axios.delete(`/api/notices/${id}`);
      toast.success("Notice deleted");
      fetchNotices();
    } catch (error) {
      toast.error("Failed to delete notice");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold">Manage Notice Board</h2>

      {/* New Notice Form */}
      <div className="bg-white p-6 rounded-lg shadow border border-slate-200 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Post a New Notice</h3>
        <input 
          type="text" 
          placeholder="Notice Title" 
          className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea 
          placeholder="Description" 
          rows={3}
          className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <label className="bg-slate-900 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 cursor-pointer hover:bg-slate-800 transition-colors w-full md:w-max">
          {isUploading ? <FiLoader className="animate-spin" /> : <FiUpload />}
          <span>Upload File & Publish</span>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx,image/*" 
            className="hidden" 
            onChange={handleFileUpload} 
            disabled={isUploading} 
          />
        </label>
      </div>

      {/* Notices List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Notice Details</th>
              <th className="p-4">Attachment</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="p-8 text-center"><FiLoader className="animate-spin h-6 w-6 mx-auto text-blue-500" /></td></tr>
            ) : notices.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No notices posted yet.</td></tr>
            ) : (
              notices.map((notice) => (
                <tr key={notice._id} className="border-b">
                  <td className="p-4 whitespace-nowrap text-slate-500">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{notice.title}</p>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{notice.description}</p>
                  </td>
                  <td className="p-4">
                    <a href={notice.fileUrl} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:underline">
                      <FiFileText className="mr-2 shrink-0" />
                      <span className="truncate max-w-[150px] inline-block">{notice.fileName}</span>
                    </a>
                  </td>
                  <td className="p-4 text-red-500 cursor-pointer text-lg">
                    <FiTrash2 className="hover:text-red-700" onClick={() => deleteNotice(notice._id)} />
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