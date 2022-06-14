//! what is DOM:
    // == document object model: A tree presentation of HTML structure
    // Javascript use the abstracted model to manipulate HTML document
    // "object" tells that it is an OOP tool structure
        // DOM is a child of the Window object

//? DEFINE two data structures: 
    //* HTML Collection: An object in DOM. it's property kind of like an array. But cannot be iterate directly
        // some methods in DOM return HTML Collection, which can be transformed into array back and forth 
    //* Nodelist: A NodeList is a collection of document nodes (element nodes, attribute nodes, and text nodes). HTMLCollection items can be accessed by their name, id, or index number. NodeList items can only be accessed by their index number.

//? document objects properties
{
    let val;

    val = document; 
    val = document.all;  // @deprecated: all HTML tags from top to the bottom, return as Nodelist
    // access tags content in the document
        val = document.head;
        val = document.body;
        val = document.doctype;  // <!DOCTYPE html>
        val = document.forms;  // return HTML collection of all FORMs in the document      
        val = document.links;  // return HTML collection of all links in the document   
        val = document.images; // return HTML collection of all images in the document         
        val = document.scripts; // return HTML collection of all scripts in the document      
 

    val = document.domain; // loopback address IP
    val = document.URL;  // IP + port + page
    val = document.characterSet; // UTF-8
}


//! Convert HTML collection into an Array

    let scripts = document.scripts;
    let scriptsArray = Array.from(scripts);  // use Array.from()

    scriptsArray.forEach(function(script) {
        console.log(script.getAttribute('src'));
    });



