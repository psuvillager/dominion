const http = require('http');

// See also:
//  "Module": http://www.java2s.com/Tutorials/Javascript/Node.js_Tutorial/1000__Node.js_Module_System.htm
//  http.createServer: https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
//  response.writeHead: https://nodejs.org/api/http.html#http_response_writehead_statuscode_statusmessage_headers

const
  serverModifications = {}, // Customize here
  serverOptions = setServerOptions(serverModifications)
;
startServer(serverOptions);

function onRequest(req, res){
  console.log("INCOMING REQUEST: " + req.method + " " + req.url);
  //writeReadFile(req.url);
  responseBody = "woo";
  res.statuscode = 200;
  //response.writeHead(200, {"Content-Type": "text/plain"});
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.write(responseBody);
  res.end();
}

function setServerOptions(modifications = {}){

  // Determines properties
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
    // (Avoids assuming `onRequest` exists)
    defaultRequestHandler = onRequest ? onRequest : null,
    requestHandler = modifications.requestHandler || defaultRequestHandler;
  
  // NOTE: onRequest currently defines its own response options, ignoring these
    //const
    //  defaultResponseOptions = {
    //    statusCode: 200,
    //    headers: {
    //      "Content-Type": "text/plain",
    //      "Access-Control-Allow-Origin": "*",
    //    },
    //    body: "Hello World!",
    //  },
    //  responseOptions = modifications.responseOptions || defaultResponseOptions;

  // Assigns properties to object
  return {
    port: port,
    hostname: hostname,
    callback: callback,
    requestHandler: requestHandler,
    //responseOptions: responseOptions
  };
}

function startServer(opts){
  const server = http.createServer(opts.requestHandler);
  if(opts.hostname){ //console.log("got hostname");
    if(opts.callback){ //console.log("got callback");
      server.listen(opts.port, opts.hostname, opts.callback(opts.port, opts.hostname));
    }
    else server.listen(opts.port, opts.hostname);
  }
  else server.listen(opts.port);
}

function readWriteFile(url){
  const fs = require('fs'); 
  let testName = url.slice(-4,-1) + ".txt";
  fs.writeFileSync(testName, testname);
  console.log("written and read: " + fs.readFileSync(testName).toString()); 
}
