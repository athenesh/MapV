"use client";

/**
 * @file restaurant-filters.tsx
 * @description Restaurant filter component
 *
 * Provides filtering by category (All / Vegetarian / Vegan / Vegetarian-Friendly)
 */

import { Button } from "@/components/ui/button";
import type { RestaurantCategory } from "@/types/restaurant";
import type { Language } from "@/lib/i18n";

interface RestaurantFiltersProps {
  selectedCategory: RestaurantCategory | "all";
  onCategoryChange: (category: RestaurantCategory | "all") => void;
  language: Language;
}

export function RestaurantFilters({
  selectedCategory,
  onCategoryChange,
  language,
}: RestaurantFiltersProps) {
  const categories: Array<{
    value: RestaurantCategory | "all";
    label: { en: string; ko: string };
  }> = [
    { value: "all", label: { en: "All", ko: "전체" } },
    { value: "vegetarian", label: { en: "Vegetarian", ko: "채식" } },
    { value: "vegan", label: { en: "Vegan", ko: "비건" } },
    {
      value: "vegetarian-friendly",
      label: { en: "Vegetarian-Friendly", ko: "채식 친화적" },
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={selectedCategory === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.value)}
          className={
            selectedCategory === category.value
              ? "bg-green-600 hover:bg-green-700"
              : ""
          }
        >
          {language === "ko" ? category.label.ko : category.label.en}
        </Button>
      ))}
    </div>
  );
}
