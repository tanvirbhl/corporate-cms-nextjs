"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiLoader, FiLayers } from "react-icons/fi";
import { navbarSchema, NavbarFormValues } from "@/schemas/navbar";

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
    control,
    formState: { errors, isSubmitting },
  } = useForm<NavbarFormValues>({
    resolver: zodResolver(navbarSchema),
    defaultValues: {
      order: 0,
      isVisible: true,
      isCta: false,
      subLinks: [],
    },
  });

  // Setup dynamic field array for sub-menus
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subLinks",
  });

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

  const handleCreateNew = () => {
    setEditingId(null);
    reset({ order: links.length, isVisible: true, isCta: false, subLinks: [] });
    setIsModalOpen(true);
  };

  const handleEdit = (link: NavbarLink) => {
    setEditingId(link._id);
    reset({
      name: link.name,
      href: link.href,
      order: link.order,
      isVisible: link.isVisible,
      isCta: link.isCta,
      subLinks: link.subLinks || [],
    });
    setIsModalOpen(true);
  };

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Navbar Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage main navigation and dropdown sub-menus.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-brand-accent text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-600 transition-colors"
        >
          <FiPlus />
          <span>Add New Link</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Link Name</th>
                <th className="px-6 py-4 font-medium">URL / Href</th>
                <th className="px-6 py-4 font-medium text-center">Sub-links</th>
                <th className="px-6 py-4 font-medium text-center">Visible</th>
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
                  <tr key={link._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{link.order}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {link.name}
                      {link.isCta && <span className="ml-2 inline-flex text-brand-accent bg-blue-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">CTA</span>}
                    </td>
                    <td className="px-6 py-4">{link.href}</td>
                    <td className="px-6 py-4 text-center">
                      {link.subLinks && link.subLinks.length > 0 ? (
                        <span className="inline-flex items-center text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                          <FiLayers className="mr-1.5" /> {link.subLinks.length}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {link.isVisible ? (
                        <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium"><FiCheck className="mr-1"/> Yes</span>
                      ) : (
                        <span className="inline-flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium"><FiX className="mr-1"/> No</span>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 overflow-y-auto pt-20 pb-10">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Link" : "Add New Link"}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Name</label>
                  <input
                    {...register("name")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent"
                    placeholder="e.g., Services"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL / Href</label>
                  <input
                    {...register("href")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent"
                    placeholder="e.g., /services"
                  />
                  {errors.href && <p className="text-red-500 text-xs mt-1">{errors.href.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  {...register("order")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent"
                />
              </div>

              {/* Sub-menu Section */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-900">Dropdown Sub-links</label>
                  <button
                    type="button"
                    onClick={() => append({ name: "", href: "" })}
                    className="text-xs bg-white border border-gray-300 px-2 py-1 rounded text-gray-600 hover:text-brand-accent hover:border-brand-accent transition-colors flex items-center"
                  >
                    <FiPlus className="mr-1" /> Add Sub-link
                  </button>
                </div>
                
                {fields.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No sub-links. This will be a standard link.</p>
                ) : (
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-start bg-white p-2 border border-gray-200 rounded-md">
                        <div className="flex-1 space-y-2">
                          <input
                            {...register(`subLinks.${index}.name`)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-brand-accent"
                            placeholder="Sub-link Name (e.g. Web Design)"
                          />
                          <input
                            {...register(`subLinks.${index}.href`)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-brand-accent"
                            placeholder="Sub-link Href (e.g. /services/web)"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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