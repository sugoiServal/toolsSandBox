- [ref](https://spring.io/projects/spring-cloud)

- `spring cloud version` have to be corresponding to a `spring boot version`

```xml
<properties>
    <spring-cloud.version>2022.0.1</spring-cloud.version>
</properties>
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```
