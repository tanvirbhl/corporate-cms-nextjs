"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { FadeInView } from "@/components/common/FadeInView";

export function ContactForm() {
  const [fields, setFields] = useState<any[]>([]);
  const [isFetchingFields, setIsFetchingFields] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  // Fetch the form configuration on load
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await axios.get("/api/contact/config");
        if (res.data.success) {
          setFields(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load form");
      } finally {
        setIsFetchingFields(false);
      }
    };
    fetchFields();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post("/api/contact", data);
      if (response.data.success) {
        toast.success("Message sent successfully!");
        setIsSubmitted(true);
        reset();
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  if (isFetchingFields) {
    return (
      <div className="bg-white p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <FadeInView delay={0.2}>
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Send us a message</h3>
          <p className="text-slate-600">Fill out the form below and our team will get back to you within 24 hours.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            {fields.map((field) => (
              <div key={field._id || field.name}>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {field.label} {field.required && "*"}
                </label>
                
                {field.type === "textarea" ? (
                  <textarea
                    {...register(field.name, { required: field.required })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all bg-slate-50 focus:bg-white resize-none"
                  />
                ) : field.type === "select" ? (
                  <select
                    {...register(field.name, { required: field.required })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all bg-slate-50 focus:bg-white appearance-none"
                  >
                    <option value="">Select an option...</option>
                    {field.options?.split(",").map((opt: string) => (
                      <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    {...register(field.name, { required: field.required })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all bg-slate-50 focus:bg-white"
                  />
                )}
                {errors[field.name] && <p className="text-red-500 text-xs mt-1">This field is required</p>}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isSubmitted}
            className={`w-full py-4 px-6 rounded-lg font-bold text-white flex items-center justify-center transition-all duration-300 ${
              isSubmitted ? "bg-green-600 hover:bg-green-700" : "bg-slate-900 hover:bg-blue-600 disabled:opacity-70"
            }`}
          >
            {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</> : isSubmitted ? <><CheckCircle2 className="w-5 h-5 mr-2" /> Sent Successfully</> : <><Send className="w-5 h-5 mr-2" /> Send Message</>}
          </button>
        </form>
      </div>
    </FadeInView>
  );
}