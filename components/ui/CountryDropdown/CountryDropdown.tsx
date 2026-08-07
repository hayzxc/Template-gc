"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { Country, COUNTRIES } from "./countries.data";
import { useCountryFilter } from "./useCountryFilter";
import { CountrySearchInput } from "./CountrySearchInput";
import { CountryList } from "./CountryList";

export interface CountryDropdownProps {
  value?: string;
  onChange?: (value: string, country?: Country) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  error?: string;
  className?: string;
  valueKey?: "name" | "iso2" | "iso3";
}

export const CountryDropdown: React.FC<CountryDropdownProps> = ({
  value = "",
  onChange,
  placeholder = "Select a country...",
  disabled = false,
  name,
  error,
  className = "",
  valueKey = "name",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { filteredPinned, filteredRemaining, totalCount, hasResults } =
    useCountryFilter(searchQuery);

  const visibleCountries = [...filteredPinned, ...filteredRemaining];

  // Find selected country object
  const selectedCountry = COUNTRIES.find((c) => {
    if (!value) return false;
    const v = value.toLowerCase().trim();
    return (
      c.name.toLowerCase() === v ||
      c.iso2.toLowerCase() === v ||
      c.iso3.toLowerCase() === v
    );
  });

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Reset highlight index when filtering changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  const handleSelect = useCallback(
    (country: Country) => {
      const selectedValue = country[valueKey];
      if (onChange) {
        onChange(selectedValue, country);
      }
      setIsOpen(false);
      setSearchQuery("");
      triggerRef.current?.focus();
    },
    [onChange, valueKey]
  );

  // Keyboard navigation inside popover or trigger
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < visibleCountries.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : visibleCountries.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (visibleCountries[highlightedIndex]) {
          handleSelect(visibleCountries[highlightedIndex]);
        }
        break;
      case "Escape":
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden input for standard HTML form submission if name is provided */}
      {name && <input type="hidden" name={name} value={value} />}

      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm bg-white border rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : isOpen
            ? "border-blue-500 ring-2 ring-blue-500"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "text-gray-900 cursor-pointer"}`}
      >
        <div className="flex items-center space-x-2 truncate">
          {selectedCountry ? (
            <>
              <span className="text-base leading-none" aria-hidden="true">
                {selectedCountry.flag}
              </span>
              <span className="truncate font-medium">{selectedCountry.name}</span>
            </>
          ) : value ? (
            <>
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="truncate">{value}</span>
            </>
          ) : (
            <>
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 truncate">{placeholder}</span>
            </>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 ml-2 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180 text-blue-600" : ""
          }`}
        />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 left-0 top-full mt-1 w-full min-w-[280px] bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
          <CountrySearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            autoFocus
          />

          <CountryList
            pinned={filteredPinned}
            remaining={filteredRemaining}
            selectedCountryName={selectedCountry?.name || value}
            highlightedIndex={highlightedIndex}
            onHighlightIndex={setHighlightedIndex}
            onSelectCountry={handleSelect}
            searchQuery={searchQuery}
            hasResults={hasResults}
          />

          <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>{totalCount} countries available</span>
            <span>Use ↑↓ &amp; Enter</span>
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
