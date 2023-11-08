- redis java client

  - Jedis: easy to use. not thread-saft
  - lettuce: Spring default (SpringDataRedis), thread-safe, support reactive, support cluster/sentinel/pipelinine...

- SpringDataRedis API is compatible to both implementation

```bash
# deploy redis instance
# https://hub.docker.com/r/redis/redis-stack-server/
docker run -d --name redis-stack -p 6379:6379 -e REDIS_ARGS="--requirepass mypassword" redis/redis-stack-server:latest
redis-cli
auth mypassword
```

# Jedis

- [docs](https://github.com/redis/jedis)

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
</dependency>
```

### Connection Pool

- redis is single-thread database
- Jedis is java client, which may be concurrent. Jedis is not thread-safe.

  - not thread-safe: a software component or system is not designed to be used by multiple threads, susceptible to common multi-thread issues (eg. race condition, deadlocks)

- `Connection pool`: providing a pool of pre-established connections that threads can borrow and return when they are done, rather than create connection for each thread.
  - Creating a new database connection (redis object) and delete connection frequently is inefficient. Connection pooling helps address these issues.

```java
// use JedisPool
JedisPool pool = new JedisPool("localhost", 6379);
try (Jedis jedis = pool.getResource()) {
  jedis.set("clientName", "Jedis");
}
// use JedisPooled
JedisPooled jedis = new JedisPooled("localhost", 6379);
jedis.set("clientName", "Jedis");

jedis.close();
```

### Connect to Reids Cluster

```java
// https://redis.io/docs/reference/cluster-spec/
Set<HostAndPort> jedisClusterNodes = new HashSet<HostAndPort>();
jedisClusterNodes.add(new HostAndPort("127.0.0.1", 7379));
jedisClusterNodes.add(new HostAndPort("127.0.0.1", 7380));
JedisCluster jedis = new JedisCluster(jedisClusterNodes);
jedis.sadd("planets", "Mars");
```

# SpringDataRedis

- [SpringDataRedis](https://spring.io/projects/spring-data-redis)
- [docs](https://docs.spring.io/spring-data/redis/docs/current/reference/html/)
- [RedisTemplate](https://www.bilibili.com/video/BV1cr4y1671t?p=20)
- [RedisRepository]

  - [video tutorial](https://www.youtube.com/watch?v=oRGqCz8OLcM)
  - [written tutorial](https://dzone.com/articles/introduction-to-spring-data-redis)

- SpringDataRedis
  - 提供对不同 Redis Client 的整合 (lettuce, jedis)
  - 提供 unified API (RedisTemplate)
  - support Redis Sentinal/CLuster, support pub/sub model
  - support serialization/deserializtion (JSON, String, POJO...)
  - support reactive programming (lettuce)

```xml
<!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-data-redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

- Components

  - RedisConnection and RedisConnectionFactory: handles the communication with the Redis backend.
  - RedisTemplate: The template offers a high-level abstraction for Redis interactions (include abstraction of serialization, connection management...)
  - Redis Repositories: use repository feature of redis-POJO mapping, similar to JPA repository
    - Redis Repositories require at least Redis Server version 2.8.0 and do not work with transactions: use a RedisTemplate with disabled transaction support
    - Domain Entities: POJO in Redis Repositories

## Getting Started

```yml
# application.yml
spring:
  application:
    name: spring-redis
  redis:
    host: localhost
    port: 6379
    password: 123321
    lettuce:
      pool:
        max-active: 8
        max-wait: 100
        max-idle: 8
        min-idle: 0
```

- `RedisConnection`
  - create connection as bean

```java
// Lettuce connection factory: lettuce is included in spring-boot-starter-data-redis
@Configuration
@EnableRedisRepositories
class RedisConfig {
  @Bean
  public LettuceConnectionFactory redisConnectionFactory() {
    RedisStandaloneConfiguration config = new RedisStandaloneConfiguration("server", 6379);
    return new LettuceConnectionFactory();
  }
}

// Jedis connection factory: need to include Jedis dependency
@Configuration
class RedisConfig {
  @Bean
  public JedisConnectionFactory redisConnectionFactory() {
    return new JedisConnectionFactory(new RedisStandaloneConfiguration("server", 6379););
  }
}
```

- RedisTemplate: he template offers a high-level abstraction for Redis interactions (include abstraction of serialization, connection management...)

  - template is thread-safe and can be reused across multiple instances

- Template operations [docs](https://docs.spring.io/spring-data/redis/docs/current/reference/html/#redis:template)

| API                       | Interface Description | Key Type Operations                                       |
| ------------------------- | --------------------- | --------------------------------------------------------- |
| redisTemplate.opsForGeo   | GeoOperations         | Redis geospatial operations, such as GEOADD, GEORADIUS,…​ |
| redisTemplate.opsForHash  | HashOperations        | Redis hash operations                                     |
| redisTemplate.opsFor      | HyperLogLogOperations | Redis HyperLogLog operations, such as PFADD, PFCOUNT,…​   |
| redisTemplate.opsForList  | ListOperations        | Redis list operations                                     |
| redisTemplate.opsForSet   | SetOperations         | Redis set operations                                      |
| redisTemplate.opsForValue | ValueOperations       | Redis string (or value) operations                        |
| redisTemplate.opsForZSet  | ZSetOperations        | Redis zset (or sorted set) operations                     |
| redisTemplate             | redisTemplate         | generic operations                                        |

- register RedisTemplate

```java
@Configuration
class RedisConfig {
  // ConnectionFactorys ...

  // a String to Object template serialize values as json object
  @Bean
  public RedisTemplate<String, Object> redisTemplate() throws UnknownHostException {
      RedisTemplate<String, Object> template = new RedisTemplate<>();
      template.setConnectionFactory(redisConnectionFactory());
      // setting serializers
      // json serializer for value
      GenericJackson2JsonRedisSerializer jsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
      // key and hash key use string serializer
      template.setKeySerializer(RedisSerializer.string());
      template.setHashKeySerializer(RedisSerializer.string());
      // redisTemp
      template.setValueSerializer(jsonRedisSerializer);
      template.setHashKeySerializer(jsonRedisSerializer);
      return template;
  }

  // StringRedisTemplate(): shortcut to RedisTemplate<String, String> serialize values as string
  @Bean
  StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
    StringRedisTemplate template = new StringRedisTemplate();
    template.setConnectionFactory(redisConnectionFactory);
    return template;
  }

  // generic RedisTemplate serialize as byte
  @Bean
  public RedisTemplate<?, ?> redisTemplate() {
    RedisTemplate<byte[], byte[]> template = new RedisTemplate<>();
    template.setConnectionFactory(redisConnectionFactory());
    return template;
  }
}
```

- use RedisRemplate

```java
@SpringBootTest(classes = RedisConfig.class)
public class RedisTemplateTest {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Test
    void testString() {
        stringRedisTemplate.opsForValue().set("name", "aa");
        System.out.println(redisTemplate.opsForValue().get("name"));
    }
    @Test
    void testList() {
        stringRedisTemplate.opsForList().leftPush("myStringList", "a");
        stringRedisTemplate.opsForList().leftPush("myStringList", "b");
        redisTemplate.opsForList().leftPush("myObjectList", "a");
        redisTemplate.opsForList().leftPush("myObjectList", "b");
        assertEquals("a", stringRedisTemplate.opsForList().rightPop("myStringList"));
    }
    @Test
    void testHash() {
        stringRedisTemplate.opsForHash().put("myHash", "name", "Kafka");
        stringRedisTemplate.opsForHash().put("myHash", "age", "24");
        Map<Object, Object> entries = stringRedisTemplate.opsForHash().entries("myHash");
        System.out.println(entries);
    }

    @Test
    void testPojoAutoSerialization() {
        redisTemplate.opsForValue().set("user:11", new User("Sean", 13));
        User user = (User) redisTemplate.opsForValue().get("user:11");
        System.out.println(user);
    }

    @Test
    void testPojoManualSerialization() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        // manual serialization: POJO->string
        String userJson = mapper.writeValueAsString(new User("Solo", 13));
        stringRedisTemplate.opsForValue().set("user:12", userJson);
        String userString = stringRedisTemplate.opsForValue().get("user:11");
        User user = mapper.readValue(userString, User.class);
        System.out.println(user);
    }
}
```

### use Redis Repositories

- [docs](https://docs.spring.io/spring-data/redis/docs/current/reference/html/#redis.repositories)
- [written tutorial](https://dzone.com/articles/introduction-to-spring-data-redis)

```java
@Configuration
@EnableRedisRepositories   // ! add @EnableRedisRepositories to use repository.
class RedisConfig {
  // ConnectionFactorys ...
  // set generic RedisTemplate for `Redis Repository`
  @Bean
  public RedisTemplate<?, ?> redisTemplate() {
    RedisTemplate<byte[], byte[]> template = new RedisTemplate<>();
    template.setConnectionFactory(redisConnectionFactory());
    return template;
  }
}
```

- define data model

```java
// Product.java
@Data
@AllArgsConstructor
@NoArgsConstructor
@RedisHash("product")  // redis key: product
public class Product {
    @Id private Integer id;             // @Id is used to persist to redis key:id
    private String name;
    private Integer qty;
    private Long price;
}
```

- define repository

```java
// ProductRepository
@Repository
public interface ProductRepository extends CrudRepository<Product, Integer> {
}
```

- use repository

```java
@SpringBootApplication
public class RedisApplication implements CommandLineRunner {
    public static void main(String[] args) {
        SpringApplication.run(RedisApplication.class, args);
    }

    @Autowired
    ProductRepository productRepository;
    @Override
    public void run(String... args) throws Exception {
        Product product = new Product(1, "rice", 12, (long)200);
        productRepository.save(product);
        System.out.println(productRepository.findById(product.getId()));
    }
}
```

## Sentinel

- https://docs.spring.io/spring-data/redis/docs/current/reference/html/#redis:write-to-master-read-from-replica
- https://docs.spring.io/spring-data/redis/docs/current/reference/html/#redis:sentinel
