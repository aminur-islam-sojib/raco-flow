import type { DefaultSession } from "next-auth";
import { UserRole } from "./user.service";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id?: string;
      role?: UserRole;
    };
  }

  interface User {
    id?: string;
    role?: UserRole;
    status?: string;
    createdAt?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: "ADMIN" | "BUYER" | "SOLVER";
    } & DefaultSession["user"];
  }
}
