//? array
    //* Create an array
    const numbers = [43,56,33,23,44,36,5];
    const numbers2 = new Array(22,45,33,76,54);
    const fruit = ['Apple', 'Banana', 'Orange', 'Pear'];
    const mixed = [22, 'Hello', true, undefined, null, {a:1, b:1}, new Date()];

    //* array properties
        console.log(numbers.length);
        console.log(Array.isArray(numbers));  // return ture if the object is an array

    //* array method

        // access by index (0 based)
        {
            let val;
            val = numbers[3]; // Get single value
            numbers[2] = 100;
            val = numbers.indexOf(36);  // Find first index of a value
        }
        //! mutate
        numbers.push(250);  // Add on to end
        numbers.pop();
        numbers.unshift(120); // Add on to front
        numbers.shift(); // Take off from front
        numbers.splice(1,3); // Splice values: remove by starting index and elements counts. return the removed elements. replace with new if provided
        numbers.reverse(); // Reverse

        // Concatenate array
        val = numbers.concat(numbers2);

        //! Sort arrays
            val = fruit.sort();  // sort base on the first characterr
            val = numbers.sort();   // sort base on the first number(basically treated as string)

            //! sort by rule (provide a rule)
                //? MY RULE: the function should always return a negative value (assuming a sorted array)
                // small to large
                val = numbers.sort(function(x, y){
                return x - y;   // (x < y, so x - y is negative)
                });
                console.log(val);

                // large to small
                val = numbers.sort(function(x, y){
                return y - x;  // (x > y, so y - x is negative)
                });
                console.log(val);


    // ! Find or subarray by rule
        // a rule
        function greaterThan10(num){
            return num > 12;
            }

        // find(): the first value
        console.log(numbers.find(greaterThan10));

        // filter(): a subarray that satify the condition
        console.log(numbers.filter(greaterThan10));

    // ! Destructuring
        // Rest pattern
        [a, b, c, ...rest] = [100, 200, 300, 400, 500];

        // Parse array returned from function
            function getPeople() {
              return ['John', 'Beth', 'Mike'];
            }

            let person1, person2, person3;
            [person1, ...rest] = getPeople();



//? Object Literal(sometimes dictionary, sometimes class)
    
    // define an object literals 
        const person = {

            // primitive types
            firstName: 'Steve',
            lastName: 'Smith',
            age: 36,
            email: 'steve@aol.com',

            // nested reference types
            hobbies: ['music', 'sports'],  // array

            address: {        // object literal
            city: 'Miami',
            state: 'FL'
            },

            getBirthYear: function(){  // functions
            return 2017 - this.age;
            }
        }

    // access values: '.' like any object
        val = person.address.state;
        val = person.getBirthYear();
    
    // array of object literals
        const people = [
            {name: 'John', age: 30},
            {name: 'Mike', age: 23},
            {name: 'Nancy', age: 40}
        ];
        
        for(let i = 0; i < people.length; i++){
            console.log(people[i].name);
        }

//? Dates & Times

    const today = new Date();
    // three formats
    let birthday = new Date('9-10-1981 11:25:00');
    birthday = new Date('September 10 1981');
    birthday = new Date('9/10/1981');

    {
        // access
            let val;
            val = today.getMonth();
            val = today.getDate();  // The date of the month
            val = today.getDay();   // the day of the week
            val = today.getFullYear(); // the year
            val = today.getHours();
            val = today.getMinutes();
            val = today.getSeconds();
            val = today.getMilliseconds();
            console.log(today.getTime());   // timestamp in milliseconds: time pasted since 1/1/1970
        
        // modify
            birthday.setMonth(2);
            birthday.setDate(12);
            birthday.setFullYear(1985);
            birthday.setHours(3);
            birthday.setMinutes(30);
            birthday.setSeconds(25);
    }

// ES6 MAPS: generalized key-value pairs - can use ANY type as a key or value

    const map1 = new Map();

    // Set Keys
    const key1 = 'some string',
        key2 = {},
        key3 = function() {};

    // Set map values by key
    map1.set(key1, 'Value of key1');
    map1.set(key2, 'Value of key2');
    map1.set(key3, 'Value of key3');

    // basic operations
        // Get values by key
        console.log(map1.get(key1), map1.get(key2), map1.get(key3));
        // Count values
        console.log(map1.size);

    // ITERATING MAPS
        for(let [key, value] of map1) {
            console.log(`${key} = ${value}`);
        }

        for(let key of map1.keys()) {
        console.log(key);
        }

        for(let value of map1.values()) {
        console.log(value);
        }

        // Loop with forEach
        map1.forEach(function(value, key){
            console.log(`${key} = ${value}`);
        });

        // CONVERT TO ARRAYS
        const keyValArr = Array.from(map1);

// ES6 SETS - Store unique values, unordered

    const set1 = new Set([1, true, 'string']);

    // Add values to set
    set1.add(100);
    set1.add('A string');
    set1.add({name: 'John'});
    set1.add(true);
    set1.add(100);

    // basic operations
        // Get count
        console.log(set1.size);

        // Check for values
        console.log(set1.has(100));
        console.log(set1.has({name: 'John'}));

        // Delete from set
        set1.delete(100);


    // ITERATING THROUGH SETS

        // For..of 
        for(let item of set1) {
        console.log(item);
        }

        // ForEach Loop
        set1.forEach((value) => {
        console.log(value);
        });

    // CONVERT SET TO ARRAY
    const setArr = Array.from(set1);
