const http = require('http');
const https = require('https');
const url = require('url');

const CLIENT_ID = '29352735982374239857';
const CLIENT_SECRET = 'sample_secret';
const REDIRECT_URI = 'http://localhost:8080/callback';
const AUTH_SERVER = 'http://localhost:3000'; // Change this to your Vercel deployment URL when testing the deployed version

// Start a local server to handle the redirect
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === '/callback') {
    const code = parsedUrl.query.code;
    console.log('Received code:', code);

    // Exchange the code for an access token
    const tokenResponse = await getAccessToken(code);
    console.log('Access Token Response:', tokenResponse);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Authorization complete! Check your console.</h1>');
    server.close();
  }
});

server.listen(8080, () => {
  console.log('Redirect server is running on http://localhost:8080');
  startAuthFlow();
});

function startAuthFlow() {
  const authUrl = `${AUTH_SERVER}/api/auth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=create+read&state=xcoivjuywkdkhvusuye3kch`;
  console.log('Please open the following URL in your browser:', authUrl);
}

function getAccessToken(code) {
  return new Promise((resolve, reject) => {
    const data = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

    const options = {
      hostname: url.parse(AUTH_SERVER).hostname,
      port: url.parse(AUTH_SERVER).port,
      path: '/api/auth/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    };

    const req = (AUTH_SERVER.startsWith('https') ? https : http).request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(responseData));
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}
