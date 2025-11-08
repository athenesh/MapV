"use client";

/**
 * @file restaurant-card.tsx
 * @description Yelp-style restaurant card component
 *
 * Displays restaurant information in a card format with:
 * - Photo thumbnail
 * - Restaurant name and category
 * - Address and key features
 * - Price range and ratings (future)
 */

import Link from "next/link";
import Image from "next/image";
import { MapPin, Leaf, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RestaurantWithDetails } from "@/types/restaurant";

interface RestaurantCardProps {
  restaurant: RestaurantWithDetails;
  language: "en" | "ko";
  onClick?: () => void;
}

export function RestaurantCard({
  restaurant,
  language,
  onClick,
}: RestaurantCardProps) {
  const name = language === "ko" ? restaurant.name_ko : restaurant.name_en;
  const address =
    language === "ko" ? restaurant.address_ko : restaurant.address_en;

  // Category badges
  const getCategoryBadge = () => {
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

    return badges[restaurant.category] || badges.vegetarian;
  };

  const categoryBadge = getCategoryBadge();

  // Price range display
  const priceDisplay = restaurant.price_range
    ? { budget: "$", "mid-range": "$$", upscale: "$$$" }[restaurant.price_range]
    : "";

  const cardContent = (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Photo Thumbnail */}
          <div className="relative shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            {restaurant.photos && restaurant.photos.length > 0 ? (
              <Image
                src={restaurant.photos[0].storage_path}
                alt={name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="128px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Leaf className="h-12 w-12" />
              </div>
            )}
          </div>

          {/* Restaurant Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* Top Section */}
            <div>
              {/* Name and Category */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-1">
                  {name}
                </h3>
              </div>

              {/* Category Badge and Price */}
              <div className="flex items-center gap-2 mb-2">
                <Badge className={categoryBadge.className} variant="secondary">
                  {categoryBadge.label}
                </Badge>
                {priceDisplay && (
                  <span className="text-sm text-muted-foreground font-medium">
                    {priceDisplay}
                  </span>
                )}
              </div>

              {/* Address */}
              <div className="flex items-start gap-1.5 text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{address}</span>
              </div>
            </div>

            {/* Bottom Section - Features */}
            <div className="flex flex-wrap gap-2">
              {restaurant.offers_side_dish_only && (
                <div className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  <span>
                    {language === "ko" ? "반찬만 주문 가능" : "Side-dish-only"}
                  </span>
                </div>
              )}
              {restaurant.is_verified && (
                <div className="flex items-center gap-1 text-xs text-blue-700 dark:text-blue-400">
                  <CheckCircle className="h-3 w-3" />
                  <span>{language === "ko" ? "검증됨" : "Verified"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return <div onClick={onClick}>{cardContent}</div>;
  }

  return (
    <Link href={`/restaurants/${restaurant.id}`} className="block">
      {cardContent}
    </Link>
  );
}
