"use client";

import React, { useEffect, useRef } from "react";
import { Country } from "./countries.data";
import { CountryListItem } from "./CountryListItem";
import { SearchX } from "lucide-react";

interface CountryListProps {
  pinned: Country[];
  remaining: Country[];
  selectedCountryName?: string;
  highlightedIndex: number;
  onHighlightIndex: (index: number) => void;
  onSelectCountry: (country: Country) => void;
  searchQuery: string;
  hasResults: boolean;
}

export const CountryList: React.FC<CountryListProps> = ({
  pinned,
  remaining,
  selectedCountryName,
  highlightedIndex,
  onHighlightIndex,
  onSelectCountry,
  searchQuery,
  hasResults,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Flat array of current visible items for keyboard index mapping
  const visibleCountries = [...pinned, ...remaining];

  // Auto-scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && containerRef.current) {
      const activeEl = containerRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      ) as HTMLElement | null;

      if (activeEl) {
        activeEl.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  if (!hasResults) {
    return (
      <div className="py-8 px-4 text-center text-gray-500 bg-white">
        <SearchX className="w-8 h-8 mx-auto text-gray-300 mb-2" />
        <p className="text-sm font-medium text-gray-700">No countries found</p>
        <p className="text-xs text-gray-400 mt-1">
          No matches for &quot;<span className="font-semibold">{searchQuery}</span>&quot;
        </p>
      </div>
    );
  }

  let currentIndex = 0;

  return (
    <div
      ref={containerRef}
      role="listbox"
      tabIndex={-1}
      className="max-h-60 overflow-y-auto divide-y divide-gray-50 bg-white"
    >
      {pinned.length > 0 && (
        <div className="py-1">
          <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-gray-400 uppercase bg-gray-50/70">
            Popular / Pinned
          </div>
          {pinned.map((country) => {
            const index = currentIndex++;
            const isSelected = selectedCountryName?.toLowerCase() === country.name.toLowerCase() ||
              selectedCountryName?.toLowerCase() === country.iso2.toLowerCase();
            const isHighlighted = highlightedIndex === index;

            return (
              <div key={`pinned-${country.iso2}`} data-index={index}>
                <CountryListItem
                  country={country}
                  isSelected={isSelected}
                  isHighlighted={isHighlighted}
                  onSelect={onSelectCountry}
                  onMouseEnter={() => onHighlightIndex(index)}
                  id={`country-opt-${index}`}
                />
              </div>
            );
          })}
        </div>
      )}

      {remaining.length > 0 && (
        <div className="py-1">
          {pinned.length > 0 && (
            <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-gray-400 uppercase bg-gray-50/70">
              All Countries
            </div>
          )}
          {remaining.map((country) => {
            const index = currentIndex++;
            const isSelected = selectedCountryName?.toLowerCase() === country.name.toLowerCase() ||
              selectedCountryName?.toLowerCase() === country.iso2.toLowerCase();
            const isHighlighted = highlightedIndex === index;

            return (
              <div key={`rem-${country.iso2}`} data-index={index}>
                <CountryListItem
                  country={country}
                  isSelected={isSelected}
                  isHighlighted={isHighlighted}
                  onSelect={onSelectCountry}
                  onMouseEnter={() => onHighlightIndex(index)}
                  id={`country-opt-${index}`}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
