'use client';

/**
 * @file restaurant-detail-view.tsx
 * @description Restaurant detail view component
 *
 * Client component for displaying restaurant details on a dedicated page.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RestaurantWithDetails } from '@/types/restaurant';
import type { Language } from '@/lib/i18n';
import { formatRestaurantName, formatAddress, getCurrentLanguageText, setLanguage } from '@/lib/i18n';
import { OrderingGuide } from './ordering-guide';
import { NaverReviews } from './naver-reviews';
import { SideDishNotes } from './side-dish-notes';
import { useRestaurantViewTracking } from '@/hooks/use-progress-tracking';

interface RestaurantDetailViewProps {
  restaurant: RestaurantWithDetails;
  initialLanguage: Language;
}

export function RestaurantDetailView({ restaurant, initialLanguage }: RestaurantDetailViewProps) {
  const router = useRouter();
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  
  // Track restaurant view
  useRestaurantViewTracking(restaurant.id);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ko' : 'en';
    setLanguageState(newLang);
    setLanguage(newLang);
  };

  const name = formatRestaurantName(restaurant.name_en, restaurant.name_ko, language);
  const address = formatAddress(restaurant.address_en, restaurant.address_ko, language);
  const description = language === 'ko' ? restaurant.description_ko : restaurant.description_en;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-green-600 dark:text-green-400">{name}</h1>
          <Button variant="outline" size="icon" onClick={toggleLanguage}>
            <Globe className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-card rounded-lg shadow-md p-6 space-y-6 border">
          {/* Basic Info */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{name}</h2>
            <p className="text-gray-600 mb-4">{address}</p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded">
                {language === 'ko'
                  ? restaurant.category === 'vegetarian'
                    ? '채식'
                    : restaurant.category === 'vegan'
                      ? '비건'
                      : '채식 친화적'
                  : restaurant.category === 'vegetarian'
                    ? 'Vegetarian'
                    : restaurant.category === 'vegan'
                      ? 'Vegan'
                      : 'Vegetarian-Friendly'}
              </span>
              {restaurant.offers_side_dish_only && (
                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded">
                  {language === 'ko' ? '반찬만 주문 가능' : 'Offers Side-Dish-Only Orders'}
                </span>
              )}
              {restaurant.is_verified && (
                <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded">
                  {language === 'ko' ? '검증됨' : 'Verified'}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {description && (
            <div>
              <p className="text-gray-700">{description}</p>
            </div>
          )}

          {/* Operating Hours */}
          {restaurant.operating_hours && (
            <div>
              <h3 className="font-semibold mb-2">{language === 'ko' ? '영업 시간' : 'Operating Hours'}</h3>
              <div className="text-sm space-y-1">
                {Object.entries(restaurant.operating_hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize">{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          {restaurant.price_range && (
            <div>
              <span className="text-sm font-medium">
                {language === 'ko' ? '가격대' : 'Price Range'}:{' '}
                {language === 'ko'
                  ? restaurant.price_range === 'budget'
                    ? '저렴한'
                    : restaurant.price_range === 'mid-range'
                      ? '보통'
                      : '고급'
                  : restaurant.price_range === 'budget'
                    ? 'Budget-Friendly'
                    : restaurant.price_range === 'mid-range'
                      ? 'Mid-Range'
                      : 'Upscale'}
              </span>
            </div>
          )}

          {/* Menu Items */}
          {restaurant.menu_items && restaurant.menu_items.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">{language === 'ko' ? '메뉴' : 'Menu'}</h3>
              <div className="space-y-2">
                {restaurant.menu_items.map((item, index) => (
                  <div key={index} className="text-sm border-b pb-2">
                    <div className="font-medium">
                      {language === 'ko' ? item.name_ko : item.name_en}
                    </div>
                    {item.price && <div className="text-gray-600">{item.price}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photos */}
          {restaurant.photos && restaurant.photos.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">{language === 'ko' ? '사진' : 'Photos'}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {restaurant.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.storage_path}
                    alt={getCurrentLanguageText({ en: photo.caption_en || '', ko: photo.caption_ko || '' }, language)}
                    className="w-full h-48 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Ordering Guide */}
          {restaurant.category === 'vegetarian-friendly' && (
            <OrderingGuide restaurant={restaurant} language={language} />
          )}

          {/* Naver Reviews */}
          {restaurant.category === 'vegetarian-friendly' && restaurant.naver_place_id && (
            <NaverReviews placeId={restaurant.naver_place_id} language={language} />
          )}

          {/* Side Dish Notes */}
          {restaurant.side_dish_notes && restaurant.side_dish_notes.length > 0 && (
            <SideDishNotes notes={restaurant.side_dish_notes} language={language} />
          )}
        </div>
      </div>
    </div>
  );
}

