# common sense

## complier:
  - complier translate c/c++ into machine code
  - produce object file (.o), comtains binary machine code
  - linked .o file become the executable
  - module: complie single ".cpp" output an ".o" object binary file. it is essentially a complied module
  
## Library: library is organized modules
  - what is it: 
  > multiple  object files that are logically connected
  - static library (aka archive)
    - .a 
    - is essentially archive of .o, similar to tar
    - all objects are precompiled, faster, heavier 
  - dynamic library (aka shared library)
    - .so, .dll
    - dynamic libraries are not complied into the main program, they are linked into the program at run time
    - many programs can share one copy
    - dynamic library can be upgraded to a newer version without rebuild the project
## link: 
  - connect all the function in library and the main program: for every function in the header that is used by the program, where is the binary code lies in the library

## makefile: 
  - what is makefile
    - a build tool, invoking complier to build complex project
  - why makefile, what is the different from complier?
  > gcc compiles and/or links a single file. It does not knows how to combine several source files into a non-trivial, running program

  > make is a "build tool" that invokes the compiler (which could be gcc) in a particular sequence to compile multiple sources and link them together

## cmake
  - what is cmake
    - a generator of buildsystems
  - as makefile produce executable, cmake produce makefile (or other buildsystems)
  - it is cross-platform: same CMakeLists.txt can generate project build for different system 

# complier
## basic complie tool
|cimpiler|platform|
|--|--|
|gcc|all platform|
|clang|all platform|
|visual c++ complier|windows|
|mingw|windows|

## GCC
- gcc g++ (command) difference
  - gcc will compile C and C++ language
  - g++ treat .c and .cpp file as c++ language
- use g++ compiler
``` bash
# Compile a source code file into an executable binary:
  g++ path/to/source.cpp -o path/to/output_executable

# -Wall display all warning, -std select standard: 11/14/17
  g++ path/to/source.cpp -Wall -std=c++11 -o path/to/output_executable

# Include libraries located at a different path than the source file:
  g++ path/to/source.cpp -o path/to/output_executable -Ipath/to/header -Lpath/to/library -llibrary_name
```

# makefile (make)
> [makefile tutorial](https://makefiletutorial.com/)
# cmake

> [cmake tutorial](https://cmake.org/cmake/help/latest/guide/tutorial/index.html)

>[lecture2&3](https://www.youtube.com/watch?v=7e71KWARrNQ&list=PLgnQpQtFTOGR50iIOtO36nK6aNPtVq98C&index=4)

> [configure cmake preset in VSCode](https://github.com/microsoft/vscode-cmake-tools/blob/HEAD/docs/cmake-presets.md)

## cmake build process
``` bash
cd <project_folder>
mkdir build && cd build
cmake ..          # produce makefile
make -j8          # build with 8 core

# when dependency/lib/sourcefiles/executable/etc..., aka CMakeList.txt changes
  # remake and rebuild
cd .. && rm -rf build
mkdir build && cd build
cmake ..          # produce makefile
make -j8          # build with 8 core

# when part of the src code change
make -j8
```

## cmake syntax
>[EXAMPLE](https://github.com/mlpppp/ScaleORB-SLAM/blob/master/CMakeLists.txt)
# run program
``` bash
./program 
```
# project structure
``` text
project_name/
├── CMakeLists.txt
├── Readme.md
├── LICENSE.txt
├── build/              # byproducts: .o, makefile, etc. DISPOSABLE
├── bin/                # executables
│   ├── demo
│   └── debug
├── lib/                # thirdparty libraries
│   ├── DBoW2           # require build lib
│   │   ├── CMakeLists.txt
│   │   └── DBoW2/..
│   └── g2o/..          # not require build lib
├── cmake_modules
│   └── FindEigen3.cmake
├── include/             # header files
│   ├── Converter.h
│   ├── DynamicExtractor.h
│   ├── Frame.h
│   ├── FrameDrawer.h
│   ├── Initializer.h
│   ├── KeyFrame.h
│   ├── KeyFrameDatabase.h
│   ├── LocalMapping.h
│   ├── LoopClosing.h
│   └── Viewer.h
└── src/                 # cpp, cc, c files
    ├── Converter.cc
    ├── DynamicExtractor.cc
    ├── Frame.cc
    ├── FrameDrawer.cc
    ├── Initializer.cc
    ├── KeyFrame.cc
    ├── KeyFrameDatabase.cc
    ├── LocalMapping.cc
    ├── LoopClosing.cc
    └── Viewer.cc
```