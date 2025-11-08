/**
 * @file naver-maps.ts
 * @description Naver Maps API client utilities
 *
 * Provides functions for interacting with Naver Maps API including geocoding,
 * reverse geocoding, and map initialization.
 */

/**
 * Naver Maps configuration
 */
export interface NaverMapsConfig {
  clientId: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

/**
 * Default map center (Seoul)
 */
export const DEFAULT_MAP_CENTER = {
  lat: 37.5665,
  lng: 126.978,
};

/**
 * Default map zoom level
 */
export const DEFAULT_MAP_ZOOM = 13;

/**
 * Get Naver Maps API client ID from environment variables
 */
export function getNaverMapsClientId(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID || "";
  }
  return process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID || "";
}

/**
 * Check if Naver Maps API is configured
 */
export function isNaverMapsConfigured(): boolean {
  return !!getNaverMapsClientId();
}

/**
 * Geocode an address to coordinates
 * Note: This would typically call Naver Maps Geocoding API
 * For now, returns a placeholder structure
 */
export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  // TODO: Implement actual Naver Maps Geocoding API call
  // This requires server-side implementation due to API key security
  console.log("Geocoding address:", address);
  return null;
}

/**
 * Reverse geocode coordinates to address
 * Note: This would typically call Naver Maps Reverse Geocoding API
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<string | null> {
  // TODO: Implement actual Naver Maps Reverse Geocoding API call
  // This requires server-side implementation due to API key security
  console.log("Reverse geocoding:", { lat, lng });
  return null;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

/**
 * Format distance for display
 */
export function formatDistance(
  distanceKm: number,
  language: "en" | "ko" = "en",
): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return language === "ko" ? `${meters}m` : `${meters}m`;
  }
  const km = distanceKm.toFixed(1);
  return language === "ko" ? `${km}km` : `${km}km`;
}
