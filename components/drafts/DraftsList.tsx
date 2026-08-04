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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/certificates")
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
        console.error("Error loading drafts:", err);
        setErrorMessage(err.message || "Failed to load drafts");
        setDrafts([]);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
            <div className="flex gap-4">
              <div className="h-3 bg-gray-100 rounded w-24" />
              <div className="h-3 bg-gray-100 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="p-5 text-red-600 bg-red-50/80 border border-red-100 rounded-xl">
        <p className="font-semibold text-sm">Error loading certificate drafts</p>
        <p className="text-sm mt-1 text-red-500">{errorMessage}</p>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">📄</div>
        <p className="text-gray-400 text-sm">Belum ada draft Gas Clearance Certificate.</p>
        <Link
          href="/certificates/new"
          className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Buat Draft Baru
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {drafts.map((draft) => (
        <div
          key={draft.id}
          className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-150 px-5 py-4"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Left: Content */}
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-medium text-gray-800 leading-snug line-clamp-2">
                {draft.commodity || <span className="text-gray-300 italic">No commodity</span>}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                {draft.containerNumber && (
                  <span className="inline-flex items-center gap-1">
                    <span className="text-gray-300">📦</span>
                    {draft.containerNumber}
                  </span>
                )}
                {draft.certificateDate && (
                  <span className="inline-flex items-center gap-1">
                    <span className="text-gray-300">📅</span>
                    {format(new Date(draft.certificateDate), "dd/MM/yyyy")}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <span className="text-gray-300">🕐</span>
                  {format(new Date(draft.updatedAt), "dd/MM/yyyy HH:mm")}
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
              <Link
                href={`/certificates/${draft.id}`}
                className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Edit
              </Link>
              <a
                href={`/api/certificates/${draft.id}/pdf`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                PDF
              </a>
              <a
                href={`/api/certificates/${draft.id}/docx`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
              >
                DOCX
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
