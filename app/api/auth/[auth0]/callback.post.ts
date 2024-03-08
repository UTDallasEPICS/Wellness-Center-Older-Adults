// import jwt from "jsonwebtoken"
// import fs from "fs"
// import { PrismaClient } from "@prisma/client"
// const client = new PrismaClient()
// const runtime = useRuntimeConfig()
// export default defineEventHandler(async event => {
//   const body = await readBody(event)
//   setCookie(event, "cvtoken", body.id_token)
//   await sendRedirect(event, "/") 
// });

import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string
}

const client = new PrismaClient();

export default function handler (
  req: NextApiRequest,
  res:NextApiResponse<ResponseData>
) {
  const body = req.body;
  const id_token = body.id_token;
  const maxAge = 60 * 60 * 24;
  res.setHeader('Set-Cookie', `cvtoken=${id_token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure`);
  res.redirect(307, '/');
}