const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST': {
      if (pathname.indexOf('/') !== -1) {
        res.statusCode = 400;
        res.end('Nested path not access');
        return;
      }
      
      fs.stat(filepath, (err, stats) => {
        if (err) {
          let body = '';
          
          req.on('data', (chunk) => {
            body += chunk;
          });
          
          req.on('end', () => {
            if (body.length > 1000000) {
              res.statusCode = 413;
              res.end();
            } else {
              fs.writeFile(filepath, body, (err) => {
                if (err) {
                  throw err;
                } else {
                  res.statusCode = 201;
                  res.end();
                }
              });
            }
          })
        } else {
          if (stats.isFile()) {
            res.statusCode = 409;
            res.end('File exist');
          } else {
            console.log('not used section');
          }
        }
      });
      break;
    }

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
