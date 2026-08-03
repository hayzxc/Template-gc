"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CertificateForm } from "@/components/certificate/CertificateForm";
import { CertificatePreview } from "@/components/certificate/CertificatePreview";
import type { CertificateInput } from "@/lib/certificate-schema";

export default function NewCertificatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<Partial<CertificateInput>>({});

  const handleSubmit = async (data: CertificateInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save draft");

      const record = await res.json();
      router.push(`/certificates/${record.id}`);
    } catch (error) {
      console.error(error);
      alert("Error saving draft");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewChange = React.useCallback((data: Partial<CertificateInput>) => {
    setPreviewData(data);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">New Certificate Draft</h2>

      <div className="bg-white p-6 rounded-lg border shadow-sm flex">
        <div className="flex-1 pr-6 border-r">
          <CertificateForm onSubmit={handleSubmit} onChange={handlePreviewChange} isLoading={isLoading} />
        </div>
        <div className="flex-1 pl-6">
          <CertificatePreview data={previewData} />
        </div>
      </div>
    </div>
  );
}
