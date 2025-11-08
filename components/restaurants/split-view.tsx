"use client";

/**
 * @file split-view.tsx
 * @description Desktop split view layout (list + map)
 *
 * Shows restaurant list on the left and map on the right:
 * - List: 60-70% width, scrollable
 * - Map: 30-40% width, sticky
 * - Responsive: collapses to single view on mobile
 */

import { useState } from "react";
import { RestaurantList } from "./restaurant-list";
import NaverMap from "@/components/map/naver-map";
import type { Restaurant, RestaurantWithDetails } from "@/types/restaurant";

interface SplitViewProps {
  restaurants: Restaurant[];
  language: "en" | "ko";
  loading?: boolean;
  onMarkerClick?: (restaurant: Restaurant) => Promise<void>;
  onRestaurantClick?: (restaurant: Restaurant) => void;
}

export function SplitView({
  restaurants,
  language,
  loading = false,
  onMarkerClick,
  onRestaurantClick,
}: SplitViewProps) {
  return (
    <div className="flex h-full">
      {/* Left Side - Restaurant List (scrollable) */}
      <div className="w-full lg:w-3/5 overflow-y-auto">
        <div className="p-4 lg:p-6">
          <RestaurantList
            restaurants={restaurants}
            language={language}
            loading={loading}
            onRestaurantClick={onRestaurantClick}
          />
        </div>
      </div>

      {/* Right Side - Map (sticky, hidden on mobile/tablet) */}
      <div className="hidden lg:block lg:w-2/5 relative border-l">
        <div className="sticky top-16 h-[calc(100vh-4rem)]">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
              <p className="text-muted-foreground">
                {language === "ko" ? "지도 로딩 중..." : "Loading map..."}
              </p>
            </div>
          ) : (
            <NaverMap
              restaurants={restaurants}
              onMarkerClick={onMarkerClick || (() => Promise.resolve())}
            />
          )}
        </div>
      </div>
    </div>
  );
}
