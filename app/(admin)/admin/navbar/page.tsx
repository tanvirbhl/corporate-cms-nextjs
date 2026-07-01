"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiLoader } from "react-icons/fi";
import { navbarSchema, NavbarFormValues } from "@/schemas/navbar";

// Local type for the fetched data
interface NavbarLink extends NavbarFormValues {
  _id: string;
}

export default function NavbarAdminPage() {
  const [links, setLinks] = useState<NavbarLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NavbarFormValues>({
    resolver: zodResolver(navbarSchema),
    defaultValues: {
      order: 0,
      isVisible: true,
      isCta: false,
    },
  });

  // Fetch Data
  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/navbar");
      if (response.data.success) {
        setLinks(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch navbar links");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Open Modal for Create
  const handleCreateNew = () => {
    setEditingId(null);
    reset({ order: links.length, isVisible: true, isCta: false });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleEdit = (link: NavbarLink) => {
    setEditingId(link._id);
    setValue("name", link.name);
    setValue("href", link.href);
    setValue("order", link.order);
    setValue("isVisible", link.isVisible);
    setValue("isCta", link.isCta);
    setIsModalOpen(true);
  };

  // Submit Handler (Create & Update)
  const onSubmit = async (data: NavbarFormValues) => {
    try {
      if (editingId) {
        await axios.put(`/api/navbar/${editingId}`, data);
        toast.success("Link updated successfully");
      } else {
        await axios.post("/api/navbar", data);
        toast.success("Link created successfully");
      }
      setIsModalOpen(false);
      fetchLinks();
    } catch (error) {
      toast.error(editingId ? "Failed to update link" : "Failed to create link");
    }
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      await axios.delete(`/api/navbar/${id}`);
      toast.success("Link deleted successfully");
      fetchLinks();
    } catch (error) {
      toast.error("Failed to delete link");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Navbar Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your website's main navigation links.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-brand-accent text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-600 transition-colors"
        >
          <FiPlus />
          <span>Add New Link</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Link Name</th>
                <th className="px-6 py-4 font-medium">URL / Href</th>
                <th className="px-6 py-4 font-medium text-center">Visible</th>
                <th className="px-6 py-4 font-medium text-center">CTA</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <FiLoader className="animate-spin h-6 w-6 text-brand-accent mx-auto" />
                  </td>
                </tr>
              ) : links.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No navbar links found. Click "Add New Link" to create one.
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{link.order}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{link.name}</td>
                    <td className="px-6 py-4">{link.href}</td>
                    <td className="px-6 py-4 text-center">
                      {link.isVisible ? (
                        <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium"><FiCheck className="mr-1"/> Yes</span>
                      ) : (
                        <span className="inline-flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium"><FiX className="mr-1"/> No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {link.isCta ? (
                        <span className="inline-flex text-brand-accent bg-blue-50 px-2 py-1 rounded-full text-xs font-medium">CTA</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => handleEdit(link)} className="text-gray-400 hover:text-brand-accent transition-colors">
                        <FiEdit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(link._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Link" : "Add New Link"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Name</label>
                <input
                  {...register("name")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all"
                  placeholder="e.g., About Us"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL / Href</label>
                <input
                  {...register("href")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all"
                  placeholder="e.g., /about"
                />
                {errors.href && <p className="text-red-500 text-xs mt-1">{errors.href.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  {...register("order")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all"
                />
                {errors.order && <p className="text-red-500 text-xs mt-1">{errors.order.message}</p>}
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="text-sm font-medium text-gray-700 cursor-pointer flex items-center space-x-2">
                  <input type="checkbox" {...register("isVisible")} className="rounded text-brand-accent focus:ring-brand-accent" />
                  <span>Visible to public</span>
                </label>
                
                <label className="text-sm font-medium text-gray-700 cursor-pointer flex items-center space-x-2">
                  <input type="checkbox" {...register("isCta")} className="rounded text-brand-accent focus:ring-brand-accent" />
                  <span>Is CTA Button</span>
                </label>
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-brand-primary text-white px-4 py-2 rounded-md font-medium hover:bg-brand-accent transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {isSubmitting ? <FiLoader className="animate-spin" /> : "Save Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}