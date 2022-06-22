# style
- use cpplint to check the style
- check Google Style

## naming
- google style: 
  - name varialbe with **snake_case**
  - name const with **kCamelCase**, "k" indicate constant











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



## 2) header files


### include
- what include do is to copy all text content inside a header file into the beginning of the current file (before the file being compiled)
``` c++
// two variant
#include <file>     // system include files, search in (external system's) lib, usr/bin etc...
#include "file"     // local include files
```
### what should be in header files?

- header file (.h):
  - the header file (.h) should be for 
    - declarations of classes, structs and its methods, prototypes, 
    - comments, documentation, explanations...
    - inline functions and their definitions 
  - header functions as I/O interface: as "library" or "package", either native to c++ or installed elsewhere
  - user can just: include the header; lookup the utilities and usage; use the utilities. No need to worry about implementation 
``` c++
system.h          // declarations of classes, structs and its methods that pertain to system 
system.cpp        // implement methods of those declared in system.h
```
- .hpp
  - so-called header files that contain source code, essentially .h + .cpp
  - store components of code that are commonly reused across one or more project (var, const, functions...)

 


# tips
## design
- declare everything "const" unless it must to be changed
  - especially for pointer and reference types

## debugging
- read error from the top
