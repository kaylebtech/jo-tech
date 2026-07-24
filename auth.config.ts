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
  },
} satisfies NextAuthConfig;
