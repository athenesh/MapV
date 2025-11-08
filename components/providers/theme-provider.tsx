/**
 * @file theme-provider.tsx
 * @description Theme provider component for dark mode support
 *
 * Wraps the next-themes ThemeProvider for dark mode functionality.
 * Note: Requires next-themes package to be installed: pnpm add next-themes
 */

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode, type ComponentProps } from "react";

type ThemeProviderProps = Omit<
  ComponentProps<typeof NextThemesProvider>,
  "children"
> & {
  children: ReactNode;
};

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
