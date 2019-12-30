const http = require('http');

const
  body = "woo",
  callback = () => {
    console.log(`Server running at http://${hostname}:${port}`);
  },
  serverModifications = {}, // Customize here
  serverOptions = setServerOptions(serverModifications)
;
startServer(serverOptions);


function processRequest(req, res){
  res.statuscode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(body);
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
    defaultCallback = () => {
      const port = defaultPort, hostname = this.hostname;
      console.log(`Server running at http://${hostname}:${port}`);
    },
    callback = modifications.callback || defaultCallback;
  const
    // (Avoids assuming `processRequest` exists)
    defaultRequestHandler = processRequest ? processRequest : null,
    requestHandler = modifications.requestHandler || defaultRequestHandler;
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