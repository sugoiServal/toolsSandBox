//! XHR	XmlHttpRequest(), core part of Ajax functionality	
    //? infos
        // this.readyState:
            // 0: request not initialized 
            // 1: server connection established
            // 2: request received 
            // 3: processing request 
            // 4: request finished and response is ready



    //? 1. XHR API:  GET use case
    {   
        document.getElementById('button2').addEventListener('click', loadCustomers);

        function loadCustomers(e) {

        // Create an XHR Object
        const xhr = new XMLHttpRequest();
        // request data
        xhr.open('GET', 'json/customers.json', true);  //  method: string, url: string, async: boolean


        // define action after data is loaded (readyState Value 4)
        xhr.onload = function(){
            //! is called on readyState 4
            if(this.status === 200) {   // if XHR status === 200 (HTTP status)

                // process JSON data
                const customers = JSON.parse(this.responseText);  
                    // responseText: Text being read from url
                    // customers: array of Object Literal
                let output = '';

                customers.forEach(function(customer){
                output += `
                <ul>
                    <li>ID: ${customer.id}</li>
                    <li>Name: ${customer.name}</li>
                    <li>Company: ${customer.company}</li>
                    <li>Phone: ${customer.phone}</li>
                </ul>
                `;
                });

                // modify the page without reloading 
                document.getElementById('customers').innerHTML = output;
            }
        }

        // Optional - error handling
        xhr.onerror = function() {
            console.log('Request error...');       
        }

        // Optional - Used for spinners/loaders
        xhr.onprogress = function(){
            // is called on readyState === 3
            // define spinners or loading animation
            console.log('READYSTATE', xhr.readyState, "request received, processing...");
        }

        // Initiates the request.
        xhr.send();   // Initiates the request. The body argument provides the request body, if any, and is ignored if the request method is GET or HEAD.
        }
    }

