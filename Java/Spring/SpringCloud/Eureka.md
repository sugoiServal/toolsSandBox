- resource

  - [implement basic Service Discovery in Go](https://itnext.io/lets-implement-basic-service-discovery-using-go-d91c513883f6)

- service discovery:

  - `service registry`, a database of the network locations: to application's service instances. think a internal DNS to your services

    - typlical features:
      - 地址解析(Service Registry): translate Domain name to IPs
      - 服务管理(registrar): add or remove service
      - Load balancing: map one domain name to many IPs
      - 动态更新: 服务的网络位置可能会因扩展、负载平衡、故障或更新而频繁变化。
      - 安全和访问控制

  - implementaion:
    - k8s: integrated in deployment infrastructure(ClusterIP...)
    - AWS: Route 53, EKS(k8s)
    - third party(applicationn specified): HashiCorp Consul, Netflix Eureka

# Eureka

- [Eureka1](https://www.youtube.com/watch?v=-gLLeoS1m6s)
- [Eureka2](https://www.bilibili.com/video/BV1LQ4y127n4/?p=10)
- [doc: client](https://docs.spring.io/spring-cloud-netflix/docs/current/reference/html/#service-discovery-eureka-clients)
- [doc: server](https://docs.spring.io/spring-cloud-netflix/docs/current/reference/html/#spring-cloud-eureka-server)
-
- Eureka features

  - REST-based
  - in AWS, Eureka is region-isolated

- Eureka components
  - `Eureka Server`: a service registry that manages information about available services
    - microservice registers itself with the Eureka server, providing metadata: host, port, health status..
  - `Eureka Client`: a library that is integrated into each microservice
    - allows the microservice to `register` itself with the Eureka server
    - allows the microservice to periodically send `heartbeat signals`
    - `retrieve and cache a list of available services` from the Eureka server to consume other services

![](https://imgur.com/DZPSluw.jpg)

## Eureka Server

- dependencies

```xml
<!-- spring cloud version management -->
<properties>
    <java.version>17</java.version>
    <spring-cloud.version>2022.0.3</spring-cloud.version>
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

<!-- eureka -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

- configs (Standalone Mode)

```yml
# application.yml
# https://docs.spring.io/spring-cloud-netflix/docs/current/reference/html/#spring-cloud-eureka-server

server:
  port: 8761
spring:
  application:
    name: eurekaserver # eureka service name
eureka:
  client:
    instance:
      hostname: localhost
    serviceUrl: # register eureka service to eureka itself
      defaultZone: http://localhost:8761/eureka
```

- application

```java
// EurekaApplication.java
@SpringBootApplication
@EnableEurekaServer
public class EurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }
}
```

## Eureka Client

- dependencies

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

- config

```yml
server: # Tomcat port
  port: 8080
spring:
  application:
    name: ride-service
# add config below to register
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka
```

## Service Discovery: Eureka Clients

1. URL: use service name instead of hostname:port

```java
// you connection string
String url = "http://ride-service/api/run";

// add @LoadBalanced to http client
@Bean
@LoadBalanced
public RestTemplate restTemplate() {
  return new RestTemplate;
}
```

2. use Eureka CLient

```java
@Autowired
private EurekaClient discoveryClient;

public String serviceUrl() {
    InstanceInfo instance = discoveryClient.getNextServerFromEureka("ride-service", false);
    return instance.getHomePageUrl();   // http://localhost:8088
}

```
