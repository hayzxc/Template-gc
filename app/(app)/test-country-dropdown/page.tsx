"use client";

import React, { useState } from "react";
import { CountryDropdown, Country } from "@/components/ui/CountryDropdown";
import { Globe, CheckCircle2, Info } from "lucide-react";

export default function TestCountryDropdownPage() {
  const [selectedName, setSelectedName] = useState<string>("Turkiye");
  const [selectedIso, setSelectedIso] = useState<string>("ID");
  const [selectedCountryObj, setSelectedCountryObj] = useState<Country | undefined>();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Country Dropdown with Search Showcase
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Interactive component supporting live search, keyboard navigation, flags, dial codes &amp; custom aliases (e.g. Turkiye / Türkiye).
              </p>
            </div>
          </div>
        </div>

        {/* Demo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Default (Name value) */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-semibold text-gray-800 text-sm">
                1. Storing Full Country Name
              </h2>
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-mono">
                valueKey=&quot;name&quot;
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Select Destination Country:
              </label>
              <CountryDropdown
                value={selectedName}
                onChange={(val, countryObj) => {
                  setSelectedName(val);
                  setSelectedCountryObj(countryObj);
                }}
                placeholder="Type to search country..."
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1 font-mono border border-gray-100">
              <p className="text-gray-500 font-sans font-medium text-[11px] uppercase tracking-wider">
                Current Field Value:
              </p>
              <p className="text-blue-700 font-bold text-sm">
                &quot;{selectedName}&quot;
              </p>
            </div>
          </div>

          {/* Card 2: ISO Code value */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-semibold text-gray-800 text-sm">
                2. Storing ISO2 Code
              </h2>
              <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded font-mono">
                valueKey=&quot;iso2&quot;
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Select Country Code:
              </label>
              <CountryDropdown
                value={selectedIso}
                onChange={(val) => setSelectedIso(val)}
                valueKey="iso2"
                placeholder="Choose country code..."
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1 font-mono border border-gray-100">
              <p className="text-gray-500 font-sans font-medium text-[11px] uppercase tracking-wider">
                Current Field Value:
              </p>
              <p className="text-purple-700 font-bold text-sm">
                &quot;{selectedIso}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Selected Metadata Inspector */}
        {selectedCountryObj && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-green-700 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Selected Country Metadata Payload</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-2xl">{selectedCountryObj.flag}</span>
                <p className="text-[11px] text-gray-400 mt-1">Flag</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {selectedCountryObj.name}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">Name</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 font-mono">
                <p className="font-semibold text-gray-800 text-sm">
                  {selectedCountryObj.iso2}
                </p>
                <p className="text-[11px] text-gray-400 mt-1 font-sans">ISO2</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 font-mono">
                <p className="font-semibold text-gray-800 text-sm">
                  {selectedCountryObj.iso3}
                </p>
                <p className="text-[11px] text-gray-400 mt-1 font-sans">ISO3</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 font-mono">
                <p className="font-semibold text-blue-600 text-sm">
                  {selectedCountryObj.dialCode}
                </p>
                <p className="text-[11px] text-gray-400 mt-1 font-sans">Dial Code</p>
              </div>
            </div>
          </div>
        )}

        {/* Feature Verification Tips */}
        <div className="bg-blue-50/70 p-5 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-2">
          <div className="flex items-center space-x-2 font-semibold text-blue-950">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Interactive Test Checklist</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-blue-800">
            <li>Type <strong>&quot;Turkiy&quot;</strong>, <strong>&quot;Turkiye&quot;</strong>, or <strong>&quot;Turkey&quot;</strong> in the search box to verify alias matching for 🇹🇷 <strong>Turkiye</strong>.</li>
            <li>Type <strong>&quot;+62&quot;</strong> or <strong>&quot;ID&quot;</strong> to match 🇮🇩 <strong>Indonesia</strong>.</li>
            <li>Use <strong>Arrow Down (↓)</strong> and <strong>Arrow Up (↑)</strong> to navigate items with auto-scrolling, and press <strong>Enter</strong> to pick.</li>
            <li>Click anywhere outside the dropdown box to close it cleanly.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
