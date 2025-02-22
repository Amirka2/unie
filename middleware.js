import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { ROUTES } from "@/core/routes";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const privateRoutes = ['/private', '/dashboard', '/profile'];

export async function middleware(req) {
  const session = await getServerSession(req, authOptions);

  if (!session && privateRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL(ROUTES.auth.signIn, req.url));
  }
}
