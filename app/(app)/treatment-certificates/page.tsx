import Link from "next/link";
import { TreatmentDraftsList } from "@/components/treatment/TreatmentDraftsList";

export default function TreatmentCertificatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Treatment Certificate Drafts</h2>
        <Link
          href="/treatment-certificates/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm"
        >
          New Treatment Certificate
        </Link>
      </div>
      <TreatmentDraftsList />
    </div>
  );
}
