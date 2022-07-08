// ? 1. Iterator: object that used to iterate iteratable data

    // define iterator
    function nameIterator(names) {
        let nextIndex = 0;

        return {
            next: function() {
            return nextIndex < names.length ?
            { value: names[nextIndex++], done: false } :
            { done: true }
            }
        }
    }

    // Create an array of names
    const namesArr = ['Jack', 'Jill', 'John'];
    // Init iterator and pass in the names array
    const names = nameIterator(namesArr);

    console.log(names.next().value);
    console.log(names.next().done);


// ? 2.Generator: unknown usage
    // use Generator in function
        function* sayNames() {
            yield 'Jack';
            yield 'Jill';
            yield 'John';
        }

        const name = sayNames();

        console.log(name.next().value);


// ? 3.symbol: TODO

    // Create a symbol
    const sym1 = Symbol();
    const sym2 = Symbol('sym2');


    // uniqueness
    console.log(Symbol('123') === Symbol('123'));

    // Unique Object Keys
        // create symbol keys
        const KEY1 = Symbol();
        const KEY2 = Symbol('sym2');

        const myObj = {};

        myObj[KEY1] = 'Prop1';
        myObj[KEY2] = 'Prop2';
        myObj.key3 = 'Prop3';
        myObj.key4 = 'Prop4';
    
    // *properties

    // !Symbols are not enumerable in for...in
    for(let i in myObj) {
        console.log(`${i}: ${myObj[i]}`);  // KEY1, KEY2 are skipped
    }

    // Symbols are ignored by JSON.stringify
    console.log(JSON.stringify({key: 'prop'}));
    console.log(JSON.stringify({[Symbol('sym1')]: 'prop'}));