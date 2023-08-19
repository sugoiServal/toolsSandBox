//? Local/Session Storage Overview:
    // What it is: a temporary storage in the browser that can store small data
        // use/API as an object
    // used for teaching/ small scale project to emulate server experience: data can be pertained after page being closed

    // Local Storage or Session Storage:
        // Session Storage: clear each time browser close
        // Local Storage: clear only when you manually do so

    // the storage structure:
        //! key-value pair: all the data is stored as string 

//? Learn the API:
    // insert item
        localStorage.setItem('name', 'John');
        sessionStorage.setItem('age', '42');

    // remove from storage
        localStorage.removeItem('name');

    // access from storage
        const name = localStorage.getItem('name');
        const age = sessionStorage.getItem('age');

    // clear local storage
        localStorage.clear();

    // to store a collection of items (eg, array)
        //* the array is stored as a single entry in the storage (name: theArray)
        //* use JSON.stringify and JSON.parse

        // store an array of item
            localStorage.setItem('theArray', JSON.stringify(aArray));
        // access from storage
            let aArray = JSON.parse(localStorage.getItem('theArray'))


// Example: 
    // when a new item (task) is submitted from the form, 
    // get 'tasks' as Array from localStorage 
    // push 'task' into 'tasks'
    // save modified 'tasks' back to localStorage
{
    document.querySelector('form').addEventListener('submit', function(e){
        const task = document.getElementById('task').value;
    
        let tasks;
    
        if(localStorage.getItem('tasks') === null) {
        tasks = [];
        } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        }
    
        tasks.push(task);
    
        localStorage.setItem('tasks', JSON.stringify(tasks));
    
        alert('Task saved');
    
        e.preventDefault();
    });
}