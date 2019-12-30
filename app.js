const http = require('http');

const
  port = 3000,
  hostname = "127.0.0.1",
  body = "woo",
  callback = () => {
    console.log(`Server running at http://${hostname}:${port}`);
  }
;

let serverOptions = {
  port: 3000,
  hostname: "127.0.0.1",
  requestHandler: processRequest,
  callback: () => { console.log(`Server running at http://${hostname}:${port}`); }
}
startServer(serverOptions);


function processRequest(req, res){
  res.statuscode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(body);
}

function startServer(opts){
  const server = http.createServer(opts.requestHandler);
  if(opts.hostname){
    console.log("got hostname");
    if(opts.callback){
      console.log("got callback");
      server.listen(opts.port, opts.hostname, opts.callback(opts.port, opts.hostname));
    }
    else server.listen(opts.port, opts.hostname);
  }
  else server.listen(opts.port);
}