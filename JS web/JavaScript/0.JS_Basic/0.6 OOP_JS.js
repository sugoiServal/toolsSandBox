//? ES6 OOP syntax suger
    //? OOP 101
        class Person {
            constructor(firstName, lastName) {
                this.firstName = firstName;
                this.lastName = lastName;
            }
            greeting() {
                return `greeting from ${this.firstName} ${this.lastName}`;
            }
            getsMarried(newLastName) {
                this.lastName = newLastName;
            }
        }
        const mary = new Person("Mary", 'Williams');
        mary.getsMarried('Thompson')

    //? Static methods
        //* a method that belongs to a class instead of an object, no need to instantiate an object to call
        class BasicMathTool {
            static addition(x, y) {
                return x + y;
            }
        }
    
    //? inheritance (subclasses) in ES6
        class Customer extends Person {
            constructor(firstName, lastName, phone, membership) {
                super(firstName, lastName);  //* call the parent class constructor and pass (firstName, lastName) to it
                this.phone = phone
                this.membership = membership
            }
        }
    //? this conflict
        // when we want to refer to the object(this) in object method inside a function expression, the this actually point to the function expression, so there are two 'this' that conflicts
        // example:
            // class
            function easyHTTP() {
                this.http = new XMLHttpRequest();
            }
            
            // member function 
            easyHTTP.prototype.get = function(url, callback) {
                this.http.open('GET', url, true);
                this.http.onload = function() {    // in a function expression callback
                    if(this.http.status === 200) {     //! the 'this' actually point the the function itself, but we want it to be the easyHTTP
                        callback(null, self.http.responseText);
                    } else {
                        callback('Error: ' + self.http.status);
                    }
                }
            // solution 1. use arrow function
            {
                easyHTTP.prototype.get = function(url, callback) {
                    this.http.open('GET', url, true);
                    this.http.onload = () => {    // use arrow function
                        if(this.http.status === 200) {     //! use self instead of this
                            callback(null, this.http.responseText);
                        } else {
                            callback('Error: ' + this.http.status);
                        }
                    }
                }
            }
            // solution 2. use a variable which refer to this
            {
                    easyHTTP.prototype.get = function(url, callback) {
                        this.http.open('GET', url, true);
                        let self = this;   //! self is this
                        this.http.onload = function() {    // in a function expression callback
                            if(self.http.status === 200) {     //! use self instead of this
                                callback(null, self.http.responseText);
                            } else {
                                callback('Error: ' + self.http.status);
                            }
                        }
                }
            }
                

// OOP JavaScript under the hood (ES5): can ignore

    //? constructor
        function Person(name, dateBirth) {

            // member properties
            this.name = name;
            this.birthday = new Date(dateBirth);

            //member method
            this.calculateAge = function(){   
                const diff =  Date.now() - this.birthday.getTime();
                const ageDate = new Date(diff);
                return Math.abs(ageDate.getUTCFullYear() - 1970);
            }
        }

    //? instantiate 
        const brad = new Person('Brad', '9-10-1981');
        console.log(brad.calculateAge());
        
    //? prototype: something like a medium to aid the inheritance of JavsScript OOP
        // Object.prototype
            // each object of JS has a prototype, all object inheritate the Object.prototype 
            // something like a meta class that includes some meta properties
        
    
    
        // methods like calculateAge can be declare outside the class, they are added to the prototype of Person 
        Person.prototype.calculateAge = function(){
            const diff =  Date.now() - this.birthday.getTime();
            const ageDate = new Date(diff);
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        // Person.prototype includes:
            // Constructor (the function content inside  "function Person(name, dateBirth) {}")
            // Object.prototype
            // other member methods of Person


    //? prototypical inheritance
        function Customer(firstName, lastName, phone, membership) {
            Person.call(this, firstName, lastName);   // call Person constructor
            // rest of Customer constructor
            this.phone = phone;   
            this.membership = membership;
        }

        // Inherit the Person prototype methods
        Customer.prototype = Object.create(Person.prototype);

        // Make customer.prototype return Customer()
        Customer.prototype.constructor = Customer;
        
        // reload parent method
        Customer.prototype.calculateAge = function(){
            return `Hello there ${this.firstName} ${this.lastName} welcome to our company`;
        }

    //? create classes through Object.create (another syntax to define)
    {      
        // define the prototypes containing methods
        const personPrototypes = {
            greeting: function() {
                return `Hello there ${this.firstName} ${this.lastName}`;
            },
            getsMarried: function(newLastName) {
                this.lastName = newLastName;
            }
        }

        // SYNTAX 1:
            // Object.create
            const mary = Object.create(personPrototypes);
            // add properties
            mary.firstName = 'Mary';
            mary.lastName = 'Williams';
            mary.age = 30;
        // SYNTAX 2:
            const brad = Object.create(personPrototypes, {
                firstName: {value: 'Brad'},
                lastName: {value: 'Traversy'},
                age: {value: 36}
            });
    }


//? misc: Primitive types and references types can all be instantiate as an object
    // String
    const name = new String('Jeff');

    // Number
    const num2 = new Number(5);

    // Boolean
    const bool2 = new Boolean(true);

    // Function
    const getSum2 = new Function('x','y', 'return 1 + 1');

    // Object
    const john2 = new Object({name: "John"});

    // Arrays
    const arr2 = new Array(1,2,3,4);

    // Regular Expressions
    const re2 = new RegExp('\\w+');