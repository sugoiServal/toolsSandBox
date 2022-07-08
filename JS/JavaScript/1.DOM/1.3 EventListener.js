//? overview
  //! what is a event listener: A function affix to an element, and running constantly to catch events happen in the page
  //* API: element.addEventListener(eventType, callbackOnEvent), 
      //whenever an event is triggered the callback function is called
  //* callbackOnEvent(e) {...}, when defining the callback functio,n a parameter 'e' can be passed into it. 'e' contain essential information about the event



//? list of events:
  // MouseEvents:
      // 'click', 'dblclick 
      // 'mousedown', 'mouseup': click down/ click release 
      // 'mouseenter', 'mouseleave': mouse enter/leave element
      // 'mouseover', 'mouseout': : mouse enter/leave element or child element inside
      // 'mousemove': any pixel level movement inside the element counts a event
  // keyboardEvents:
      // 'keydown', 'keyup', 'keypress', 
  // inputEvents:
      // 'focus', 'blur': click in/out the input and enter/quit the input mode , '
      // 'cut', 'paste': when content inside input box is cut/ something be pasted into the input box
      // input': anything being inputed into the input box, 
  // selectBoxEvents:
      // 'change': make a change to the selection 
  // formEvent:
      // 'submit': when a form is submittecd


//? Example use case
  // addEventListener 
  document.querySelector('.clear-tasks').addEventListener('click', onClick);

  // define callback
  function onClick(e){
    let val;
    e.preventDefault(); // Prevent unwanted default action of some event
    val = e.shiftKey;     // if shift key held
    val = e.target;     //! Event target element
    val = e.type;      // type of the event (multiple listener can share the same callback)
    val = e.timeStamp;      // Timestamp of the event (each one is different, change over time)

    // Coords of event relative to the window
    val = e.clientY;
    val = e.clientX;

    // Coords of event relative to the element
    val = e.offsetY;
    val = e.offsetX;
  }


//? Event Bubbling & Delegation
    //* EVENT BUBBLING
      //! what is it: set event listeners to parents(multiple level) of an element, when the element is triggered, all parents' events will also be triggered, thus the event 'bubble up' the DOM tree

      // EXAMPLE:
          // the element that is actually trigger
          document.querySelector('.card-title').addEventListener('click', function(){
            console.log('card title');
          });

          // its parent also be triggered
          document.querySelector('.card-content').addEventListener('click', function(){
            console.log('card content');
          });
          // its parent's parent also be triggered
          document.querySelector('.card').addEventListener('click', function(){
            console.log('card');
          });


    //* EVENT DELGATION
      //! what is it: To trigger a callback function targeting a child elements, sometimes we need to set event listener to the parent , and then find the target child element manually in the callback function 
    
      // Example: 
        // the listener is set to the global scale
        document.body.addEventListener('click', deleteItem);

        function deleteItem(e){     
          // in the callback,
            // we care about the element being triggered (e) 
            // we identify the target element manually with its identifier -- class name: .contains('delete-item')

          if(e.target.parentElement.classList.contains('delete-item')){
            console.log('delete item');
            e.target.parentElement.parentElement.remove();
          }
        }