import Link from "next/link";
import { TreatmentDraftsList } from "@/components/treatment/TreatmentDraftsList";

export default function TreatmentCertificatesPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Draft Treatment Certificate (MB)</h2>
          <p className="text-xs text-gray-400 mt-0.5">Kelola dan edit draf sertifikat penanganan MB Treatment</p>
        </div>
        <Link
          href="/treatment-certificates/new"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-xs shadow-sm transition-all duration-150"
        >
          + Buat Draft Baru
        </Link>
      </div>
      <TreatmentDraftsList />
    </div>
  );
}
