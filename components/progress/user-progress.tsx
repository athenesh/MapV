/**
 * @file user-progress.tsx
 * @description User progress display component
 *
 * Displays user's progress statistics including visits, restaurants viewed, searches, etc.
 */

"use client";

import { useEffect, useState } from "react";
import { getUserProgress } from "@/actions/progress";
import type { UserProgress } from "@/types/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Language } from "@/lib/i18n";

interface UserProgressProps {
  language: Language;
}

export function UserProgress({ language }: UserProgressProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const data = await getUserProgress();
        setProgress(data);
      } catch (error) {
        console.error("Error loading user progress:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {language === "ko" ? "진행 상황" : "Your Progress"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            {language === "ko" ? "로딩 중..." : "Loading..."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!progress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {language === "ko" ? "진행 상황" : "Your Progress"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            {language === "ko"
              ? "로그인하여 진행 상황을 추적하세요."
              : "Sign in to track your progress."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === "ko" ? "진행 상황" : "Your Progress"}
        </CardTitle>
        <CardDescription>
          {language === "ko"
            ? "당신의 채식 식당 탐험 활동"
            : "Your vegetarian restaurant exploration activity"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {progress.total_visits}
            </div>
            <div className="text-sm text-gray-600">
              {language === "ko" ? "방문" : "Visits"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {progress.total_restaurants_viewed}
            </div>
            <div className="text-sm text-gray-600">
              {language === "ko" ? "식당 조회" : "Restaurants"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {progress.total_searches}
            </div>
            <div className="text-sm text-gray-600">
              {language === "ko" ? "검색" : "Searches"}
            </div>
          </div>
        </div>

        {/* Average Session Duration */}
        {progress.average_session_duration > 0 && (
          <div>
            <div className="text-sm text-gray-600 mb-1">
              {language === "ko"
                ? "평균 세션 시간"
                : "Average Session Duration"}
            </div>
            <div className="text-lg font-semibold">
              {Math.round(progress.average_session_duration / 60)}{" "}
              {language === "ko" ? "분" : "min"}
            </div>
          </div>
        )}

        {/* Favorite Categories */}
        {progress.favorite_categories.length > 0 && (
          <div>
            <div className="text-sm text-gray-600 mb-2">
              {language === "ko" ? "선호 카테고리" : "Favorite Categories"}
            </div>
            <div className="flex flex-wrap gap-2">
              {progress.favorite_categories.map((cat) => (
                <span
                  key={cat.category}
                  className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded"
                >
                  {language === "ko"
                    ? cat.category === "vegetarian"
                      ? "채식"
                      : cat.category === "vegan"
                      ? "비건"
                      : "채식 친화적"
                    : cat.category === "vegetarian"
                    ? "Vegetarian"
                    : cat.category === "vegan"
                    ? "Vegan"
                    : "Vegetarian-Friendly"}{" "}
                  ({cat.count})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {progress.recent_searches.length > 0 && (
          <div>
            <div className="text-sm font-semibold mb-2">
              {language === "ko" ? "최근 검색" : "Recent Searches"}
            </div>
            <div className="space-y-1">
              {progress.recent_searches.slice(0, 5).map((search) => (
                <div key={search.id} className="text-sm text-gray-600">
                  &quot;{search.query_text}&quot;
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Restaurant Views */}
        {progress.recent_restaurant_views.length > 0 && (
          <div>
            <div className="text-sm font-semibold mb-2">
              {language === "ko" ? "최근 조회한 식당" : "Recently Viewed"}
            </div>
            <div className="space-y-1">
              {progress.recent_restaurant_views
                .slice(0, 5)
                .map((view, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {view.restaurant_name}
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
