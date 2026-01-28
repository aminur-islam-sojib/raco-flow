// components/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Use class attribute on html element for Tailwind dark mode
  // storageKey tells next-themes where to persist theme preference
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="app-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
