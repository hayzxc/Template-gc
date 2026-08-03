"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { TreatmentDocument } from "./TreatmentDocument";
import { TreatmentLivePreview } from "./TreatmentLivePreview";
import type { TreatmentCertificateInput } from "@/lib/treatment-schema";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-gray-400 text-sm">
        Loading PDF render...
      </div>
    ),
  }
);

interface TreatmentPreviewProps {
  data: Partial<TreatmentCertificateInput>;
}

const toNullableDate = (v: unknown): Date | null => {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(String(v));
  return isNaN(d.getTime()) ? null : d;
};

const toNullableNumber = (v: unknown): number | null => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
};

const toPreviewData = (data: Partial<TreatmentCertificateInput>): TreatmentCertificateInput => ({
  hideLetterhead: Boolean(data.hideLetterhead),
  serialNo: data.serialNo || "",
  dateIssued: toNullableDate(data.dateIssued),
  certificateNo: data.certificateNo || "",
  treatmentProviderId: data.treatmentProviderId || "ID0018MB",
  relatedDocumentNo: data.relatedDocumentNo || "",
  containers: data.containers || "",
  consigneeName: data.consigneeName || "",
  consigneeAddress: data.consigneeAddress || "",
  notifyParty: data.notifyParty || "",
  sealNumbers: data.sealNumbers || "",
  carrierVessel: data.carrierVessel || "",
  clientName: data.clientName || "",
  clientAddress: data.clientAddress || "",
  commodity: data.commodity || "",
  grossWeight: data.grossWeight || "",
  netWeight: data.netWeight || "",
  measurement: data.measurement || "",
  countryOfOrigin: data.countryOfOrigin || "",
  destinationCountry: data.destinationCountry || "",
  portOfLoading: data.portOfLoading || "",
  portOfUnloading: data.portOfUnloading || "",
  targetOfFumigation: data.targetOfFumigation || "",
  enclosureType: data.enclosureType || "",
  doseRate: toNullableNumber(data.doseRate),
  exposurePeriod: toNullableNumber(data.exposurePeriod),
  scheduleTemperature: toNullableNumber(data.scheduleTemperature),
  appliedDose: toNullableNumber(data.appliedDose),
  appliedExposurePeriod: toNullableNumber(data.appliedExposurePeriod),
  appliedTemperature: toNullableNumber(data.appliedTemperature),
  placeOfFumigation: data.placeOfFumigation || "",
  commencedAt: toNullableDate(data.commencedAt),
  completedAt: toNullableDate(data.completedAt),
  finalTlvPpm: toNullableNumber(data.finalTlvPpm),
  fullName: data.fullName || "",
  accreditationNumber: data.accreditationNumber || "",
  signatureDate: toNullableDate(data.signatureDate),
  signatureUrl: data.signatureUrl || "",
  additionalDeclarations: data.additionalDeclarations || "",
});

export const TreatmentPreview = React.memo(function TreatmentPreview({ data }: TreatmentPreviewProps) {
  const [mode, setMode] = useState<"live" | "pdf">("live");
  const deferredData = React.useDeferredValue(data);
  const [debouncedData, setDebouncedData] = useState(deferredData);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedData(deferredData), 500);
    return () => clearTimeout(timer);
  }, [deferredData]);

  const previewData = toPreviewData(deferredData);

  const handleDownloadPdf = async () => {
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const doc = (
        <TreatmentDocument
          data={previewData}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const safeName = data.certificateNo && data.certificateNo.trim()
        ? data.certificateNo.trim().replace(/[^a-zA-Z0-9_-]/g, "_")
        : "Treatment_Certificate";
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeName}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate PDF download", err);
    }
  };

  return (
    <div className="h-[760px] rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex flex-col">
      {/* Mode Switcher Bar */}
      <div className="bg-white border-b px-4 py-2 flex justify-between items-center text-xs shrink-0">
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-md">
          <button
            type="button"
            onClick={() => setMode("live")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              mode === "live"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            ⚡ Live Preview
          </button>
          <button
            type="button"
            onClick={() => setMode("pdf")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              mode === "pdf"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📄 PDF View
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-md text-xs transition-colors flex items-center space-x-1"
            title="Download PDF file"
          >
            <span>📥 Download PDF</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
        {mode === "live" ? (
          <TreatmentLivePreview
            data={previewData}
          />
        ) : (
          <div className="w-full h-full">
            <PDFViewer width="100%" height="100%" showToolbar={false}>
              <TreatmentDocument
                data={toPreviewData(debouncedData)}
              />
            </PDFViewer>
          </div>
        )}
      </div>
    </div>
  );
});

TreatmentPreview.displayName = "TreatmentPreview";
