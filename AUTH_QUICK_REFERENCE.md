# 🔐 Authentication & Authorization Quick Reference

## Quick Start

### 1. Get Current User Session in Components

```typescript
import { useSession } from "next-auth/react";
import { getUserRole } from "@/lib/auth.utils";

export function MyComponent() {
  const { data: session } = useSession();
  const role = getUserRole(session);

  console.log(role); // "user" | "buyer" | "solver" | "admin" | null
}
```

### 2. Check User Role

```typescript
import { useSession } from "next-auth/react";
import { isAdmin, isBuyer, isSolver, isRole } from "@/lib/auth.utils";

export function Dashboard() {
  const { data: session } = useSession();

  if (isAdmin(session)) return <AdminDashboard />;
  if (isBuyer(session)) return <BuyerDashboard />;
  if (isSolver(session)) return <SolverDashboard />;
  return <UserDashboard />;
}
```

### 3. Check Permissions

```typescript
import { useSession } from "next-auth/react";
import { hasPermission } from "@/lib/auth.utils";

export function CreateProjectButton() {
  const { data: session } = useSession();

  if (!hasPermission(session, "create_project")) {
    return null; // Or show disabled button
  }

  return <button>Create Project</button>;
}
```

### 4. Sign In User

```typescript
import { signIn } from "next-auth/react";

async function handleLogin(email: string, password: string) {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false, // Don't redirect automatically
  });

  if (result?.ok) {
    // User signed in successfully
  }
}
```

### 5. Register New User

```typescript
import { signIn } from "next-auth/react";

async function handleRegister(
  name: string,
  email: string,
  password: string,
  role: "user" | "buyer" | "solver",
) {
  const [fname, lname] = name.split(" ");

  const result = await signIn("credentials", {
    name: `${fname} ${lname}`,
    email,
    password,
    role,
    isRegister: "true",
    redirect: false,
  });

  if (result?.ok) {
    // User registered and signed in
  }
}
```

### 6. Sign Out User

```typescript
import { signOut } from "next-auth/react";

async function handleLogout() {
  await signOut({ redirect: true, callbackUrl: "/auth" });
}
```

---

## Session Object Structure

```typescript
{
  user: {
    id: "507f1f77bcf86cd799439011",      // MongoDB ObjectId as string
    email: "user@example.com",
    name: "John Doe",
    image: "https://...",
    role: "buyer" | "solver" | "user" | "admin"
  },
  expires: "2024-02-28T12:00:00.000Z"
}
```

---

## Role Permissions Matrix

| Permission          | User | Buyer | Solver | Admin |
| ------------------- | ---- | ----- | ------ | ----- |
| view_profile        | ✅   | ✅    | ✅     | ✅    |
| edit_profile        | ✅   | ✅    | ✅     | ✅    |
| create_project      | ❌   | ✅    | ❌     | ✅    |
| assign_solver       | ❌   | ✅    | ❌     | ✅    |
| review_submissions  | ❌   | ✅    | ❌     | ✅    |
| submit_deliverables | ❌   | ❌    | ✅     | ❌    |
| manage_users        | ❌   | ❌    | ❌     | ✅    |
| promote_user_role   | ❌   | ❌    | ❌     | ✅    |

---

## API Usage Examples

### Get User by Email

```typescript
import { findUserByEmail } from "@/lib/user.service";

const user = await findUserByEmail("user@example.com");
if (user) {
  console.log(user.role); // "buyer" | "solver" | "user" | "admin"
}
```

### Get User by ID

```typescript
import { findUserById } from "@/lib/user.service";

const user = await findUserById(userId);
```

### Get All Users with Specific Role

```typescript
import { getUsersByRole } from "@/lib/user.service";

const buyers = await getUsersByRole("buyer");
const solvers = await getUsersByRole("solver");
```

### Promote User to Admin (Admin Only)

```typescript
import { updateUserRole } from "@/lib/user.service";

await updateUserRole(userId, "admin");
```

### Deactivate User (Admin Only)

```typescript
import { deactivateUser } from "@/lib/user.service";

await deactivateUser(userId);
```

---

## Protected Route Examples

### Client-Side Route Protection

```typescript
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isBuyer } from "@/lib/auth.utils";
import { useEffect } from "react";

export default function BuyerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
    if (status === "authenticated" && !isBuyer(session)) {
      router.push("/dashboard");
    }
  }, [status, session]);

  if (status === "loading") return <div>Loading...</div>;

  return <div>Buyer Dashboard Content</div>;
}
```

### Server-Side Route Protection

```typescript
// app/api/projects/create/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { hasPermission } from "@/lib/auth.utils";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session, "create_project")) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Handle the request
  const data = await req.json();
  // ... create project logic
}
```

---

## Middleware Example

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export const middleware = withAuth(
  function onSuccess(req: NextRequest) {
    const role = req.nextauth.token?.role;

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
      return Response.redirect(new URL("/dashboard", req.url));
    }

    // Protect buyer routes
    if (
      req.nextUrl.pathname.startsWith("/buyer") &&
      !["buyer", "admin"].includes(role as string)
    ) {
      return Response.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/buyer/:path*", "/solver/:path*"],
};
```

---

## Error Handling

### Registration Errors

```typescript
const result = await signIn("credentials", {
  email,
  password,
  name,
  role: "buyer",
  isRegister: "true",
  redirect: false,
});

if (result?.error) {
  // Possible errors:
  // "Name is required for registration"
  // "User with this email already exists"
  // "Password must be at least 8 characters"
  console.error("Registration error:", result.error);
}
```

### Login Errors

```typescript
const result = await signIn("credentials", {
  email,
  password,
  redirect: false,
});

if (result?.error) {
  // Possible errors:
  // "Email and password are required"
  // "No account found with this email"
  // "Incorrect password"
  // "This account was created using Google..."
  console.error("Login error:", result.error);
}
```

---

## Environment Variables

```env
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=racoflow

# NextAuth
NEXT_AUTH_SECRET=your-secret-key-here
NEXT_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

Generate NEXT_AUTH_SECRET:

```bash
openssl rand -base64 32
```

---

## Common Tasks

### 1. Create Admin User

```typescript
import { createCredentialsUser } from "@/lib/user.service";

const admin = await createCredentialsUser({
  name: "Admin User",
  email: "admin@example.com",
  password: "securePassword123",
  role: "admin",
});
```

### 2. Check User Permissions

```typescript
import { hasRole, hasPermission } from "@/lib/auth.utils";

// Check specific role
if (hasRole(session, ["buyer", "admin"])) {
  // User is buyer or admin
}

// Check specific permission
if (hasPermission(session, "create_project")) {
  // User can create projects
}
```

### 3. Update User Role Safely

```typescript
import { updateUserRole, ROLE_HIERARCHY } from "@/lib/auth.utils";

// Only allow promotion by higher-level user
if (ROLE_HIERARCHY[adminRole] > ROLE_HIERARCHY[targetRole]) {
  await updateUserRole(userId, "buyer");
}
```

---

## Testing Authentication

### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Test Google OAuth

Visit: `http://localhost:3000/api/auth/signin`

---

## Debugging Tips

1. **Check JWT Token**

```typescript
const { data: session } = useSession();
console.log(session?.user); // View current user data
```

2. **Enable Debug Mode**

```typescript
// In options.ts
debug: process.env.NODE_ENV === "development",
```

3. **Check MongoDB**

```bash
db.users.findOne({ email: "user@example.com" })
```

4. **Monitor Network** - Check browser DevTools > Network tab for auth requests

---

## Security Checklist

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with expiry (30 days)
- ✅ Role-based access control
- ✅ Session validation on each request
- ❓ Email verification (not yet implemented)
- ❓ Two-factor authentication (not yet implemented)
- ❓ Rate limiting (not yet implemented)
