import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { type NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Account, Session, User } from "next-auth";
import {
  createOAuthUser,
  findUserByEmail,
  createCredentialsUser,
  verifyPassword,
  type UserRole,
} from "@/lib/user.service";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt" as const,
  },

  providers: [
    // ============ CREDENTIALS PROVIDER ============
    // Supports both login and registration flows
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
        isRegister: { label: "IsRegister", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const { email, password, name, role, isRegister } = credentials;

        // -------- REGISTRATION FLOW --------
        if (isRegister === "true") {
          if (!name) {
            throw new Error("Name is required for registration");
          }

          const validRoles: UserRole[] = ["user", "admin", "buyer", "solver"];
          const userRole = (
            validRoles.includes(role as UserRole) ? role : "user"
          ) as UserRole;

          try {
            const newUser = await createCredentialsUser({
              name,
              email,
              password,
              role: userRole,
            });

            return {
              id: newUser._id?.toString() || "",
              email: newUser.email,
              name: newUser.name,
              role: newUser.role,
            };
          } catch (error) {
            throw new Error(
              error instanceof Error ? error.message : "Registration failed",
            );
          }
        }

        // -------- LOGIN FLOW --------
        const user = await findUserByEmail(email);

        if (!user) {
          throw new Error("No account found with this email");
        }

        if (!user.password) {
          throw new Error(
            "This account was created using Google. Please sign in with Google",
          );
        }

        const isValid = await verifyPassword(user.password, password);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id?.toString() || "",
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),

    // ============ GOOGLE OAUTH PROVIDER ============
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    // ============ JWT CALLBACK ============
    // Sync user data with DB and add role to token
    async jwt({
      token,
    }: {
      token: JWT;
      user?: User | undefined;
      account?: Account | null | undefined;
    }) {
      if (!token.email) return token;

      const dbUser = await findUserByEmail(token.email);

      if (!dbUser) {
        token.id = "";
        token.role = undefined as never;
        return token;
      }

      token.id = dbUser._id?.toString() || "";
      token.role = dbUser.role;
      token.name = dbUser.name;
      token.image = dbUser.image;

      return token;
    },

    // ============ SESSION CALLBACK ============
    // Add user role and ID to session
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        const user = session.user as Record<string, unknown>;
        user.id = token.id;
        user.role = token.role as UserRole;
      }
      return session;
    },

    // ============ SIGNIN CALLBACK ============
    // Handle OAuth first-login and user creation
    async signIn({ user, account }: { user: User; account: Account | null }) {
      // Google OAuth flow
      if (account?.provider === "google") {
        if (!user.email) return false;

        const existingUser = await findUserByEmail(user.email);

        if (!existingUser) {
          try {
            await createOAuthUser({
              name: user.name || undefined,
              email: user.email,
              image: user.image || undefined,
              role: "user", // Default role for new OAuth users
              provider: "google",
            });
          } catch (error) {
            console.error("Error creating OAuth user:", error);
            return false;
          }
        }

        return true;
      }

      // Credentials flow - handled in authorize method
      return true;
    },
  },

  pages: {
    signIn: "/auth",
    error: "/auth",
  },

  secret: process.env.NEXT_AUTH_SECRET,
};
