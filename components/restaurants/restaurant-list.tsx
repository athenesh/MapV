"use client";

/**
 * @file restaurant-list.tsx
 * @description Scrollable list of restaurant cards
 *
 * Displays restaurants in a vertical list with:
 * - Restaurant cards
 * - Loading states
 * - Empty states
 * - Result count
 */

import { RestaurantCard } from "./restaurant-card";
import type { Restaurant } from "@/types/restaurant";
import { Loader2 } from "lucide-react";

interface RestaurantListProps {
  restaurants: Restaurant[];
  language: "en" | "ko";
  loading?: boolean;
  onRestaurantClick?: (restaurant: Restaurant) => void;
}

export function RestaurantList({
  restaurants,
  language,
  loading = false,
  onRestaurantClick,
}: RestaurantListProps) {
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-muted-foreground">
            {language === "ko"
              ? "식당 불러오는 중..."
              : "Loading restaurants..."}
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (restaurants.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <p className="text-lg font-semibold mb-2">
            {language === "ko"
              ? "식당을 찾을 수 없습니다"
              : "No restaurants found"}
          </p>
          <p className="text-sm text-muted-foreground">
            {language === "ko"
              ? "다른 필터나 검색어를 시도해보세요."
              : "Try adjusting your filters or search terms."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Result Count */}
      <div className="text-sm text-muted-foreground">
        {language === "ko"
          ? `${restaurants.length}개의 식당`
          : `${restaurants.length} restaurant${
              restaurants.length !== 1 ? "s" : ""
            }`}
      </div>

      {/* Restaurant Cards */}
      <div className="space-y-3">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            language={language}
            onClick={
              onRestaurantClick
                ? () => onRestaurantClick(restaurant)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
