const https = require('https');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/init-db',
  method: 'POST'
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(JSON.parse(data).message);
  });
});

req.on('error', (error) => {
  console.error('Failed to initialize database:', error);
});

req.end();