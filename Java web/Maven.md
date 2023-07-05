### usage
- `project management` tool and `build` tool
    - build: 
        - generating source code 
        generating documentation for the source code 
        compiling  source code
        - packaging compiled codes into JAR files
        - install packaged code into target(deploy)

    - `project management`
        - download dependencies(lib...)
        - manage JAR file version
        - create right project struture


### project
- Group Id: 
    - identifies the organization
    - should be a full domain name, lower case (com.example)
- Aritifact Id:
    - identifies the name of the applicaiton
    - separated by `-`

### Dependencies
- Dependencies =  Packaged library(files or JAR files)
- `Central Maven Repository`: Place where Maven downloads dependencies from
- `Local Maven Repository`: inside your computer, maven place downloaded library inside local repository


### pom.xml
define dependencies(tools, libraries)
meta data (groupId, artifactId, version)
<properties>
plugins
modules(sub projects, children project...): inherite dependencies from parent
parent(specify the parent project)



### maven command
- `Maven Wrapper` is a set of scripts that help developers to `use a specific version of Maven` for thier project without the need to actually install maven

```bash
# any project(eg, spring initializer) with the following file can use maven wrapper
mvnw.cmd
mvnw
```
- commands

```bash
.\mvnw      # (powershell) use maven warpper(run without maven installed)
./mvnw      # linux, mac


# Spring
mvn spring-boot:run     # compile applications code and run compiled code  => target folder
mvn clean spring-boot:run     # clean target before spring-boot:run

# General
mvn complie     # complie to "target" folder
mvn clean       # clean the `target` folder
mvn test        # complie `src` the production folder and run tests defined in the `test` folder
compile test # same as mvn test
mvn package     # package everything into a JAR file, also run mvn clean compile test before package
mvn install     # mvn package then push(install) to your local maven repository
```