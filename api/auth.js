const crypto = require('crypto');

function generateRandomString(length) {
  return crypto.randomBytes(length).toString('hex');
}

export default async function handler(req, res) {
  const { path } = req.query;

  switch (path) {
    case 'authorize':
      handleAuthorize(req, res);
      break;
    case 'token':
      await handleToken(req, res);
      break;
    default:
      res.status(404).json({ error: 'Not found' });
  }
}

function handleAuthorize(req, res) {
  console.log("Query", req.query);
  const { response_type, client_id, redirect_uri, scope, state } = req.query;

  // Validate the request
  if (response_type !== 'code' || !client_id || !redirect_uri) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  // Generate an authorization code
  const code = generateRandomString(16);
  // authorizationCodes.set(code, { client_id, redirect_uri, scope });
  console.log("Code", code);
  // Redirect back to the client
  const redirectUrl = new URL(redirect_uri);
  console.log("Redirect URL", redirect_uri);
  redirectUrl.searchParams.append('code', code);
  if (state) {
    redirectUrl.searchParams.append('state', state);
  }

  res.redirect(redirectUrl.toString());
}

async function handleToken(req, res) {

  console.log("Body", req.body);
  const { grant_type, code, redirect_uri, client_id, client_secret } = req.body;

  // Generate an access token

  if (grant_type == 'refresh_token') {

    const accessToken = generateRandomString(32);
    const refreshToken = generateRandomString(32);

    console.log("Refresh", accessToken);
    console.log("Redirect URL", redirect_uri);
    return res.json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 300,
      refresh_token: refreshToken,
      scope: "fun"
    });
  }

  // Validate the request
  if (grant_type !== 'authorization_code' || !code || !redirect_uri || !client_id || !client_secret) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const accessToken = generateRandomString(32);
  const refreshToken = generateRandomString(32);

  console.log("Auth Code", accessToken);

  // Return the access token response
  return res.json({
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 300,
    refresh_token: refreshToken,
    scope: "fun"
  });
}
