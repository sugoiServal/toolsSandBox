//? logical
    //? types of equals
        //* ==  VALUE EQUAL TO
        //* !=  VALUE NOT EQUAL TO
        //* === VALUE & TYPE EQUAL TO 
        //* !== VALUE OR TYPE NOT EQUAL
    //? AND: &&, OR: ||
   
    //? if-else structure
    // types of statement
        // if
        // else
        // else if
        {
            const color = 'yellow';

            if(color === 'red') {
                console.log('Color is red');
            } 
            else if(color === 'blue') {
                console.log('Color is blue');
            } 
            else {
                console.log('Color is not red or blue');
            }
        }


    //? TERNARY OPERATOR
    console.log(id === 100 ? 'CORRECT' : 'INCORRECT');


    //? switch structure: don't forget break
    {
        const color = 'yellow';

        switch(color){
        case 'red':
            console.log('Color is red');
            break;
        case 'blue':
            console.log('Color is blue');
            break;
        default:
            console.log('Color is not red or blue');
            break;
        }
    } 



//? iteration
    //? general loops: for, while and do...while
        //* FOR LOOP
        {        
            for(let i = 0; i < 10; i++){
                if(i === 2){
                    console.log('2 is my favorite number');
                    continue;
                }
            
                if(i === 5){
                    console.log('Stop the loop on 5');
                    break;
                }
            }
        }
        //* WHILE LOOP
        {
            let i = 0;
            while(i < 10) {
                console.log('Number ' + i);
                i++;
            }
        }

        //* DO WHILE

        {        
            let i = 100;
            do {   
                console.log('Number ' + i);  // Only executed one time and print 100
                i++;
            }
            while(i < 10);
        }

    //? array loop: forEach
        const cars = ['Ford', 'Chevy', 'Honda', 'Toyota'];

        // forEach: three argument: item, index, this
        cars.forEach(function(car, index, array) {
            console.log(`${index} : ${car}`);
            console.log(array);
        });


    //? object literal: for...in: key-value pairs
        // FOR IN LOOP
        const user = {
            firstName: 'John', 
            lastName: 'Doe',
            age: 40
        }
        
        for(let x in user){
            console.log(`${x} : ${user[x]}`);
        }

        // x is the key name: firstName, lastName, age



