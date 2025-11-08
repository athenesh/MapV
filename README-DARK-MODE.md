/**
 * @file README-DARK-MODE.md
 * @description Dark Mode Setup Instructions
 *
 * Dark mode has been implemented but requires next-themes package to be installed.
 */

# Dark Mode Setup

Dark mode functionality has been implemented in the application. To enable it, you need to install the `next-themes` package.

## Installation

Run the following command:

```bash
pnpm add next-themes
```

## What's Already Implemented

1. **Theme Provider** (`components/providers/theme-provider.tsx`)
   - Wraps the application with next-themes ThemeProvider
   - Already integrated into `app/layout.tsx`

2. **Theme Toggle Component** (`components/theme-toggle.tsx`)
   - Button to toggle between light and dark themes
   - Already added to `components/Navbar.tsx`

3. **Dark Mode Styles**
   - Dark mode CSS variables already defined in `app/globals.css`
   - Components updated to use semantic color tokens (bg-background, bg-card, etc.)
   - Components updated:
     - `components/map/restaurant-info-card.tsx`
     - `app/page.tsx`
     - `components/restaurants/restaurant-detail-view.tsx`
     - `app/admin/restaurants/page.tsx`
     - `app/admin/dashboard/page.tsx`

## After Installation

Once `next-themes` is installed, dark mode will work automatically. The theme toggle button in the navbar will allow users to switch between light and dark themes.

## Testing

1. Install the package: `pnpm add next-themes`
2. Start the dev server: `pnpm dev`
3. Click the theme toggle button in the navbar
4. Verify that all pages switch between light and dark themes correctly

