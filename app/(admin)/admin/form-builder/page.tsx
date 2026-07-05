"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiSave, FiLoader } from "react-icons/fi";

interface FormField {
  label: string;
  name: string;
  type: string;
  required: boolean;
  options?: string;
}

export default function FormBuilderPage() {
  const [isLoading, setIsLoading] = useState(true);

  const { control, register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm<{ fields: FormField[] }>({
    defaultValues: { fields: [] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "fields" });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get("/api/contact/config");
        if (res.data.success) {
          reset({ fields: res.data.data });
        }
      } catch (error) {
        toast.error("Failed to load form configuration");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, [reset]);

  const generateFieldName = (label: string, index: number) => {
    const name = label.toLowerCase().replace(/[^a-z0-9]+/g, "") || `field_${index}`;
    setValue(`fields.${index}.name`, name);
  };

  const onSubmit = async (data: { fields: FormField[] }) => {
    try {
      await axios.put("/api/contact/config", data);
      toast.success("Form structure saved globally!");
    } catch (error) {
      toast.error("Failed to save form structure");
    }
  };

  if (isLoading) return <div className="p-10 text-center"><FiLoader className="animate-spin text-2xl text-brand-accent mx-auto" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Form Builder</h2>
          <p className="text-sm text-gray-500 mt-1">Configure the fields that appear on your public contact page.</p>
        </div>
        <button
          type="button"
          onClick={() => append({ label: "", name: "", type: "text", required: false, options: "" })}
          className="bg-brand-accent text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-600 transition-colors"
        >
          <FiPlus /><span>Add New Field</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          {fields.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No fields configured. Add one to get started.</p>
          ) : (
            fields.map((field, index) => {
              const currentType = watch(`fields.${index}.type`);
              
              return (
                <div key={field.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-start gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                    
                    {/* Label Input */}
                    <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Display Label</label>
                      <input
                        {...register(`fields.${index}.label`, { required: true })}
                        onChange={(e) => generateFieldName(e.target.value, index)}
                        placeholder="e.g. Budget Range"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent focus:outline-none"
                      />
                    </div>

                    {/* Internal Name (Read-only) */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Database Key</label>
                      <input
                        {...register(`fields.${index}.name`)}
                        readOnly
                        className="w-full border border-gray-200 bg-gray-100 rounded px-3 py-2 text-sm text-gray-500 outline-none"
                      />
                    </div>

                    {/* Field Type */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Input Type</label>
                      <select
                        {...register(`fields.${index}.type`)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent focus:outline-none"
                      >
                        <option value="text">Single Line Text</option>
                        <option value="email">Email Field</option>
                        <option value="textarea">Multi-line Paragraph</option>
                        <option value="select">Dropdown Select</option>
                      </select>
                    </div>

                    {/* Required Checkbox */}
                    <div className="md:col-span-2 flex items-center pt-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" {...register(`fields.${index}.required`)} className="rounded text-brand-accent focus:ring-brand-accent" />
                        <span className="text-sm font-medium text-gray-700">Required</span>
                      </label>
                    </div>

                    {/* Options (Only show if type is 'select') */}
                    {currentType === "select" && (
                      <div className="md:col-span-12">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dropdown Options (Comma Separated)</label>
                        <input
                          {...register(`fields.${index}.options`)}
                          placeholder="e.g. Under $5k, $5k-$10k, $10k+"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <button type="button" onClick={() => remove(index)} className="text-gray-400 hover:text-red-500 pt-6">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-brand-accent transition-colors disabled:opacity-70">
            {isSubmitting ? <FiLoader className="animate-spin" /> : <FiSave />}
            <span>Save Form Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}