"use client";

/**
 * @file view-toggle.tsx
 * @description Toggle between list, map, and split view modes
 *
 * Allows users to switch between different viewing modes:
 * - List: Restaurant cards in a list
 * - Map: Map view only
 * - Split: List + Map side by side (desktop only)
 */

import { LayoutList, Map, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ViewMode = "list" | "map" | "split";

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  language: "en" | "ko";
  showSplit?: boolean; // Only show split on desktop
}

export function ViewToggle({
  currentView,
  onViewChange,
  language,
  showSplit = true,
}: ViewToggleProps) {
  const views: {
    mode: ViewMode;
    icon: React.ReactNode;
    labelEn: string;
    labelKo: string;
  }[] = [
    {
      mode: "list",
      icon: <LayoutList className="h-4 w-4" />,
      labelEn: "List",
      labelKo: "목록",
    },
    {
      mode: "map",
      icon: <Map className="h-4 w-4" />,
      labelEn: "Map",
      labelKo: "지도",
    },
  ];

  if (showSplit) {
    views.push({
      mode: "split",
      icon: <LayoutGrid className="h-4 w-4" />,
      labelEn: "Split",
      labelKo: "분할",
    });
  }

  return (
    <div className="inline-flex items-center rounded-lg border bg-background p-1">
      {views.map(({ mode, icon, labelEn, labelKo }) => (
        <Button
          key={mode}
          variant={currentView === mode ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange(mode)}
          className="gap-2"
        >
          {icon}
          <span className="hidden sm:inline">
            {language === "ko" ? labelKo : labelEn}
          </span>
        </Button>
      ))}
    </div>
  );
}
