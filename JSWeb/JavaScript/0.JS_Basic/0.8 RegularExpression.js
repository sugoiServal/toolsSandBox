// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
// RE Object
    // /exp/
    // add flags: at the end
        // flags:  
        //     g: Global search, return all matches
        //     i: 	Case-insensitive search

    let re;
    re = /hello/;
    re = /hello/i; // i =  case insensitive
    re = new RegExp('foo', 'i');

// properties
    re.source;  //re.source, the expression ('hello') //

// evaluate RE
    let result = re.exec('string to match');
    let result = 'string to match'.match(re);  // alt, use string method match
        // the result:
            // result = ['matchString', index:matchPosition, input:'inputString']
    // console.log(result[0]);
    // console.log(result.index);
    // console.log(result.input);


// test RE: match or not (true or false)
    re.test('Hello');

// STRING RE methods:
    // replace() - Replace RE match substring with alt string
        const str = 'Hello There';
        const newStr = str.replace(re, 'Hi');

    // search() - partial functions, Returns index of the first match, if not found retuns -1
        'string to match'.search(re);


