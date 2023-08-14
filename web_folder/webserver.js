const fs = require('fs');
const http = require('http');
const path = require('path');
const port = 8001;
const hostname = '127.0.0.1';
const webPath = path.join(__dirname, 'web_folder', 'webserver.html');

const server = http.createServer((req, res) => {
  if (req.url === '/webserver') {
    fs.readFile(webPath, 'utf8', (err, data) => {
      if (err) {
        console.log('file not found');
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end(`page not found ${err}`);
      }
      res.writeHead(200, { 'Content-type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('page not found');
  }
});
server.listen(port, hostname, () => {
  console.log(`server is running successfully at : ${port}`);
});
