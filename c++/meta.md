






# namespace
``` c++
using namespace <nameSpace>     // exclude the need to specify namespace with nameSpace::xxx
```






# program lifespan

## 1) scope
### global scope
- every program starts with "main" function, which define the global scope
  - main program exits with an error code, 0 means ok, non-0 means bad
### loacl scope
- local scope within {}
  - variables declared inside {} belongs to the scope
  - die in the of the their scope
  - **unless the variable is a STL type or other libraries (that implemented with smart pointer) and there are still pointers/references that point to the variable**




# style
- use cpplint to check the style
- check Google Style

## naming
- google style: 
  - name varialbe with **snake_case**
  - name const with **kCamelCase**, "k" indicate constant
  - name Function in **CamelCase()**
  - use **snake_case** for function arguments
  - name Class in **CamelCase()**
    - use snake_case_ with tailing "_" for private data member



 


# tips
## design
- declare everything "const" unless it must to be changed
  - especially for pointer and reference types, Don't want the content pointed to being manipulated by random code.
  - use const reference (const Type&) as function arguments
- function:
  - a function should do only one thing, not multiple. 
  - use const reference (const Type&) as function arguments
  - Default arguments,
    -  avoid, only use them when readability gets much better
    -  always set in declaration instead of definition
- struct: 
  - struct is a class where everything is public. 
  - Use struct as a simple data container. 
  - If a struct needs a function it should be a class instead.
- class:
  - all data must be **private**. Public interface is the only way from outside to manipulate the data
  - data member should be set in the constructor,  AVOID setter
  - if data need cleanup (eg, memory allocated with new), do it in the Destructor
  - mark all functions with **const correctness** (fun() const;), unless its function is to change the state of the object 
## debugging
- read error from the top
