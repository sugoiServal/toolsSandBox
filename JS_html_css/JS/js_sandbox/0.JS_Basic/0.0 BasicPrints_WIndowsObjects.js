//? Console
    console.clear();
    console.time('TIMER');
    console.log(123);
    console.table({a:1, b:2});
    console.error('This is some error');
    console.warn('This is some error');
    console.timeEnd('TIMER');





//? Window Object
    // METHODS
        // setTimeout()
        setTimeout(function(){console.log("hello")}, 2000);   // run the anom function after 2 seconds
        // Alert
        alert('Hello World');

        // Prompt
        const input = prompt();
        alert(input);

        // Confirm
        if(confirm('Are you sure')){
        console.log('YES');
        } else {
        console.log('NO');
        }

    // Window PROPERTIES
    {
        let val;

        // Outter height and width
        val = window.outerHeight;
        val = window.outerWidth;

        // Inner height and width
        val = window.innerHeight;
        val = window.innerWidth;

        // Scroll points
        val = window.scrollY;
        val = window.scrollX;

        // Location Object
        val = window.location;
        val = window.location.hostname;
        val = window.location.port;
        val = window.location.href;
        val = window.location.search;
    }

    // Navigate through pages
    {    
        // Redirect
        window.location.href = 'http://google.com';
        //Reload
        window.location.reload();

        // History Object
        let val;
        window.history.go(-2);
        val = window.history.length;
    }

    // Navigator Object
    {    
        let val;
        val = window.navigator;
        val = window.navigator.appName;
        val = window.navigator.appVersion;
        val = window.navigator.userAgent;
        val = window.navigator.platform;
        val = window.navigator.vendor;
        val = window.navigator.language;
    }


//? misc:
    //! What is Node.js:
        // it's a javascript runtime environment. just like the browser chrome, it's also an javascript runtime environment