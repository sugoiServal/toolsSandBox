//! scenerio: when post time is longer than the get time, 
  // user post new post and then getPosts, the new post will not appear (since it is still not added to the database)
    
  //* mimic the server database
    const posts = [
      {title: 'Post One', body: 'This is post one'},
      {title: 'Post Two', body: 'This is post two'}
    ];
    
//! method1: callback
  // to solve the delimma, 
    // we do not getPosts after the post call
    // instead, we getPosts inside post call as a callback function, to make sure getPosts is run after post is completed

  //? the code
  {


    // user post something to the server: 2s
    function createPost(post, callback) {
      setTimeout(function() {   // push after 2 seconds, mimic net delay
        posts.push(post);
        callback();
      }, 2000);
    }

    // server send all posts to client side: 1s
    function getPosts() {
      setTimeout(function() {
        let output = '';
        posts.forEach(function(post){
          output += `<li>${post.title}</li>`;
        });
        document.body.innerHTML = output;
      }, 1000);
    }

    createPost({title: 'Post Three', body: 'This is post three'}, getPosts);
  }

//! method 2. es6 promise
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
  //The Promise object represents the eventual completion (or failure) of an asynchronous operation and "its resulting value" -- a proxy value not necessarily known when the promise is created
  // allows you to associate handlers to different asynchronous scenerio
  // A Promise is in one of these states:
    // pending: initial state, neither fulfilled nor rejected.
    // fulfilled: meaning that the operation was completed successfully.
    // rejected: meaning that the operation failed.
{
  function createPost(post) {
    return new Promise(function(resolve, reject){   // resolve: called when success, reject:called when error
      setTimeout(function() {
        posts.push(post);

        const error = false;  // simulate error from server

        if(!error) {
          resolve();
        } else {
          // 
          reject('Error: Something went wrong');
        }
      }, 2000);
    });
  }

  // same
  function getPosts() {
    setTimeout(function() {
      let output = '';
      posts.forEach(function(post){
        output += `<li>${post.title}</li>`;
      });
      document.body.innerHTML = output;
    }, 1000);
  }

Promise.then and Promise.catch:

  createPost({title: 'Post Three', body: 'This is post three'})
  .then(getPosts)     //!
  .catch(function(err) {   //!
    console.log(err);
  });
}