const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.indexOf('/') !== -1) {
        res.statusCode = 400;
        res.end('Nested path not access');
        return;
      } else {
        fs.stat(filepath, (err, stats) => {
          if (typeof stats === 'undefined') {
            res.statusCode = 404;
            res.end('Not found');
          } else {
            fs.unlink(filepath, (err) => {
              if (err) {throw err}
              res.statusCode = 200;
              res.end();
            })
          }
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
