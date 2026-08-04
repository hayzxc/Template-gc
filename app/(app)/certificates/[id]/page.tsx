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
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/certificates/${id}`)
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

  if (notFound) {
    return (
      <div className="p-8 bg-white rounded-lg border text-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Draft Gas Clearance Certificate Tidak Ditemukan</h2>
        <p className="text-sm text-gray-500">Draft dengan ID "{id}" tidak ditemukan di database.</p>
        <a href="/certificates" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm">
          Kembali ke Daftar Draft
        </a>
      </div>
    );
  }

  if (!initialData) {
    return <div className="p-8 text-gray-500">Memuat data draft...</div>;
  }

  const handlePreviewChange = React.useCallback((data: Partial<CertificateInput>) => {
    setPreviewData(data);
  }, []);

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
          <CertificateForm initialValues={initialData} onSubmit={handleSubmit} onChange={handlePreviewChange} isLoading={isLoading} />
        </div>
        <div className="flex-1 pl-6">
          <CertificatePreview data={previewData} />
        </div>
      </div>
    </div>
  );
}
