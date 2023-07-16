# What are they
- Spring: 创建web app, microservices, DB, Auth, Session management, security...
- Spring boot:on top of Spring, 简化dependencies management, 自动配置...
- bean: 组件，通过组件扫描发现

# Project Creation
### Creating a Spring Boot Project with Maven
- Group Id: Identifies the organization (ex: com.ltp)
- Artifact Id: Determines the name of the application (ex: hello-spring)
- Dependency: Software that your application depends on. (usually JAR)
    - where: pom.xml
    - `Central Maven Repository`: Place where Maven downloads dependencies from
    - `Local Maven Repository`: inside your computer, maven place downloaded library inside local repository
### Spring Initializr(vscode)
```bash
# install Spring Boot Extension Pack
# ctrl+shift+p -> spring initilalizr
```
### Maven Standard Directory Layout:
```bash
# src/main/java: source code.
# src/main/resources
    - static: images, CSS, static HTML.
    - templates: dynamic HTML templates.
    - application.properties: application properties and settings. (eg: `server.port=9090`)
# src/test/java: application tests.
# pom.xml
    - dependencies
```

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
    - `Controller`:response web requests through handler methods 
    - `Model`: Stores data 
        - Controller should be able to read/write data through model method
    - View: what user see

## controller


|@Controller|Instruments the target(class) to control all web requests.|
|@RequestMapping("/score")  |通用|
|@PostMapping("path")|Convert a method to handler method, Maps a POST request to the handler method|
|@GetMapping("path")|Convert a method to handler method, maps a GET request to the handler method|
|@RequestParam|Parameter to be received from a GET request|
|@PutMapping, @DeleteMapping, @PatchMapping|

```java
@Controller
@RequestMapping("/grades")  // 指定这些mapping是针对路径"/score"
public class HomeController{
    @GetMapping("/")   // 处理针对'/score/'发送的get请求 
    public String getGrade(Model model){
        return "score";         // 处理函数
    }
}
```



### ui.Model, addAttribute (org.springframework.ui.Model)
- Model(org.springframework.ui.Model) 负责在Controller和View之间传递数据
    - 数据通过controller调用addAttribute()添加到model, 之后send到view

|org.springframework.ui.Model|在Controller和View之间传递数据|
|model.addAttribute(attributeName, attributeObject)||
|@ModelAttribute("/score")  ||

```java
@GetMapping("/grades")
public String getGrades(Model model) {
    Grade grade = new Grade("harry", "potions", "c-", "1");
    model.addAttribute("grade", grade);
    return "grades";
}
```

## Model
- pojo: plain old java object 

### TODOs
[@SessionAttributes](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/sessionattributes.html) 













































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
