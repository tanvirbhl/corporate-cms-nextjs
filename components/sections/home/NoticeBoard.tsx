"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FileDown, Calendar, Image as ImageIcon, FileText } from "lucide-react";
import { FadeInView } from "@/components/common/FadeInView";

interface NoticeData {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  createdAt: string;
}

export function NoticeBoard() {
  const [notices, setNotices] = useState<NoticeData[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get("/api/notices");
        if (res.data.success) setNotices(res.data.data);
      } catch (error) {
        console.error("Failed to load notices");
      }
    };
    fetchNotices();
  }, []);

  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension || '')) {
      return <ImageIcon className="w-5 h-5 mr-2" />;
    }
    if (['pdf', 'doc', 'docx'].includes(extension || '')) {
      return <FileText className="w-5 h-5 mr-2" />;
    }
    return <FileDown className="w-5 h-5 mr-2" />;
  };

  if (notices.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <FadeInView>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Notice Board</h2>
            <p className="text-lg text-slate-600">Important updates, announcements, and downloadable resources.</p>
          </div>
        </FadeInView>

        <div className="max-w-4xl mx-auto space-y-4">
          {notices.map((notice, index) => (
            <motion.div
              key={notice._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center text-sm text-blue-600 font-medium mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(notice.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{notice.title}</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{notice.description}</p>
              </div>
              
              <a 
                href={notice.fileUrl} 
                target="_blank" 
                rel="noreferrer"
                download
                className="inline-flex items-center justify-center shrink-0 px-6 py-3 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium rounded-xl transition-colors border border-slate-200 hover:border-blue-200 mt-4 md:mt-0"
              >
                {getFileIcon(notice.fileUrl)}
                View / Download
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}