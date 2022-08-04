document.getElementById('button1').addEventListener('click', getText);

document.getElementById('button2').addEventListener('click', getJson);

document.getElementById('button3').addEventListener('click', getExternal);

// Fetch API
  // Fetch return Promise object
    // Promise.then: function when status is fulfilled, return a promise object wrapping the return data
    // Promise.catch: function when status is rejected, return a promise object wrapping the error

// Get local text file data
function getText() {
  fetch('test.txt')
    .then(res => {    //* response Object, is a data structure in fetch, include many useful properties
      if (!res.ok) {
        throw new Error(res.error);  // catch HTTP error
      }
      return res.text();    // res.text() return a promise
    })
    .then(data => {
      console.log(data);
      document.getElementById('output').innerHTML = data;
    })
    .catch(err => {
      console.log(err);
    });
}


// Get local json data
function getJson() {
  fetch('json/posts.json')
    .then(res => {
      if (!res.ok) {
        throw new Error(res.error);  // catch HTTP error
      }
      return res.json();
    })
    .then(data => {
      console.log(data);
      let output = '';
      data.forEach(function(post) {
        output += `<li>${post.title}</li>`;
      });
      document.getElementById('output').innerHTML = output;
    })
    .catch(err => {
      console.log(err);
    });
}


// Get from external API
function getExternal() {
  fetch('https://api.github.com/users')
    .then(res => {
      if (!res.ok) {
        throw new Error(res.error);  // catch HTTP error
      }
      return res.json();
    })
    .then(data => {
      console.log(data);
      let output = '';
      data.forEach(function(user) {
        output += `<li>${user.login}</li>`;
      });
      document.getElementById('output').innerHTML = output;
    })
    .catch(err => {
      console.log(err);
    });
}