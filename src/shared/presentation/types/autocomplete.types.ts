export interface AutocompleteOption {
  code: string;
  value: string;
  meta: Record<string, unknown>;
}

export type AutocompleteReturnMode = "code" | "value" | "both";

export interface AutocompleteFieldMapping {
  code: string;
  value: string;
  searchFields: string[];
  metaFields?: string[];
}

export interface AutocompleteConfig {
  searchAction: (query: string) => Promise<AutocompleteOption[]>;
  returnMode: AutocompleteReturnMode;
  minChars?: number;
  debounceMs?: number;
  placeholder?: string;
  initialDisplayValue?: string;
  initialDisplayValueField?: string;
  onSelect?: (option: AutocompleteOption | null) => void;
}
