# Project Creation
### Creating a Spring Boot Project with Maven
- Group Id: Identifies the organization (ex: com.ltp)
- Artifact Id: Determines the name of the application (ex: hello-spring)
- Dependency: Software that your application depends on. (usually JAR)
    - `Central Maven Repository`: Place where Maven downloads dependencies from
    - `Local Maven Repository`: inside your computer, maven place downloaded library inside local repository
### Spring Initializr(vscode)
```bash
# install Spring Boot Extension Pack
# ctrl+shift+p -> spring initilalizr
```
### Maven Standard Directory Layout:
- src/main/java: source code.
- src/main/resources
    - static: images, CSS, static HTML.
    - templates: dynamic HTML templates.
    - application.properties: application properties and settings. (eg: `server.port=9090`)
- src/test/java: application tests.

### Install dependencies
- copy dependencies code to pom.xml


### Client-Server Model
- Client: Entity making a request.
- Server: Machine receiving the request.
- IP address: Sequence of numbers that identifies a server.
- Port: Tells the server where to forward the request.
- HTTP Server: Software that processes requests.

## Compiling and Running
```bash
.\mvnw      # (powershell) use maven warpper(run without maven installed)
./mvnw      # linux, mac

mvnw spring-boot:run # compiles and runs your application.
mvnw clean spring-boot:run # cleans target folder, compiles, and runs your application.
mvn test        # complie `src` the production folder and run tests defined in the `test` folder
mvnw package # builds and packages the compiled classes into a JAR file.
mvn install  # mvn package then push(install) to your local maven repository
java -jar # runs the JAR file.
```

# Spring MVC

- Model View Controller
    - `Controller`: Serves web requests by managing the model and presenting the view.
    - `Model`: Stores data needed by the view in the form of key-value pairs.
    - View: Visual elements of a webpage.

|Annotation|Purpose|
|-|-|
|@Controller|Instruments the target(class) to control all web requests.|
|@GetMapping("path")|Maps a GET request to a handler method|
|@RequestParam|Parameter to be received from a GET request|
|@PostMapping("path")|Maps a POST request to a handler method|


### Model (org.springframework.ui.Model;) 
- addAttribute:  
```java
 model.addAttribute("grade", grade);
```



# Thymeleaf: a simple UI library
- able to bind `Model` to `spring html template`  

### Expressions
```html
<!-- Variable -->
<td th:text="${grade.name}"></td> 
<!-- Selection expression: select a field from previously bound object -->
<tr th:object="${grade}">
    <td th:text="*{name}"></td>
</tr>
<!-- Link expression: specify an URL endpoint/path, eg. including external .css style-->
<link th:href="@{/grade-stylesheet.css}" rel="stylesheet">
```

### Thymeleaf conditions
- 
```html
<p> th:if="${age > 18}" </p>       <!--  render if true -->
<p> th:unless="${age == 18}" </p>    <!--  render if false -->
<td th:text="${age > 18} ? 'val1' : 'val2'"></td>  <!--  ternary render  -->
<!--  switch -->
<div th:switch="${age}">
    <p th:case="'val1'">val1</p>
    <p th:case="'val2'">val2</p>
    <p th:case="*">anything</p>
</div>
```

### Thymeleaf Loops
- generate html from a collection
```html
<div th:each="grade : ${grade-collection}">
    <p>grade</p>
</div>
```
### Thymeleaf utiizy classes (略)
- wide range of `functions` that can handle `attributes content`
```html
"${#class.method(target, other params)}"
```
### Form


















































# tools

## dependencies

- spring-boot-starter-web: includes server tomcat
- spring-boot-devtools: devtools, auto reload when code change
- Lombok: Lombok is a java library that automatically plugs into your editor and build tools, spicing up your java. Never write another getter or equals method again, with one annotation your class has a fully featured builder, Automate your logging variables, and much more.


```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
</dependency>
```

## Vscode
- java code generators: generate getter/setter, etc
