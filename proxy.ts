import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const protectedRoutes = ['/'];
const authRoutes = ['/login', '/signup'];

export default async function proxy(request: NextRequest) {
    const sessionCookie = await auth.api.getSession({
        headers: request.headers,
    });
    const pathname = request.nextUrl.pathname;

    // Check auth routes first - logged in users get redirected to home
    if (
        sessionCookie &&
        authRoutes.some((route) => pathname.startsWith(route))
    ) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Not logged in trying to access protected route -> redirect to login
    // Use exact match for '/' to avoid matching all paths
    if (
        !sessionCookie &&
        protectedRoutes.some((route) =>
            route === '/' ? pathname === '/' : pathname.startsWith(route)
        )
    ) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/signup'],
};
