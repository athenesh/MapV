"use client";

/**
 * @file quick-search-buttons.tsx
 * @description Quick search buttons for discovery
 *
 * Provides one-click access to:
 * - Popular Korean dishes (Bibimbap, Tofu, etc.)
 * - Restaurant features (Side-dishes only, Vegan, etc.)
 * - Help guides (How to order)
 */

import { Button } from "@/components/ui/button";
import { quickSearchButtons, type QuickSearchButton } from "@/lib/quick-search-config";
import { cn } from "@/lib/utils";

interface QuickSearchButtonsProps {
  onSearch: (query: string) => void;
  onFilter: (filter: {
    category?: string;
    priceRange?: string;
    sideDishOnly?: boolean;
    verified?: boolean;
  }) => void;
  onNavigate?: (path: string) => void;
  language: "en" | "ko";
  activeButtonId?: string;
}

export function QuickSearchButtons({
  onSearch,
  onFilter,
  onNavigate,
  language,
  activeButtonId,
}: QuickSearchButtonsProps) {
  const handleButtonClick = (button: QuickSearchButton) => {
    console.log("🔘 Quick search button clicked:", button.id);

    if (button.action.type === "search") {
      // Trigger search
      onSearch(button.action.value as string);
    } else if (button.action.type === "filter") {
      // Apply filter
      const filterValue = button.action.value as {
        category?: string;
        priceRange?: string;
        sideDishOnly?: boolean;
        verified?: boolean;
      };
      onFilter(filterValue);
    } else if (button.action.type === "navigate") {
      // Navigate to page
      if (onNavigate) {
        onNavigate(button.action.value as string);
      }
    }

    // Track analytics (optional)
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "quick_search_click", {
        button_id: button.id,
        action_type: button.action.type,
      });
    }
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          {language === "ko" ? "빠른 검색:" : "Looking for:"}
        </h2>
      </div>

      {/* Buttons - Horizontal scroll on mobile */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickSearchButtons.map((button) => {
            const isActive = activeButtonId === button.id;
            const label = language === "ko" ? button.labelKo : button.labelEn;

            return (
              <Button
                key={button.id}
                variant="outline"
                size="default"
                onClick={() => handleButtonClick(button)}
                className={cn(
                  "shrink-0 gap-2 font-medium transition-all duration-200",
                  button.colorClass,
                  isActive && "ring-2 ring-green-600 ring-offset-2",
                )}
              >
                <span className="text-lg">{button.icon}</span>
                <span className="whitespace-nowrap">{label}</span>
              </Button>
            );
          })}
        </div>

        {/* Fade effect on right edge (mobile scroll indicator) */}
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
      </div>

      {/* Hint for mobile scrolling */}
      <p className="text-xs text-muted-foreground mt-2 md:hidden">
        {language === "ko" 
          ? "← 왼쪽으로 스크롤하여 더 보기" 
          : "← Scroll to see more"}
      </p>
    </div>
  );
}

