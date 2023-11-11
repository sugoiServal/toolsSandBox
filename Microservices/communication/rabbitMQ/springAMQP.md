- Spring AMQP: spring 基于 AMQP 定义的一套 API and Template

  - spring-amqp: abstraction
  - spring-rabbit: default implementation

- resources

  - [ref](https://spring.io/projects/spring-amqp)
  - [docs](https://docs.spring.io/spring-amqp/docs/current/reference/html/)
    - [应用: 使用 rabbitMQ 同步 MySQL 与 ElasticSearch 数据](https://www.bilibili.com/video/BV1LQ4y127n4?p=133)

- components:
  - RabbitTemplate: sending and receiving messages
  - RabbitAdmin: `automatically` declaring queues, exchanges and bindings

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

```yml
# application.yml
spring:
  rabbitmq:
    host: localhost
    port: 5672
    virtual-host: /
    username: user
    password: password
```

```java
// <!-- configs -->
@Configuration
public class AmqpConfig {

    @Bean
    public CachingConnectionFactory connectionFactory() {
        CachingConnectionFactory cachingConnectionFactory = new CachingConnectionFactory("localhost");
        cachingConnectionFactory.setUsername("user");
        cachingConnectionFactory.setPassword("password");
        cachingConnectionFactory.setPort(5672);
        cachingConnectionFactory.setVirtualHost("/");
        return cachingConnectionFactory;
    }

    @Bean
    public RabbitAdmin amqpAdmin() {
        return new RabbitAdmin(connectionFactory());
    }

    @Bean
    public RabbitTemplate rabbitTemplate() {
        return new RabbitTemplate(connectionFactory());
    }
}
```

# Worker Queues

- two work consumer to a queue: work.queue

- config

```yml
spring:
  rabbitmq:
    host: localhost
    port: 5672
    virtual-host: /
    username: user
    password: password
    listener:
      simple:
        prefetch: 1 # set prefetch to 1 globally
```

- producer

```java
@Autowired
RabbitTemplate rabbitTemplate;
@Autowired
RabbitAdmin rabbitAdmin;

@Test
void testWorkerQueue() throws InterruptedException{
    rabbitAdmin.declareQueue(new Queue("work.queue"));
    String queueName = "work.queue";
    for (int i = 1; i < 50; i++) {
        String message = String.valueOf(i) + ": hello, rabbit";
        rabbitTemplate.convertAndSend(queueName, message);
        Thread.sleep(30);
    }
}
```

- consumer
- rabbitTemplate: consumer single message

```java
@Test
void testSimpleQueue() {
    rabbitAdmin.declareQueue(new Queue("work.queue"));
    String foo = (String) rabbitTemplate.receiveAndConvert("work.queue");
    System.out.println(foo);
}
```

- use async @RabbitListener to start multiple Listener process

```java
@Component
public class SpringRabbitListener {
    @RabbitListener(queues = "work.queue")
    public void listenSimpleQueue(String msg) throws InterruptedException{
        System.out.println("Consumer 1 received msg: [" + msg + "] " + LocalTime.now());
        Thread.sleep(20);
    }

    @RabbitListener(queues = "work.queue")
    public void listenSimpleQueue2(String msg) throws InterruptedException{
        System.err.println("Consumer 2 received msg: [" + msg + "] "+ LocalTime.now());
        Thread.sleep(200);
    }
}
```

## Fanout Exchange

- create a fanout exchange `exchange.fanout`
- binding `queue1.fanout` and `queue2.fanout` to the `exchange.fanout`
- use two consumer to listen to each of `queue1.fanout` and `queue2.fanout`
- producer send message to exchange `exchange.fanout`

```java
@Configuration
public class AmqpConfig {
    @Bean
    public FanoutExchange fanoutExchange() {
        return new FanoutExchange("exchange.fanout");
    }

    // binding queue1
    @Bean
    public Queue fanoutQueue1() {
        return new Queue("queue1.fanout");
    }
    @Bean
    public Binding bindQueue1(Queue fanoutQueue1, FanoutExchange fanoutExchange) {
        return BindingBuilder.bind(fanoutQueue1).to(fanoutExchange);
    }

    // binding queue2
    @Bean
    public Queue fanoutQueue2() {
        return new Queue("queue2.fanout");
    }
    @Bean
    public Binding bindQueue2(Queue fanoutQueue2, FanoutExchange fanoutExchange) {
        return BindingBuilder.bind(fanoutQueue2).to(fanoutExchange);
    }
}
```

- create listener

```java
@Component
public class SpringRabbitListener {
    // # Fanout
    @RabbitListener(queues = "queue1.fanout")
    public void listenFanoutQueue1(String msg) throws InterruptedException{
        System.out.println("Consumer received msg from queue1.fanout: [" + msg + "] " + LocalTime.now());
        Thread.sleep(20);
    }

    @RabbitListener(queues = "queue2.fanout")
    public void listenFanoutQueue2(String msg) throws InterruptedException{
        System.err.println("Consumer received msg from queue2.fanout: [" + msg + "] "+ LocalTime.now());
        Thread.sleep(20);
    }
}
```

- producer

```java
    @Test
    void testFanoutExchange () throws InterruptedException{
        String exchangeName = "exchange.fanout";
        for (int i = 1; i < 10; i++) {
            String message = String.valueOf(i) + ": hello, every rabbit";
            rabbitTemplate.convertAndSend(exchangeName, "", message);
            Thread.sleep(30);
        }
    }
```

## Direct Exchange

- Alternative way to @Bean: use @RabbitListener to declare queues, exchange and binding altogether

  - exchange: exchange.direct, type direct
  - queues: queue1.direct, queue2.direct
  - bindKeys: red/blue/yellow

- producer send message to exchange `exchange.fanout` with directKey either red/blue/yellow

```java
@Component
public class SpringRabbitListener {
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "queue1.direct"),
            exchange = @Exchange(name = "exchange.direct", type = ExchangeTypes.DIRECT),
            key = {"red", "blue"}
    ))
    public void listenDirectQueue1(String msg) throws InterruptedException{
        System.out.println("Consumer received msg from queue1.direct: [" + msg + "] "+ LocalTime.now());
        Thread.sleep(20);
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "queue2.direct"),
            exchange = @Exchange(name = "exchange.direct", type = ExchangeTypes.DIRECT),
            key = {"red", "yellow"}
    ))
    public void listenDirectQueue2(String msg) throws InterruptedException{
        System.err.println("Consumer received msg from queue2.direct: [" + msg + "] "+ LocalTime.now());
        Thread.sleep(20);
    }
}
```

- producer

```java
    @Test
    void testDirectExchange () throws InterruptedException{
        String exchangeName = "exchange.direct";
        List<String> directKey = Arrays.asList("yellow", "red", "blue");
        for (String key : directKey) {
            String message = "hello, " + key + " rabbit!";
            rabbitTemplate.convertAndSend(exchangeName, key, message);
            Thread.sleep(30);
        }
    }
```

## Topic Exchange

- use @RabbitListener to declare queues, exchange and binding altogether

  - exchange: exchange.topic, type topic
  - queues: queue1.topic, queue2.topic
  - bindKeys: ottawa.#, #.news

- producer send message to exchange `exchange.topic` with directKey either red/blue/yellow

```java
// listeners
@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "ottawa.topic"),
        exchange = @Exchange(name = "exchange.topic", type = ExchangeTypes.TOPIC),
        key = "ottawa.#"
))
public void listenTopicQueue1(String msg) throws InterruptedException{
    System.err.println("Consumer received msg from ottawa.topic: [" + msg + "] "+ LocalTime.now());
    Thread.sleep(20);
}

@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "news.topic"),
        exchange = @Exchange(name = "exchange.topic", type = ExchangeTypes.TOPIC),
        key = "#.news"
))
public void listenTopicQueue2(String msg) throws InterruptedException{
    System.err.println("Consumer received msg from news.topic: [" + msg + "] "+ LocalTime.now());
    Thread.sleep(20);
}

// producer
@Test
void testTopicExchange () throws InterruptedException{
    String exchangeName = "exchange.topic";
    String news = "A doctor inside Gaza's largest hospital says hundreds of patients are stranded, most operations suspended";
    String weather = "Sunny. Becoming a mix of sun and cloud in the morning. ";
    rabbitTemplate.convertAndSend(exchangeName, "ottawa.news", news);
    rabbitTemplate.convertAndSend(exchangeName, "ottawa.weather", weather);
    Thread.sleep(30);
}
```

## Object Serialization

- when message is object, the default serializer is the JDK serializer Java.io.ObjectOutputStream

  - lengthy
  - not efficient
  - security risk

- To modify object serializer:
  - import a serializer (eg. jackson(json))
  - inject amqp.support.converter.MessageConverter in producer/consumer as a bean
  - message in producer and consumer should have the same type

```xml
<!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.dataformat/jackson-dataformat-xml -->
<!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.dataformat/jackson-dataformat-xml -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

```java
@Bean
public MessageConverter jsonMessageConverter() {
    return new Jackson2JsonMessageConverter();
}
```

```java
// producer
HashMap<String, Object> msg = new HashMap<>();
msg.put("name", "Tute");
msg.put("age", "20");
rabbitTemplate.convertAndSend(exchangeName, key, msg);

// consumer
@RabbitListener(queues = "queue2.fanout")
public void listenFanoutQueue2(Map<String, Object> msg) throws InterruptedException{
    System.err.println("Consumer received msg from queue2.fanout: [" + msg + "] "+ LocalTime.now());
}
```
