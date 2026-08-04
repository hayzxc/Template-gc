"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/certificates", label: "Draft GC", icon: "📄" },
  { href: "/treatment-certificates", label: "Draft Sertifikat", icon: "🧪" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Brand */}
            <Link href="/certificates" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">AF</span>
              </div>
              <span className="text-[15px] font-semibold text-gray-800 tracking-tight group-hover:text-gray-600 transition-colors">
                AFAS Certificate
              </span>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150
                      ${
                        isActive
                          ? "text-blue-700 bg-blue-50/80"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-blue-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
