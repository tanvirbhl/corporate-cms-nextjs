"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiTrash2, FiPlus, FiLoader } from "react-icons/fi";

export default function ServicesAdminPage() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    const res = await axios.get("/api/services");
    setServices(res.data.data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await axios.post("/api/services", formData);
    toast.success("Service added!");
    setFormData({ title: "", description: "" });
    fetchServices();
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/services/${id}`); // Create this route next
    toast.success("Service deleted!");
    fetchServices();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <form onSubmit={handleAdd} className="mb-8 p-4 bg-gray-50 rounded space-y-2">
        <input placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" required />
        <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded" required />
        <button className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded">
          {isSubmitting ? <FiLoader className="animate-spin" /> : <FiPlus />} Add Service
        </button>
      </form>
      
      <div className="grid gap-4">
        {services.map((s: any) => (
          <div key={s._id} className="p-4 border rounded flex justify-between items-center">
            <div><h3 className="font-bold">{s.title}</h3><p className="text-sm text-gray-600">{s.description}</p></div>
            <button onClick={() => handleDelete(s._id)} className="text-red-500"><FiTrash2 /></button>
          </div>
        ))}
      </div>
    </div>
  );
}