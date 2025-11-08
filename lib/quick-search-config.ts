/**
 * @file quick-search-config.ts
 * @description Configuration for quick search buttons
 *
 * Defines button configurations for quick discovery of:
 * - Popular Korean dishes
 * - Restaurant features
 * - Help and guides
 */

import type { RestaurantCategory } from "@/types/restaurant";

export type QuickSearchActionType = "search" | "filter" | "navigate";

export interface QuickSearchAction {
  type: QuickSearchActionType;
  value: string | {
    category?: RestaurantCategory;
    priceRange?: "budget" | "mid-range" | "upscale";
    sideDishOnly?: boolean;
    verified?: boolean;
  };
}

export interface QuickSearchButton {
  id: string;
  icon: string;
  labelEn: string;
  labelKo: string;
  descriptionEn?: string;
  descriptionKo?: string;
  action: QuickSearchAction;
  colorClass: string; // Tailwind classes for styling
  category: "dish" | "feature" | "help";
}

export const quickSearchButtons: QuickSearchButton[] = [
  // Dishes - Blue/Purple tones
  {
    id: "bibimbap",
    icon: "🍚",
    labelEn: "Bibimbap",
    labelKo: "비빔밥",
    descriptionEn: "Mixed rice bowl",
    descriptionKo: "섞은 밥",
    action: {
      type: "search",
      value: "bibimbap",
    },
    colorClass: "bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800",
    category: "dish",
  },
  {
    id: "tofu",
    icon: "🍲",
    labelEn: "Tofu Stew",
    labelKo: "순두부",
    descriptionEn: "Soft tofu stew",
    descriptionKo: "부드러운 두부찌개",
    action: {
      type: "search",
      value: "tofu",
    },
    colorClass: "bg-purple-100 text-purple-900 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100 dark:hover:bg-purple-800",
    category: "dish",
  },
  {
    id: "temple-food",
    icon: "🥗",
    labelEn: "Temple Food",
    labelKo: "사찰음식",
    descriptionEn: "Buddhist cuisine",
    descriptionKo: "불교 요리",
    action: {
      type: "filter",
      value: { category: "vegetarian" },
    },
    colorClass: "bg-indigo-100 text-indigo-900 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-100 dark:hover:bg-indigo-800",
    category: "dish",
  },
  {
    id: "japchae",
    icon: "🍜",
    labelEn: "Japchae",
    labelKo: "잡채",
    descriptionEn: "Glass noodles",
    descriptionKo: "당면",
    action: {
      type: "search",
      value: "japchae",
    },
    colorClass: "bg-violet-100 text-violet-900 hover:bg-violet-200 dark:bg-violet-900 dark:text-violet-100 dark:hover:bg-violet-800",
    category: "dish",
  },
  
  // Features - Green tones (brand color)
  {
    id: "side-dishes",
    icon: "🥬",
    labelEn: "Side-dishes Only",
    labelKo: "반찬만",
    descriptionEn: "Restaurants offering side-dishes only",
    descriptionKo: "반찬만 주문 가능",
    action: {
      type: "filter",
      value: { sideDishOnly: true },
    },
    colorClass: "bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800",
    category: "feature",
  },
  {
    id: "vegan",
    icon: "🌱",
    labelEn: "Vegan Only",
    labelKo: "비건",
    descriptionEn: "100% vegan restaurants",
    descriptionKo: "완전 채식",
    action: {
      type: "filter",
      value: { category: "vegan" },
    },
    colorClass: "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800",
    category: "feature",
  },
  {
    id: "budget",
    icon: "💰",
    labelEn: "Budget",
    labelKo: "저렴한",
    descriptionEn: "Budget-friendly options",
    descriptionKo: "저렴한 음식점",
    action: {
      type: "filter",
      value: { priceRange: "budget" },
    },
    colorClass: "bg-teal-100 text-teal-900 hover:bg-teal-200 dark:bg-teal-900 dark:text-teal-100 dark:hover:bg-teal-800",
    category: "feature",
  },
  {
    id: "verified",
    icon: "✅",
    labelEn: "Verified",
    labelKo: "검증됨",
    descriptionEn: "Verified restaurants",
    descriptionKo: "검증된 식당",
    action: {
      type: "filter",
      value: { verified: true },
    },
    colorClass: "bg-lime-100 text-lime-900 hover:bg-lime-200 dark:bg-lime-900 dark:text-lime-100 dark:hover:bg-lime-800",
    category: "feature",
  },
  
  // Help - Orange/Yellow tones
  {
    id: "ordering-guide",
    icon: "🗣️",
    labelEn: "How to Order",
    labelKo: "주문 방법",
    descriptionEn: "Korean ordering phrases",
    descriptionKo: "한국어 주문 문구",
    action: {
      type: "navigate",
      value: "/ordering-guide",
    },
    colorClass: "bg-orange-100 text-orange-900 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-100 dark:hover:bg-orange-800",
    category: "help",
  },
];

// Helper to get buttons by category
export function getButtonsByCategory(category: QuickSearchButton["category"]) {
  return quickSearchButtons.filter((btn) => btn.category === category);
}

// Get all dish buttons
export const dishButtons = getButtonsByCategory("dish");

// Get all feature buttons
export const featureButtons = getButtonsByCategory("feature");

// Get all help buttons
export const helpButtons = getButtonsByCategory("help");

