/**
 * @file restaurants.ts
 * @description Server actions for restaurant data operations
 *
 * Server actions for fetching, creating, updating, and searching restaurants.
 * Uses Supabase for database operations.
 */
"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import type {
  Restaurant,
  RestaurantWithDetails,
  RestaurantFilters,
  RestaurantSearchResult,
} from "@/types/restaurant";

/**
 * Get all restaurants
 */
export async function getRestaurants(
  filters?: RestaurantFilters,
): Promise<Restaurant[]> {
  try {
    const supabase = createClerkSupabaseClient();
    let query = supabase.from("restaurants").select("*");

    // Apply category filter
    if (filters?.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }

    // Apply price range filter
    if (filters?.price_range) {
      query = query.eq("price_range", filters.price_range);
    }

    // Apply search filter
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      query = query.or(
        `name_en.ilike.%${searchTerm}%,name_ko.ilike.%${searchTerm}%,address_en.ilike.%${searchTerm}%,address_ko.ilike.%${searchTerm}%`,
      );
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching restaurants:", error);
      throw new Error("Failed to fetch restaurants");
    }

    return (data as Restaurant[]) || [];
  } catch (error) {
    console.error("Error in getRestaurants:", error);
    return [];
  }
}

/**
 * Get restaurant by ID with details (photos, side dish notes)
 */
export async function getRestaurantById(
  id: string,
): Promise<RestaurantWithDetails | null> {
  try {
    const supabase = createClerkSupabaseClient();

    // Fetch restaurant
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", id)
      .single();

    if (restaurantError || !restaurant) {
      console.error("Error fetching restaurant:", restaurantError);
      return null;
    }

    // Fetch photos
    const { data: photos } = await supabase
      .from("restaurant_photos")
      .select("*")
      .eq("restaurant_id", id)
      .order("is_primary", { ascending: false })
      .order("uploaded_at", { ascending: false });

    // Fetch side dish notes
    const { data: sideDishNotes } = await supabase
      .from("restaurant_side_dish_notes")
      .select("*")
      .eq("restaurant_id", id)
      .eq("is_verified", true)
      .order("created_at", { ascending: false });

    return {
      ...(restaurant as Restaurant),
      photos: photos || [],
      side_dish_notes: sideDishNotes || [],
    };
  } catch (error) {
    console.error("Error in getRestaurantById:", error);
    return null;
  }
}

/**
 * Search restaurants by query
 */
export async function searchRestaurants(
  query: string,
): Promise<RestaurantSearchResult> {
  try {
    const supabase = createClerkSupabaseClient();
    const searchTerm = query.toLowerCase();

    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .or(
        `name_en.ilike.%${searchTerm}%,name_ko.ilike.%${searchTerm}%,address_en.ilike.%${searchTerm}%,address_ko.ilike.%${searchTerm}%`,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error searching restaurants:", error);
      throw new Error("Failed to search restaurants");
    }

    return {
      restaurants: (data as Restaurant[]) || [],
      total: data?.length || 0,
    };
  } catch (error) {
    console.error("Error in searchRestaurants:", error);
    return {
      restaurants: [],
      total: 0,
    };
  }
}

/**
 * Get Supabase user ID from Clerk user ID
 * Looks up the users table to find the UUID corresponding to the Clerk ID
 */
export async function getSupabaseUserIdFromClerkId(
  clerkUserId: string | null,
): Promise<string | null> {
  if (!clerkUserId) {
    return null;
  }

  try {
    // Use service role client to bypass RLS
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUserId)
      .single();

    if (error || !data) {
      console.error("Error finding Supabase user:", error);
      // User might not be synced yet - return null
      return null;
    }

    return data.id;
  } catch (error) {
    console.error("Error in getSupabaseUserIdFromClerkId:", error);
    return null;
  }
}
/**
 * Create a new restaurant (admin only)
 */
export async function createRestaurant(
  restaurant: Omit<
    Restaurant,
    "id" | "created_at" | "updated_at" | "created_by"
  >,
): Promise<Restaurant | null> {
  try {
    // Step 1: Get Clerk user ID from session
    const { userId: clerkUserId } = await auth();

    // Step 2: Get Supabase user ID from Clerk ID
    const supabaseUserId = await getSupabaseUserIdFromClerkId(clerkUserId);

    // Step 3: Create Supabase client
    const supabase = createClerkSupabaseClient();

    // Step 4: Insert restaurant with created_by field
    const { data, error } = await supabase
      .from("restaurants")
      .insert({
        ...restaurant,
        created_by: supabaseUserId, // Use Supabase UUID, not Clerk ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating restaurant:", error);
      throw new Error("Failed to create restaurant");
    }

    return data as Restaurant;
  } catch (error) {
    console.error("Error in createRestaurant:", error);
    return null;
  }
}

/**
 * Update a restaurant (admin only)
 */
export async function updateRestaurant(
  id: string,
  updates: Partial<Omit<Restaurant, "id" | "created_at" | "updated_at">>,
): Promise<Restaurant | null> {
  try {
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("restaurants")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating restaurant:", error);
      throw new Error("Failed to update restaurant");
    }

    return data as Restaurant;
  } catch (error) {
    console.error("Error in updateRestaurant:", error);
    return null;
  }
}

/**
 * Delete a restaurant (admin only)
 */
export async function deleteRestaurant(id: string): Promise<boolean> {
  try {
    const supabase = createClerkSupabaseClient();

    const { error } = await supabase.from("restaurants").delete().eq("id", id);

    if (error) {
      console.error("Error deleting restaurant:", error);
      throw new Error("Failed to delete restaurant");
    }

    return true;
  } catch (error) {
    console.error("Error in deleteRestaurant:", error);
    return false;
  }
}
