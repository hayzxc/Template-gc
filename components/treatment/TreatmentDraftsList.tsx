"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

interface TreatmentDraft {
  id: string;
  certificateNo: string | null;
  commodity: string | null;
  dateIssued: string | null;
  updatedAt: string;
}

export function TreatmentDraftsList() {
  const [drafts, setDrafts] = useState<TreatmentDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/treatment-certificates")
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setDrafts(data);
        } else {
          setDrafts([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading treatment drafts:", err);
        setErrorMessage(err.message || "Failed to load drafts");
        setDrafts([]);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading drafts...</div>;
  }

  if (errorMessage) {
    return (
      <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-md">
        <p className="font-semibold">Error loading treatment certificate drafts:</p>
        <p className="text-sm mt-1">{errorMessage}</p>
        <p className="text-xs text-gray-500 mt-2">
          Make sure your database connection string (DATABASE_URL) is set up correctly.
        </p>
      </div>
    );
  }

  if (drafts.length === 0) {
    return <div className="p-4 text-gray-500">No treatment certificate drafts found.</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Certificate No.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Commodity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Issued
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Updated
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {drafts.map((draft) => (
            <tr key={draft.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {draft.certificateNo || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {draft.commodity || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {draft.dateIssued ? format(new Date(draft.dateIssued), "dd/MM/yyyy") : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {format(new Date(draft.updatedAt), "dd/MM/yyyy HH:mm")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <Link
                  href={`/treatment-certificates/${draft.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
