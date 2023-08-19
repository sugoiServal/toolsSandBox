//? basic tree structure: parents, child/children, and siblings
  //? Child APIs
    // 1. children property: 
        // ! Get children **element** nodes in HTMLCollection, not include line break
      val = list.children;
      val = list.children[1];

    // 2. firstElementChild/ lastElementChild (first child that is an element)
      val = list.firstElementChild;
      val = list.lastElementChild;

    // 3. childElementCount property
      val = list.childElementCount;

    // <avoid> including non element nodes
        // 1. childNodes property:
          //! Get child nodes in nodeList, including non element nodes(not wanted)
          val = list.childNodes;
          val = list.childNodes[0];
          val = list.childNodes[0].nodeName;  // #Text
          val = list.childNodes[3].nodeType;  // 3
          // nodeType to nodeName table
            // 1 - Element
            // 2 - Attribute (deprecated)
            // 3 - Text node
            // 8 - Comment
            // 9 - Document itself
            // 10 - Doctype

        // 2. firstChild /lastChild (include non element)
          val = list.firstChild;
          val = list.lastChild;

          
  //? parents APIs
    val = listItem.parentElement;
    val = listItem.parentNode;  // avoid


  //? sibling APIs
    // Get next sibling
    val = listItem.previousElementSibling;
    val = listItem.nextElementSibling;

    // avoid
    val = listItem.nextSibling;
    val = listItem.previousSibling;

//? tree element modification (add, remove and replace)
  //* adding EXAMPLE: create a li inside list
  {
    // Create element
    const li  = document.createElement('li');

    // Add class
    li.className = 'collection-item';

    // Add id
    li.id = 'new-item';

    // Add attribute
    li.setAttribute('title', 'New Item');

    // Create text node and append
    li.appendChild(document.createTextNode('Hello World'));

    // Create new link element
    const link = document.createElement('a');
    // Add classes
    link.className = 'delete-item secondary-content';
    // Add icon html
    link.innerHTML = '<i class="fa fa-remove"></i>';

    // Append link into li
    li.appendChild(link);

    // insert as nth child
    li.insertBefore(newElement, li.children[2]);

    // Append li as child to ul
    document.querySelector('ul.collection').appendChild(li);

    console.log(li);
  }

  // * removing/replacing elements Example
    // Replace
    cardAction.replaceChild(newHeading, oldHeading);

    // Remove list item
    lis[0].remove();

    // Remove child element
    list.removeChild(lis[3]);

  // Modify elements Classes/ attributes
    //classes 
    val = link.className;
    val = link.classList;
    link.classList.add('test');
    link.classList.remove('test');

    // Attributes
    val = link.getAttribute('href');
    val = link.setAttribute('href', 'http://google.com');
    val = link.hasAttribute('title');
    link.removeAttribute('title');




  
