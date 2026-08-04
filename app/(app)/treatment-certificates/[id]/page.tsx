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
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/treatment-certificates/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        if (data.error) {
          setNotFound(true);
        } else {
          setInitialData(data);
          setPreviewData(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setNotFound(true);
      });
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

  if (notFound) {
    return (
      <div className="p-8 bg-white rounded-lg border text-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Draft Treatment Certificate Tidak Ditemukan</h2>
        <p className="text-sm text-gray-500">Draft dengan ID "{id}" tidak ditemukan di database.</p>
        <a href="/treatment-certificates" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm">
          Kembali ke Daftar Draft
        </a>
      </div>
    );
  }

  if (!initialData) {
    return <div className="p-8 text-gray-500">Memuat data draft...</div>;
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
