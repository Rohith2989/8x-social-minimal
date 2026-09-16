// Keep the requested review address on 3904 pointed at the single Next preview.
import http from 'node:http';

http.createServer((request, response) => {
  const upstream = http.request({
    hostname: '127.0.0.1', port: 3091, method: request.method,
    path: request.url, headers: request.headers,
  }, (result) => {
    response.writeHead(result.statusCode ?? 502, result.headers);
    result.on('error', () => response.destroy());
    result.pipe(response);
  });
  upstream.on('error', () => {
    if (response.headersSent) return response.destroy();
    response.writeHead(503, { 'Content-Type': 'text/plain' });
    response.end('Start the 8x preview on port 3091 with npm run start.');
  });
  response.on('close', () => upstream.destroy());
  request.pipe(upstream);
}).listen(3904, '127.0.0.1', () => {
  console.log('8x preview: http://localhost:3904 → http://localhost:3091');
});
