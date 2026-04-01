const https = require('https');

const accessKey = '6V9gbjOQA3TB1_Wgnkeuzg';
const secretKey = '4QunKGLAbbtJfRUCQutD1Ib393B6N3f8';
const baseUrl = 'openapi.liblibai.cloud';

// Test API call
const options = {
  hostname: baseUrl,
  port: 443,
  path: '/v1/user/account/info',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-Access-Key': accessKey,
  }
};

console.log('Testing API call to:', baseUrl);

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();
