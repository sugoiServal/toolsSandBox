//? Define Variables : var, let, const
    // var, let, const

    // *var: 
        // Can be reassigned
        // Can be uninitialized
        // Can be redeclare (Var a = "1"; var a = '2';)
    var name;    
    var name = 'Jone Doe';
    name = 'Steve';
    
    // *let 
        // Can be reassigned
        // Can be uninitialized
        // cannot be redeclare in strict mode ('use strict';)
        //! the variable is defined in a immediated block scope (a pair of {}), and no more exist after the "}"
            //* so in block scope we can define a variable with let which have the same name as another variable outside 
     
    // *const
        // Cannot be reassigned
        // Cannot be uninitialized
        //! the premitive types inside objects can be changed(add, remove or mutate)

    // ! one rule of var:
        // in function scope, all variable are limited to the scope
        //* in block scope (whenever it is in {} and not in a function, for, while, if, etc): only ***var*** is STILL the SAME variable as that of the global scope
        //* avoid ***var*** because it does not act as other language and cause confusion
//? DataTypes
    //* There are two types of data types: primitive data types and reference data types
        // premitive data types: direct access; store on the stack;  
            // *string; number(float or integer); bool; null(an intentional empty symbol); undefined(ie: container without value); symbols(ES6)
        // reference data types(or objects): assessed by reference(pointer); store on the heap; eg:
            // *Arrays, Object Literals; functions; Dates; anything else
    //* Dynamically typed language
        //! aka: variable do not own types, value own types. SO: same variable can hold value of different types. NO need to specify data types
        // As opposed to Java or C++(statically typed)
        // TypeScript allows static typing

    //? primitive types
        const name = 'a';
        const age = 46;
        const hasKids = true;
        const aNull = null;  //* when call "typeof aNull;", The console should return an object
        const aSymbol = Symbol();
    
    //? reference types
        const hobbies = ['movie', 'music']; // Array
        const address = {  // Object literal
            city: 'Boston',
            state: "MA"
        }
        const today = new Date();

//? Type Conversion
        //  to string
        let strNum =  String(5+4);
        let strNum2 = (5).toString();
        let strBool = String(true);
        let strDate = String(new Date())

        // to number
        let Num2 = Number(strNum2);
        Num2 =  parseInt("100");
        Num2 =  parseFloat("100.30");

//? misc 
    // 1. variable naming convention
        // variable cannot start with a number, can start with _(eg: private variable in OOP) or $(eg: DOM manipulation) 
        // multiWords: firstName(Camel case), or second_name(snake or underscore), ThirdName(Pascal case, class names)
    // 2. number of boolean and null: true = 1, false = 0, null = 0. For value that cannot be parse into number, it is 'NaN'
