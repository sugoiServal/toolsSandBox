//! EasyHttp with Promise

class EasyHTTP_Promise {
   
    // Make an HTTP GET Request 
    get(url) {
      return new Promise((resolve, reject) => {   // wrap whole thing with promise, so that the app get a promise
        fetch(url)  // a promise
        .then(res => res.json()) // still a promise
        .then(data => resolve(data)) // call callback resolve() with the data
        .catch(err => reject(err)); // error case, call callback reject() with the err
      });
    }
  
    // Make an HTTP POST Request
    post(url, data) {
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
      });
    }
  
     // Make an HTTP PUT Request
     put(url, data) {
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
      });
    }
  
    // Make an HTTP DELETE Request
    delete(url) {
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(() => resolve('Resource Deleted...'))
        .catch(err => reject(err));
      });
    }
  
   }
  
//! Async + Await case


 class EasyHTTP_Async_Await {
    // Make an HTTP GET Request 
    async get(url) {
      const response = await fetch(url);
      const resData = await response.json();
      return resData;
    }
  
    // Make an HTTP POST Request
    async post(url, data) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      const resData = await response.json();
      return resData;
     
    }
  
     // Make an HTTP PUT Request
     async put(url, data) {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const resData = await response.json();
      return resData;
    }
  
    // Make an HTTP DELETE Request
    async delete(url) {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json'
        }
      });
  
      const resData = await 'Resource Deleted...';
      return resData;
    }
  
   }
  
   