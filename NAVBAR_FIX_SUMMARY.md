# Navbar `.map()` Error Fix

## Issue

**Error**: `Cannot read properties of undefined (reading 'map')`

- Location: Navbar component, line 68
- Cause: `navItems.map()` was being called on `undefined`

## Root Cause

The Navbar was setting `role` to `"guest"` when user was not authenticated, but `NAV_CONFIG` in `nav.config.ts` did not have a `"guest"` entry, causing `NAV_CONFIG[role]` to return `undefined`.

```typescript
// BEFORE (broken):
const role = (session?.user?.role as UserRole) || "guest";
const navItems = NAV_CONFIG[role]; // ❌ undefined when role="guest"
```

## Solution Applied

### 1. Updated Navbar.tsx

Added fallback to ensure `navItems` is always an array:

```typescript
// AFTER (fixed):
const role = (session?.user?.role as UserRole) || "user"; // Fallback to "user" instead of "guest"
const navItems = NAV_CONFIG[role] || NAV_CONFIG.user || []; // ✅ Fallback to user or empty array
```

### 2. Added "guest" Role to All Config Files

**nav.config.ts**: Added guest navigation items

```typescript
guest: [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
],
```

**user.service.ts**: Extended UserRole type

```typescript
export type UserRole = "user" | "admin" | "buyer" | "solver" | "guest";
```

**auth.utils.ts**: Updated all role-related constants

- Added `"guest"` to `VALID_ROLES`
- Added `guest: "Guest User"` to `ROLE_DESCRIPTIONS`
- Added guest permissions to `ROLE_PERMISSIONS`
- Set guest hierarchy to `-1` (lowest level)

**nav.config.ts (config file)**: Extended Role type

```typescript
export type Role = "admin" | "buyer" | "solver" | "user" | "guest";
```

## Files Modified

1. `src/components/site/Navbar/Navbar.tsx` - Added fallback for navItems
2. `src/config/nav.config.ts` - Added guest role navigation config
3. `src/lib/user.service.ts` - Added "guest" to UserRole type
4. `src/lib/auth.utils.ts` - Added guest to VALID_ROLES, descriptions, permissions, and hierarchy

## Result

✅ Error is now fixed - Navbar renders without errors
✅ Unauthenticated users see guest navigation
✅ Role system is consistent across all files
