# Authentication Setup Guide

## ✅ Setup Complete

Your application now has a complete, production-ready authentication system with 4 user roles.

---

## 📋 Roles & Permissions

### 1. **User** (Regular User)

- Browse public projects
- View solver profiles
- Edit own profile
- **Default role for new registrations**

### 2. **Buyer** (Project Owner)

- Create and manage projects
- Assign problem solvers to projects
- Review and approve work submissions
- View project analytics
- Manage project lifecycle (OPEN → ASSIGNED → COMPLETED)

### 3. **Solver** (Problem Executor)

- Bid on available projects
- Create sub-tasks for assigned projects
- Submit deliverables via ZIP files
- View own submissions and project status

### 4. **Admin** (System Administrator)

- Manage all users
- Promote users to Buyers
- Deactivate user accounts
- View all projects and submissions
- System-wide analytics
- Role management

---

## 🔧 Key Files Modified/Created

### 1. **[src/lib/user.service.ts](src/lib/user.service.ts)**

Complete user service with:

- `createCredentialsUser()` - Register with email/password
- `createOAuthUser()` - Register with Google
- `findUserByEmail()` - Find user by email
- `findUserById()` - Find user by ID
- `verifyPassword()` - Verify password with bcrypt
- `updateUserRole()` - Admin function to change roles
- `getUsersByRole()` - Get all users with specific role
- `deactivateUser()` - Deactivate a user account

**Type definitions:**

```typescript
export type UserRole = "user" | "admin" | "buyer" | "solver";

export interface User {
  _id?: ObjectId;
  name?: string;
  email: string;
  image?: string;
  password?: string;
  role: UserRole;
  provider?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. **[src/app/api/auth/[...nextauth]/options.ts](src/app/api/auth/[...nextauth]/options.ts)**

NextAuth configuration with:

- **Credentials Provider** - Email/password login and registration
- **Google OAuth** - Google sign-in integration
- **JWT Callbacks** - Role syncing with database
- **Session Callbacks** - Adding role to user session
- **SignIn Callbacks** - OAuth first-login handling

### 3. **[src/lib/auth.utils.ts](src/lib/auth.utils.ts)** (NEW)

Helper utilities for role-based access control:

- `isRole()` - Check if user has specific role
- `hasRole()` - Check if user has any of multiple roles
- `hasPermission()` - Check if user has permission
- `isAdmin()` / `isBuyer()` / `isSolver()` - Role shortcuts
- `canManageRole()` - Check role hierarchy
- Role descriptions and permission mappings

### 4. **[src/components/site/AuthComponents/RegisterForm/RegisterForm.tsx](src/components/site/AuthComponents/RegisterForm/RegisterForm.tsx)**

Updated registration form with:

- Role selection dropdown (user, buyer, solver)
- Password validation (min 8 chars)
- Password confirmation check
- Error message display
- NextAuth integration via `signIn("credentials")`
- Automatic redirect to dashboard on success

### 5. **[src/lib/dbConnects.ts](src/lib/dbConnects.ts)**

Added collections for:

- `USERS` - User accounts
- `PROJECTS` - Project listings
- `SUBMISSIONS` - Work submissions
- `SUBTASKS` - Sub-tasks within projects
- `BIDS` - Solver bids on projects

---

## 🔐 Authentication Flow

### Registration Flow

```
User fills form → Selects role → Validates data → Calls signIn("credentials")
→ NextAuth calls createCredentialsUser() → Password hashed with bcrypt
→ User stored in MongoDB → Session created → Redirect to /dashboard
```

### Login Flow

```
User enters email/password → signIn("credentials")
→ NextAuth finds user → Verifies password → Checks isActive
→ JWT token created with role → Session established
```

### Google OAuth Flow

```
User clicks "Sign in with Google" → Google callback
→ NextAuth checks if user exists → If not, creates user with role "user"
→ Session created with role → Redirect to dashboard
```

---

## 🛠️ Usage Examples

### Check User Role in Components

```typescript
import { useSession } from "next-auth/react";
import { isAdmin, isBuyer, isSolver } from "@/lib/auth.utils";

export function Dashboard() {
  const { data: session } = useSession();

  if (isAdmin(session)) {
    // Show admin panel
  }

  if (isBuyer(session)) {
    // Show buyer dashboard
  }

  if (isSolver(session)) {
    // Show solver workspace
  }
}
```

### Protect Routes with Middleware

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export const middleware = withAuth(
  function onSuccess(req) {
    // Check role in middleware
    const role = req.nextauth.token?.role;

    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (role !== "admin") {
        return Response.redirect(new URL("/dashboard", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
```

### Update User Role (Admin Only)

```typescript
import { updateUserRole } from "@/lib/user.service";

// Promote user to buyer
await updateUserRole(userId, "buyer");

// Promote to admin
await updateUserRole(userId, "admin");
```

### Check Permissions

```typescript
import { hasPermission } from "@/lib/auth.utils";

const { data: session } = useSession();

if (hasPermission(session, "create_project")) {
  // Show create project button
}
```

---

## 📦 Environment Variables Needed

Add to `.env.local`:

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=racoflow

# NextAuth
NEXT_AUTH_SECRET=your-secret-key-here (generate with: openssl rand -base64 32)

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 🔑 Session Data Structure

After authentication, the session object contains:

```typescript
{
  user: {
    id: "ObjectId as string",
    email: "user@example.com",
    name: "John Doe",
    image: "https://...",
    role: "buyer" | "solver" | "user" | "admin"
  },
  expires: "2024-02-28T..."
}
```

Access in components:

```typescript
const { data: session } = useSession();
const userRole = session?.user?.role; // "buyer" | "solver" | "user" | "admin"
```

---

## 🚀 Next Steps

1. **Create role-based pages:**
   - `/dashboard/admin` - Admin panel
   - `/dashboard/buyer` - Buyer workspace
   - `/dashboard/solver` - Solver workspace

2. **Implement middleware** - Protect routes by role

3. **Create API endpoints** for:
   - Project management
   - Submission handling
   - Role promotion (admin only)

4. **Add role-based UI components** - Show/hide features based on role

---

## ⚠️ Security Notes

✅ **Implemented:**

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiry
- Google OAuth verification
- Role syncing with database on each request
- User status validation (isActive)

📋 **Recommended Additions:**

- Email verification on registration
- Two-factor authentication
- Rate limiting on auth endpoints
- Session timeout/refresh
- Audit logging for role changes

---

## 🐛 Troubleshooting

### "bcryptjs not found"

```bash
npm install bcryptjs
```

### Google OAuth not working

- Verify CLIENT_ID and CLIENT_SECRET are correct
- Add callback URL to Google Console: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

### "MongoError: authentication failed"

- Check MONGO_URI format
- Verify username/password in connection string
- Check IP whitelist in MongoDB Atlas

### User role not updating after role change

- User is logged out (JWT cached until expiry)
- Clear browser cookies and sign in again
- Or implement `revalidateSession()` hook

---

## 📚 References

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- [MongoDB Driver](https://www.mongodb.com/docs/drivers/node/)
- [TypeScript User Roles](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
