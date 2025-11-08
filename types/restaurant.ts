/**
 * @file restaurant.ts
 * @description TypeScript type definitions for restaurant-related data structures
 *
 * This file contains all TypeScript interfaces and types used throughout the application
 * for restaurant data, photos, side dish notes, and related entities.
 */

/**
 * Restaurant category type
 */
export type RestaurantCategory = "vegetarian" | "vegan" | "vegetarian-friendly";

/**
 * Price range type
 */
export type PriceRange = "budget" | "mid-range" | "upscale";

/**
 * Photo type for restaurant photos
 */
export type PhotoType = "restaurant" | "side_dish";

/**
 * Edit suggestion status
 */
export type EditSuggestionStatus = "pending" | "approved" | "rejected";

/**
 * Menu item structure
 */
export interface MenuItem {
  name_en: string;
  name_ko: string;
  price?: number | string;
}

/**
 * Operating hours structure
 * Example: { mon: "11:00-22:00", tue: "11:00-22:00", ..., sun: "closed" }
 */
export interface OperatingHours {
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  sun?: string;
}

/**
 * Restaurant interface
 * Main restaurant data structure
 */
export interface Restaurant {
  id: string;
  name_en: string;
  name_ko: string;
  category: RestaurantCategory;
  address_en: string;
  address_ko: string;
  latitude: number;
  longitude: number;
  menu_items?: MenuItem[] | null;
  operating_hours?: OperatingHours | null;
  price_range?: PriceRange | null;
  description_en?: string | null;
  description_ko?: string | null;
  naver_place_id?: string | null;
  offers_side_dish_only: boolean;
  ordering_tips_en?: string | null;
  ordering_tips_ko?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  is_verified: boolean;
}

/**
 * Restaurant Photo interface
 */
export interface RestaurantPhoto {
  id: string;
  restaurant_id: string;
  storage_path: string;
  caption_en?: string | null;
  caption_ko?: string | null;
  uploaded_by?: string | null;
  uploaded_at: string;
  is_primary: boolean;
  photo_type: PhotoType;
}

/**
 * Side Dish Note interface
 */
export interface SideDishNote {
  id: string;
  restaurant_id: string;
  side_dish_name_ko: string;
  side_dish_name_en?: string | null;
  description_en?: string | null;
  description_ko?: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  notes?: string | null;
  ordering_phrase_ko?: string | null;
  ordering_phrase_en?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
}

/**
 * Restaurant Edit Suggestion interface
 */
export interface RestaurantEditSuggestion {
  id: string;
  restaurant_id: string;
  suggested_by: string;
  field_name: string;
  old_value?: string | null;
  new_value: string;
  status: EditSuggestionStatus;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
}

/**
 * Restaurant with related data (photos, side dish notes)
 */
export interface RestaurantWithDetails extends Restaurant {
  photos?: RestaurantPhoto[];
  side_dish_notes?: SideDishNote[];
}

/**
 * Filter options for restaurants
 */
export interface RestaurantFilters {
  category?: RestaurantCategory | "all";
  price_range?: PriceRange;
  search?: string;
  location?: string;
}

/**
 * Search result structure
 */
export interface RestaurantSearchResult {
  restaurants: Restaurant[];
  total: number;
}
