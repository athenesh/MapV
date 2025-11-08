"use client";

/**
 * @file naver-map.tsx
 * @description Naver Maps wrapper component
 *
 * Wraps Naver Maps Web API and provides map initialization and controls.
 */

import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  getNaverMapsClientId,
} from "@/lib/naver-maps";
import type { Restaurant } from "@/types/restaurant";

declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        LatLng: new (lat: number, lng: number) => any;
        LatLngBounds: new () => any;
        Marker: new (options: any) => any;
        Point: new (x: number, y: number) => any;
        SymbolStyle: any;
        Event: {
          addListener: (
            target: any,
            event: string,
            handler: () => void,
          ) => void;
        };
        MapOptions: {
          center: any;
          zoom: number;
        };
      };
    };
  }
}

// Declare naver namespace for direct type usage
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace naver {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace maps {
    class Marker {
      constructor(options: any);
      setMap(map: any): void;
      getPosition(): any;
    }
  }
}

// Type declaration for naver.maps.MapOptions
type NaverMapOptions = {
  center: any;
  zoom: number;
};

interface NaverMapProps {
  restaurants: Restaurant[];
  onMarkerClick?: (restaurant: Restaurant) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export default function NaverMap({
  restaurants,
  onMarkerClick,
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Naver Maps script
  useEffect(() => {
    const clientId = getNaverMapsClientId();
    if (!clientId) {
      console.error("❌ Naver Maps Client ID is not configured");
      return;
    }

    console.log("🗺️ Checking Naver Maps script...");

    // Check if script is already loaded AND working
    if (window.naver?.maps?.Map) {
      console.log("✅ Naver Maps already loaded");
      setIsLoaded(true);
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector(
      `script[src*="map.naver.com"]`,
    );

    if (existingScript) {
      console.log("⏳ Naver Maps script exists, waiting for load...");
      // Script exists but might not be loaded yet
      const checkLoaded = setInterval(() => {
        if (window.naver?.maps?.Map) {
          console.log("✅ Naver Maps loaded from existing script");
          setIsLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);

      // Clear interval after 10 seconds to prevent memory leak
      setTimeout(() => clearInterval(checkLoaded), 10000);
      return;
    }

    console.log("📥 Loading Naver Maps script...");
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
    script.async = true;
    script.onload = () => {
      console.log("✅ Naver Maps script loaded successfully");
      setIsLoaded(true);
    };
    script.onerror = (error) => {
      console.error("❌ Failed to load Naver Maps script:", error);
    };
    document.head.appendChild(script);

    // DON'T remove the script on cleanup - let it persist
    // This prevents issues with React Strict Mode remounting
    return () => {
      console.log("🧹 NaverMap component unmounting (script kept for reuse)");
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.naver?.maps) {
      console.log("⏸️ Map initialization waiting:", {
        isLoaded,
        hasMapRef: !!mapRef.current,
        hasNaverMaps: !!window.naver?.maps,
      });
      return;
    }

    console.log("🗺️ Initializing map...");

    const mapOptions: NaverMapOptions = {
      center: new window.naver.maps.LatLng(center.lat, center.lng),
      zoom,
    };

    const mapInstance = new window.naver.maps.Map(mapRef.current, mapOptions);
    console.log("✅ Map instance created successfully");
    setMap(mapInstance);

    // Add current location button
    if (navigator.geolocation) {
      const locationBtn = document.createElement("button");
      locationBtn.innerHTML = "📍";
      locationBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 1000;
        padding: 10px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;
      locationBtn.onclick = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            mapInstance.setCenter(
              new window.naver.maps.LatLng(latitude, longitude),
            );
            mapInstance.setZoom(15);
          },
          (error) => {
            console.error("Error getting location:", error);
          },
        );
      };
      mapRef.current.appendChild(locationBtn);
    }
  }, [isLoaded, center, zoom]);

  // Add markers
  useEffect(() => {
    if (!map || !window.naver?.maps || restaurants.length === 0) {
      console.log("⏸️ Marker addition waiting:", {
        hasMap: !!map,
        hasNaverMaps: !!window.naver?.maps,
        restaurantCount: restaurants.length,
      });
      return;
    }

    console.log(`📍 Adding ${restaurants.length} markers to map...`);

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));
    const newMarkers: naver.maps.Marker[] = [];

    restaurants.forEach((restaurant) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(
          restaurant.latitude,
          restaurant.longitude,
        ),
        map,
        title: restaurant.name_en,
        icon: getMarkerIcon(restaurant.category),
      });

      // Add click event
      window.naver.maps.Event.addListener(marker, "click", () => {
        if (onMarkerClick) {
          onMarkerClick(restaurant);
        }
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
    console.log(`✅ ${newMarkers.length} markers added successfully`);

    // Fit map bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.naver.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        const position = marker.getPosition();
        if (position) {
          bounds.extend(position);
        }
      });
      map.fitBounds(bounds);
      console.log("✅ Map bounds adjusted to show all markers");
    }
  }, [map, restaurants, onMarkerClick]);

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[400px]">
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-gray-600 text-sm md:text-base">Loading map...</p>
        </div>
      )}
    </div>
  );
}

/**
 * Get marker icon based on restaurant category
 */
function getMarkerIcon(category: Restaurant["category"]): any {
  // Default icons - can be replaced with custom images
  const iconOptions = {
    content: getMarkerContent(category),
    anchor: new window.naver.maps.Point(12, 12),
  };

  return iconOptions;
}

/**
 * Get marker content (SVG or HTML)
 */
function getMarkerContent(category: Restaurant["category"]): string {
  const colors = {
    vegetarian: "#22c55e",
    vegan: "#16a34a",
    "vegetarian-friendly": "#84cc16",
  };

  const color = colors[category] || "#22c55e";
  const icon =
    category === "vegan"
      ? "🌿🌿"
      : category === "vegetarian-friendly"
      ? "🥗"
      : "🌿";

  return `
    <div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">
      ${icon}
    </div>
  `;
}
