"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useAutocompleteSearch } from "../../hooks/use-autocomplete-search";
import type { AutocompleteOption, AutocompleteReturnMode } from "../../types/autocomplete.types";

export interface AutocompleteProps {
  searchAction: (query: string) => Promise<AutocompleteOption[]>;
  returnMode: AutocompleteReturnMode;
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: AutocompleteOption | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minChars?: number;
  debounceMs?: number;
  initialDisplayValue?: string;
  queryKeyPrefix?: string;
}

function getReturnValue(option: AutocompleteOption, mode: AutocompleteReturnMode): string {
  switch (mode) {
    case "code":
      return option.code;
    case "value":
      return option.value;
    case "both":
      return option.code;
    default:
      return option.code;
  }
}

export function Autocomplete({
  searchAction,
  returnMode,
  value,
  onChange,
  onSelect,
  placeholder = "Buscar...",
  disabled = false,
  minChars = 3,
  debounceMs = 300,
  initialDisplayValue,
  queryKeyPrefix = "autocomplete",
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<AutocompleteOption | null>(null);
  const [displayValue, setDisplayValue] = useState(initialDisplayValue ?? "");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { inputValue, setInputValue, options, isLoading } = useAutocompleteSearch({
    searchAction,
    minChars,
    debounceMs,
    queryKeyPrefix,
  });

  // Sync initialDisplayValue when it changes (edit mode)
  useEffect(() => {
    if (initialDisplayValue && !selectedOption) {
      setDisplayValue(initialDisplayValue);
    }
  }, [initialDisplayValue, selectedOption]);

  const isSelected = !!value && (!!selectedOption || !!initialDisplayValue);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      setDisplayValue(val);
      setActiveIndex(-1);

      // If user clears or modifies, deselect
      if (selectedOption) {
        setSelectedOption(null);
        onChange?.("");
        onSelect?.(null);
      }

      if (val.length >= minChars) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    },
    [selectedOption, onChange, onSelect, setInputValue, minChars]
  );

  const handleSelect = useCallback(
    (option: AutocompleteOption) => {
      setSelectedOption(option);
      setDisplayValue(option.value);
      setInputValue("");
      setOpen(false);
      setActiveIndex(-1);

      const returnValue = getReturnValue(option, returnMode);
      onChange?.(returnValue);
      onSelect?.(option);
    },
    [returnMode, onChange, onSelect, setInputValue]
  );

  const handleClear = useCallback(() => {
    setSelectedOption(null);
    setDisplayValue("");
    setInputValue("");
    setOpen(false);
    setActiveIndex(-1);
    onChange?.("");
    onSelect?.(null);
    inputRef.current?.focus();
  }, [onChange, onSelect, setInputValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open || options.length === 0) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setActiveIndex((prev) => {
            const next = prev < options.length - 1 ? prev + 1 : 0;
            scrollToItem(next);
            return next;
          });
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setActiveIndex((prev) => {
            const next = prev > 0 ? prev - 1 : options.length - 1;
            scrollToItem(next);
            return next;
          });
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < options.length) {
            handleSelect(options[activeIndex]);
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          setOpen(false);
          setActiveIndex(-1);
          break;
        }
      }
    },
    [open, options, activeIndex, handleSelect]
  );

  function scrollToItem(index: number) {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }

  const showPopover = open && (options.length > 0 || isLoading);

  return (
    <Popover open={showPopover} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={isSelected ? displayValue : displayValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputValue.length >= minChars && !isSelected) {
                setOpen(true);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={false}
            className={isSelected ? "pr-8" : ""}
          />
          {isSelected && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {isLoading && !isSelected && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div ref={listRef} className="max-h-60 overflow-y-auto py-1">
          {isLoading && options.length === 0 ? (
            <div className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Buscando...
            </div>
          ) : options.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              Sin resultados
            </div>
          ) : (
            options.map((option, index) => (
              <button
                key={option.code}
                type="button"
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                  index === activeIndex ? "bg-accent" : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(option);
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span className="truncate">{option.value}</span>
                {option.code !== option.value && (
                  <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                    {option.code.length > 8
                      ? `${option.code.slice(0, 8)}...`
                      : option.code}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
