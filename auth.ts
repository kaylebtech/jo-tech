import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";

// Full config (Node runtime only): adds the Credentials provider, which needs
// Prisma/`pg`. Used by the API route handler and server-side `auth()` calls —
// never imported by middleware.ts directly (see auth.config.ts for that).
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const admin = await prisma.adminUser.findUnique({ where: { email } });
        if (!admin) return null;

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) return null;

        return { id: admin.id, email: admin.email, name: admin.name ?? undefined, role: admin.role };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    // Overrides the edge-safe jwt callback with a Prisma-backed one (Node-only,
    // never loaded by proxy.ts). Re-checks the account on every request instead
    // of only at sign-in, so a deleted or role-changed admin is signed out on
    // their very next request rather than waiting for the JWT to expire.
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        return token;
      }
      if (!token.id) return token;

      const admin = await prisma.adminUser.findUnique({ where: { id: token.id as string } });
      if (!admin) return null;

      token.role = admin.role;
      return token;
    },
  },
});
