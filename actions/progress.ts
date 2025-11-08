/**
 * @file progress.ts
 * @description Server actions for progress tracking and analytics
 *
 * Server actions for tracking user activity, restaurant views, search queries,
 * and retrieving analytics data for dashboard.
 */
"use server";

import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { getSupabaseUserIdFromClerkId } from "@/actions/restaurants";
import type {
  UserVisit,
  RestaurantView,
  SearchQuery,
  UserProgress,
  DashboardStats,
} from "@/types/progress";

/**
 * Get or create session ID for anonymous tracking
 */
async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return sessionId;
}

/**
 * Track a restaurant view
 */
export async function trackRestaurantView(
  restaurantId: string,
  source?: string,
): Promise<void> {
  try {
    const { userId: clerkUserId } = await auth();
    const sessionId = await getSessionId();
    const supabase = createClerkSupabaseClient();

    // Get Supabase user ID if authenticated
    let supabaseUserId: string | null = null;
    if (clerkUserId) {
      supabaseUserId = await getSupabaseUserIdFromClerkId(clerkUserId);
    }

    const { error } = await supabase.from("restaurant_views").insert({
      restaurant_id: restaurantId,
      user_id: supabaseUserId,
      session_id: sessionId,
      source: source || "unknown",
      viewed_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error tracking restaurant view:", error);
    }
  } catch (error) {
    console.error("Error in trackRestaurantView:", error);
  }
}

/**
 * Track a search query
 */
export async function trackSearchQuery(
  queryText: string,
  filterCategory?: string,
  resultsCount: number = 0,
): Promise<void> {
  try {
    const { userId: clerkUserId } = await auth();
    const sessionId = await getSessionId();
    const supabase = createClerkSupabaseClient();

    // Get Supabase user ID if authenticated
    let supabaseUserId: string | null = null;
    if (clerkUserId) {
      supabaseUserId = await getSupabaseUserIdFromClerkId(clerkUserId);
    }

    const { error } = await supabase.from("search_queries").insert({
      user_id: supabaseUserId,
      session_id: sessionId,
      query_text: queryText,
      filter_category: filterCategory || null,
      results_count: resultsCount,
      searched_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error tracking search query:", error);
    }
  } catch (error) {
    console.error("Error in trackSearchQuery:", error);
  }
}

/**
 * Start a user visit session
 */
export async function startUserVisit(): Promise<string> {
  try {
    const { userId: clerkUserId } = await auth();
    const sessionId = await getSessionId();
    const supabase = createClerkSupabaseClient();

    // Get Supabase user ID if authenticated
    let supabaseUserId: string | null = null;
    if (clerkUserId) {
      supabaseUserId = await getSupabaseUserIdFromClerkId(clerkUserId);
    }

    const { data, error } = await supabase
      .from("user_visits")
      .insert({
        user_id: supabaseUserId,
        session_id: sessionId,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error starting user visit:", error);
      return sessionId;
    }

    return sessionId;
  } catch (error) {
    console.error("Error in startUserVisit:", error);
    return await getSessionId();
  }
}

/**
 * Update user visit with page view, restaurant view, or search
 */
export async function updateUserVisit(
  type: "page_view" | "restaurant_view" | "search",
): Promise<void> {
  try {
    const sessionId = await getSessionId();
    const supabase = createClerkSupabaseClient();

    const updateField =
      type === "page_view"
        ? "page_views"
        : type === "restaurant_view"
          ? "restaurants_viewed"
          : "searches_performed";

    // Find the most recent visit for this session
    const { data: visit } = await supabase
      .from("user_visits")
      .select("id")
      .eq("session_id", sessionId)
      .order("started_at", { ascending: false })
      .limit(1)
      .single();

    if (visit) {
      // Fetch current value and increment
      const { data: currentVisit } = await supabase
        .from("user_visits")
        .select(updateField)
        .eq("id", visit.id)
        .single();

      if (currentVisit) {
        const currentValue = (currentVisit as Record<string, number>)[updateField] || 0;
        const { error } = await supabase
          .from("user_visits")
          .update({
            [updateField]: currentValue + 1,
          })
          .eq("id", visit.id);

        if (error) {
          console.error(`Error updating user visit (${type}):`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error in updateUserVisit:", error);
  }
}

/**
 * Get user progress summary
 */
export async function getUserProgress(): Promise<UserProgress | null> {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return null;
    }

    const supabaseUserId = await getSupabaseUserIdFromClerkId(clerkUserId);
    if (!supabaseUserId) {
      return null;
    }

    const supabase = createClerkSupabaseClient();

    // Get total visits
    const { count: totalVisits } = await supabase
      .from("user_visits")
      .select("*", { count: "exact", head: true })
      .eq("user_id", supabaseUserId);

    // Get total restaurant views
    const { count: totalRestaurantsViewed } = await supabase
      .from("restaurant_views")
      .select("*", { count: "exact", head: true })
      .eq("user_id", supabaseUserId);

    // Get total searches
    const { count: totalSearches } = await supabase
      .from("search_queries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", supabaseUserId);

    // Get average session duration
    const { data: visits } = await supabase
      .from("user_visits")
      .select("duration_seconds")
      .eq("user_id", supabaseUserId)
      .not("duration_seconds", "is", null);

    const averageSessionDuration =
      visits && visits.length > 0
        ? visits.reduce((sum, v) => sum + (v.duration_seconds || 0), 0) /
          visits.length
        : 0;

    // Get favorite categories from restaurant views
    const { data: views } = await supabase
      .from("restaurant_views")
      .select("restaurant_id")
      .eq("user_id", supabaseUserId);

    const restaurantIds =
      views?.map((v) => v.restaurant_id) || [];
    
    let favoriteCategories: Array<{ category: string; count: number }> = [];
    if (restaurantIds.length > 0) {
      const { data: restaurants } = await supabase
        .from("restaurants")
        .select("category")
        .in("id", restaurantIds);

      const categoryCounts = new Map<string, number>();
      restaurants?.forEach((r) => {
        categoryCounts.set(
          r.category,
          (categoryCounts.get(r.category) || 0) + 1,
        );
      });

      favoriteCategories = Array.from(categoryCounts.entries()).map(
        ([category, count]) => ({ category, count }),
      );
    }

    // Get recent searches
    const { data: recentSearches } = await supabase
      .from("search_queries")
      .select("*")
      .eq("user_id", supabaseUserId)
      .order("searched_at", { ascending: false })
      .limit(10);

    // Get recent restaurant views with restaurant names
    const { data: recentViews } = await supabase
      .from("restaurant_views")
      .select("restaurant_id, viewed_at")
      .eq("user_id", supabaseUserId)
      .order("viewed_at", { ascending: false })
      .limit(10);

    const recentRestaurantViews = [];
    if (recentViews && recentViews.length > 0) {
      const viewRestaurantIds = recentViews.map((v) => v.restaurant_id);
      const { data: restaurants } = await supabase
        .from("restaurants")
        .select("id, name_en, name_ko")
        .in("id", viewRestaurantIds);

      const restaurantMap = new Map(
        restaurants?.map((r) => [r.id, r]) || [],
      );

      recentRestaurantViews.push(
        ...recentViews.map((view) => ({
          restaurant_id: view.restaurant_id,
          restaurant_name:
            restaurantMap.get(view.restaurant_id)?.name_en ||
            restaurantMap.get(view.restaurant_id)?.name_ko ||
            "Unknown",
          viewed_at: view.viewed_at,
        })),
      );
    }

    return {
      total_visits: totalVisits || 0,
      total_restaurants_viewed: totalRestaurantsViewed || 0,
      total_searches: totalSearches || 0,
      average_session_duration: Math.round(averageSessionDuration),
      favorite_categories: favoriteCategories,
      recent_searches: (recentSearches as SearchQuery[]) || [],
      recent_restaurant_views: recentRestaurantViews,
    };
  } catch (error) {
    console.error("Error in getUserProgress:", error);
    return null;
  }
}

/**
 * Get dashboard statistics (admin only)
 */
export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const supabase = getServiceRoleClient();

    // User Metrics
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: monthlyActiveUsers } = await supabase
      .from("user_visits")
      .select("user_id", { count: "exact", head: true })
      .gte("started_at", thirtyDaysAgo.toISOString())
      .not("user_id", "is", null);

    const { data: visits } = await supabase
      .from("user_visits")
      .select("duration_seconds, restaurants_viewed")
      .not("duration_seconds", "is", null);

    const averageSessionDuration =
      visits && visits.length > 0
        ? visits.reduce((sum, v) => sum + (v.duration_seconds || 0), 0) /
          visits.length
        : 0;

    const restaurantsViewedPerSession =
      visits && visits.length > 0
        ? visits.reduce((sum, v) => sum + (v.restaurants_viewed || 0), 0) /
          visits.length
        : 0;

    // Content Metrics
    const { count: totalRestaurants } = await supabase
      .from("restaurants")
      .select("*", { count: "exact", head: true });

    const { count: restaurantsWithPhotos } = await supabase
      .from("restaurant_photos")
      .select("restaurant_id", { count: "exact", head: true })
      .not("restaurant_id", "is", null);

    const { count: restaurantsWithReviews } = await supabase
      .from("restaurants")
      .select("*", { count: "exact", head: true })
      .not("naver_place_id", "is", null);

    const { count: vegetarianFriendlyCount } = await supabase
      .from("restaurants")
      .select("*", { count: "exact", head: true })
      .eq("category", "vegetarian-friendly");

    // Activity Metrics
    const { count: totalRestaurantViews } = await supabase
      .from("restaurant_views")
      .select("*", { count: "exact", head: true });

    const { count: totalSearchQueries } = await supabase
      .from("search_queries")
      .select("*", { count: "exact", head: true });

    // Popular searches
    const { data: searchData } = await supabase
      .from("search_queries")
      .select("query_text");

    const searchCounts = new Map<string, number>();
    searchData?.forEach((s) => {
      searchCounts.set(s.query_text, (searchCounts.get(s.query_text) || 0) + 1);
    });

    const popularSearches = Array.from(searchCounts.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Popular restaurants
    const { data: viewData } = await supabase
      .from("restaurant_views")
      .select("restaurant_id");

    const viewCounts = new Map<string, number>();
    viewData?.forEach((v) => {
      viewCounts.set(
        v.restaurant_id,
        (viewCounts.get(v.restaurant_id) || 0) + 1,
      );
    });

    const popularRestaurantIds = Array.from(viewCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => id);

    const { data: popularRestaurantsData } = await supabase
      .from("restaurants")
      .select("id, name_en, name_ko")
      .in("id", popularRestaurantIds);

    const popularRestaurants =
      popularRestaurantsData?.map((r) => ({
        restaurant_id: r.id,
        restaurant_name: r.name_en || r.name_ko,
        view_count: viewCounts.get(r.id) || 0,
      })) || [];

    // Views by category
    const { data: restaurantCategoryData } = await supabase
      .from("restaurants")
      .select("id, category");

    const categoryViewCounts = new Map<string, number>();
    viewData?.forEach((view) => {
      const restaurant = restaurantCategoryData?.find(
        (r) => r.id === view.restaurant_id,
      );
      if (restaurant) {
        categoryViewCounts.set(
          restaurant.category,
          (categoryViewCounts.get(restaurant.category) || 0) + 1,
        );
      }
    });

    const viewsByCategory = Array.from(categoryViewCounts.entries()).map(
      ([category, count]) => ({ category, count }),
    );

    // Daily activity (last 30 days)
    const { data: dailyVisits } = await supabase
      .from("user_visits")
      .select("started_at")
      .gte("started_at", thirtyDaysAgo.toISOString());

    const { data: dailyViews } = await supabase
      .from("restaurant_views")
      .select("viewed_at")
      .gte("viewed_at", thirtyDaysAgo.toISOString());

    const { data: dailySearches } = await supabase
      .from("search_queries")
      .select("searched_at")
      .gte("searched_at", thirtyDaysAgo.toISOString());

    const dailyActivityMap = new Map<string, { visits: number; views: number; searches: number }>();

    const addToDaily = (
      date: string,
      type: "visits" | "views" | "searches",
    ) => {
      const day = date.split("T")[0];
      if (!dailyActivityMap.has(day)) {
        dailyActivityMap.set(day, { visits: 0, views: 0, searches: 0 });
      }
      const dayData = dailyActivityMap.get(day)!;
      dayData[type]++;
    };

    dailyVisits?.forEach((v) => addToDaily(v.started_at, "visits"));
    dailyViews?.forEach((v) => addToDaily(v.viewed_at, "views"));
    dailySearches?.forEach((s) => addToDaily(s.searched_at, "searches"));

    const dailyActivity = Array.from(dailyActivityMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      total_users: totalUsers || 0,
      monthly_active_users: monthlyActiveUsers || 0,
      average_session_duration: Math.round(averageSessionDuration),
      restaurants_viewed_per_session: Math.round(restaurantsViewedPerSession * 10) / 10,
      total_restaurants: totalRestaurants || 0,
      restaurants_with_photos: restaurantsWithPhotos || 0,
      restaurants_with_reviews: restaurantsWithReviews || 0,
      vegetarian_friendly_count: vegetarianFriendlyCount || 0,
      total_restaurant_views: totalRestaurantViews || 0,
      total_search_queries: totalSearchQueries || 0,
      popular_searches: popularSearches,
      popular_restaurants: popularRestaurants,
      views_by_category: viewsByCategory,
      daily_activity: dailyActivity,
    };
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return null;
  }
}

