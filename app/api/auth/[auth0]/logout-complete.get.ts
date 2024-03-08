import type { NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers'

type ResponseData = {
    message: string
  }
  
  export default function handler (
    req: NextApiRequest,
    res:NextApiResponse<ResponseData>
  ) {
    const body = req.body;
    const id_token = body.id_token;
    const maxAge = 60 * 60 * 24;
    res.setHeader('Set-Cookie', `cvtoken=""; Path=/; Max-Age=${maxAge}; HttpOnly; Secure`);
    res.setHeader('Set-Cookie', `cvuser=""; Path=/; Max-Age=${maxAge}; HttpOnly; Secure`);
    res.redirect(307, '/');
  }