const http = require('http');
const fs = require('fs');

// See also:
//  "Module": http://www.java2s.com/Tutorials/Javascript/Node.js_Tutorial/1000__Node.js_Module_System.htm
//  http.createServer: https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
//  response.writeHead: https://nodejs.org/api/http.html#http_response_writehead_statuscode_statusmessage_headers


let serverModifications = {
  // Customize here
};
const serverOptions = setServerOptions(serverModifications);
startServer(serverOptions);





function onRequest(req, res){
  console.log("INCOMING REQUEST: " + req.method + " " + req.url);
  //writeReadFile(req.url); // Writes to files (See below)
  let html = `<h2>woo</h2>`;
  responseBody = html;
  res.statuscode = 200;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.write(responseBody);
  res.end();
}

function setServerOptions(modifications = {}){
  // Determines properties (including port, hostname, and callback)
  // Uses the defaults specified here unless `modifications` overrides
  const
    defaultPort = 3000,
    port = modifications.port || defaultPort;
  const
    defaultHostname = "127.0.0.1",    
    hostname = modifications.hostname || defaultHostname;
  const
    // (Relies on above definitions of `port` and `hostname`)
    defaultCallback = () => {
      console.log(`Server running at http://${hostname}:${port}`);
    },
    callback = modifications.callback || defaultCallback;
  const
    // Avoids assuming `onRequest` exists
    genericRequestListener = ( (_, res) => {
      res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
      res.end("Server running");
    }),
    // Replaces generic listener w/ onRequest listener if possible
    defaultRequestListener = onRequest ? onRequest : genericRequestListener,
    // Replaces onRequest listener with modifications.requestListener if possible
    requestListener = modifications.requestListener || defaultRequestListener;

  // Assigns properties to object
  const serverOptions = {
    port: port,
    hostname: hostname,
    callback: callback,
    requestListener: requestListener,
    //responseOptions: responseOptions
    
    // TODO: Make listener configurable via a responseOptions object
    //   This should handle status, headers, 
  };
  return serverOptions;
}

function startServer(opts){
  // Takes an options object that must have a .port property
  // Calls http.createServer, passing listener function for incoming requests
  // Tells server to listen on port (and hostname), and calls callback if any
  // (NOTE: Apparently, createServer can also accept an options object directly)
  const server = http.createServer(opts.requestListener);
  if(opts.hostname){ //console.log("got hostname");
    if(opts.callback){ //console.log("got callback");
      server.listen(opts.port, opts.hostname, opts.callback(opts.port, opts.hostname));
    }
    else server.listen(opts.port, opts.hostname);
  }
  else server.listen(opts.port);
}

function writeReadFile(url){
  // Uses Node's core "fs" module to read/write on server side

  // Ignores automatic favicon requests (untested)
  if(url == "/favicon.ico"){ return; }
  // `url` is just the path from the app root, no fqdn
  let testName = "." + url + ".txt";
  // writeFileSync takes target file's name and text to write (can create file)
  fs.writeFileSync(testName, testName); // Change 2nd(?) arg to useful string
  // readFileSync gets the file's contents (probably as a stream or buffer)
  console.log("written and read: " + fs.readFileSync(testName).toString()); 
}
