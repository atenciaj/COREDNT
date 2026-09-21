const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;

const MIME = {
  '.html':'text/html;charset=utf-8','.js':'application/javascript;charset=utf-8',
  '.css':'text/css;charset=utf-8','.json':'application/json','.png':'image/png',
  '.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'
};

http.createServer((req,res)=>{
  let file = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(file);
  fs.readFile(file,(err,data)=>{
    if(err){
      res.writeHead(404,{'Content-Type':'text/plain'});
      res.end('404');
    }else{
      res.writeHead(200,{'Content-Type':MIME[ext]||'application/octet-stream','Cache-Control':'no-cache'});
      res.end(data);
    }
  });
}).listen(PORT,()=>console.log(`Dev server on http://localhost:${PORT}`));
