
const https = require('https');
const dotenv = require('dotenv');

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

module.exports = (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    const requestData = JSON.parse(body);

    const data = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: requestData.messages,
      stream: true,
      max_tokens: 1500,
      temperature: 0.7
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const openaiReq = https.request(options, openaiRes => {
      console.log('Status da OpenAI:', openaiRes.statusCode);

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      openaiRes.on('data', chunk => {
        console.log(chunk.toString());
        res.write(chunk);
      });

      openaiRes.on('end', () => {
        res.end();
      });
    });

    openaiReq.on('error', error => {
      console.error(error);
      res.writeHead(500);
      res.end('Internal Server Error');
    });

    openaiReq.write(data);
    openaiReq.end();
  });
};
