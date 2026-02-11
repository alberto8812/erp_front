"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AutocompleteOption } from "../types/autocomplete.types";

interface UseAutocompleteSearchOptions {
  searchAction: (query: string) => Promise<AutocompleteOption[]>;
  minChars?: number;
  debounceMs?: number;
  queryKeyPrefix?: string;
}

export function useAutocompleteSearch({
  searchAction,
  minChars = 3,
  debounceMs = 300,
  queryKeyPrefix = "autocomplete",
}: UseAutocompleteSearchOptions) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    if (inputValue.length < minChars) {
      setDebouncedQuery("");
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputValue, minChars, debounceMs]);

  const { data: options = [], isLoading } = useQuery({
    queryKey: [queryKeyPrefix, "search", debouncedQuery],
    queryFn: () => searchAction(debouncedQuery),
    enabled: debouncedQuery.length >= minChars,
    staleTime: 30_000,
  });

  const isSearching = inputValue.length >= minChars && inputValue !== debouncedQuery;

  return {
    inputValue,
    setInputValue,
    options,
    isLoading: isLoading || isSearching,
  };
}
