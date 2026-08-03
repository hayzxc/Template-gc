import React from "react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">
              Certificate Drafts
            </h1>
            <nav className="flex space-x-4">
              <Link
                href="/certificates"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                GC Drafts
              </Link>
              <Link
                href="/treatment-certificates"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                MB Treatment
              </Link>
              <Link
                href="/settings"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

