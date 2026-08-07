import { useMemo } from "react";
import { Country, getSortedCountries, COUNTRIES } from "./countries.data";

function matchCountry(country: Country, term: string): boolean {
  if (!term) return true;
  const cleanTerm = term.trim().toLowerCase();
  if (cleanTerm === "") return true;

  if (country.name.toLowerCase().includes(cleanTerm)) return true;
  if (country.iso2.toLowerCase().includes(cleanTerm)) return true;
  if (country.iso3.toLowerCase().includes(cleanTerm)) return true;
  if (country.dialCode.toLowerCase().includes(cleanTerm)) return true;

  if (country.aliases && country.aliases.some((alias) => alias.toLowerCase().includes(cleanTerm))) {
    return true;
  }

  return false;
}

export function useCountryFilter(query: string) {
  return useMemo(() => {
    const { pinned, remaining } = getSortedCountries();
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      return {
        filteredPinned: pinned,
        filteredRemaining: remaining,
        totalCount: COUNTRIES.length,
        hasResults: true,
      };
    }

    // When searching, filter across all countries
    const filteredAll = COUNTRIES.filter((c) => matchCountry(c, cleanQuery));
    
    // Sort results: exact ISO code or prefix matches first, then name matches
    filteredAll.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aStarts = aName.startsWith(cleanQuery);
      const bStarts = bName.startsWith(cleanQuery);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return aName.localeCompare(bName);
    });

    const pinnedSet = new Set(pinned.map((p) => p.iso2));
    const filteredPinned = filteredAll.filter((c) => pinnedSet.has(c.iso2));
    const filteredRemaining = filteredAll.filter((c) => !pinnedSet.has(c.iso2));

    return {
      filteredPinned: cleanQuery ? [] : filteredPinned, // Merge list when searching for clearer reading
      filteredRemaining: cleanQuery ? filteredAll : filteredRemaining,
      totalCount: filteredAll.length,
      hasResults: filteredAll.length > 0,
    };
  }, [query]);
}
