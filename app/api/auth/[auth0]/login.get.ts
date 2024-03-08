// import { loginRedirectUrl } from './api/auth/[auth0]/auth0'

// export default defineEventHandler(async event => {
//   await sendRedirect(event, loginRedirectUrl() || "")
// })

import type { NextApiRequest, NextApiResponse } from 'next'
import { loginRedirectUrl } from './auth';
import { nanoid } from 'nanoid';
 
type ResponseData = {
  url: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { nonce } = req.body;
  const url = loginRedirectUrl(nonce); 
  const maxAge = 60 * 10;
  res.status(200).json({ url });
}