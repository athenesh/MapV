"use client";

/**
 * @file slide-up-panel.tsx
 * @description Slide-up panel for displaying search results on map
 *
 * Features:
 * - Three states: collapsed, partial, expanded
 * - Draggable interaction
 * - Restaurant cards with quick info
 * - Click to navigate to detail page
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronUp, ChevronDown, X, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Restaurant, RestaurantWithDetails } from "@/types/restaurant";
import { cn } from "@/lib/utils";

type PanelState = "collapsed" | "partial" | "expanded";

interface SlideUpPanelProps {
  restaurants: (Restaurant | RestaurantWithDetails)[];
  language: "en" | "ko";
  isOpen: boolean;
  onToggle: () => void;
  searchTerm?: string;
}

export function SlideUpPanel({
  restaurants,
  language,
  isOpen,
  onToggle,
  searchTerm,
}: SlideUpPanelProps) {
  const [panelState, setPanelState] = useState<PanelState>("partial");
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // Calculate panel height based on state
  const getPanelHeight = () => {
    switch (panelState) {
      case "collapsed":
        return "80px"; // Just header
      case "partial":
        return "40%"; // Show 2-3 restaurants
      case "expanded":
        return "85%"; // Almost full screen
      default:
        return "40%";
    }
  };

  // Handle drag start
  const handleDragStart = (clientY: number) => {
    setIsDragging(true);
    setStartY(clientY);
    setCurrentY(clientY);
  };

  // Handle drag move
  const handleDragMove = (clientY: number) => {
    if (!isDragging) return;
    setCurrentY(clientY);
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const deltaY = currentY - startY;
    const threshold = 50; // Minimum drag distance to trigger state change

    if (Math.abs(deltaY) < threshold) return;

    // Dragging down (positive deltaY)
    if (deltaY > 0) {
      if (panelState === "expanded") {
        setPanelState("partial");
      } else if (panelState === "partial") {
        setPanelState("collapsed");
      }
    }
    // Dragging up (negative deltaY)
    else {
      if (panelState === "collapsed") {
        setPanelState("partial");
      } else if (panelState === "partial") {
        setPanelState("expanded");
      }
    }

    setStartY(0);
    setCurrentY(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Add global mouse/touch event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, currentY]);

  // Get category badge info
  const getCategoryBadge = (category: string) => {
    const badges = {
      vegetarian: {
        label: language === "ko" ? "🌿 채식" : "🌿 Vegetarian",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      },
      vegan: {
        label: language === "ko" ? "🥬 비건" : "🥬 Vegan",
        className:
          "bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-50",
      },
      "vegetarian-friendly": {
        label: language === "ko" ? "🍃 채식 친화" : "🍃 Veg-Friendly",
        className:
          "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-200",
      },
    };

    return badges[category as keyof typeof badges] || badges.vegetarian;
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background border-t shadow-2xl rounded-t-3xl transition-all duration-300 ease-out z-50",
        isDragging && "transition-none"
      )}
      style={{
        height: getPanelHeight(),
      }}
    >
      {/* Drag Handle Header */}
      <div
        className="sticky top-0 bg-background border-b z-10 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Indicator */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>

        {/* Header Content */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-red-500" />
              <h3 className="font-bold text-lg">
                {searchTerm
                  ? language === "ko"
                    ? `"${searchTerm}" 검색 결과`
                    : `Results for "${searchTerm}"`
                  : language === "ko"
                    ? "검색 결과"
                    : "Search Results"}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "ko"
                ? `${restaurants.length}개 식당 찾음`
                : `${restaurants.length} restaurants found`}
            </p>
          </div>

          {/* State Toggle Buttons */}
          <div className="flex items-center gap-2">
            {panelState !== "expanded" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPanelState("expanded")}
                className="h-8 w-8"
              >
                <ChevronUp className="h-5 w-5" />
              </Button>
            )}
            {panelState !== "collapsed" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPanelState("collapsed")}
                className="h-8 w-8"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="overflow-y-auto h-[calc(100%-80px)] px-4 py-4">
        {restaurants.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-16 w-16 text-gray-400 mb-4" />
            <h4 className="text-lg font-semibold text-foreground mb-2">
              {language === "ko" ? "검색 결과 없음" : "No Results Found"}
            </h4>
            <p className="text-sm text-muted-foreground max-w-md">
              {language === "ko"
                ? `"${searchTerm}"에 대한 검색 결과가 없습니다. 다른 키워드로 시도해보세요.`
                : `No restaurants found for "${searchTerm}". Try a different search term.`}
            </p>
          </div>
        ) : (
          // Restaurant Cards
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurants.map((restaurant) => {
              const name =
                language === "ko" ? restaurant.name_ko : restaurant.name_en;
              const address =
                language === "ko"
                  ? restaurant.address_ko
                  : restaurant.address_en;
              const categoryBadge = getCategoryBadge(restaurant.category);

              return (
                <Link
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.id}`}
                  className="block group"
                >
                  <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-card">
                    {/* Image */}
                    <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                      {'photos' in restaurant && restaurant.photos && restaurant.photos.length > 0 ? (
                        <Image
                          src={restaurant.photos[0].storage_path}
                          alt={name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-4xl">🍽️</span>
                        </div>
                      )}
                      {/* Overlay Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge
                          className={cn(categoryBadge.className, "shadow-md")}
                          variant="secondary"
                        >
                          {categoryBadge.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="font-bold text-base mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                        {name}
                      </h4>
                      <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{address}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

