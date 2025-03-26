import { nanoid } from 'nanoid';

const state: Record<string, boolean> = {};

const genState = (): string => {
  // Generates a nonce to append to the end of login and logout links (for security purposes)
  const nonce = nanoid();
  state[nonce] = true;
  return nonce;
};

/**
 * Constructs a login link which the user will be redirected to in order to login
 * ISSUER_BASEURL: The base URL of the Auth0 application
 * BASEURL: The base URL of this React application
 * CLIENTID: The ID of the Auth0 client, provided by Auth0
 * @returns Constructed login link
 */
export const loginRedirectUrl = () => {
  const ISSUER_BASEURL = process.env.AUTH0_ISSUER_BASE_URL;
  const BASEURL = process.env.AUTH0_BASE_URL;
  const CLIENTID = process.env.AUTH0_CLIENT_ID;
  // eslint-disable-next-line max-len
  return `${ISSUER_BASEURL}authorize?response_type=id_token&response_mode=form_post&client_id=${CLIENTID}&scope=openid%20email&redirect_uri=${encodeURIComponent(BASEURL! + 'api/auth/callback')}&nonce=${genState()}`;
};

/**
 * Constructs a logout link which the user will be redirected to, logging out the user
 * ISSUER_BASEURL: The base URL of the Auth0 application
 * BASEURL: The base URL of this React application
 * @returns Constructed logout link
 */
export const logoutRedirectUrl = (id_token: string) => {
  const ISSUER_BASEURL = process.env.AUTH0_ISSUER_BASE_URL;
  const BASEURL = process.env.AUTH0_BASE_URL;
  // eslint-disable-next-line max-len
  return `${ISSUER_BASEURL}oidc/logout?id_token_hint=${id_token}&post_logout_redirect_uri=${encodeURIComponent(BASEURL! + 'api/auth/logout-complete')}&nonce=${genState()}`;
};
/**
 * Checks if the logged-in user is an admin
 * @param id_token The ID token of the logged-in user
 * @returns Boolean indicating if the user is an admin
 */
export const isAdmin = async (id_token: string): Promise<boolean> => {
  const ISSUER_BASEURL = process.env.AUTH0_ISSUER_BASE_URL;

  // Decode the ID token to extract user information
  const response = await fetch(`${ISSUER_BASEURL}userinfo`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  });

  const userInfo = await response.json();

  // Check if the user has an "admin" role
  return userInfo.roles && userInfo.roles.includes('admin');
};
export async function getManagementApiToken() {
  const ISSUER_BASEURL = process.env.AUTH0_ISSUER_BASE_URL;
  const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
  const CLIENT_ID = process.env.AUTH0_CLIENT_ID;
  // Implementation to get a management API token from Auth0
  const response = await fetch(`${ISSUER_BASEURL}oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      audience: `${ISSUER_BASEURL}api/v2/`,
      grant_type: 'client_credentials',
    }),
  });

  const data = await response.json();
  return data.access_token;
}

/**
 * Used to ensure that each nonce is only used one time
 * @param nonce Generated string intended for one-time use
 * @returns If nonce has been successfully consumed/deleted or not
 */
export const verifyNonce = (nonce: string): boolean => {
  if (state[nonce]) {
    delete state[nonce];
    return true;
  }
  return false;
};
