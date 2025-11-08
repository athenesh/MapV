/**
 * @file dashboard/page.tsx
 * @description Admin dashboard with statistics and analytics
 *
 * Displays key metrics including user engagement, content statistics, and activity metrics.
 */

import { getDashboardStats } from "@/actions/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLanguage } from "@/lib/i18n";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const language = getLanguage();

  if (!stats) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          {language === "ko" ? "대시보드" : "Dashboard"}
        </h1>
        <p className="text-gray-600">
          {language === "ko" ? "통계를 불러올 수 없습니다." : "Unable to load statistics."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        {language === "ko" ? "관리자 대시보드" : "Admin Dashboard"}
      </h1>

      {/* User Metrics */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {language === "ko" ? "사용자 통계" : "User Metrics"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "ko" ? "총 사용자" : "Total Users"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.total_users}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "ko" ? "월간 활성 사용자" : "Monthly Active Users"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.monthly_active_users}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "ko" ? "평균 세션 시간" : "Avg Session Duration"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {Math.round(stats.average_session_duration / 60)}{" "}
                {language === "ko" ? "분" : "min"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "ko" ? "세션당 식당 조회" : "Restaurants per Session"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.restaurants_viewed_per_session.toFixed(1)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Metrics */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {language === "ko" ? "콘텐츠 통계" : "Content Metrics"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "ko" ? "총 식당" : "Total Restaurants"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total_restaurants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "ko" ? "사진이 있는 식당" : "With Photos"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.restaurants_with_photos}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "ko" ? "리뷰가 있는 식당" : "With Reviews"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.restaurants_with_reviews}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "ko" ? "채식 친화적" : "Vegetarian-Friendly"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.vegetarian_friendly_count}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Metrics */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {language === "ko" ? "활동 통계" : "Activity Metrics"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "ko" ? "총 식당 조회" : "Total Restaurant Views"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats.total_restaurant_views}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "ko" ? "총 검색 쿼리" : "Total Search Queries"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats.total_search_queries}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popular Searches */}
      {stats.popular_searches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === "ko" ? "인기 검색어" : "Popular Searches"}
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {stats.popular_searches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="font-medium">{search.query}</span>
                    <span className="text-sm text-gray-600">{search.count}회</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Popular Restaurants */}
      {stats.popular_restaurants.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === "ko" ? "인기 식당" : "Popular Restaurants"}
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {stats.popular_restaurants.map((restaurant) => (
                  <div
                    key={restaurant.restaurant_id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="font-medium">{restaurant.restaurant_name}</span>
                    <span className="text-sm text-gray-600">
                      {restaurant.view_count}{" "}
                      {language === "ko" ? "조회" : "views"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Views by Category */}
      {stats.views_by_category.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === "ko" ? "카테고리별 조회" : "Views by Category"}
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {stats.views_by_category.map((cat) => (
                  <div
                    key={cat.category}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="font-medium">
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
                            : "Vegetarian-Friendly"}
                    </span>
                    <span className="text-sm text-gray-600">{cat.count}회</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Daily Activity */}
      {stats.daily_activity.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === "ko" ? "일일 활동" : "Daily Activity"}
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">
                        {language === "ko" ? "날짜" : "Date"}
                      </th>
                      <th className="text-right p-2">
                        {language === "ko" ? "방문" : "Visits"}
                      </th>
                      <th className="text-right p-2">
                        {language === "ko" ? "조회" : "Views"}
                      </th>
                      <th className="text-right p-2">
                        {language === "ko" ? "검색" : "Searches"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.daily_activity.slice(-30).map((day) => (
                      <tr key={day.date} className="border-b">
                        <td className="p-2">{day.date}</td>
                        <td className="text-right p-2">{day.visits}</td>
                        <td className="text-right p-2">{day.views}</td>
                        <td className="text-right p-2">{day.searches}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

