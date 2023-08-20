//! the library
  // Class easyHTTP
  function easyHTTP() {
    this.http = new XMLHttpRequest();
  }


  // easyHTTP.get(): Make an HTTP GET Request
    // callback takecare of IO, either error or success
  easyHTTP.prototype.get = function(url, callback) {
    this.http.open('GET', url, true);

    let self = this;
    this.http.onload = function() {
      if(self.http.status === 200) {
        callback(null, self.http.responseText); 
      } else {
        callback('Error: ' + self.http.status);
      }
    }

    this.http.send();
  }

  // easyHTTP.post(): Make an HTTP POST Request
  easyHTTP.prototype.post = function(url, data, callback) {
    this.http.open('POST', url, true);
    this.http.setRequestHeader('Content-type', 'application/json');   //! HTTP header: tell server the content is sent as JSON

    let self = this;
    this.http.onload = function() {
      callback(null, self.http.responseText);  // responseText is the new post
    }

    this.http.send(JSON.stringify(data));  //! data send through HTTP as string
  }


  // easyHTTP.put: Make an HTTP PUT Request
  easyHTTP.prototype.put = function(url, data, callback) {
    this.http.open('PUT', url, true);
    this.http.setRequestHeader('Content-type', 'application/json');

    let self = this;
    this.http.onload = function() {
      callback(null, self.http.responseText);
    }

    this.http.send(JSON.stringify(data));
  }

  // Make an HTTP DELETE Request
  easyHTTP.prototype.delete = function(url, callback) {
    this.http.open('DELETE', url, true);

    let self = this;
    this.http.onload = function() {
      if(self.http.status === 200) {
        callback(null, 'Post Deleted');
      } else {
        callback('Error: ' + self.http.status);
      }
    }

    this.http.send();
  }

//! the application



const http = new easyHTTP;

// Get Posts
http.get('https://jsonplaceholder.typicode.com/posts', function(err, posts) {
  if(err) {
    console.log(err);
  } else {
    console.log(posts);
  }
});

// Get Single Post
http.get('https://jsonplaceholder.typicode.com/posts/1', function(err, post) {
  if(err) {
    console.log(err);
  } else {
    console.log(post);
  }
});

// Create Data
const data = {
  title: 'Custom Post',
  body: 'This is a custom post'
};

// Create Post data to posts dump
http.post('https://jsonplaceholder.typicode.com/posts', data, function(err, post) {
  if(err) {
    console.log(err);
  } else {
    console.log(post);
  }
});

// Update Post 5 with data
http.put('https://jsonplaceholder.typicode.com/posts/5', data, function(err, post) {
  if(err) {
    console.log(err);
  } else {
    console.log(post);
  }
});

// Delete Post
http.delete('https://jsonplaceholder.typicode.com/posts/1', function(err, response) {
  if(err) {
    console.log(err);
  } else {
    console.log(response);
  }
});