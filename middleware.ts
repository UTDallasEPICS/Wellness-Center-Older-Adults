import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { loginRedirectUrl, logoutRedirectUrl } from './app/api/auth/auth0';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { jwtVerify, importX509 } from 'jose';

const localDatabasePort = process.env.WEBSOCKET_PORT || 6432;;
const localDatabaseHost = 'localhost';
neonConfig.fetchEndpoint = `http://${localDatabaseHost}:${localDatabasePort}`;
neonConfig.useSecureWebSocket = false; // SET TO TRUE IN PROD
neonConfig.pipelineConnect = false;
neonConfig.wsProxy = `localhost:${localDatabasePort}`;
const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
const adapter = new PrismaNeon(neon);
const client = new PrismaClient({ adapter });

export async function middleware(request: NextRequest) {
  try {
    const cvtoken = request.cookies.get('cvtoken')?.value;
    const response = NextResponse.next();

    if (!cvtoken && request.url !== 'http://localhost:3000/') {
      // redirect to login if no cvtoken and path requires authentication
      return NextResponse.redirect(loginRedirectUrl(), { status: 302 });
    } else if (cvtoken && request.url !== 'http://localhost:3000/') {
      // convert certificate PEM into KeyLike object
      let key;
      const certPem = process.env.CERT_PEM;
      if (!certPem) {
        throw new Error('Certificate not found in environment variables or code');
      }
      try {
        key = await importX509(certPem, 'RS256');
      } catch (error) {
        console.error('Error importing certificate:', error);
        throw new Error('Failed to import certificate');
      }
      try {
        // Token verification
        const decoded = await jwtVerify(cvtoken, key);
        const email = decoded.payload.email as string;
        const user = await client.user.findUnique({
          where: { email },
        });
        if (!user) {
          // If a user that is not found in the db tries to sign in
          // and take action, redirect to login
          response.cookies.set('cvtoken', '');
          response.cookies.set('cvuser', '');
          return NextResponse.redirect(logoutRedirectUrl(cvtoken), { status: 302 });
        }
        response.cookies.set('cvuser', `${user.id}`);
        return NextResponse.next();
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    // If there is any error, assume the user's authentication is malformed and redirect to login
    const response = NextResponse.next();
    response.cookies.set('cvtoken', '');
    response.cookies.set('cvuser', '');
    console.error(err);
    return NextResponse.redirect(loginRedirectUrl(), { status: 302 });
  }
  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api/auth/ (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - logo.png (logo file)
   */

  matcher: [
    // Exclude specified paths from the middleware
    '/((?!api|logo.png|_next/static|_next/image|favicon.ico).*)',
  ],
};
