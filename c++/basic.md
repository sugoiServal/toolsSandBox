# reference
- https://en.cppreference.com/w/

# basic IO
```c++
#include <iostream>

std::cin        // map to stdin
std::cout       // map to stdout
std::cerr        // map to stderr

int some_number;

// cin 
std::cin >> some_number;
// cout
std::cout << "number =" << some_number << std::endl;
```



# Variable
## IMPORTANT:
- always initialize variables if you can
``` c++
int initialization_is_good = true;
```

## basic types
``` c++
bool is_fun = true;
char c_return = '\n';
int meaning_of_life = 42;
short small_int = 42;
long big_int = 42;
float fraction = 0.01f;
double precise_frac = 0.01;

// auto type
auto any_int = 13;
auto any_float = 13.0f;
auto any_double = 13.0;
```

## included types
### string
``` c++
// string
#include <string>
std::string hello = "HELLO"     
hello = hello + "lol";          // concat

hello.empty();                  // check empty
```
### array
- array: collection of **SAME TYPE**, **FIX SIZE**
``` c++
// array: collection of **SAME TYPE**
#include <array>
std::array<float, 3> arr = {1.0f, 2.0f, 3.0f}
std::cout << arr[1];           // access

arr.size()
arr.clear()
arr.back()          // arr[arr.size()-1]
```
### vector
- vector: collection of **SAME TYPE**, **DYNAMIC SIZE**
  - implemented as a dynamic table
- consider it as default container type in c++

``` c++
#include <vector>
std::vector<std::string> vec;
vec.emplace_back("HELLO");        // add item
vec.push_back("HELLO");           // add item, alt
 
// reserve() before multiple emplace_back() to save time
vec.reserve(vec.size()+100);
for (int i =0; i < 100; ++i) {
    vec.emplace_back("HELLO");
}
```

# modifier
## variable
- const: declare a constant
  - compiler will guard it from any changes
  - naming: kCamelCase, "k" indicate constant
  - "const int" is an independent type from "int"  
```c++
const std::string kHello = "hello";
```



# Control structures
|sign|meaning|
|--|-|
|+, -, +=, *, /, %|arithmetic operations|
|<, >, <=, >=, ==|comparison|
|\|\|, &&|logical operations|
|++, --|Increment/ Decrement operator|

## branching
###  if-else
```c++
// if-else
if (STATEMENT) { 
  //
} else if () {
  //
} else {
  //
}
```
### switch
```c++
// switch
switch (STATEMENT) {
  case CONST_1:
    //runs if STATEMENT == CONST_1
    break;
  case CONST_2:
    //runs if STATEMENT == CONST_2
    break;
  default:
    //runs else
}
```
## Iteration

// while
```c++
// while
while (STATEMENT) {
  // loop while STATEMENT == true
}
```
// while (true) loop

```c++
// while (true) loop
while (true) {
  // loop
  // exit when condition true
  bool exit = eval_break_condition();
  if (exit) {
    break;
  }
}
```

// for loop: fix number of iteration
```c++
// for loop: fix number of iteration
for (int i = 0; i < END_CONDITION; ++i) {
  // loop END_CONDITION of times
  bool skip = true;
  if(skip) { continue; }
}
```

// range for loop: loop through vector, array, string, etc
```c++
// range for loop: loop through vector, array, string,etc
  // use const auto& if you want read-only
  // else put auto&

for (const auto& value : container) {
  // loop through values in container
}

```



# reference & pointer 
## 1) reference
- reference is a type, **float &** is a independent type from **float**
- target of reference is a variable
- reference works like alias, the objective is to avoid data copy 
  > "a reference is a named entity that stores the address of an allocated memory"
- speaking of reference it comes to the concept of ownership: we don't want anybody from somewhere in the program to change the refed variable. 
  > always good to use const refenence to ensure read-only, unless it need to be changed

``` c++
int return_ref_plus_1(int &in_float) {
  return in_float++;
}
int return_ref(const int &in_float) {
  return in_float;
}

int num =1;
int &ref_num = num;       // read-write
const int kRef_num = num; // read only
num = 2;        // num_ref also become 2
ref_num = 3;    // as an alias, num_ref uses like normal variable

int num2 = return_ref_plus_1(ref_num);   // save the need to copy num into the function scope

num2 = return_ref(kRef_num)
```

## reference & pointer symbol position