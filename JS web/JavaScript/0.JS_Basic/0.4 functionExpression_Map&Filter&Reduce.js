
//? Function
    //* normal functaion declaration
    function greet(firstName = 'John', lastName = 'Doe') {  // default parameter(ES6), multiple parameters
        return 'Hello ' + firstName + ' ' + lastName;  // return parameter
        }
        console.log(greet("steve", "Smith"));

    //* function expression: 
        //* A function expression may be a part of a larger expression, like a callback
        // * "named" function expressions or 'anonymous' function are both supported
        const square = function(x = 3) {   // assign an anonymous function to a variable named square, here function is seem as an object
            return x*x;
        };
        console.log(square());  //  and we invoke the variable like a function 

    //* Immediately invokable function expression - IIFEs
        // ie. the function is invoked immediately after it is defined
        // the function is thus only used once
        (function(name){
        console.log('IIFE print name:'+ name);
        })('Brad');
    
    //? arrow function expression (=>) 
        // Traditional Anonymous Function
        function (a, b){
            return a + b + 100;
        }
        // each of the below is vaild arrow function 
            // 1. Remove the word "function" and place arrow between the argument and opening body bracket
            (a, b) => {
                return a + b + 100;
            }
            // 2. Remove the body braces and word "return" -- the return is implied.
            (a, b) => a + b + 100;       
            // 3. Remove the argument parentheses
            a, b => a + b + 100;



    //* PROPERTY METHODS
        const todo = {        
            add: function(){  //define inside object literal
                console.log('Add todo..');
            }
        }

        todo.delete = function() {  // define outside object literal
            console.log('Delete todo...');
        }
        todo.add();

    //! callback function:
        // function can be passed as parameter into another function
        function printGood() {
          console.log(" Good");
        }

        function main(name, callback) {
          console.log(name);
          callback();
        } 
        main();

// async: adding async make a function return a Promise object
{
  async function myFunc() {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve('Hello'), 1000);
    });

    const error = false;

    if(!error){
      const res = await promise; // Wait until promise is resolved
      return res;
    } else {
      await Promise.reject(new Error('Something went wrong'));
    }
  }

  myFunc()
    .then(res => console.log(res))
    .catch(err => console.log(err));
}

//? Map, filter and reduce
        //Source: https://medium.com/poka-techblog/simplify-your-javascript-use-map-reduce-and-filter-bd02c593cc2d
    
    //! .map Example:
        //? an compound object => another compound object with item being processed (pipelined)
        // What you have
        var officers = [
            { id: 20, name: 'Captain Piett' },
            { id: 24, name: 'General Veers' },
            { id: 56, name: 'Admiral Ozzel' },
            { id: 88, name: 'Commander Jerjerrod' }
        ];
        // What you need: officersIds == [20, 24, 56, 88]
        let officersIds = officers.map(function (officer) {  // function expression
            return officer.id
          });
        officersIds = officers.map(officer => officer.id);   // equally with arrow function

        // what happened?
          // map take 2 argument: a callback function and an (optional) context (this in the example)
          // The callback runs for each value in the array and returns each new value in the resulting array.
    
    //! .reduce Example:
          //? an compound object => one refined object
          // What you have: a set of pilots
          var pilots = [
            {
              id: 10,
              name: "Poe Dameron",
              years: 14,
            },
            {
              id: 2,
              name: "Temmin 'Snap' Wexley",
              years: 30,
            },
            {
              id: 41,
              name: "Tallissan Lintra",
              years: 16,
            },
            {
              id: 99,
              name: "Ello Asty",
              years: 22,
            }
          ];

          // 01) what you want: the total number of years of all pilots(the accumulator)
          let totalYears = pilots.reduce(function (accumulator, pilot) {
            return accumulator + pilot.years;
          }, 0);
          totalYears = pilots.reduce((accumulator, pilot) => accumulator + pilot.years, 0);  // equally with arrow function
          
          // what reduce do: run callback function on all value and an global variable, the variable is set to 0 on start(2nd parameter). return the global variable

          // 02) what you want: find out the most experenced pilot
          var mostExpPilot = pilots.reduce(function (oldest, pilot) {
            return (oldest.years || 0) > pilot.years ? oldest : pilot;
          }, {});  // oldest change: {} -> some pilot object

    //! filter()    
        //? an compound object => an reduced compound object that satisfy some condition 
        // What you have: a set of pilots
        var pilots = [
            {
              id: 2,
              name: "Wedge Antilles",
              faction: "Rebels",
            },
            {
              id: 8,
              name: "Ciena Ree",
              faction: "Empire",
            },
            {
              id: 40,
              name: "Iden Versio",
              faction: "Empire",
            },
            {
              id: 66,
              name: "Thane Kyrell",
              faction: "Rebels",
            }
          ];
        
        // what you want: rebels pilots and empire pilots
        const rebels = pilots.filter(pilot => pilot.faction === "Rebels");
        const empire = pilots.filter(pilot => pilot.faction === "Empire");
        //* Basically, if the callback function returns true, the current element will be in the resulting array