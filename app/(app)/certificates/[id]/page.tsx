"use client";

import React, { useEffect, useState, use } from "react";
import { CertificateForm } from "@/components/certificate/CertificateForm";
import { CertificatePreview } from "@/components/certificate/CertificatePreview";
import type { CertificateInput } from "@/lib/certificate-schema";

export default function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [initialData, setInitialData] = useState<Partial<CertificateInput> | null>(null);
  const [previewData, setPreviewData] = useState<Partial<CertificateInput>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/certificates/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInitialData(data);
        setPreviewData(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async (data: CertificateInput) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/certificates/${id}`, {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Edit Certificate Draft</h2>
        <a
          href={`/api/certificates/${id}/pdf`}
          target="_blank"
          rel="noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md text-sm"
        >
          Export PDF
        </a>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm flex">
        <div className="flex-1 pr-6 border-r">
          <CertificateForm initialValues={initialData} onSubmit={handleSubmit} onChange={setPreviewData} isLoading={isLoading} />
        </div>
        <div className="flex-1 pl-6">
          <CertificatePreview data={previewData} />
        </div>
      </div>
    </div>
  );
}
