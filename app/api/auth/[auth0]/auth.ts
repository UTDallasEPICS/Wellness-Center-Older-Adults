import { nanoid } from 'nanoid';
  
 export const loginRedirectUrl = (nonce: string) => {
    const ISSUER_BASEURL = process.env.AUTH0_ISSUER_BASE_URL;
    const BASEURL = process.env.AUTH0_BASE_URL;
    const CLIENTID = process.env.AUTH0_CLIENT_ID;
    return `${ISSUER_BASEURL}authorize?response_type=id_token&response_mode=form_post&client_id=${CLIENTID}&scope=openid%20email&redirect_uri=${encodeURIComponent(BASEURL!+"api/callback")}&nonce=${nonce}`;
  };

 export const logoutRedirectUrl = (id_token: string, nonce: string) => {
    const ISSUER_BASEURL = process.env.AUTH0_ISSUER_BASE_URL;
    const BASEURL = process.env.AUTH0_BASE_URL;
    return `${ISSUER_BASEURL}oidc/logout?id_token_hint=${id_token}&post_logout_redirect_uri=${encodeURIComponent(BASEURL!+"api/logout-complete")}&nonce=${nonce}`;
  };