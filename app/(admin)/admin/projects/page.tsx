"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiLoader,
  FiCheck,
  FiX,
  FiUpload, // Added upload icon
} from "react-icons/fi";

interface Project {
  _id: string;
  title: string;
  slug: string;
  category: string;
  shortSummary: string;
  coverImage: string;
  technologies: string[] | string;
  isPublished: boolean;
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false); // New state for image upload
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Web Development",
    shortSummary: "",
    coverImage: "",
    technologies: "",
    isPublished: true,
  });

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/projects");
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      category: "Web Development",
      shortSummary: "",
      coverImage: "",
      technologies: "",
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (project: any) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      slug: project.slug,
      category: project.category,
      shortSummary: project.shortSummary,
      coverImage: project.coverImage,
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "",
      isPublished: project.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await axios.delete(`/api/projects/${id}`);
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  // - Direct Cloudinary Upload Handler  ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);

    // Pull configuration securely from your environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary configuration is missing in .env.local");
      setIsUploadingImage(false);
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", uploadPreset);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      const response = await axios.post(cloudinaryUrl, uploadData);

      // Save the secure URL from Cloudinary into our form state
      setFormData({ ...formData, coverImage: response.data.secure_url });
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image to Cloudinary");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent submission if image is still uploading or empty
    if (isUploadingImage) {
      toast.error("Please wait for the image to finish uploading");
      return;
    }
    if (!formData.coverImage) {
      toast.error("Please upload a cover image");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`/api/projects/${editingId}`, formData);
        toast.success("Project updated successfully");
      } else {
        await axios.post("/api/projects", formData);
        toast.success("Project published successfully");
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      toast.error(
        editingId ? "Failed to update project" : "Failed to create project",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Portfolio Projects
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage case studies and products.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-brand-accent text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-600 transition-colors"
        >
          <FiPlus />
          <span>Add Project</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">Project Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <FiLoader className="animate-spin h-6 w-6 text-brand-accent mx-auto" />
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center space-x-3">
                      {p.coverImage && (
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="w-10 h-10 rounded object-cover border border-gray-200"
                        />
                      )}
                      <span>{p.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{p.category}</td>
                  <td className="px-6 py-4 text-center">
                    {p.isPublished ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
                        Published
                      </span>
                    ) : (
                      <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-gray-400 hover:text-brand-accent transition-colors"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Project" : "New Project Case Study"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <form
              onSubmit={onSubmit}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project Title
                  </label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: generateSlug(e.target.value),
                      })
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent focus:outline-none"
                    placeholder="e.g., QuickHire Platform"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL Slug
                  </label>
                  <input
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Short Summary
                </label>
                <textarea
                  required
                  value={formData.shortSummary}
                  onChange={(e) =>
                    setFormData({ ...formData, shortSummary: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent focus:outline-none"
                  placeholder="Brief overview of the challenge and solution..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="SaaS Application">SaaS Application</option>
                    <option value="Corporate Website">Corporate Website</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Internal Tools">Internal Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    value={formData.technologies}
                    onChange={(e) =>
                      setFormData({ ...formData, technologies: e.target.value })
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent"
                    placeholder="Next.js, MongoDB, Tailwind..."
                  />
                </div>
              </div>

              {/* --- NEW: Image Upload UI --- */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cover Image
                </label>
                <div className="flex items-center space-x-4">
                  {/* Image Preview */}
                  {formData.coverImage ? (
                    <div className="relative w-20 h-20 rounded-md border border-gray-200 overflow-hidden">
                      <img
                        src={formData.coverImage}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-md border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400">
                      <FiUpload size={24} />
                    </div>
                  )}

                  {/* Upload Button */}
                  <label
                    className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-md border transition-colors flex items-center space-x-2 ${
                      isUploadingImage
                        ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white"
                    }`}
                  >
                    {isUploadingImage ? (
                      <>
                        <FiLoader className="animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FiUpload />
                        <span>
                          {formData.coverImage
                            ? "Change Image"
                            : "Select Image"}
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="text-sm font-medium text-gray-700 cursor-pointer flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isPublished: e.target.checked,
                      })
                    }
                    className="rounded text-brand-accent focus:ring-brand-accent"
                  />
                  <span>Publish immediately</span>
                </label>
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 py-2 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="flex-1 bg-brand-primary text-white py-2 rounded-md font-medium flex justify-center items-center hover:bg-brand-accent transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <FiLoader className="animate-spin" />
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    "Publish Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
