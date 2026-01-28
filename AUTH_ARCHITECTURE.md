# 🔐 RacoFlow Authentication Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     RACOFLOW AUTHENTICATION SYSTEM                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────┐          ┌──────────────────┐                 │
│  │  Frontend Apps  │          │  External OAuth  │                 │
│  │  (React/Next.js)│          │   (Google)       │                 │
│  └────────┬────────┘          └────────┬─────────┘                 │
│           │                            │                            │
│           └────────────────┬───────────┘                            │
│                            ▼                                        │
│           ┌───────────────────────────────────┐                    │
│           │  NextAuth.js (API Routes)        │                    │
│           │  /api/auth/[...nextauth]         │                    │
│           │                                   │                    │
│           │  ├─ Credentials Provider          │                    │
│           │  ├─ Google OAuth Provider         │                    │
│           │  ├─ JWT Callbacks                 │                    │
│           │  └─ Session Callbacks             │                    │
│           └───────────┬───────────────────────┘                    │
│                       │                                             │
│                       ▼                                             │
│           ┌───────────────────────────────────┐                    │
│           │   User Service Functions         │                    │
│           │   (src/lib/user.service.ts)      │                    │
│           │                                   │                    │
│           │  ├─ createCredentialsUser()      │                    │
│           │  ├─ createOAuthUser()            │                    │
│           │  ├─ findUserByEmail()            │                    │
│           │  ├─ verifyPassword()             │                    │
│           │  └─ updateUserRole()             │                    │
│           └───────────┬───────────────────────┘                    │
│                       │                                             │
│                       ▼                                             │
│           ┌───────────────────────────────────┐                    │
│           │      MongoDB Database             │                    │
│           │                                   │                    │
│           │  Collections:                    │                    │
│           │  ├─ users (documents with role) │                    │
│           │  ├─ projects                    │                    │
│           │  ├─ submissions                 │                    │
│           │  ├─ subtasks                    │                    │
│           │  └─ bids                        │                    │
│           └───────────────────────────────────┘                    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flows

### 1️⃣ Email/Password Registration Flow

```
User                          Frontend                    Backend
 │                               │                          │
 ├─ Fill form                    │                          │
 │  (name, email, password)      │                          │
 │                               │                          │
 └──────────────────────────────>│                          │
                                 │   POST /api/auth/signin  │
                                 │ (signIn with credentials)│
                                 ├─────────────────────────>│
                                 │                          │
                                 │              Validate    │
                                 │              Hash pwd    │
                                 │              Create user │
                                 │              in MongoDB  │
                                 │                          │
                                 │      JWT Token Created   │
                                 │<─────────────────────────┤
                                 │                          │
                  Set session    │                          │
                  & redirect     │                          │
 <──────────────────────────────┤                          │
 │                               │                          │
 └─> /dashboard (authenticated) │                          │
```

### 2️⃣ Email/Password Login Flow

```
User                          Frontend                    Backend
 │                               │                          │
 ├─ Enter email/password         │                          │
 │                               │                          │
 └──────────────────────────────>│                          │
                                 │   POST /api/auth/signin  │
                                 │ (signIn with credentials)│
                                 ├─────────────────────────>│
                                 │                          │
                                 │         Find user        │
                                 │         Verify password  │
                                 │         (bcrypt)         │
                                 │         Get role from DB │
                                 │                          │
                                 │      JWT Token with role │
                                 │<─────────────────────────┤
                                 │                          │
                  Set session    │                          │
                  & redirect     │                          │
 <──────────────────────────────┤                          │
 │                               │                          │
 └─> /dashboard (authenticated) │                          │
     with role included          │                          │
```

### 3️⃣ Google OAuth Flow

```
User                          Frontend                    Backend
 │                               │                          │
 ├─ Click "Sign in with Google"  │                          │
 │                               │                          │
 └──────────────────────────────>│                          │
                                 │   Redirect to Google    │
                                 ├─────────────────────────>│
                                 │                          │ (Google servers)
                                 │                          │
                  User authenticates with Google            │
                                 │                          │
                                 │     Return auth code    │
                                 │<─────────────────────────┤
                                 │                          │
                                 │   Exchange code for JWT  │
                                 │   + user info            │
                                 ├─────────────────────────>│
                                 │                          │
                                 │         Check if user    │
                                 │         exists in DB     │
                                 │                          │
                                 │         If new: create   │
                                 │         with role="user" │
                                 │                          │
                                 │      JWT Token Created   │
                                 │<─────────────────────────┤
                                 │                          │
                  Set session    │                          │
                  & redirect     │                          │
 <──────────────────────────────┤                          │
 │                               │                          │
 └─> /dashboard (authenticated) │                          │
```

---

## Role Hierarchy & Permissions

```
┌──────────────────────────────────────────────────────────────┐
│                    ROLE HIERARCHY                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ADMIN (Level 3) ──────────────────────────────────────┐   │
│  • Manage all users                                    │   │
│  • Promote/demote roles                                │   │
│  • View all projects/submissions                       │   │
│  • System analytics                                    │   │
│                                                         │   │
│         ├─────────────────────────────────────────────┘   │
│         │                                                   │
│  BUYER (Level 2) ────────────────────────────────────┐    │
│  • Create projects                                    │    │
│  • Assign solvers                                     │    │
│  • Review work                                        │    │
│  • Approve submissions                                │    │
│                                                        │    │
│         ├──────────────────────────────────────────┐     │
│         │                                           │     │
│  SOLVER (Level 1) ──────────────────────────────┐  │     │
│  • Bid on projects                              │  │     │
│  • Create subtasks                              │  │     │
│  • Submit deliverables                          │  │     │
│                                                 │  │     │
│         ├─────────────────────────────────────┐ │  │     │
│         │                                      │ │  │     │
│  USER (Level 0)                                │ │  │     │
│  • Browse projects                             │ │  │     │
│  • View profiles                               │ │  │     │
│  • Edit own profile                            │ │  │     │
│         │                                      │ │  │     │
│         └──────────────────────────────────────┘ │  │     │
│                                                   │  │     │
└───────────────────────────────────────────────────┘──┘──┘
```

---

## JWT Token Structure

```
┌─────────────────────────────────────────────────────────┐
│                    JWT TOKEN                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Header:                                                │
│  {                                                      │
│    "alg": "HS256",                                     │
│    "typ": "JWT"                                        │
│  }                                                      │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Payload:                                               │
│  {                                                      │
│    "id": "507f1f77bcf86cd799439011",  ← User ID       │
│    "email": "user@example.com",                        │
│    "name": "John Doe",                                 │
│    "image": "https://...",                             │
│    "role": "buyer",  ◄── Key field for RBAC           │
│    "iat": 1234567890,                                  │
│    "exp": 1234654290   ◄── Expires in 30 days         │
│  }                                                      │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Signature:                                             │
│  HMACSHA256(base64(header) + "." + base64(payload),    │
│            NEXT_AUTH_SECRET)                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Users Collection

```
db.users
│
├─ _id (ObjectId)                    ← Unique identifier
├─ name (String)                     ← User full name
├─ email (String, unique)            ← Login email
├─ password (String, hashed)         ← bcrypt hash
├─ image (String, optional)          ← Avatar URL
├─ role (String)                     ← "user"|"buyer"|"solver"|"admin"
├─ provider (String)                 ← "credentials"|"google"
├─ isActive (Boolean)                ← Account status
├─ createdAt (Date)                  ← Registration timestamp
└─ updatedAt (Date)                  ← Last update timestamp

Example document:
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$abcdef...", ← bcrypt hash
  "image": "https://example.com/avatar.jpg",
  "role": "buyer",
  "provider": "credentials",
  "isActive": true,
  "createdAt": ISODate("2024-01-20T12:00:00Z"),
  "updatedAt": ISODate("2024-01-25T15:30:00Z")
}
```

---

## Session Management

### Session Lifecycle

```
1. User authenticates
   ↓
2. JWT token created with role
   ↓
3. Token stored in HTTP-only cookie
   ↓
4. Session object created { user: { id, email, role } }
   ↓
5. Token synced with DB on each request (JWT callback)
   ↓
6. Role checked on component/API level (RBAC)
   ↓
7. On logout: cookie deleted, session cleared
   ↓
8. On token expiry: user redirected to login
```

### Session Access Points

```
Client-Side:
├─ useSession() hook (React)
├─ session.user.id
├─ session.user.role
└─ session.user.email

Server-Side:
├─ getServerSession() (API routes)
├─ req.nextauth.token
├─ req.nextauth.token.role
└─ req.nextauth.token.id

Middleware:
├─ req.nextauth.token
├─ req.nextauth.token.role
└─ withAuth wrapper
```

---

## Security Flow

```
┌──────────────────────────────────────────────────────────┐
│           PASSWORD SECURITY (Registration)              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  User Password Input: "MyPassword123"                   │
│         │                                               │
│         ▼                                               │
│  Validation:                                             │
│  ├─ Min 8 characters ✓                                 │
│  ├─ Matches confirmation ✓                             │
│  └─ Not empty ✓                                        │
│         │                                               │
│         ▼                                               │
│  bcrypt.hash(password, 10)                             │
│         │                                               │
│         ▼                                               │
│  Hashed: "$2a$10$abcdefghijklmnopqrstuvwxyzABCD"      │
│         │                                               │
│         ▼                                               │
│  MongoDB: user.password = hashed_value                 │
│         │                                               │
│         └─> Original password never stored             │
│                                                         │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│            PASSWORD VERIFICATION (Login)                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  User Password Input: "MyPassword123"                   │
│         │                                               │
│         ▼                                               │
│  bcrypt.compare(input, stored_hash)                    │
│         │                                               │
│         ▼                                               │
│  ├─ Match ✓ → Create JWT → Grant access               │
│  └─ No match ✗ → Error message → Deny access          │
│                                                         │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│          ROLE-BASED ACCESS CONTROL (RBAC)              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. User requests protected resource                   │
│  2. Check JWT token exists                             │
│  3. Extract role from token                            │
│  4. Check permission matrix:                           │
│     ├─ User → ["view_profile", "edit_profile"]        │
│     ├─ Buyer → [..., "create_project"]                │
│     ├─ Solver → [..., "submit_deliverables"]          │
│     └─ Admin → [..., "manage_users"]                  │
│  5. Allow or deny access                              │
│                                                         │
└──────────────────────────────────────────────────────────┘
```

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           ├── route.ts          ← NextAuth handler
│   │           └── options.ts        ← Config (JWT, callbacks)
│   └── auth/
│       └── page.tsx                  ← Login/Register page
│
├── components/
│   └── site/
│       └── AuthComponents/
│           ├── auth-form.tsx         ← Form wrapper
│           ├── LoginForm/
│           │   └── LoginForm.tsx     ← Login component
│           └── RegisterForm/
│               └── RegisterForm.tsx  ← Register component (UPDATED)
│
└── lib/
    ├── dbConnects.ts                 ← MongoDB connection (UPDATED)
    ├── user.service.ts               ← User operations (UPDATED)
    ├── auth.utils.ts                 ← RBAC helpers (NEW)
    └── mongodb.ts                    ← MongoDB client
```

---

## Integration Checklist

- [x] User service with 4 roles
- [x] NextAuth configuration
- [x] Credentials provider
- [x] Google OAuth provider
- [x] JWT token with role
- [x] Session management
- [x] Password hashing (bcrypt)
- [x] Registration form with role selection
- [x] RBAC utilities (auth.utils.ts)
- [x] Role hierarchy system
- [x] Permission matrix
- [x] Database schema
- [ ] Middleware for route protection
- [ ] Role-specific dashboard pages
- [ ] Admin user management panel
- [ ] Email verification
- [ ] Password reset flow

---

## Quick Commands

```bash
# Generate NEXT_AUTH_SECRET
openssl rand -base64 32

# Check if user exists in MongoDB
mongo "mongodb+srv://..." --eval "db.users.findOne({email: 'user@example.com'})"

# Test password verification
npm install bcryptjs
node -e "const bcrypt = require('bcryptjs'); bcrypt.compare('password', '$2a$...').then(r => console.log(r))"

# Clear sessions (development)
rm -rf .next/cache

# View JWT token
# Use jwt.io website or: node -e "console.log(require('base64-js').toByteArray(token_part))"
```

---

This architecture ensures a **secure, scalable, and maintainable** authentication system for RacoFlow! 🔐🚀
