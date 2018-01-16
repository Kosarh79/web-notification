const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
const path = require('path');
const fs = require('fs');
const server = http.createServer((req, res) =>{
  console.log(req.url);
  let filePath = path.join(__dirname, '../client');
  if(req.url === '/favicon.ico') return;
  if (req.url ==='/') {
    filePath = filePath + '/index.html';
    res.writeHead(200, {'content-Type':'text/html'});
  }
  else {
    filePath = filePath + req.url;
    res.writeHead(200, {'content-Type':'text/javascript'});
  }
  return fs.readFile(filePath, function(err, data){
    res.end(data, 'utf-8');
  });

});

server.listen(port, hostname, () => {
  console.log(`Server running at at http://${hostname}:${port}/`);
});


const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/eUZSm3hwfPc:APA91bEV4bAj8TLuJrS4wisVY23ejm3cq9wko3iEu8Abod4sItGw26fPOag4QZrdAHVtDoAD3J7PBLghs5YQdjzybi2aOOphmw96CH8yfK20GPNRckHqZhBUuLWzVCpyVO1fpFdo6eYG","expirationTime":null,"keys":{"p256dh":"BMpUI-6SsB9vPpMFCBEdM2WcYdJJYifKRJE2ElpdfBOkVzbC7--1xidgOCFtGzGpuEAujri4JPzQd56iOOFe0rw=","auth":"9D8Y4ydKs8qsXnWXqkUMqQ=="}}
