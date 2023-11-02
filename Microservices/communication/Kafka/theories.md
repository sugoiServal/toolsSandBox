- resource

  - [doc](https://kafka.apache.org/documentation/)
  - [tutorial](https://www.bilibili.com/video/BV19y4y1b7Uo?p=4)

- kafka: distributed event streaming platform.

  - distributed: many brokers nodes
  - scalable: horizontal scalability
  - high throughput: 十万级，vs Rabbit 万级
  - `pull model`: pub-sub
  - written with Java/Scala
  - `TCP` based communication
  - Clients:
    - 多语言支持：Java, Scala, Go, Python, C/C++
    - Java 优先

- application:

  - driver realtime location, log aggregation, real-time analytics

- kafka vs rabbitmq [ref](https://aws.amazon.com/compare/the-difference-between-rabbitmq-and-kafka/)

  - `RabbitMQ`: traditional message broker (Think SQS)
    - `push model`: Producers send messages to consumers (点对点)
    - Non-real time message: thousands of messages per second.
    - RabbitMQ delete messages after consumption
  - `Kafka` (Think Kinesis)
    - `pull model`: pub-sub
    - `real-time` event, `high-throughput`: up to millions of messages per second.
    - Kafka `retains messages` for a period

- 应用场景
  - 异步处理提高效率
  - 系统 decouple
  - 高并发流量 buffer (eg. wait for DB to process)
  - 用户日志实时收集分析 => Spark(Data Science 场景)

![](https://imgur.com/4VroLLd.jpg)
![](https://imgur.com/qYsHLMG.jpg)
![](https://imgur.com/agYuLFB.jpg)

# Theories

## Abstract Design

### Record (aka event/ messages)

- Record :=

  - `Timestamp`: when produced
  - `Key`: used for `partitioning` records. guarantee: same key => same partition
  - `Payload`: can be any sequence of bytes (JSON/ plain text/ ...)
  - `Topic`: which topic the record belongs to

- `Record are immutable`: Once it is written to a Kafka topic (cannot update/delete).

### Topic

- `topics` are logical channels of distributing records(pub/sub model)

  - eg. payment

- `topic don't has size limit`.

  - for large topic and small machines, you can partition the topic to `multiple nodes`.

- `data retaintion period` can be configured in topic

### Partition

- `Partition`: `topic` can be divided into `partitions`

  - `purpose`:
    - to distribute a topic to many broker nodes,
    - to group Record based on their `key`

### Broker (Kafka Nodes)

- a broker is `a node` in a Kafka cluster that `runs Kafka process`:

  - receive records from producer
  - store records in partitions
  - serve records to consumers

- `brokers` distribute records from producers to consumers

  - `decouple`: through broker, producer and consumer are `decoupled` and never know each other

- As distributed node, Broker can be `scaled horizontally`

### Producer

- `Producers API`: publishing data to Kafka topics.
  - create records(messages)
  - send records(messages) to Kafka brokers

### Consumer

- `Consumers API` : `subscribe to Kafka topics`, and pull messages from Kafka topics

- `consumer groups`: multiple consumers to consume messages from a topic
  - Kafka automatically balances the load. Ensuring that each `partition` is `processed by only one consumer at a time`

### Connectors

- `connectors (Kafka Connect API)` connects Kafka cluster to external applications

  - `Connect Source Connectors`: act as `Producers`
    - ingest data from external systems into Apache Kafka
    - eg: databases(e.g., MySQL, PostgreSQL), MQ(RabbitMQ), cloud source(AWS S3)
  - `Connect Sinks Connectors`: act as `Consumers`
    - export data from Apache Kafka topics to external systems
    - eg: databases (e.g., Elasticsearch, Cassandra), AWS S3, analytics platforms (e.g., Hadoop, Spark)...

### Admin

- `Kafka Controller(Admin API)` is responsible for managing Kafka cluster

  - leader election for partitions
  - broker health monitoring
  - topic configuration changes.

### Stream API

- `Kafka Streams API` (Java library)
  - provides a way to process and analyze data as it flows through Kafka topics
    - recieve stream
    - process stream: filtering, grouping, aggregating, joining, etc
    - put stream back to broker
  - Application: eg: real-time analytics, data transformation, ETL, microservice
