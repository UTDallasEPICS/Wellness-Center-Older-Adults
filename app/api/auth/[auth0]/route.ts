import { NextResponse } from 'next/server';
import { loginRedirectUrl, logoutRedirectUrl } from '../auth0';
import { cookies } from 'next/headers';
import prisma from '../../../../util/prisma-client';
import { jwtVerify, importX509 } from 'jose';

// NOTE: this route is dynamic, and the value of 'auth0' is inferred
// from the URL which makes the request

// authentication get requests are processed here
export async function GET(request: Request, { params }: { params: { auth0: string } }) {
  const auth0 = params.auth0;

  // Responds with a login url which the user should be redirected to
  if (auth0 === 'login') {
    const url = loginRedirectUrl();
    return NextResponse.json({ url });

    // Responds with a logout url which the user should be redirected to
  } else if (auth0 === 'logout') {
    const cookieStore = cookies();
    const id_token = cookieStore.get('cvtoken')?.value;
    const url = logoutRedirectUrl(id_token as string);
    return NextResponse.json({ url });

    // Reciever for the logout callback: Auth0 callbacks to this request when user logs out
  } else if (auth0 === 'logout-complete') {
    const ret = NextResponse.redirect('http://localhost:3000', { status: 302 });
    ret.cookies.delete('cvtoken');
    ret.cookies.delete('cvuser');
    return ret;

    // Helper API to render components given a session is valid
    // (The cvtoken is authenticated by the middleware, so this route
    // only needs to check if the token exists)
  } else if (auth0 === 'session') {
    const cookieStore = cookies();
    const id_token = cookieStore.get('cvtoken')?.value;
    const isAuthenticated = !!id_token && id_token.trim() !== '';
    return NextResponse.json({ isAuthenticated });
  }
}

// authentication post requests are processed here
export async function POST(request: Request, { params }: { params: { auth0: string } }) {
  const auth0 = params.auth0;

  // Reciever for the login callback: Auth0 callbacks to this request when user logs in
  if (auth0 === 'callback') {
    try {
      const requestBody = await request.text();
      const formData = new URLSearchParams(requestBody);
      const id_token = formData.get('id_token');
      const maxAge = 60 * 60 * 24;

      // Verify user in the database
      if (!id_token) {
        throw new Error('id_token is null');
      }
      const certPem = process.env.CERT_PEM;
      if (!certPem) {
        throw new Error('Certificate not found in environment variables or code');
      }
      const key = await importX509(certPem, 'RS256');
      const decoded = await jwtVerify(id_token, key);
      const email = decoded.payload.email as string;
      const admin = await prisma.user.findUnique({
        where: { email },
      });
      if (!admin) {
        // If a user that is not found in the db tries to sign in
        // and take action, redirect to login
        const ret = NextResponse.redirect(logoutRedirectUrl(id_token as string), { status: 302 });
        ret.cookies.set('cvtoken', '');
        ret.cookies.set('cvuser', '');
        return ret;
      }

      const ret = NextResponse.redirect('http://localhost:3000/Dashboard', { status: 302 });
      ret.cookies.set({
        name: 'cvtoken',
        value: `${id_token}`,
        httpOnly: true,
        path: '/',
        maxAge: maxAge,
        secure: false, // CHANGE TO TRUE IN PROD
      });
      ret.cookies.set('cvuser', `${admin.id}`);
      return ret;
    } catch (error) {
      console.error('Error parsing Request:', error);
      return NextResponse.json({
        error: 'Invalid Request',
        status: 400,
      });
    }
  }
}
