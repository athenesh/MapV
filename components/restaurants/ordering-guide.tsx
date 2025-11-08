"use client";

/**
 * @file ordering-guide.tsx
 * @description Ordering guide component with Korean phrases
 *
 * Displays common Korean phrases for ordering vegetable-only dishes with copy-to-clipboard functionality.
 */

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@/types/restaurant";
import type { Language } from "@/lib/i18n";

interface OrderingGuideProps {
  restaurant: Restaurant;
  language: Language;
}

interface Phrase {
  ko: string;
  en: string;
  pronunciation?: string;
}

const COMMON_PHRASES: Phrase[] = [
  {
    ko: "반찬만 주세요",
    en: "Just side dishes, please",
    pronunciation: "ban-chan-man ju-se-yo",
  },
  {
    ko: "채소만 있는 비빔밥 주세요",
    en: "Bibimbap with vegetables only, please",
    pronunciation: "chae-so-man it-neun bi-bim-bap ju-se-yo",
  },
  {
    ko: "나물만 주세요",
    en: "Just seasoned vegetables, please",
    pronunciation: "na-mul-man ju-se-yo",
  },
  {
    ko: "고기 없이 주세요",
    en: "Without meat, please",
    pronunciation: "go-gi eop-si ju-se-yo",
  },
];

export function OrderingGuide({ restaurant, language }: OrderingGuideProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Combine common phrases with restaurant-specific ordering tips
  const phrases = [...COMMON_PHRASES];
  if (restaurant.ordering_tips_ko && restaurant.ordering_tips_en) {
    // Parse ordering tips if they contain phrases
    // For now, just add them as additional tips
  }

  return (
    <div className="border-t pt-4">
      <h3 className="font-semibold mb-3">
        {language === "ko" ? "주문 방법" : "How to Order"}
      </h3>

      <div className="space-y-3">
        {phrases.map((phrase, index) => (
          <div
            key={index}
            className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="text-lg font-medium mb-1">{phrase.ko}</div>
                <div className="text-sm text-gray-600 mb-1">{phrase.en}</div>
                {phrase.pronunciation && (
                  <div className="text-xs text-gray-500 italic">
                    {phrase.pronunciation}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(phrase.ko, index)}
                className="shrink-0"
              >
                {copiedIndex === index ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Restaurant-specific ordering tips */}
      {(restaurant.ordering_tips_en || restaurant.ordering_tips_ko) && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2 text-sm">
            {language === "ko" ? "이 식당 팁" : "Restaurant-Specific Tips"}
          </h4>
          <p className="text-sm text-gray-700">
            {language === "ko"
              ? restaurant.ordering_tips_ko
              : restaurant.ordering_tips_en}
          </p>
        </div>
      )}
    </div>
  );
}
