
// Part 1. REST API:
    // representational state transfer API
        // REST: is a software architectural style (design art) that was created to guide the design of network applications
        // properties:
            // relies on a stateless, client-server protocol -- HTTP at most time
            // treats server objects as resources: can be created and destroyed at will
            // multi-language support (just need to have JSON and HTTP support)
            // APIs have their own rules and structures
            
        // API = Application Programming Interface  
                // Contract provided by one piece of software to another
                // structured requests and responses
                // generally through a URL (format defined by the application)



// Part 2.Async 
    // why need Async: application work collaborately over Internet, not able to process in realtime
    // few ways to work with asyn code:
        // old: callback
        // later: Promises
        // modern: Async/Await
    // technologies that provide JS Async capability
        // jQuery Ajax (old technology), Fetch API(JS原生),  Node.js fs(filesystem) module (in Node ecosystem)


    // Ajax: Asynchronous JavaScript and XML (but now JSON replaced XML)
        // technologies to: send & receive data between client and server Asynchronously(without reload the page) 
        //* xmlHttpRequest(XHR) Object: core of Ajax tech
            // provided by browsers' JS environment



//? misc
    // common HTTP status:
        // 200: OK
        // 403: "Forbidden"
        // 404: "Not Found"
    // HTTP requests (client side):
        // GET: retrieved data from server
        // POST: submit data to be process
        // PUT: update a specific resource
        // DELETE: delete a specific resource
        // HEAD: same as GET but not return a body (only header)
        // OPTIONS: return support HTTP methods
        // PATCH: update partial resource
    // HTTP headers ref:
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers



