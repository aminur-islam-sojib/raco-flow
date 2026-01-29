# Complete Role-Based Authentication & Routing Flow

## 1. LOGIN/REGISTRATION FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Submits Login Form                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │  CredentialsProvider.authorize()  │
         │  (Credentials) OR GoogleProvider  │
         └───────────────┬───────────────────┘
                         │
         ┌───────────────▼───────────────────┐
         │  Find User in MongoDB by Email    │
         └───────────────┬───────────────────┘
                         │
         ┌───────────────▼─────────────────────────┐
         │  Verify Password (or OAuth redirect)    │
         └───────────────┬─────────────────────────┘
                         │
         ┌───────────────▼─────────────────────────────┐
         │  RETURN USER OBJECT WITH ROLE:             │
         │  {                                         │
         │    id: "userId",                           │
         │    email: "user@example.com",              │
         │    name: "John Doe",                       │
         │    role: "admin"  ← FROM DATABASE         │
         │  }                                         │
         └───────────────┬─────────────────────────────┘
                         │
                         ▼
```

---

## 2. JWT CALLBACK - TOKEN CREATION

```
┌──────────────────────────────────────────────────────────┐
│  jwt({ token, user, account })  ← NextAuth Callback    │
└──────────────────┬───────────────────────────────────────┘
                   │
       ┌───────────▼───────────┐
       │ Is user object passed?│  (Initial sign-in)
       └───────────┬───────────┘
                   │
      ┌────────────▼────────────┐
      │  YES: Initial sign-in   │
      └────────────┬────────────┘
      │
      │  ✅ Copy role from user object:
      │     token.role = user.role      (e.g., "admin")
      │     token.id = user.id
      │     token.email = user.email
      │     token.name = user.name
      │
      │  ✅ Return token immediately
      │     (do NOT query database)
      │
      └────────────┬────────────┐
                   │            │
      ┌────────────▼──────────┐ │
      │ NO: Subsequent request│ │  (Every page navigation)
      │ (Only token, no user) │ │
      └────────────┬──────────┘ │
                   │◄───────────┘
                   │
      ┌────────────▼──────────────────────┐
      │ Query MongoDB for fresh data:     │
      │ findUserByEmail(token.email)      │
      └────────────┬──────────────────────┘
                   │
      ┌────────────▼──────────────────────┐
      │ Update token with fresh role:     │
      │ token.role = dbUser.role          │
      │ token.id = dbUser._id             │
      │ token.name = dbUser.name          │
      └────────────┬──────────────────────┘
                   │
                   ▼
      ┌─────────────────────────────┐
      │  Return Updated Token       │
      │  {                          │
      │    role: "admin",  ← Fresh  │
      │    id: "...",              │
      │    email: "...",           │
      │    ...                      │
      │  }                          │
      └─────────────────────────────┘
```

---

## 3. SESSION CALLBACK - SESSION POPULATION

```
┌─────────────────────────────────────────────────┐
│  session({ session, token })  ← NextAuth      │
└──────────────┬──────────────────────────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │ Attach token to session: │
    │                          │
    │ session.user.role =      │
    │   token.role    ← "admin"│
    │                          │
    │ session.user.id =        │
    │   token.id               │
    └──────────────┬───────────┘
                   │
                   ▼
    ┌──────────────────────────────────────┐
    │  Return Session Object:              │
    │  {                                   │
    │    user: {                           │
    │      email: "admin@example.com",     │
    │      role: "admin",  ← Available now │
    │      id: "userId"                    │
    │    },                                │
    │    expires: "..."                    │
    │  }                                   │
    └──────────────────────────────────────┘
```

---

## 4. MIDDLEWARE PROTECTION - ROUTE CHECKING

```
┌────────────────────────────────────────────────────────────┐
│  Client requests: GET /admin/dashboard                    │
└───────────────────┬────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│  Route matches middleware matcher?                     │
│  ["/admin/:path*", "/buyer/:path*", ...]              │
└───────────────┬─────────────────────────────────────────┘
                │
    ┌───────────▼──────────┐
    │  YES: Middleware runs│
    └───────────┬──────────┘
                │
    ┌───────────▼────────────────────────────┐
    │ Extract role from token:               │
    │ const role = token?.role || ""         │
    │ // e.g., "admin"                       │
    └───────────┬────────────────────────────┘
                │
    ┌───────────▼────────────────────────────────────┐
    │ Log for debugging:                            │
    │ [MIDDLEWARE] Path: /admin/dashboard            │
    │ [MIDDLEWARE] Role from token: "admin"          │
    └───────────┬────────────────────────────────────┘
                │
    ┌───────────▼─────────────────────────────┐
    │ Check role permissions:                │
    │                                         │
    │ if (/admin && role !== "admin")         │
    │   → DENY  ✗                            │
    │                                         │
    │ if (/buyer && role !== "buyer"         │
    │     && role !== "admin")                │
    │   → DENY  ✗                            │
    │                                         │
    │ if (/solver && role !== "solver"       │
    │     && role !== "admin")                │
    │   → DENY  ✗                            │
    └───────────┬─────────────────────────────┘
                │
    ┌───────────▼───────────────┐
    │ This request: role="admin"│
    │ Path="/admin"             │
    │                           │
    │ ✅ ALLOW - Proceed        │
    └───────────┬───────────────┘
                │
                ▼
    ┌──────────────────────────┐
    │ return NextResponse.next()│
    │                          │
    │ → Page renders normally  │
    └──────────────────────────┘
```

---

## 5. DENIED ACCESS FLOW

```
┌────────────────────────────────────────────────────┐
│  Client (with role="buyer") requests:             │
│  GET /admin/dashboard                             │
└──────────────────┬─────────────────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ Extract token:               │
    │ role = "buyer" (from token)  │
    └──────────────┬───────────────┘
                   │
    ┌──────────────▼───────────────────────────┐
    │ Check: if (/admin && role !== "admin")   │
    │        if (true && "buyer" !== "admin")  │
    │        ✗ CONDITION IS TRUE               │
    └──────────────┬───────────────────────────┘
                   │
    ┌──────────────▼───────────────────────────────┐
    │ return NextResponse.redirect(                │
    │   new URL("/auth?error=Unauthorized", ...)  │
    │ )                                           │
    └──────────────┬───────────────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────────┐
    │ Browser redirects to:                    │
    │ http://localhost:3001/auth?error=Unauthorized│
    │                                          │
    │ → Shows auth page with error message     │
    └──────────────────────────────────────────┘
```

---

## 6. ROLE HIERARCHY (Admin is Superuser)

```
┌────────────────────────────────────────────┐
│           ROLE PERMISSIONS MATRIX          │
├────────────────────────────────────────────┤
│ ROLE   │ /admin │ /buyer │ /solver │ Home │
├────────┼────────┼────────┼─────────┼──────┤
│ admin  │   ✅   │   ✅   │   ✅    │  ✅  │
│ buyer  │   ❌   │   ✅   │   ❌    │  ✅  │
│ solver │   ❌   │   ❌   │   ✅    │  ✅  │
│ user   │   ❌   │   ❌   │   ❌    │  ✅  │
└────────┴────────┴────────┴─────────┴──────┘

✅ = Can access
❌ = Access denied → Redirect to /auth?error=Unauthorized
```

---

## 7. ERROR SCENARIOS

### Scenario A: Admin Token Missing Role

```
Admin logs in
↓
JWT callback runs
↓
Token created but role = undefined (BUG)
↓
Middleware sees: if (path === "/admin" && undefined !== "admin") → TRUE
↓
❌ Redirect to /auth?error=Unauthorized

FIX: Ensure role is copied from user object on initial login
```

### Scenario B: Database Role Changed

```
Buyer user is promoted to admin in database
↓
Browser still has old "buyer" token
↓
Middleware checks: if (path === "/admin" && "buyer" !== "admin") → TRUE
↓
❌ First request: Denied

Next request:
JWT callback refreshes role from DB
↓
role = "admin" (fresh from database)
✅ Access granted on second request
```

### Scenario C: Stale Session

```
User clears database role to "user"
↓
But browser still has cached "admin" token
↓
Middleware sees: if (path === "/admin" && "admin" !== "admin") → FALSE
↓
✅ Access still granted (until page reload or token refresh)

FIX: Token is refreshed every ~30 min, or user clears cookies
```

---

## Summary

| Step | Component           | Key Action                                                       |
| ---- | ------------------- | ---------------------------------------------------------------- |
| 1    | CredentialsProvider | Return user with role                                            |
| 2    | JWT Callback        | ✅ Copy role to token (initial), ✅ Refresh from DB (subsequent) |
| 3    | Session Callback    | Attach role to session.user                                      |
| 4    | Middleware          | Check role matches route requirements                            |
| 5    | Error Handler       | Redirect to /auth?error=Unauthorized if denied                   |

**The key fix:** JWT callback now handles the `user` parameter on initial login, so role is immediately available without an extra database query.
