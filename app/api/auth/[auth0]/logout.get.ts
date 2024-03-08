import type { NextApiRequest, NextApiResponse } from 'next';
import { logoutRedirectUrl } from './auth';
import { cookies } from 'next/headers'

type ResponseData = {
  url: string
}

export default function handler (
  req: NextApiRequest,
  res:NextApiResponse<ResponseData>
) {
  const { nonce } = req.body;
  const cookieStore = cookies();
  const id_token = cookieStore.get("cvtoken")?.value;
  const url = logoutRedirectUrl(id_token as string, nonce);
  res.status(200).json({ url });
}