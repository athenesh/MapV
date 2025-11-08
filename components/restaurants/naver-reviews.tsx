"use client";

/**
 * @file naver-reviews.tsx
 * @description Naver reviews display component
 *
 * Fetches and displays filtered Naver reviews about side dishes (real-time, not stored).
 */

import { useEffect, useState } from "react";
import {
  getFilteredReviews,
  highlightKeywords,
  type NaverReview,
} from "@/lib/naver-local";
import type { Language } from "@/lib/i18n";

interface NaverReviewsProps {
  placeId: string;
  language: Language;
}

export function NaverReviews({ placeId, language }: NaverReviewsProps) {
  const [reviews, setReviews] = useState<NaverReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        setError(null);
        const filteredReviews = await getFilteredReviews(placeId);
        setReviews(filteredReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    }

    if (placeId) {
      fetchReviews();
    }
  }, [placeId]);

  if (loading) {
    return (
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">
          {language === "ko"
            ? "반찬 관련 리뷰"
            : "Local Reviews About Side Dishes"}
        </h3>
        <p className="text-sm text-gray-500">
          {language === "ko" ? "로딩 중..." : "Loading reviews..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">
          {language === "ko"
            ? "반찬 관련 리뷰"
            : "Local Reviews About Side Dishes"}
        </h3>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">
          {language === "ko"
            ? "반찬 관련 리뷰"
            : "Local Reviews About Side Dishes"}
        </h3>
        <p className="text-sm text-gray-500">
          {language === "ko"
            ? "반찬에 대한 리뷰를 찾을 수 없습니다."
            : "No reviews mentioning side dishes found."}
        </p>
      </div>
    );
  }

  return (
    <div className="border-t pt-4">
      <h3 className="font-semibold mb-2">
        {language === "ko"
          ? "반찬 관련 리뷰"
          : "Local Reviews About Side Dishes (반찬)"}
      </h3>
      <p className="text-xs text-gray-500 mb-3">
        {language === "ko"
          ? "Naver 리뷰 (실시간 표시)"
          : "Reviews from Naver (displayed in real-time)"}
      </p>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-3 bg-gray-50">
            <div className="flex items-start justify-between mb-2">
              {review.rating && (
                <div className="text-sm font-medium">
                  {"⭐".repeat(Math.floor(review.rating))}
                </div>
              )}
              {review.date && (
                <div className="text-xs text-gray-500">{review.date}</div>
              )}
            </div>
            <p
              className="text-sm text-gray-700"
              dangerouslySetInnerHTML={{
                __html: highlightKeywords(
                  review.content.substring(0, 200) +
                    (review.content.length > 200 ? "..." : ""),
                  review.matchedKeywords || [],
                ),
              }}
            />
            {review.url && (
              <a
                href={review.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline mt-2 inline-block"
              >
                {language === "ko" ? "전체 리뷰 보기" : "View full review"}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
