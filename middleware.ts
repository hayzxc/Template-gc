export { auth as middleware } from "@/auth";

export const config = {
  // Prisma + bcrypt (via @/auth) require the Node.js runtime, not Edge.
  runtime: "nodejs",
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
