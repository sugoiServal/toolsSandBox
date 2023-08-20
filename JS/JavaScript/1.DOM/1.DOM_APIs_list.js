
//! table of property of element nodes:
//? ELEMENT
    //? element properties
        // styles
            .style.background = '#333';
            .style.color = '#fff';
            .style.padding = '5px';
            .style.display = 'none';  // make it disappear

        // Change text content
            .textContent = 'Task List'; 
            .innerText = 'My Tasks';  // another way
            .innerHTML = '<span style="color:red">Task List</span>';  // insert a chunk of HTML
            HTMLDataElement.value  // of some HTMLDataElement (eg, <input>) returns a string of its value

        // set id/ class
        .id
        .className  // a string of all class separated in space
        .classList  //  return a DOMTokenList collection nf all classes, access by [i]
            .classList.add(className)
            .classList.remove(className)


        // DOM tree elements access  
            .children
            .childElementCount
            .parentElement
            .previousElementSibling  
            .nextElementSibling
            // <avoid>
                .childNodes
                .parentNode
                .nextSibling;
                .previousSibling;

    //? element methods
        // attributes ()
            .getAttribute(attrName)   // get the content of an attribute (eg, href="", class="", title=""...)
            .setAttribute(attrName, attrContent)  // set title
            .hasAttribute()  //Return ture if the attribute exist
            .removeAttribute() 

        // add, replace, remove elements
            .appendChild(child); // add: append another element as child
            .replaceChild(newchild, oldchild) // replace: replace old child with new child (both element object)
            .remove();  // remove self
            .removeChild(childElement)  // remove a child element

        // Events
            .addEventListener(eventType, CallbackFunctionOnEvent)
            

// DOM methods (document.)
    // access
        .querySelector()
        .querySelectorAll()
    // create
        .createElement()
        .createTextNode() // the text being displayed: https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode