const http = require('http');

// See also:
//  "Module": http://www.java2s.com/Tutorials/Javascript/Node.js_Tutorial/1000__Node.js_Module_System.htm

const
  serverModifications = {}, // Customize here
  serverOptions = setServerOptions(serverModifications)
;
startServer(serverOptions);


function processRequest(req, res){
  console.log("INCOMING REQUEST: " + req.method + " " + req.url);
  responseBody = "woo";
  res.statuscode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(responseBody);
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
    // (Avoids assuming `processRequest` exists)
    defaultRequestHandler = processRequest ? processRequest : null,
    requestHandler = modifications.requestHandler || defaultRequestHandler;
  
  // NOTE: processRequest currently defines its own response options, ignoring these
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