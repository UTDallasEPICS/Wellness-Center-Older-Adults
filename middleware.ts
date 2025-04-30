import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { loginRedirectUrl } from './app/api/auth/auth0';
import { jwtVerify, importX509 } from 'jose';

export async function middleware(request: NextRequest) {
    try {
        const cvtoken = request.cookies.get('cvtoken')?.value;
        const pathname = request.nextUrl.pathname;

        if (!cvtoken && pathname !== '/') {
            console.log(`No cvtoken found for protected route: ${pathname}. Redirecting to login.`);
            return NextResponse.redirect(loginRedirectUrl(), { status: 302 });
        } else if (cvtoken) {
            const certPem = process.env.CERT_PEM;
            if (!certPem) {
                console.error('Middleware Error: CERT_PEM environment variable not found.');
                const response = NextResponse.next();
                response.cookies.delete('cvtoken');
                response.cookies.delete('cvuser');
                return NextResponse.redirect(loginRedirectUrl(), { status: 302 });
            }

            let key;
            try {
                key = await importX509(certPem, 'RS256');
            } catch (error) {
                console.error('Middleware Error: Error importing certificate:', error);
                const response = NextResponse.next();
                response.cookies.delete('cvtoken');
                response.cookies.delete('cvuser');
                return NextResponse.redirect(loginRedirectUrl(), { status: 302 });
            }

            try {
                await jwtVerify(cvtoken, key);
                // Token is valid, allow the request to proceed
                return NextResponse.next();
            } catch (err) {
                console.error("Middleware Warning: Token verification failed:", err);
                // DO NOT redirect here. Just log the error and allow the request to proceed.
                // The API route or page will handle the missing/invalid session if needed.
                return NextResponse.next();
            }
        }

        // If no cvtoken and it's the landing page, allow access
        return NextResponse.next();

    } catch (err) {
        console.error("Middleware Critical Error:", err);
        const response = NextResponse.next();
        response.cookies.delete('cvtoken');
        response.cookies.delete('cvuser');
        return NextResponse.redirect(loginRedirectUrl(), { status: 302 });
    }
}

export const config = {
    matcher: [
        '/((?!api|logo.png|_next/static|_next/image|favicon.ico).*)',
    ],
};