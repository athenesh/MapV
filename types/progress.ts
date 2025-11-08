/**
 * @file progress.ts
 * @description TypeScript type definitions for progress tracking and analytics
 *
 * This file contains interfaces for tracking user activity, restaurant views,
 * search queries, and related analytics data.
 */

/**
 * User Visit interface
 * Tracks user sessions and overall visit statistics
 */
export interface UserVisit {
  id: string;
  user_id?: string | null;
  session_id: string;
  started_at: string;
  ended_at?: string | null;
  duration_seconds?: number | null;
  page_views: number;
  restaurants_viewed: number;
  searches_performed: number;
  user_agent?: string | null;
  referrer?: string | null;
  created_at: string;
}

/**
 * Restaurant View interface
 * Tracks individual restaurant detail page views
 */
export interface RestaurantView {
  id: string;
  restaurant_id: string;
  user_id?: string | null;
  session_id: string;
  viewed_at: string;
  view_duration_seconds?: number | null;
  source?: string | null; // 'map', 'search', 'direct', etc.
  created_at: string;
}

/**
 * Search Query interface
 * Tracks search queries performed by users
 */
export interface SearchQuery {
  id: string;
  user_id?: string | null;
  session_id: string;
  query_text: string;
  filter_category?: string | null;
  results_count: number;
  searched_at: string;
  created_at: string;
}

/**
 * User Progress Summary
 * Aggregated progress data for a user
 */
export interface UserProgress {
  total_visits: number;
  total_restaurants_viewed: number;
  total_searches: number;
  average_session_duration: number;
  favorite_categories: Array<{
    category: string;
    count: number;
  }>;
  recent_searches: SearchQuery[];
  recent_restaurant_views: Array<{
    restaurant_id: string;
    restaurant_name: string;
    viewed_at: string;
  }>;
}

/**
 * Analytics Dashboard Data
 * Statistics for admin dashboard
 */
export interface DashboardStats {
  // User Metrics
  total_users: number;
  monthly_active_users: number;
  average_session_duration: number;
  restaurants_viewed_per_session: number;

  // Content Metrics
  total_restaurants: number;
  restaurants_with_photos: number;
  restaurants_with_reviews: number;
  vegetarian_friendly_count: number;

  // Activity Metrics
  total_restaurant_views: number;
  total_search_queries: number;
  popular_searches: Array<{
    query: string;
    count: number;
  }>;
  popular_restaurants: Array<{
    restaurant_id: string;
    restaurant_name: string;
    view_count: number;
  }>;

  // Time-based metrics
  views_by_category: Array<{
    category: string;
    count: number;
  }>;
  daily_activity: Array<{
    date: string;
    visits: number;
    views: number;
    searches: number;
  }>;
}

