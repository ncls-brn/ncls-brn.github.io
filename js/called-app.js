console.log('hello world')

/*const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/

let http = require('http')
let fs = require('fs')

let server = http.createServer()
server.on('request',function(request,response) {
  fs.readFile('dataviz.html' /*&& 'dataviz.css'&& 'dataviz.js'*/,(err,data) => {
    if(err) {
      response.writeHead(404)
      response.end("Ce fichier n'existe pas")
    }else{
      response.writeHead(200,{
        'Content-type': 'text/html; charset=utf-8'

    })
    
    
  }
  response.end(data)
  
  })
  

})

server.listen(8080)