"use client";

/**
 * @file restaurant-search.tsx
 * @description Restaurant search component
 *
 * Provides search functionality by restaurant name or location.
 */

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Language } from "@/lib/i18n";

interface RestaurantSearchProps {
  onSearch: (query: string) => void;
  language: Language;
  placeholder?: string;
}

export function RestaurantSearch({
  onSearch,
  language,
  placeholder,
}: RestaurantSearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const defaultPlaceholder =
    language === "ko"
      ? "식당 이름 또는 지역 검색..."
      : "Search by restaurant name or location...";

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || defaultPlaceholder}
        className="pl-10"
      />
    </form>
  );
}
