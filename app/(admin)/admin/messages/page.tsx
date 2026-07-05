"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiMail,
  FiCheck,
  FiArchive,
  FiTrash2,
  FiEye,
  FiX,
  FiLoader,
} from "react-icons/fi";

interface DynamicMessage {
  _id: string;
  data: Record<string, any>;
  status: "unread" | "read" | "archived";
  createdAt: string;
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<DynamicMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<DynamicMessage | null>(
    null,
  );

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/messages");
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put(`/api/messages/${id}`, { status: newStatus });
      toast.success(`Marked as ${newStatus}`);
      fetchMessages();

      // Update local state for the modal if it's currently open
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus as any });
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteMessage = async (id: string) => {
    if (
      !window.confirm("Are you sure you want to permanently delete this lead?")
    )
      return;
    try {
      await axios.delete(`/api/messages/${id}`);
      toast.success("Message deleted");
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleOpenMessage = (msg: DynamicMessage) => {
    setSelectedMessage(msg);
    // Automatically mark as read if it's currently unread
    if (msg.status === "unread") {
      updateStatus(msg._id, "read");
    }
  };

  // Updated Helper
  const getPreviewInfo = (data: Record<string, any> | null | undefined) => {
    // If data is null/undefined, return fallback values immediately
    if (!data || typeof data !== "object") {
      return { name: "Unknown Sender", email: "No Email Provided" };
    }

    const nameKey = Object.keys(data).find((k) =>
      k.toLowerCase().includes("name"),
    );
    const emailKey = Object.keys(data).find((k) =>
      k.toLowerCase().includes("email"),
    );

    return {
      name: nameKey ? data[nameKey] : "Unknown Sender",
      email: emailKey ? data[emailKey] : "No Email Provided",
    };
  };
  // Helper to format keys cleanly (e.g., "fullName" -> "Full Name")
  const formatLabel = (key: string) => {
    const result = key.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Inbox</h2>
          <p className="text-sm text-gray-500 mt-1">
            Review and manage incoming website inquiries.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Sender Preview</th>
              <th className="px-6 py-4">Date Received</th>
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
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  Your inbox is empty.
                </td>
              </tr>
            ) : (
              messages.map((msg) => {
                const preview = getPreviewInfo(msg.data);
                const isUnread = msg.status === "unread";

                return (
                  <tr
                    key={msg._id}
                    className={`border-b hover:bg-gray-50 transition-colors ${isUnread ? "bg-blue-50/30" : ""}`}
                  >
                    <td className="px-6 py-4">
                      {isUnread ? (
                        <span className="inline-flex items-center text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <FiMail className="mr-1.5" /> Unread
                        </span>
                      ) : msg.status === "archived" ? (
                        <span className="inline-flex items-center text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <FiArchive className="mr-1.5" /> Archived
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <FiCheck className="mr-1.5" /> Read
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className={`text-gray-900 ${isUnread ? "font-bold" : "font-medium"}`}
                      >
                        {preview.name}
                      </p>
                      <p className="text-xs text-gray-500">{preview.email}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleOpenMessage(msg)}
                        className="text-brand-primary hover:text-brand-accent transition-colors font-medium inline-flex items-center"
                      >
                        <FiEye className="mr-1" /> View Lead
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Lead Details</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Safety Check: Only map if selectedMessage.data exists and is an object */}
              {selectedMessage.data &&
              typeof selectedMessage.data === "object" ? (
                Object.entries(selectedMessage.data).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                  >
                    <p className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
                      {formatLabel(key)}
                    </p>
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {value ? (
                        value.toString()
                      ) : (
                        <span className="text-gray-400 italic">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic p-4">
                  No data content available for this message.
                </p>
              )}
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Received: {new Date(selectedMessage.createdAt).toLocaleString()}
              </p>
              <div className="flex space-x-3">
                {selectedMessage.status !== "archived" && (
                  <button
                    onClick={() =>
                      updateStatus(selectedMessage._id, "archived")
                    }
                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    <FiArchive className="mr-2" /> Archive
                  </button>
                )}
                <button
                  onClick={() => deleteMessage(selectedMessage._id)}
                  className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <FiTrash2 className="mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
