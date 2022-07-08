//? Numbers: Math Objects
    let val;
    val = Math.PI;
    val = Math.round(Math.E);
    val = Math.ceil(Math.E);
    val = Math.floor(Math.E);
    val = Math.sqrt(Math.E);
    val = Math.pow(Math.E, 3);
    val = Math.abs(-3);

    val = Math.min(-3, -2);
    val = Math.max(-3, -2);

    val = Math.random(); // Uniformly distributed (0, 1)
    val = Math.random()*20; // Uniformly distributed (0, 20)

//? Strings
    let firstName = 'William';
    let lastName = 'Johnson';

    let name =  firstName + ' ' + lastName;

    name = firstName + ' ';
    name += lastName;

    // ! template literals
    {
        const name = 'John';
        const age = 31;
        const job = 'Web Developer';
        const city = 'Miami';
        function hello(){
            return 'hello';
        }
        let html;
        // With template strings (es6)
        html = `
        <ul>
        <li>Name: ${name}</li>
        <li>Age: ${age}</li>
        <li>Job: ${job}</li>
        <li>City: ${city}</li>
        <li>${2 + 2}</li>
        <li>${hello()}</li>
        <li>${age > 30 ? 'Over 30' : 'Under 30'}</li>
        </ul>
        `;
    }

    // escape
    let quoteSign = '\'';  // escaping ' sign

    // properties
    console.log(name.length);

    // methods
        console.log(name.toUpperCase());
        console.log(name.toLowerCase());
        console.log(name.concat(': a name'));

        console.log(name.indexOf('l'));   // Find the first index of a character
        console.log(name.lastIndexOf('l'));   // Find the last index a character
        console.log(name.charAt(name.length - 1));   // get the last character of a string

        // substrings
        console.log(name.substring(0,4));   // slice 0, 4
        console.log(name.slice(0,4));   // slice 0, 4
        console.log(name.slice(-3));   // slice last three
    
        // split()
        console.log(name.split(' '));   //! split string into array base on ' '

        // replace()
        console.log(name.replace('William', "Dude"));   // search for substring and replace it which another
        
        // includes()  
        console.log(name.includes('William'));   // return true if a substring is included 
