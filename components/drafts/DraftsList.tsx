"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

interface Draft {
  id: string;
  commodity: string;
  containerNumber: string;
  certificateDate: string;
  updatedAt: string;
}

export function DraftsList() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/certificates")
      .then((res) => res.json())
      .then((data) => {
        setDrafts(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading drafts...</div>;
  }

  if (drafts.length === 0) {
    return <div className="p-4 text-gray-500">No certificate drafts found.</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Commodity / Article
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Container Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Certificate Date
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
                {draft.commodity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {draft.containerNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {format(new Date(draft.certificateDate), "dd/MM/yyyy")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {format(new Date(draft.updatedAt), "dd/MM/yyyy HH:mm")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <Link
                  href={`/certificates/${draft.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </Link>
                <a
                  href={`/api/certificates/${draft.id}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-600 hover:text-green-900"
                >
                  Export PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
