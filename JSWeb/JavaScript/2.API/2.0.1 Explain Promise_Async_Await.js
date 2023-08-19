// ref: Asynchronous programming pattern in javascript @ mendeley

//! JS是单线程语言，不支持处理器多线程
    // 单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。对于执行很慢的IO任务，主线程挂起处于等待中的IO任务，先运行排在后面的任务。等到IO设备返回了结果，再把挂起的任务继续执行下去。
        // （1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
        // （2）主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
        // （3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
        // （4）主线程不断重复上面的第三步。
//! promise
    // functions that return Promise
        // network requests with fetch
        fetch("https://advancedweb.hu");// Promise
        // async function
        const asyncFn = async () => {return5;}
        asyncFn();// Promise
        // some packages
            //fs
            const fs = require("fs");   
            fs.promises.readFile("test.js");// Promise

            //sharp lib
            const sharp = require("sharp");sharp("image.png")  
                .jpeg()  
                .toFile("image.jpg");// Promise

    // Promise hold the result of a function, to access the value, attach a callback using then()
        fs.promises.readFile("test.js") // a promise
            .then((VarToResult) => {console.log(VarToResult);})// callback function: anything you want to do with the VarToResult};

        // abstactly:
            function FunThatReturnPromise() {
                // do sth, result may be late because of remote
                // return Promise
            }
            let APromise = FunThatReturnPromise(); // function terminate syncly, without wait from the result
            // conduct other function
            // (when the result arrive)
                APromise.then(callbackThatDealWithResult=>{
                    // result is ready
                    // process result ...
                }) 

    //! why return promise:
        // the result (VarToResult) might not be ready by the time the function(ie readFIle) return
        // promise act as a placeholder to whatever the remote return, in the future 
        //? asyncFun -> asyncFun return Promise -> asyncFun finish, result of promise yet to arrive -> other process continue to run -> promise arrive, callback is called from then() (in essense the rest part of asyncFun is executed)

    //! promise states:
        //? promise has three states:  start with a "pending" state and go into either "resolve" or "reject" the state
        // collectively "resolve" and "reject" are called "fufilled", means that the promise has already finished and has sproduced either a value or an error

        // ! in a word: res =  return, reject =  throw error

        // in above example:
        await new Promise((resolve, reject) => {
            fetch(url)  // a promise
            .then(res => res.json()) // still a promise
            .then(data => resolve(data))   //! resolve() return the value passed to it(can be object)
            .catch(err => reject(err));    //! reject() return the error and message passed to it, can be catch() as error
        })

        //* resolve() simply return the value(object) passed to it
        //* reject() simply return the error(object) passed to it
        //! only one value(or object) can be returned with resolve/reject


//! await keyword
    // await simplify the promise usage and syntax: without the need to define long callbacks:
    // ? await keyword: It stops a function that return Promise, when the Promise is ready and it returns the result value.

    let aVar = await asyncFnReturnPromise();  // we get what we want to get **when and only when** the value is ready

    //? The await keyword that waits for async results makes the code lookalmost like it's synchronous, but with all the benefits of Promises.
    //* await stops the execution of the function, which seems like something that can not happen in Javascript. But under the hood, it still uses the then() callbacks and Promise, making halting the function possible

        // sync code that might have bug
        const user = getUser();
        const permissions = getPermissions();
        const hasAccess = checkPermissions(user, permissions);
        if (hasAccess) {
            // handle request
        }

        // Promise without await
        getUser().then((user) => {  
            getPermissions().then((permissions) => {
                const hasAccess = checkPermissions(user, permissions);
                if (hasAccess) {
                    // handle request    
                }  
            });
        });

        //Promise with await
        const user = await getUser();
        const permissions = await getPermissions();
        const hasAccess = checkPermissions(user, permissions);
        if (hasAccess) {// handle request
        }

    //? recap: an async function returns a value wrapped in a Promise and the await keyword extracts the value from it when the promise is ready



//! Promises constructor

    // * It’s easier to work with Promises (or Async/await) compared to callbacks. This is especially true when you work in Node-based environments. Unfortunately, most Node APIs are written with callbacks.

    //? 1. without error handling:
        // * to consturst custom Promises: in the callback part of the API, write promise's own callback
        // * for non-callback, call res() when the data is ready, which is the same logic  

        // * FROM CALLBACK
            // Example 1:
                gapi.load("client:auth2", () => {
                    // gapi.load's callback 
                });
            // Example 2:
            const button = document.querySelector("#button");
            button.addEventListener("click", () => {
                // addEventListener's callback
            }, {once: true})

            // Example 3: promise returned by fetch
            fetch(url)  // a promise
                .then(res => res.json()) // still a promise
                .then(data => resolve(data)) // then() is also a callback 
                .catch(err => reject(err));  // catch() is also a callback 

        // * TO PROMISE
            // Example 1: (only fufilled(res) status)
                await new Promise((resolve) => {  
                    gapi.load("client:auth2", resolve);   // replace original callback with promise callback param
                });

            // Example 2: (only fufilled(res) status)
            const button = document.querySelector("#button");
            await new Promise((resolve) => {  
                button.addEventListener("click", resolve, {once: true});  // replace original callback with promise callback param
            });

            // Example 3: (fufilled or rejected status)
            await new Promise((resolve, reject) => {
                fetch(url)  // a promise
                .then(res => res.json()) // still a promise
                .then(data => resolve(data)) 
                .catch(err => reject(err));  
            })

    //? 2. with error handling:
      // we need two things. First, a way tosignal the Promise that an error happened, and second, a way to detect that error.
      // *Rejecting a Promise
            // *Promise constructor provides a second callback that can signal that anerror happened
            // *When the rej function is called it behaves similarly to an async function throwing an error


        // EXAMPLE 1

            // error are handled in ways similar to synchronous code
            const asyncFn = async () => {
                throw new Error("Something bad happened");
            }

            const res = asyncFn();  //res is Promise
            try {
                await res; //! Errors are thrown during the await and not when the function is called
            }catch(e) {
                // handle error
            }

        // EXAMPLE 2
            // call rej() when error happens
            const asyncF = new Promise((res, rej) => {
                let bGood = false;
                if(bGood) {res();}     // call res() when everything is fine
                else{rej(new Error("Something bad happened"));}    // call rej() when there is an error   
            });
            // try-catch error in async process
            try {
                await asyncF;
            }catch(e){
                // handle error when error arrive
            }

      // * detecting errors
        // detecting errors is up to the use case
            // for APIs, they may define the onerror handlers in their API's callbacks
            // for custom process, you can define the rejection scenerio, handling and messages

        // EXAMPLE: adapt the gapi example to take advantage of rej()
                // in this specific case, the callback can also be an object with callback and onerror handlers
                await new Promise((res, rej) => {  
                    gapi.load("client:auth2", {callback: res, onerror: rej});
                });


//! chaining promises
    //? in normal return:

        // chained async code only need one await to unwrap
        const f1 = async () => {return 2;};
        const f2 = async () => {return f1();}
        const result = await f2();  // result is 2 instead of promise<2>

        // an async function returns a Promise, it returns it without adding another layer. 
            // not matter if the function return a value or a Promise, the result will always be one layer of Promise
            // so await resolve to the final value but not another Promise
    //? in error return:
        //! in a chain of async process, errors that happen along the way will/can be collected in a single place 

        // syntax
            getUser()
                .then(getPermissionsForUser)  // error or not
                .then(checkPermission)  // error or not
                .then((onAllowed) => {
                    // normal return: handle allowed or not  
                }).then(undefined, (onError) => {   //! any error happens, this track is entered
                    // there was an error in one of the previous steps  
                });

            // .then(undefined, (error) => {}) can also be shorthand with catch((error) => {})
                getUser()
                    .then(getPermissionsForUser) 
                    .then(checkPermission)  
                    .then((onAllowed) => {
                    }).catch((onError) => {   //! catch()
                        // there was an error in one of the previous steps  
                    });
    //! long, complex promise chain: page 25 @ Asynchronous programming pattern in javascript @ mendeley
        // rule:
            // 1. handler and error handler ONLY handles errors from previous steps.
            // 2. there are only two tracks: success and error. 
            // 3. The process can move back and forth between two tracks
                    //3.1 when error happen on success track, go to error track
                    //3.2 when error resolved with error handler(catch), go back to success track
                    
        // try to draw the diagram of the promise chain
        getPromise()  
            .then(handler1)  
            .then(handler2, catch1)  
            .then(handler3)  
            .then(undefined, catch2)  
            .then(handler4) 

//! Promise.all
    //? what it do: gets a collection of Promises and returns a Promise with all the results
    //? why Promise.all: Whenever you want to run multiple things concurrently, this is the tool to use.
        // each Promise in the collection are executed in parallel: the function only stop once instead the number of Array.length times 
        // (total execution time REDUCED): max(exe_time([async()...])), instead of sum(exe_time([async()...]))
    //? await Promise.all move on only when all Promises in the collection are resolved, 
        // ! return an array of the results

    // Example:
        const moveObject = async () => {
            await s3.copyObject({/*...*/}).promise();
            await s3.deleteObject({/*...*/}).promise();
        };
        const updateDatabase = async () => {
            await dynamodb.updateItem({/*...*/}).promise();
        };

        await Promise.all([moveObject(), updateDatabase()]);  // get two promise and return a promise
    
    //? Error
        //! When any of the input Promises are rejected then the resulting Promise will be rejected
            // For example in [asyncF1, asyncF2], asyncF1 successed and asyncF2 fail. In await Promise.all[asyncF1, asyncF2], user still gets error, which can be catched and used to find out which process got the error
        
        //! if you want the latter process is not run unless the first one is successful, don't use Promise.all, instead run the two processes in serial
            await asyncF1();
            await asyncF2();

//! Early init
    // an async function only stop when it encounters an await
    // which means we can await later, let other functions run and only await (stop for the function) when the result is needed (allows an easy way to run things "in the background")

    // Example:
    const wait = (ms) =>newPromise((res) =>setTimeout(res, ms));
    const fn = async () => {
        console.log("starting");
        await wait(100);
        console.log("end");
    }
    const fnProm = fn();
    console.log("after");
    await fnProm;
        // print: 
            // starting
            // after
            // end

// multiple await
    // await is simply return the promise value, so multiple awaits return multiple times

    const fn = async () => {console.log("called");
        await wait(100);
        return"result";
    }
    (async () => {
        const p = fn();
        console.log(await p);
        console.log(await p);
    })();

    // print
        // called  
        // result  // 
        // result



//! Node-style callbacks
    // a standard (style) to implement callback function, which making converting to Promise easiler 
    // three characteristics:
        // The callback function is the last argument
        // It is called with an error object first, then a result ((error, result))
        // It returns only one result