import Link from "next/link";
import { DraftsList } from "@/components/drafts/DraftsList";

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Certificate Drafts</h2>
        <Link
          href="/certificates/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm"
        >
          New Certificate
        </Link>
      </div>
      <DraftsList />
    </div>
  );
}
