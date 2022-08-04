// DOM selector overview:
    // what is it: method of Document object
    //* what they do: select elements in the HTML, aka ***access*** (for modification)
    //* why selector: part of UI: user action detected => backend process data => processed info reflect to UI (involve select and modify HTML element) 
    // types of selector: 
        // old and new API, old with limited function, tedious; new APIs are capable to replace Jquery
        // single selectors or multiple selectors: return one or a collection of elements(nodelist, array, HTMLCollection...)
    
//? old selector API: getElementByX()

    // 1. document.getElementById(), return one element
        const taskTitle = document.getElementById('task-title');   // return element whose id is 'task-title'

        // EXAMPLE manipulation: 
            //Change styling
            taskTitle.style.background = '#333';
            taskTitle.style.color = '#fff';
            taskTitle.style.padding = '5px';
            taskTitle.style.display = 'none';  // make it disappear

            // Change text content
            taskTitle.textContent = 'Task List'; 
            taskTitle.innerText = 'My Tasks';  // another way
            taskTitle.innerHTML = '<span style="color:red">Task List</span>';  // insert HTML

    // 2. (multiple) document.getElementByClassName(), return HTMLCollection of elements
        const collection_items = document.getElementsByClassName('collection-item');
        const listItems = document.querySelector('ul').getElementsByClassName('collection-item');  // nested, select elements with class ''collection-item' from the first ul

    // 3. (multiple) document.getElementsByTagName(), return HTMLCollection of elements of that tag
        let lis = document.getElementsByTagName('li');





//? new API: querySelector() and querySelectorAll()
    // access elements with unified API directly using HTML hashtag and HTML/CSS syntax(instead of differ APIs: getElementByX()) 
    // put: tag, psedo-selector, id, class... and their combination ......

    // 1. document.querySelector(), return the ***first one*** that match
        console.log(document.querySelector('#task-title'));
        console.log(document.querySelector('.card-title'));
        console.log(document.querySelector('h5'));

        // Example modification (nth-child psudo-selector)
        document.querySelector('li').style.color = 'red';
        document.querySelector('ul li').style.color = 'blue';
        document.querySelector('li:last-child').style.color = 'red';
        document.querySelector('li:nth-child(3)').style.color = 'yellow';
        document.querySelector('li:nth-child(4)').textContent = 'Hello World';
        document.querySelector('li:nth-child(odd)').style.background = '#ccc';
        document.querySelector('li:nth-child(even)').style.background = '#f4f4f4';
        document.querySelector('input[type="number"]');


    // 2. document.querySelectorAll, return (Array) of all elements that satisfis the filter
        const items = document.querySelectorAll('ul.collection li.collection-item');
        const liOdd = document.querySelectorAll('li:nth-child(odd)');
        const liEven = document.querySelectorAll('li:nth-child(even)');


        // Example modification
        items.forEach(function(item, index){
            item.textContent = `${index}: Hello`;
        });

        liOdd.forEach(function(li, index){
        li.style.background = '#ccc';
        });

        for(let i = 0; i < liEven.length; i++){
        liEven[i].style.background = '#f4f4f4';
        }




