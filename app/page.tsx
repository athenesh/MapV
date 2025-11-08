"use client";

/**
 * @file page.tsx
 * @description Homepage with Yelp-style list/map view
 *
 * Main page with:
 * - Yelp-style header with search
 * - View toggle (list/map/split)
 * - Restaurant list with filters
 * - Naver map integration
 */

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import {
  ViewToggle,
  type ViewMode,
} from "@/components/restaurants/view-toggle";
import {
  FilterPanel,
  type FilterOptions,
} from "@/components/restaurants/filter-panel";
import { FilterChips } from "@/components/restaurants/filter-chips";
import { QuickSearchButtons } from "@/components/restaurants/quick-search-buttons";
import { RestaurantList } from "@/components/restaurants/restaurant-list";
import { SplitView } from "@/components/restaurants/split-view";
import NaverMap from "@/components/map/naver-map";
import { RestaurantInfoCard } from "@/components/map/restaurant-info-card";
import { getRestaurants, getRestaurantById } from "@/actions/restaurants";
import type {
  Restaurant,
  RestaurantWithDetails,
  RestaurantCategory,
} from "@/types/restaurant";
import { getLanguage, type Language } from "@/lib/i18n";
import {
  useVisitTracking,
  usePageViewTracking,
  useSearchTracking,
} from "@/hooks/use-progress-tracking";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    [],
  );
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantWithDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [activeQuickButton, setActiveQuickButton] = useState<string | undefined>();
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRanges: [],
    features: {
      sideDishOnly: false,
      verified: false,
    },
    sortBy: "name",
  });
  const router = useRouter();

  // Track visits and page views
  useVisitTracking();
  usePageViewTracking();
  const { trackSearch } = useSearchTracking();

  // Detect screen size for default view
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        // Mobile/tablet: default to list
        setViewMode("list");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Load restaurants on mount
  useEffect(() => {
    async function loadRestaurants() {
      try {
        setLoading(true);
        const data = await getRestaurants();
        console.group("🍽️ Restaurants Loaded");
        console.log("Total restaurants:", data.length);
        console.log(
          "Categories:",
          data.map((r) => r.category),
        );
        console.groupEnd();
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (error) {
        console.error("❌ Error loading restaurants:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
    setLanguage(getLanguage());
  }, []);

  // Filter restaurants by category, price, features, and search
  useEffect(() => {
    let filtered = restaurants;

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((r) =>
        filters.categories.includes(r.category),
      );
    }

    // Price range filter
    if (filters.priceRanges.length > 0 && filters.priceRanges.length < 3) {
      filtered = filtered.filter(
        (r) => r.price_range && filters.priceRanges.includes(r.price_range),
      );
    }

    // Features filter
    if (filters.features.sideDishOnly) {
      filtered = filtered.filter((r) => r.offers_side_dish_only);
    }
    if (filters.features.verified) {
      filtered = filtered.filter((r) => r.is_verified);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name_en.toLowerCase().includes(query) ||
          r.name_ko.toLowerCase().includes(query) ||
          r.address_en.toLowerCase().includes(query) ||
          r.address_ko.toLowerCase().includes(query),
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (filters.sortBy === "name") {
        return (language === "ko" ? a.name_ko : a.name_en).localeCompare(
          language === "ko" ? b.name_ko : b.name_en,
        );
      } else if (filters.sortBy === "category") {
        return a.category.localeCompare(b.category);
      } else if (filters.sortBy === "price") {
        const priceOrder = { budget: 1, "mid-range": 2, upscale: 3 };
        const aPrice = a.price_range ? priceOrder[a.price_range] : 0;
        const bPrice = b.price_range ? priceOrder[b.price_range] : 0;
        return aPrice - bPrice;
      }
      return 0;
    });

    console.log("🔍 Filtered restaurants:", filtered.length);
    setFilteredRestaurants(filtered);
  }, [restaurants, filters, searchQuery, language]);

  // Handle marker click from map
  const handleMarkerClick = async (restaurant: Restaurant) => {
    console.log("📍 Marker clicked:", restaurant.name_en);
    const details = await getRestaurantById(restaurant.id);
    if (details) {
      setSelectedRestaurant(details);
      // Track restaurant view from map
      const { trackRestaurantView } = await import("@/actions/progress");
      trackRestaurantView(restaurant.id, "map");
    }
  };

  // Handle restaurant card click
  const handleRestaurantClick = (restaurant: Restaurant) => {
    console.log("🏪 Restaurant card clicked:", restaurant.name_en);
    // Navigate to detail page
    router.push(`/restaurants/${restaurant.id}`);
  };

  // Handle search from header
  const handleSearch = (query: string) => {
    console.log("🔍 Search query:", query);
    setSearchQuery(query);
    if (query.trim()) {
      trackSearch(
        query,
        filters.categories.length > 0 ? filters.categories[0] : undefined,
        filteredRestaurants.length,
      );
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterOptions) => {
    console.log("🎛️ Filters changed:", newFilters);
    setFilters(newFilters);
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    console.log("🧹 Clearing all filters");
    setFilters({
      categories: [],
      priceRanges: [],
      features: {
        sideDishOnly: false,
        verified: false,
      },
      sortBy: "name",
    });
  };

  // Handle individual filter removals
  const handleRemoveCategory = (category: RestaurantCategory) => {
    setFilters({
      ...filters,
      categories: filters.categories.filter((c) => c !== category),
    });
  };

  const handleRemovePriceRange = (
    priceRange: "budget" | "mid-range" | "upscale",
  ) => {
    setFilters({
      ...filters,
      priceRanges: filters.priceRanges.filter((p) => p !== priceRange),
    });
  };

  const handleRemoveFeature = (feature: "sideDishOnly" | "verified") => {
    setFilters({
      ...filters,
      features: {
        ...filters.features,
        [feature]: false,
      },
    });
  };

  // Handle quick search actions
  const handleQuickSearch = (query: string) => {
    console.log("⚡ Quick search:", query);
    setSearchQuery(query);
    handleSearch(query);
    // Don't set active button here - let the component handle it
  };

  const handleQuickFilter = (filter: {
    category?: string;
    priceRange?: string;
    sideDishOnly?: boolean;
    verified?: boolean;
  }) => {
    console.log("⚡ Quick filter:", filter);

    const newFilters = { ...filters };

    // Apply category filter
    if (filter.category) {
      const category = filter.category as RestaurantCategory;
      if (!newFilters.categories.includes(category)) {
        newFilters.categories = [...newFilters.categories, category];
      }
    }

    // Apply price range filter
    if (filter.priceRange) {
      const priceRange = filter.priceRange as "budget" | "mid-range" | "upscale";
      if (!newFilters.priceRanges.includes(priceRange)) {
        newFilters.priceRanges = [...newFilters.priceRanges, priceRange];
      }
    }

    // Apply feature filters
    if (filter.sideDishOnly !== undefined) {
      newFilters.features.sideDishOnly = filter.sideDishOnly;
    }
    if (filter.verified !== undefined) {
      newFilters.features.verified = filter.verified;
    }

    setFilters(newFilters);
  };

  const handleQuickNavigate = (path: string) => {
    console.log("⚡ Quick navigate:", path);
    
    // For now, if it's ordering guide, we can show an alert
    // In the future, this could open a modal or navigate to a page
    if (path === "/ordering-guide") {
      alert(
        language === "ko"
          ? "주문 가이드 기능이 곧 추가됩니다!"
          : "Ordering guide feature coming soon!"
      );
    } else {
      router.push(path);
    }
  };

  // Toggle language
  const toggleLanguage = () => {
    const newLang = language === "en" ? "ko" : "en";
    console.log("🌐 Language changed:", newLang);
    setLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("namoolnow-language", newLang);
    }
  };

  // Handle view mode change
  const handleViewChange = (mode: ViewMode) => {
    console.log("👁️ View mode changed:", mode);
    setViewMode(mode);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header
        language={language}
        onLanguageToggle={toggleLanguage}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      {/* Quick Search Buttons - Discovery UI */}
      <div className="border-b bg-background">
        <div className="container mx-auto p-4 pb-6">
          <QuickSearchButtons
            onSearch={handleQuickSearch}
            onFilter={handleQuickFilter}
            onNavigate={handleQuickNavigate}
            language={language}
            activeButtonId={activeQuickButton}
          />
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="border-b bg-background">
        <div className="container mx-auto p-4">
          {/* Filter Panel and View Toggle */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div className="flex-1 w-full md:w-auto">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                language={language}
                onClear={handleClearFilters}
              />
            </div>
            <ViewToggle
              currentView={viewMode}
              onViewChange={handleViewChange}
              language={language}
              showSplit={
                typeof window !== "undefined" && window.innerWidth >= 1024
              }
            />
          </div>

          {/* Active Filter Chips */}
          <FilterChips
            activeCategories={filters.categories}
            activePriceRanges={filters.priceRanges}
            activeFeatures={filters.features}
            onRemoveCategory={handleRemoveCategory}
            onRemovePriceRange={handleRemovePriceRange}
            onRemoveFeature={handleRemoveFeature}
            onClearAll={handleClearFilters}
            language={language}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* List View Only */}
        {viewMode === "list" && (
          <div className="h-full overflow-y-auto">
            <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
              <RestaurantList
                restaurants={filteredRestaurants}
                language={language}
                loading={loading}
                onRestaurantClick={handleRestaurantClick}
              />
            </div>
          </div>
        )}

        {/* Map View Only */}
        {viewMode === "map" && (
          <div className="h-full relative">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <p className="text-muted-foreground">
                  {language === "ko" ? "지도 로딩 중..." : "Loading map..."}
                </p>
              </div>
            ) : (
              <NaverMap
                restaurants={filteredRestaurants}
                onMarkerClick={handleMarkerClick}
              />
            )}

            {/* Restaurant Info Card Overlay */}
            {selectedRestaurant && (
              <RestaurantInfoCard
                restaurant={selectedRestaurant}
                language={language}
                onClose={() => setSelectedRestaurant(null)}
              />
            )}
          </div>
        )}

        {/* Split View (List + Map) */}
        {viewMode === "split" && (
          <SplitView
            restaurants={filteredRestaurants}
            language={language}
            loading={loading}
            onMarkerClick={handleMarkerClick}
            onRestaurantClick={handleRestaurantClick}
          />
        )}
      </div>
    </div>
  );
}
