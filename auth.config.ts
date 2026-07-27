import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no providers that touch Prisma/Node APIs live here,
// so this can be imported by middleware.ts without pulling `pg` into the Edge bundle.
export default {
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    authorized: ({ auth, request }) => {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isLoginRoute = request.nextUrl.pathname.startsWith("/admin/login");
      if (!isAdminRoute || isLoginRoute) return true;
      return !!auth?.user;
    },
    // Runs in both the Edge proxy and the full Node auth instance — must stay
    // free of Prisma/Node-only code. On sign-in `user` carries the fields
    // returned by authorize() in auth.ts; on every later request it's
    // undefined and this just passes the existing token through.
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role!;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
