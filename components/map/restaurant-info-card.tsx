'use client';

/**
 * @file restaurant-info-card.tsx
 * @description Restaurant info card component displayed when marker is clicked
 *
 * Shows restaurant details including basic info, menu, photos, hours, and ordering guide.
 */

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RestaurantWithDetails } from '@/types/restaurant';
import { formatRestaurantName, formatAddress, getCurrentLanguageText, type Language } from '@/lib/i18n';
import { OrderingGuide } from '../restaurants/ordering-guide';
import { NaverReviews } from '../restaurants/naver-reviews';
import { SideDishNotes } from '../restaurants/side-dish-notes';

interface RestaurantInfoCardProps {
  restaurant: RestaurantWithDetails;
  language: Language;
  onClose: () => void;
}

export function RestaurantInfoCard({ restaurant, language, onClose }: RestaurantInfoCardProps) {
  const name = formatRestaurantName(restaurant.name_en, restaurant.name_ko, language);
  const address = formatAddress(restaurant.address_en, restaurant.address_ko, language);
  const description = language === 'ko' ? restaurant.description_ko : restaurant.description_en;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-card text-card-foreground rounded-t-lg shadow-lg max-h-[85vh] overflow-y-auto md:absolute md:inset-auto md:top-4 md:right-4 md:w-96 md:max-h-[calc(100vh-2rem)] md:rounded-lg border">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b p-4 flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm text-gray-600 mt-1">{address}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
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
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                {language === 'ko' ? '반찬만 주문 가능' : 'Offers Side-Dish-Only Orders'}
              </span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Description */}
        {description && <p className="text-sm text-gray-700">{description}</p>}

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
                <div key={index} className="text-sm">
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
            <div className="grid grid-cols-2 gap-2">
              {restaurant.photos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.storage_path}
                  alt={getCurrentLanguageText({ en: photo.caption_en || '', ko: photo.caption_ko || '' }, language)}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}

        {/* Ordering Guide (for vegetarian-friendly restaurants) */}
        {restaurant.category === 'vegetarian-friendly' && (
          <OrderingGuide restaurant={restaurant} language={language} />
        )}

        {/* Naver Reviews (for vegetarian-friendly restaurants) */}
        {restaurant.category === 'vegetarian-friendly' && restaurant.naver_place_id && (
          <NaverReviews placeId={restaurant.naver_place_id} language={language} />
        )}

        {/* Side Dish Notes */}
        {restaurant.side_dish_notes && restaurant.side_dish_notes.length > 0 && (
          <SideDishNotes notes={restaurant.side_dish_notes} language={language} />
        )}
      </div>
    </div>
  );
}

