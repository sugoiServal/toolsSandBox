### [video tutorial](https://www.youtube.com/watch?v=5PdEmeopJVQ&t=304s) 
## Spring Initializr [link](https://start.spring.io/)
- produce a skeleton spring project structure
- usage:
    - from web app [spring initializr](https://start.spring.io/)
    - from cli(curl)
    - from cli(Spring Boot cli)
    - from editor(vscode/intelliJ)
    - other(Spring Tool Suite, Apache NetBeans)

### Spring Initializr(vscode)
```bash
# install Spring Boot Extension Pack
# ctrl+shift+p -> spring initilalizr
```

### install dependencies
``` bash
# copy dependencies code to pom.xml
```

### change application port
```bash
# ./src/resources/application.properties
    # add
server.port=9090
```

### start spring application
```bash
.\mvnw spring-boot:run
```

```bash 
# package code into jar
mvn package
# run code packaged with jar
java -jar workbook-0.0.1.jar
```


### term    
- Bean: A bean is an object that is instantiated, assembled, and managed by a Spring IoC container. form the backbone of your application

- tomcat: an embedded HTTP server included from `spring-boot-starter-web`


