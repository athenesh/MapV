"use client";

/**
 * @file side-dish-notes.tsx
 * @description Side dish notes display component
 *
 * Displays user-generated notes about vegetarian side dishes available at restaurants.
 */

import type { SideDishNote } from "@/types/restaurant";
import type { Language } from "@/lib/i18n";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SideDishNotesProps {
  notes: SideDishNote[];
  language: Language;
}

export function SideDishNotes({ notes, language }: SideDishNotesProps) {
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

  if (notes.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-4">
      <h3 className="font-semibold mb-3">
        {language === "ko" ? "반찬 정보" : "Side Dish Information"}
      </h3>

      <div className="space-y-3">
        {notes.map((note, index) => (
          <div key={note.id} className="border rounded-lg p-3 bg-green-50">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <div className="font-medium mb-1">
                  {language === "ko"
                    ? note.side_dish_name_ko
                    : note.side_dish_name_en || note.side_dish_name_ko}
                </div>
                {(note.description_en || note.description_ko) && (
                  <div className="text-sm text-gray-600 mb-2">
                    {language === "ko"
                      ? note.description_ko
                      : note.description_en}
                  </div>
                )}
                {note.notes && (
                  <div className="text-sm text-gray-700 mb-2">{note.notes}</div>
                )}
                <div className="flex items-center gap-2">
                  {note.is_vegetarian && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                      {language === "ko" ? "채식" : "Vegetarian"}
                    </span>
                  )}
                  {note.is_vegan && (
                    <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded">
                      {language === "ko" ? "비건" : "Vegan"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Ordering phrase if available */}
            {note.ordering_phrase_ko && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">
                      {language === "ko" ? "주문 방법" : "How to Order"}
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      {note.ordering_phrase_ko}
                    </div>
                    {note.ordering_phrase_en && (
                      <div className="text-xs text-gray-500">
                        {note.ordering_phrase_en}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(note.ordering_phrase_ko!, index)
                    }
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
