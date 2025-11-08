"use client";

/**
 * @file header.tsx
 * @description Yelp-inspired header with logo, search, and authentication
 *
 * Professional navigation bar with:
 * - Logo and brand name (left)
 * - Prominent search bar (center)
 * - Language toggle and auth buttons (right)
 * - Sticky positioning for always-visible navigation
 */

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Search, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";

interface HeaderProps {
  language: "en" | "ko";
  onLanguageToggle: () => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Header({
  language,
  onLanguageToggle,
  onSearch,
  searchQuery = "",
}: HeaderProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Sync local state when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      console.log("🔍 Header search submitted:", localSearchQuery);
      onSearch(localSearchQuery);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleClear = () => {
    console.log("🧹 Search cleared");
    setLocalSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleSearchIconClick = () => {
    if (onSearch && localSearchQuery) {
      console.log("🔍 Search icon clicked:", localSearchQuery);
      onSearch(localSearchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 md:h-18 items-center justify-between gap-4 px-4">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/namoolnowlogo.png"
            alt="NamoolNow"
            width={40}
            height={40}
            className="h-8 w-8 md:h-10 md:w-10"
            priority
          />
          <span className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400 hidden sm:inline">
            {language === "ko" ? "나물나우" : "NamoolNow"}
          </span>
        </Link>

        {/* Search Bar - Center */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-2xl mx-4 hidden md:block"
        >
          <div className="relative">
            <button
              type="button"
              onClick={handleSearchIconClick}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <Input
              type="text"
              placeholder={
                language === "ko"
                  ? "식당 이름, 음식 종류, 지역 검색..."
                  : "Search restaurants, cuisine, location..."
              }
              value={localSearchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-10 h-10 md:h-11"
            />
            {localSearchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Right Side - Language, Theme, Auth */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onLanguageToggle}
            className="shrink-0"
            title={language === "ko" ? "Switch to English" : "한국어로 전환"}
          >
            <Globe className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Auth Buttons */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                {language === "ko" ? "로그인" : "Log In"}
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">
                {language === "ko" ? "가입하기" : "Sign Up"}
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 md:h-9 md:w-9",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden border-t px-4 py-2">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <button
              type="button"
              onClick={handleSearchIconClick}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <Input
              type="text"
              placeholder={
                language === "ko" ? "식당 검색..." : "Search restaurants..."
              }
              value={localSearchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-10"
            />
            {localSearchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </header>
  );
}
