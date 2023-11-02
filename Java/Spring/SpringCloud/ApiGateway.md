- what API Gateway do

  - public (client) facing
  - Add Authentication and Authorization
  - rate control: circuit breaker

- implementation:
  - zuul (old): blocking
  - gateway (newer): webflux

# Spring Cloud Gateway

- [doc](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/)

- glossary
  - `Route`: An entry to a resource. Defined by an ID, a destination URI, a collection of predicates, and a collection of filters.
  - `Predicate`: lets you map HTTP request (such as url string, headers, parameters...) to a URI resource
  - `Filter`: filter can modify requests and responses before or after sending the downstream request.

### Get Started

```xml
<!-- https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-gateway -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

- setup spring service

```java
@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

- config

```yml
# applicaiton.yml
server:
  port: 10010
spring:
  application:
    name: gateway
  cloud:
    gateway:
      routes:
        - id: ride-service # name of the route
          uri: lb://ride-service
          predicates: # routing rule
            - Path=/ride-rpc/**
        - id: ride-client
          uri: lb://ride-application
          predicates: # routing rule
            - Path=/ride-client/**
            - Method=GET,POST
          filters:
            - AddRequestHeader=X-Request-Red, Blue-{segment}

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka
```

### Predicate

- [docs](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gateway-request-predicates-factories)

- `Predicate`: lets you map HTTP request (such as url string, headers, parameters...) to a URI resource

| 名称                                                                                                   | 说明                    |
| ------------------------------------------------------------------------------------------------------ | ----------------------- |
| `Cookie`=mycookie,mycookievalue                                                                        | 请求必须包含某些 cookie |
| `After`=2017-01-20T17:42:47.789-07:00[America/Denver]                                                  | 请求是某时间点之后      |
| `Before`=2017-01-20T17:42:47.789-07:00[America/Denver]                                                 | 请求是某时间点之前      |
| `Between`=2017-01-20T17:42:47.789-07:00[America/Denver], 2017-01-21T17:42:47.789-07:00[America/Denver] | 请求于某时间段          |
| `Header`=X-Request-Id, \d+                                                                             | 请求必须包含某些 Header |
| `Host`=**.somehost.org,**.anotherhost.org                                                              | 请求必须访问某个 host   |
| `Method`=GET,POST                                                                                      | Mehtod                  |
| `Path`=/red/{segment},`/blue/**`                                                                       | path                    |
| `Query`=green                                                                                          | 路径中的 query 参数     |
| `RemoteAddr`=192.168.1.1/24                                                                            | 指定请求 ip CIDAR       |
| `Weight`=group1, 8, Weight=group1, 2                                                                   | 权重 forward 的目标     |

## Filter

- `Filter`: 可以对进入 gateway 的 request 和微服务返回的 response 做处理。

  - 正：client request=> gateway (predicate) => filters process => microservices
  - 反：microservices res => filters process => gateway => client

- 30+ out-of-box `Gateway filters`

  - [docs](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gatewayfilter-factories)

- `Default Filters (Gateway filter)`: apply out-of-box to all routes
- `Global Filters`: Global filter logic is customized written in Java, apply to all routes

- Filter Order:
  - Default Filters： 由 Spring 指定，由 1 递增
  - Route Filter： 由 Spring 指定，由 1 递增
  - Global Filters: 自指定 Order 值
  - 当过滤器的 order 值一样时, Default Filters > Route filter > Global Filters

### use `filter` and `Default Filters`

```yaml
server:
  port: 10010
spring:
  application:
    name: gateway
  cloud:
    gateway:
      routes:
        - id: ride-service
          uri: lb://ride-service
          predicates:
            - Path=/ride-rpc/**
          filters: # Route Filter: only apply to one route
            - AddRequestHeader=X-Request-Red, Blue-{segment}
      default-filters: # Default Filters:  apply to all routes
        - AddRequestHeader=X-Request-Red, Blue-{segment}
```

### `Global Filters`:

- apply to filter all routes, but filter logic is customized written in Java

- [ref](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#global-filters)

```java
@Component
public class AuthorizeFilter implements GlobalFilter, Ordered {
    // implement GlobalFilter
      // @param exchange: 请求上下文, 里面可以获取Req, Res等信息
      // @param chain: 用来把请求委托给下一个过滤器
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // get params
        ServerHttpRequest request = exchange.getRequest();
        MultiValueMap<String, String> param = request.getQueryParams();
        // get authorization from param
        String auth = param.getFirst("authorization");
        // pass filter if auth == admin
        if ("admin".equals(auth)) {
            return chain.filter(exchange);
        } else {
            // else intersect the request
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    // implement Order
      // define the order of filter execution: small int got executed earlier
    @Override
    public int getOrder() {
        return -1;
    }
}
```

### CORS

- [theory](https://www.bilibili.com/video/BV1LQ4y127n4?p=41)
- [doc](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#cors-configuration)

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        add-to-simple-url-handler-mapping: true # support CORS preflight requests. 解决初始option CORS request被拦截问题.
        cors-configurations:
          "[/**]":
            allowedOrigins: "https://docs.spring.io"
            allowedMethods:
              - GET
              - POST
              - DELETE
              - PUT
              - OPTIONS
            allowedHeaders: "*" # 允许在请求中的header
            allowCredentials: true # 允许在请求中携带cookie
            masAge: 360000 # 本次CORS允许有效期
```
