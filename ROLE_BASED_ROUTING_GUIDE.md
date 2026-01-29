# Role-Based Routing Guide

## Overview

The application uses **NextAuth.js with JWT strategy** for authentication and **middleware** for role-based route protection.

## User Roles

| Role       | Description          | Access Routes                       |
| ---------- | -------------------- | ----------------------------------- |
| **admin**  | System Administrator | `/admin/*`, `/buyer/*`, `/solver/*` |
| **buyer**  | Project Buyer        | `/buyer/*`                          |
| **solver** | Problem Solver       | `/solver/*`                         |
| **user**   | Regular User         | `/` (home, public pages only)       |

---

## Authentication Flow

### 1. **Login/Registration**

- User submits credentials or uses Google OAuth
- `CredentialsProvider` or `GoogleProvider` authenticates
- User object is returned with role from database

### 2. **JWT Callback** (`options.ts`)

- On **initial sign-in**: Role is taken from returned `user` object
- On **subsequent requests**: Role is fetched fresh from database
- Token is populated with: `id`, `role`, `name`, `email`, `image`

```typescript
// Initial sign-in (user parameter provided)
if (user) {
  token.role = user.role; // From login response
}

// Subsequent requests (only token exists)
const dbUser = await findUserByEmail(token.email);
token.role = dbUser.role; // Fresh from database
```

### 3. **Session Callback** (`options.ts`)

- Adds `role` to the session object
- Makes role accessible in client components via `useSession()`

```typescript
session.user.role = token.role;
```

### 4. **Middleware Protection** (`middleware.ts`)

- Runs on every request to protected routes
- Checks if user's role matches the required role
- Admin has universal access (can access all routes)

---

## Protected Routes

### Admin Routes (`/admin/*`)

- **Allowed roles**: `admin` only
- **Blocked users**: `buyer`, `solver`, `user`

### Buyer Routes (`/buyer/*`)

- **Allowed roles**: `buyer`, `admin`
- **Blocked users**: `solver`, `user`

### Solver Routes (`/solver/*`)

- **Allowed roles**: `solver`, `admin`
- **Blocked users**: `buyer`, `user`

---

## Debugging Checklist

If an admin sees `/auth?error=Unauthorized`:

1. **Check database** - Does the user have `role: "admin"` in MongoDB?

   ```bash
   db.users.findOne({ email: "admin@example.com" })
   ```

2. **Check token** - Enable console logs in middleware to see role value:

   ```
   [MIDDLEWARE] Path: /admin/page, Role from token: "admin"
   ```

3. **Clear session** - Delete cookies and re-login
   - Browser > DevTools > Storage > Cookies > Delete `nextauth.*`

4. **Check environment** - Verify `NEXT_AUTH_SECRET` is set:
   ```bash
   echo $NEXT_AUTH_SECRET
   ```

---

## Common Issues & Solutions

### Issue: Admin logs in but can't access `/admin`

**Solution**: Check if database user record has `role: "admin"`

### Issue: Role showing as `undefined` in middleware

**Solution**: Re-login. Clear browser cookies and try again.

### Issue: Middleware not running

**Solution**: Route must match the `matcher` pattern in `middleware.ts`:

```typescript
matcher: [
  "/admin/:path*",
  "/buyer/:path*",
  "/solver/:path*",
  "/api/admin/:path*",
  "/api/projects/:path*",
  "/api/tasks/:path*",
],
```

---

## Testing Roles

### Test Admin Access

```
1. Login with admin account
2. Navigate to http://localhost:3001/admin
3. Should see AdminPage (not redirected)
```

### Test Buyer Access

```
1. Login with buyer account
2. Navigate to http://localhost:3001/buyer
3. Should see BuyerPage (not redirected)
3. Navigate to http://localhost:3001/admin
4. Should see /auth?error=Unauthorized
```

### Test Solver Access

```
1. Login with solver account
2. Navigate to http://localhost:3001/solver
3. Should see SolverPage (not redirected)
2. Navigate to http://localhost:3001/buyer
3. Should see /auth?error=Unauthorized
```

---

## Code Files Reference

- **Authentication Setup**: `src/app/api/auth/[...nextauth]/options.ts`
- **Route Protection**: `src/middleware.ts`
- **User Database**: `src/lib/user.service.ts`
- **Auth Utilities**: `src/lib/auth.utils.ts`
