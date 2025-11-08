/**
 * @file i18n.ts
 * @description Internationalization utilities for bilingual support (English/Korean)
 *
 * Provides language detection, translation utilities, and language toggle functionality.
 */

/**
 * Supported languages
 */
export type Language = "en" | "ko";

/**
 * Language context type
 */
export interface LanguageContext {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

/**
 * Default language
 */
export const DEFAULT_LANGUAGE: Language = "en";

/**
 * Language storage key for localStorage
 */
const LANGUAGE_STORAGE_KEY = "namoolnow-language";

/**
 * Get current language from localStorage or browser preference
 */
export function getLanguage(): Language {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  // Check localStorage first
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "en" || stored === "ko") {
    return stored;
  }

  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("ko")) {
    return "ko";
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Set language in localStorage
 */
export function setLanguage(language: Language): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

/**
 * Translation dictionary
 * Add translations here as needed
 */
const translations: Record<string, Record<Language, string>> = {
  "app.title": {
    en: "NamoolNow",
    ko: "나물나우",
  },
  "restaurant.category.vegetarian": {
    en: "Vegetarian",
    ko: "채식",
  },
  "restaurant.category.vegan": {
    en: "Vegan",
    ko: "비건",
  },
  "restaurant.category.vegetarian-friendly": {
    en: "Vegetarian-Friendly",
    ko: "채식 친화적",
  },
  "restaurant.filter.all": {
    en: "All",
    ko: "전체",
  },
  "restaurant.price.budget": {
    en: "Budget-Friendly",
    ko: "저렴한",
  },
  "restaurant.price.mid-range": {
    en: "Mid-Range",
    ko: "보통",
  },
  "restaurant.price.upscale": {
    en: "Upscale",
    ko: "고급",
  },
  "ordering.guide.title": {
    en: "How to Order",
    ko: "주문 방법",
  },
  "ordering.phrase.copy": {
    en: "Copy",
    ko: "복사",
  },
  "ordering.phrase.copied": {
    en: "Copied!",
    ko: "복사됨!",
  },
};

/**
 * Translate a key to the current language
 */
export function translate(
  key: string,
  language: Language = getLanguage(),
  params?: Record<string, string>,
): string {
  const translation =
    translations[key]?.[language] ||
    translations[key]?.[DEFAULT_LANGUAGE] ||
    key;

  if (params) {
    return Object.entries(params).reduce(
      (str, [paramKey, paramValue]) =>
        str.replace(`{{${paramKey}}}`, paramValue),
      translation,
    );
  }

  return translation;
}

/**
 * Get bilingual text (returns object with en and ko)
 */
export function getBilingualText(
  en: string,
  ko: string,
): Record<Language, string> {
  return { en, ko };
}

/**
 * Get text for current language from bilingual object
 */
export function getCurrentLanguageText(
  bilingual: Record<Language, string>,
  language: Language = getLanguage(),
): string {
  return bilingual[language] || bilingual[DEFAULT_LANGUAGE] || "";
}

/**
 * Format address based on language
 */
export function formatAddress(
  addressEn: string,
  addressKo: string,
  language: Language = getLanguage(),
): string {
  return language === "ko" ? addressKo : addressEn;
}

/**
 * Format restaurant name based on language
 */
export function formatRestaurantName(
  nameEn: string,
  nameKo: string,
  language: Language = getLanguage(),
): string {
  return language === "ko" ? nameKo : nameEn;
}
