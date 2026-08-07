"use client";

import React from "react";
import { Check } from "lucide-react";
import { Country } from "./countries.data";

interface CountryListItemProps {
  country: Country;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (country: Country) => void;
  onMouseEnter: () => void;
  id?: string;
}

export const CountryListItem: React.FC<CountryListItemProps> = ({
  country,
  isSelected,
  isHighlighted,
  onSelect,
  onMouseEnter,
  id,
}) => {
  return (
    <div
      id={id}
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(country)}
      onMouseEnter={onMouseEnter}
      className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer select-none transition-colors ${
        isHighlighted
          ? "bg-blue-50 text-blue-900 font-medium"
          : isSelected
          ? "bg-gray-50 text-gray-900 font-medium"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-2.5 min-w-0">
        <span className="text-base leading-none flex-shrink-0" aria-hidden="true">
          {country.flag}
        </span>
        <span className="truncate">{country.name}</span>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
        <span className="text-xs text-gray-400 font-mono">
          {country.dialCode}
        </span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-mono">
          {country.iso2}
        </span>
        {isSelected && (
          <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
        )}
      </div>
    </div>
  );
};
