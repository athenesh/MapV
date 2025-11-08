/**
 * @file use-progress-tracking.ts
 * @description React hooks for tracking user progress and activity
 *
 * Hooks for tracking restaurant views, search queries, and user visits.
 */

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  trackRestaurantView,
  trackSearchQuery,
  startUserVisit,
  updateUserVisit,
} from "@/actions/progress";

/**
 * Hook to track restaurant views
 * Call this when a restaurant detail page is viewed
 */
export function useRestaurantViewTracking(restaurantId: string | null) {
  useEffect(() => {
    if (restaurantId) {
      trackRestaurantView(restaurantId, "detail_page");
      updateUserVisit("restaurant_view");
    }
  }, [restaurantId]);
}

/**
 * Hook to track search queries
 * Call this when a search is performed
 */
export function useSearchTracking() {
  const trackSearch = async (
    queryText: string,
    filterCategory?: string,
    resultsCount: number = 0,
  ) => {
    await trackSearchQuery(queryText, filterCategory, resultsCount);
    updateUserVisit("search");
  };

  return { trackSearch };
}

/**
 * Hook to initialize user visit tracking
 * Call this on app load or page mount
 */
export function useVisitTracking() {
  useEffect(() => {
    startUserVisit();
    updateUserVisit("page_view");
  }, []);
}

/**
 * Hook to track page views
 * Automatically tracks page views on route changes
 */
export function usePageViewTracking() {
  const pathname = usePathname();

  useEffect(() => {
    updateUserVisit("page_view");
  }, [pathname]);
}

