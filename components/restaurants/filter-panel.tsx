"use client";

/**
 * @file filter-panel.tsx
 * @description Advanced filter panel for restaurant search
 *
 * Provides filtering by:
 * - Categories (Vegetarian/Vegan/Vegetarian-Friendly)
 * - Price range ($, $$, $$$)
 * - Features (side-dish-only, verified)
 * - Sort options
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import type { RestaurantCategory } from "@/types/restaurant";

export interface FilterOptions {
  categories: RestaurantCategory[];
  priceRanges: ("budget" | "mid-range" | "upscale")[];
  features: {
    sideDishOnly: boolean;
    verified: boolean;
  };
  sortBy: "name" | "category" | "price";
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  language: "en" | "ko";
  onClear: () => void;
}

export function FilterPanel({
  filters,
  onFiltersChange,
  language,
  onClear,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const categories: Array<{
    value: RestaurantCategory;
    label: { en: string; ko: string };
  }> = [
    { value: "vegetarian", label: { en: "Vegetarian", ko: "채식" } },
    { value: "vegan", label: { en: "Vegan", ko: "비건" } },
    {
      value: "vegetarian-friendly",
      label: { en: "Vegetarian-Friendly", ko: "채식 친화적" },
    },
  ];

  const priceRanges: Array<{
    value: "budget" | "mid-range" | "upscale";
    label: { en: string; ko: string };
  }> = [
    { value: "budget", label: { en: "$", ko: "$" } },
    { value: "mid-range", label: { en: "$$", ko: "$$" } },
    { value: "upscale", label: { en: "$$$", ko: "$$$" } },
  ];

  const sortOptions: Array<{
    value: "name" | "category" | "price";
    label: { en: string; ko: string };
  }> = [
    { value: "name", label: { en: "Name", ko: "이름" } },
    { value: "category", label: { en: "Category", ko: "카테고리" } },
    { value: "price", label: { en: "Price", ko: "가격" } },
  ];

  const toggleCategory = (category: RestaurantCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    onFiltersChange({ ...filters, categories: newCategories });
  };

  const togglePriceRange = (priceRange: "budget" | "mid-range" | "upscale") => {
    const newPrices = filters.priceRanges.includes(priceRange)
      ? filters.priceRanges.filter((p) => p !== priceRange)
      : [...filters.priceRanges, priceRange];

    onFiltersChange({ ...filters, priceRanges: newPrices });
  };

  const toggleFeature = (feature: "sideDishOnly" | "verified") => {
    onFiltersChange({
      ...filters,
      features: {
        ...filters.features,
        [feature]: !filters.features[feature],
      },
    });
  };

  const activeFilterCount =
    filters.categories.length +
    filters.priceRanges.length +
    (filters.features.sideDishOnly ? 1 : 0) +
    (filters.features.verified ? 1 : 0);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border rounded-lg bg-background">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="font-semibold">
                {language === "ko" ? "필터" : "Filters"}
              </span>
              {activeFilterCount > 0 && (
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 pt-0 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-medium mb-3">
                {language === "ko" ? "카테고리" : "Category"}
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`category-${category.value}`}
                      checked={filters.categories.includes(category.value)}
                      onCheckedChange={() => toggleCategory(category.value)}
                    />
                    <Label
                      htmlFor={`category-${category.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {language === "ko"
                        ? category.label.ko
                        : category.label.en}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-medium mb-3">
                {language === "ko" ? "가격대" : "Price Range"}
              </h3>
              <div className="flex gap-2">
                {priceRanges.map((price) => (
                  <Button
                    key={price.value}
                    variant={
                      filters.priceRanges.includes(price.value)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => togglePriceRange(price.value)}
                    className={
                      filters.priceRanges.includes(price.value)
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }
                  >
                    {language === "ko" ? price.label.ko : price.label.en}
                  </Button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-medium mb-3">
                {language === "ko" ? "특징" : "Features"}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="feature-side-dish"
                    checked={filters.features.sideDishOnly}
                    onCheckedChange={() => toggleFeature("sideDishOnly")}
                  />
                  <Label
                    htmlFor="feature-side-dish"
                    className="text-sm cursor-pointer"
                  >
                    {language === "ko"
                      ? "반찬만 주문 가능"
                      : "Side-dish-only available"}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="feature-verified"
                    checked={filters.features.verified}
                    onCheckedChange={() => toggleFeature("verified")}
                  />
                  <Label
                    htmlFor="feature-verified"
                    className="text-sm cursor-pointer"
                  >
                    {language === "ko" ? "검증됨" : "Verified"}
                  </Label>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="font-medium mb-3">
                {language === "ko" ? "정렬" : "Sort By"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      filters.sortBy === option.value ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      onFiltersChange({ ...filters, sortBy: option.value })
                    }
                    className={
                      filters.sortBy === option.value
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }
                  >
                    {language === "ko" ? option.label.ko : option.label.en}
                  </Button>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                {language === "ko" ? "필터 초기화" : "Clear All Filters"}
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
