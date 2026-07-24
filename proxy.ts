import NextAuth from "next-auth";
import authConfig from "@/auth.config";

// Edge-safe: built from auth.config.ts only, so no Prisma/`pg` ends up in the
// Edge proxy bundle (see auth.config.ts for why that split exists).
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/admin/:path*"],
};
