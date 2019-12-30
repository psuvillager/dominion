const http = require('http');

const
  port = 3000,
  hostname = "127.0.0.1",
  body = "woo",
  callback = () => {
    console.log(`Server running at http://${hostname}:${port}`);
  }
;
//const
//  serverModifications = {}, // Customize here
//  serverOptions = {
//    requestHandler: processRequest
//  };
//serverOptions = setServerOptions(serverModifications);

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


/*
// I need to customize how processRequest behaves, based on a `responseOptions`
//   object. This object needs to be a modifiable version of the 
//   `defaultResponseOptions` property of the `serverOptions` object passed
//   in to `startServer`.
function processRequest(req, res){
  
  
  //res.statuscode = serverOptions.responseDefaultStatusCode;
  //if(typeof responseHeaders === "Object"){
  //  Object.keys(getResponseHeaders(defaultHeaders, modifications)).forEach(key => {
  //    res.setHeader(key, responseHeaders[key]);
  //  });
  //}
  //res.end(getResponseBody(bodyOptions));
  
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end("Hello World!");
}


// The functions below are boilerplate

function setServerOptions(modifications){
  const defaultServerOptions = {
    port: 3000,
    hostname: "127.0.0.1", // Change this for custom hosts
    callback: (port, hostname = "") => console.log("Server running " +
      hostname ? `at http://${hostname}:${port}` : `on port ${port}`
    ),
    
    //defaultResponseOptions: {
    //  statusCode: 200,
    //  headers: {
    //    "Content-Type": "text/plain",
    //    "Access-Control-Allow-Origin": "*",
    //  },
    //  body: "Hello World!",
    //};
  };
  return defaultServerOptions;
  //const modifiedServerOptions = {};
  //modifications = modifications || {};
  //Object.assign(modifiedServerOptions, defaultServerOptions, modifications);
  //return modifiedServerOptions;
}
*/

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