import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, applicationDefault } from "firebase-admin/app";

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

export async function middleware(req) {
  const token = req.cookies.token;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    await getAuth().verifyIdToken(token);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: '/hospitals/:path*', 
};
