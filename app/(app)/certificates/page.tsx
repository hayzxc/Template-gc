import Link from "next/link";
import { DraftsList } from "@/components/drafts/DraftsList";

export default function CertificatesPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Draft Gas Clearance (GC)</h2>
          <p className="text-xs text-gray-400 mt-0.5">Kelola dan edit draf sertifikat Gas Clearance</p>
        </div>
        <Link
          href="/certificates/new"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-xs shadow-sm transition-all duration-150"
        >
          <span className="text-sm font-normal">+</span> Buat Draft Baru
        </Link>
      </div>
      <DraftsList />
    </div>
  );
}
