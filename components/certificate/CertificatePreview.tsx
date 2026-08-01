"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CertificateDocument } from "./CertificateDocument";
import { CertificateLivePreview } from "./CertificateLivePreview";
import type { CertificateInput } from "@/lib/certificate-schema";

// PDFViewer touches browser-only APIs, so it must be loaded client-side only.
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

interface CertificatePreviewProps {
    data: Partial<CertificateInput>;
}

const toDate = (v: unknown): Date => {
    const d = v instanceof Date ? v : new Date(String(v ?? ""));
    return isNaN(d.getTime()) ? new Date() : d;
};

const toNullableDate = (v: unknown): Date | null => {
    if (!v) return null;
    const d = v instanceof Date ? v : new Date(String(v));
    return isNaN(d.getTime()) ? null : d;
};

// The form emits partial/in-progress values while the user types; coerce them
// into the validated shape CertificateDocument expects so the preview never crashes.
const toPreviewData = (data: Partial<CertificateInput>): CertificateInput => ({
    certificateDate: toDate(data.certificateDate),
    commodity: data.commodity || "",
    containerNumber: data.containerNumber || "",
    carrierVessel: data.carrierVessel || "",
    fumigationArea: data.fumigationArea || "",
    commencingAt: toNullableDate(data.commencingAt),
    completedAt: toNullableDate(data.completedAt),
    gasLevelPpm: Number(data.gasLevelPpm) || 0,
    fumigatorName: data.fumigatorName || "",
    fumigatorSignatureUrl: data.fumigatorSignatureUrl || undefined,
});

export function CertificatePreview({ data }: CertificatePreviewProps) {
    const [mode, setMode] = useState<"live" | "pdf">("live");
    const [debouncedData, setDebouncedData] = useState(data);
    const [assets, setAssets] = useState<{ logoImageUrl?: string; stampImageUrl?: string }>({});

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedData(data), 500);
        return () => clearTimeout(timer);
    }, [data]);

    useEffect(() => {
        fetch("/api/company-asset")
            .then((res) => res.json())
            .then((asset) =>
                setAssets({
                    logoImageUrl: asset.logoImageUrl || undefined,
                    stampImageUrl: asset.stampImageUrl || undefined,
                })
            )
            .catch(() => setAssets({}));
    }, []);

    const previewData = toPreviewData(data);

    const handleDownloadPdf = async () => {
        try {
            const { pdf } = await import("@react-pdf/renderer");
            const doc = (
                <CertificateDocument
                    data={previewData}
                    logoUrl={assets.logoImageUrl}
                    stampUrl={assets.stampImageUrl}
                />
            );
            const blob = await pdf(doc).toBlob();
            const url = URL.createObjectURL(blob);
            const safeName = data.containerNumber && data.containerNumber.trim()
                ? data.containerNumber.trim().replace(/[^a-zA-Z0-9_-]/g, "_")
                : "Gas_Clearance_Certificate";
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
        <div className="h-[660px] rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex flex-col">
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
                        ⚡ Live Typewriter Preview
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
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
                {mode === "live" ? (
                    <CertificateLivePreview
                        data={previewData}
                        logoUrl={assets.logoImageUrl}
                        stampUrl={assets.stampImageUrl}
                    />
                ) : (
                    <div className="w-full h-full">
                        <PDFViewer width="100%" height="100%" showToolbar={false}>
                            <CertificateDocument
                                data={toPreviewData(debouncedData)}
                                logoUrl={assets.logoImageUrl}
                                stampUrl={assets.stampImageUrl}
                            />
                        </PDFViewer>
                    </div>
                )}
            </div>
        </div>
    );
}
