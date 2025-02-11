import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import type { FilterOption } from "../types/search";

interface FilterSearchProps {
  type: "department" | "year" | "skill";
  options: FilterOption[];
  selectedOptions: string[];
  onToggleOption: (option: string) => void;
  onAddCustomOption?: (option: string) => void;
  placeholder: string;
}

const FilterSearch: React.FC<FilterSearchProps> = ({
  type,
  options,
  selectedOptions,
  onToggleOption,
  onAddCustomOption,
  placeholder,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim()) {
        if (type === "year") {
          const year = parseInt(searchQuery);
          if (year >= 1900 && year <= new Date().getFullYear() + 10) {
            onAddCustomOption?.(searchQuery);
          }
        } else {
          onAddCustomOption?.(searchQuery);
        }
        setSearchQuery("");
      }
    }
  };

  const handleYearInput = (value: string) => {
    const yearRegex = /^\d{0,4}$/;
    if (yearRegex.test(value)) {
      setSearchQuery(value);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type={type === "year" ? "number" : "text"}
          value={searchQuery}
          onChange={(e) =>
            type === "year"
              ? handleYearInput(e.target.value)
              : setSearchQuery(e.target.value)
          }
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
          min={type === "year" ? 1900 : undefined}
          max={type === "year" ? new Date().getFullYear() + 10 : undefined}
        />
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
      </div>

      {isOpen && (filteredOptions.length > 0 || searchQuery) && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.value)}
                onChange={() => onToggleOption(option.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSearch;