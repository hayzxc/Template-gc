"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TreatmentForm } from "@/components/treatment/TreatmentForm";
import { TreatmentPreview } from "@/components/treatment/TreatmentPreview";
import type { TreatmentCertificateInput } from "@/lib/treatment-schema";

export default function NewTreatmentCertificatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<Partial<TreatmentCertificateInput>>({});

  const handleSubmit = async (data: TreatmentCertificateInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/treatment-certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save draft");

      const record = await res.json();
      router.push(`/treatment-certificates/${record.id}`);
    } catch (error) {
      console.error(error);
      alert("Error saving draft");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewChange = React.useCallback((data: Partial<TreatmentCertificateInput>) => {
    setPreviewData(data);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">New Treatment Certificate Draft</h2>

      <div className="bg-white p-6 rounded-lg border shadow-sm flex">
        <div className="flex-1 pr-6 border-r overflow-y-auto max-h-[800px]">
          <TreatmentForm
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
