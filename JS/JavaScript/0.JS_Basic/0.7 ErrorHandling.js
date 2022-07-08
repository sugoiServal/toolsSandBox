//? try {} catch(e) {} structure
    // try{} evaluate a piece of codes
    // catch(e) {} is activated when error occurs and the error is captured
// ? finally
    // not matter what happens (error or not), this piece of code will run

//? throw 
    // define custom error (and raise it)
    // can be catched by catch()

const user = {email: 'jdoe@gmail.com'};

try {
  // Produce a ReferenceError
  // myFunction();

  // Produce a TypeError
  // null.myFunction();

  // Will produce SyntaxError
  // eval('Hello World');

  // Will produce a URIError
  // decodeURIComponent('%');

  // custom Error
  
  if(!user.name) {
    throw 'User has no name';  
    throw new SyntaxError('User has no name');  // assign it with a type 
  }

} catch(e) {
  console.log(e);
  console.log(e.message);   // only message
  console.log(e.name);       // only error type
  console.log(e instanceof TypeError);  // test if error is one type of error
} finally {
  console.log('Finally runs reguardless of result...');
}

console.log('Program continues...');