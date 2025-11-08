/**
 * @file naver-local.ts
 * @description Naver Local API client for fetching restaurant reviews
 *
 * Provides functions for fetching and filtering Naver reviews in real-time.
 * Note: Reviews are displayed only, never stored (per Naver API terms).
 */

/**
 * Naver review structure
 */
export interface NaverReview {
  id: string;
  content: string;
  rating?: number;
  author?: string;
  date?: string;
  url?: string;
  keywordMatches?: number;
  matchedKeywords?: string[];
}

/**
 * Review filter keywords
 */
export const REVIEW_KEYWORDS = {
  ko: ["반찬", "나물", "채소", "야채", "무침", "볶음", "샐러드"],
  en: ["vegetable", "side dish", "banchan", "namul", "salad"],
};

/**
 * Filter reviews by keywords
 */
export function filterReviewsByKeywords(reviews: NaverReview[]): NaverReview[] {
  const allKeywords = [...REVIEW_KEYWORDS.ko, ...REVIEW_KEYWORDS.en];

  return reviews
    .map((review) => {
      const content = review.content.toLowerCase();
      const matches = allKeywords.filter((keyword) =>
        content.includes(keyword.toLowerCase()),
      );
      return {
        ...review,
        keywordMatches: matches.length,
        matchedKeywords: matches,
      };
    })
    .filter((review) => review.keywordMatches > 0)
    .sort((a, b) => (b.keywordMatches || 0) - (a.keywordMatches || 0))
    .slice(0, 10); // Top 10 most relevant reviews
}

/**
 * Highlight keywords in review text
 */
export function highlightKeywords(text: string, keywords: string[]): string {
  let highlighted = text;
  keywords.forEach((keyword) => {
    const regex = new RegExp(`(${keyword})`, "gi");
    highlighted = highlighted.replace(regex, "<mark>$1</mark>");
  });
  return highlighted;
}

/**
 * Fetch reviews from Naver Local API
 * Note: This requires server-side implementation due to API key security
 * This is a placeholder structure
 */
export async function fetchNaverReviews(
  placeId: string,
): Promise<NaverReview[]> {
  // TODO: Implement actual Naver Local API call
  // This must be done server-side (Server Action or API Route)
  // to protect API keys

  console.log("Fetching Naver reviews for place:", placeId);

  // Placeholder return - actual implementation needed
  return [];
}

/**
 * Get filtered reviews for a restaurant
 */
export async function getFilteredReviews(
  placeId: string,
): Promise<NaverReview[]> {
  const reviews = await fetchNaverReviews(placeId);
  return filterReviewsByKeywords(reviews);
}
