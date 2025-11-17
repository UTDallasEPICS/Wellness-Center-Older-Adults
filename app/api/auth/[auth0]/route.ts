/* eslint-disable prettier/prettier */
import { NextResponse } from "next/server";
import { loginRedirectUrl, logoutRedirectUrl } from "../auth0";
import { cookies } from "next/headers";
import prisma from "../../../../util/prisma-client";
import { jwtVerify, importX509 } from "jose";

export async function GET(
  request: Request,
  { params }: { params: { auth0: string } }
) {
  const auth0 = params.auth0;

  if (auth0 === "login") {
    const url = loginRedirectUrl();
    return NextResponse.json({ url });
  } else if (auth0 === "logout") {
    const cookieStore = cookies();
    const id_token = cookieStore.get("cvtoken")?.value;
    const url = logoutRedirectUrl(id_token as string);
    return NextResponse.json({ url });
  } else if (auth0 === "logout-complete") {
    const ret = NextResponse.redirect("http://localhost:3000", { status: 302 });
    ret.cookies.delete("cvtoken");
    ret.cookies.delete("cvuser");
    return ret;
  } else if (auth0 === "session") {
    const cookieStore = cookies();
    const id_token = cookieStore.get("cvtoken")?.value;
    const isAuthenticated = !!id_token && id_token.trim() !== "";
    return NextResponse.json({ isAuthenticated });
  }

  return NextResponse.json({ error: "Invalid auth0 action" }, { status: 400 });
}
export async function POST(
  request: Request,
  { params }: { params: { auth0: string } }
) {
  const auth0 = params.auth0;

  if (auth0 === "callback") {
    try {
      const requestBody = await request.text();
      const formData = new URLSearchParams(requestBody);
      const id_token = formData.get("id_token");

      if (!id_token) {
        console.error("Error: id_token is missing in the callback.");
        return NextResponse.redirect("/?error=missing_id_token", {
          status: 302,
        });
      }

      const certPem = process.env.CERT_PEM;
      if (!certPem) {
        console.error("Error: CERT_PEM environment variable not found.");
        return NextResponse.json(
          { error: "Server configuration error" },
          { status: 500 }
        );
      }

      let key;
      try {
        key = await importX509(certPem, "RS256");
      } catch (error) {
        console.error("Error importing certificate:", error);
        return NextResponse.json(
          { error: "Failed to import certificate" },
          { status: 500 }
        );
      }

      let decoded;
      try {
        decoded = await jwtVerify(id_token, key);
        console.warn("Decoded JWT Payload:", decoded.payload); // Log the payload for debugging
      } catch (error) {
        console.error("Error verifying JWT:", error);
        return NextResponse.redirect("/?error=invalid_token", { status: 302 });
      }

      const email = decoded.payload.email as string;
      if (!email) {
        console.error("Error: Email not found in decoded token.");
        return NextResponse.redirect("/?error=email_not_found", {
          status: 302,
        });
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.error(
          `User with email ${email} not found in the database. Redirecting to logout.`
        );
        const logoutUrl = logoutRedirectUrl(id_token);
        const ret = NextResponse.redirect(logoutUrl, { status: 302 });
        ret.cookies.set("cvtoken", "");
        ret.cookies.set("cvuser", "");
        return ret;
      }

      const redirectTo = `/Dashboard`;

      const maxAge = 60 * 60 * 24;
      const redirectResponse = NextResponse.redirect(
        `http://localhost:3000${redirectTo}`,
        {
          status: 302,
        }
      );
      redirectResponse.cookies.set({
        name: "cvtoken",
        value: id_token,
        httpOnly: true,
        path: "/",
        maxAge: maxAge,
        secure: false, // Remember to set to true in production
      });
      redirectResponse.cookies.set("cvuser", `${user.id}`);
      console.warn(`User ${user.id} logged in. Redirecting to: ${redirectTo}`);
      return redirectResponse;
    } catch (error) {
      console.error("Error during callback processing:", error);
      const baseUrl = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${baseUrl}?error=callback_error`, { status: 302 });
  }
  }
  return NextResponse.json({ error: "Invalid auth0 action" }, { status: 400 });
}
