"use client";

import React, { useEffect, useState, use } from "react";
import { TreatmentForm } from "@/components/treatment/TreatmentForm";
import { TreatmentPreview } from "@/components/treatment/TreatmentPreview";
import type { TreatmentCertificateInput } from "@/lib/treatment-schema";

export default function EditTreatmentCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [initialData, setInitialData] = useState<Partial<TreatmentCertificateInput> | null>(null);
  const [previewData, setPreviewData] = useState<Partial<TreatmentCertificateInput>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/treatment-certificates/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInitialData(data);
        setPreviewData(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async (data: TreatmentCertificateInput) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/treatment-certificates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update draft");
      alert("Draft updated successfully");
    } catch (error) {
      console.error(error);
      alert("Error updating draft");
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialData) {
    return <div>Loading...</div>;
  }

  const handlePreviewChange = React.useCallback((data: Partial<TreatmentCertificateInput>) => {
    setPreviewData(data);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Edit Treatment Certificate Draft</h2>

      <div className="bg-white p-6 rounded-lg border shadow-sm flex">
        <div className="flex-1 pr-6 border-r overflow-y-auto max-h-[800px]">
          <TreatmentForm
            initialValues={initialData}
            onSubmit={handleSubmit}
            onChange={handlePreviewChange}
            isLoading={isLoading}
          />
        </div>
        <div className="flex-1 pl-6">
          <TreatmentPreview data={previewData} />
        </div>
      </div>
    </div>
  );
}
