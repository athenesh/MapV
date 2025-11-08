"use client";

/**
 * @file filter-chips.tsx
 * @description Display active filters as removable chips
 *
 * Shows active filters with X buttons to remove them individually
 */

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RestaurantCategory } from "@/types/restaurant";

interface FilterChipsProps {
  activeCategories: RestaurantCategory[];
  activePriceRanges: ("budget" | "mid-range" | "upscale")[];
  activeFeatures: {
    sideDishOnly: boolean;
    verified: boolean;
  };
  onRemoveCategory: (category: RestaurantCategory) => void;
  onRemovePriceRange: (priceRange: "budget" | "mid-range" | "upscale") => void;
  onRemoveFeature: (feature: "sideDishOnly" | "verified") => void;
  onClearAll: () => void;
  language: "en" | "ko";
}

export function FilterChips({
  activeCategories,
  activePriceRanges,
  activeFeatures,
  onRemoveCategory,
  onRemovePriceRange,
  onRemoveFeature,
  onClearAll,
  language,
}: FilterChipsProps) {
  const categoryLabels: Record<RestaurantCategory, { en: string; ko: string }> =
    {
      vegetarian: { en: "Vegetarian", ko: "채식" },
      vegan: { en: "Vegan", ko: "비건" },
      "vegetarian-friendly": { en: "Veg-Friendly", ko: "채식 친화적" },
    };

  const priceLabels: Record<
    "budget" | "mid-range" | "upscale",
    { en: string; ko: string }
  > = {
    budget: { en: "$", ko: "$" },
    "mid-range": { en: "$$", ko: "$$" },
    upscale: { en: "$$$", ko: "$$$" },
  };

  const featureLabels: Record<
    "sideDishOnly" | "verified",
    { en: string; ko: string }
  > = {
    sideDishOnly: { en: "Side-dish-only", ko: "반찬만" },
    verified: { en: "Verified", ko: "검증됨" },
  };

  const hasActiveFilters =
    activeCategories.length > 0 ||
    activePriceRanges.length > 0 ||
    activeFeatures.sideDishOnly ||
    activeFeatures.verified;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {language === "ko" ? "활성 필터:" : "Active filters:"}
      </span>

      {/* Category Chips */}
      {activeCategories.map((category) => (
        <Badge
          key={category}
          variant="secondary"
          className="gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
        >
          {language === "ko"
            ? categoryLabels[category].ko
            : categoryLabels[category].en}
          <button
            onClick={() => onRemoveCategory(category)}
            className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {/* Price Range Chips */}
      {activePriceRanges.map((price) => (
        <Badge
          key={price}
          variant="secondary"
          className="gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
        >
          {language === "ko" ? priceLabels[price].ko : priceLabels[price].en}
          <button
            onClick={() => onRemovePriceRange(price)}
            className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {/* Feature Chips */}
      {activeFeatures.sideDishOnly && (
        <Badge
          variant="secondary"
          className="gap-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
        >
          {language === "ko"
            ? featureLabels.sideDishOnly.ko
            : featureLabels.sideDishOnly.en}
          <button
            onClick={() => onRemoveFeature("sideDishOnly")}
            className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {activeFeatures.verified && (
        <Badge
          variant="secondary"
          className="gap-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
        >
          {language === "ko"
            ? featureLabels.verified.ko
            : featureLabels.verified.en}
          <button
            onClick={() => onRemoveFeature("verified")}
            className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {/* Clear All Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 px-2 text-xs"
      >
        {language === "ko" ? "전체 초기화" : "Clear all"}
      </Button>
    </div>
  );
}
