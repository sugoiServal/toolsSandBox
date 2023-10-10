- kafka: distributed event streaming platform.

  - distributed: may be many brokers nodes
  - scalable: horizontal scalability
  - high throughput

- application:
  - lyft driver realtime location
  - log aggregation, real-time analytics, building data pipelines for streaming data.

### kafka vs rabbitmq

- both popular open-source message brokers

- RabbitMQ: traditional message broker

  - messaging patterns:
    - pub-sub, request-response, point-to-point messaging
  - Non-real time message
  - RabbitMQ typically does not retain messages after consumption

- Kafka

  - messaging patterns:
    - pub-sub
  - real-time event
  - Kafka retains messages for a period
  - `high-throughput`

# Theories

## Abstract Design

### Record

- also known as: messages
- a Record is consist of

  - `Timestamp`: when produced
  - `Key`: used for `partitioning` records.
    - Messages with the same key are guaranteed to be sent to the same partition
  - `Payload`: can be any sequence of bytes (JSON/ plain text/ ...)
  - `Topic`: which topic the record belongs to

- `Immutability`: Once a record is written to a Kafka topic, it is immutable (cannot update/delete).

### Topic

- `topics` are logical channels of distributing records(pub/sub model)
  - `there is no size limit to topic`. If you want a big topic in small machines, you have to partition the topic to multiple nodes.

### Partition

- `Partition`: Each `topic can be divided into partitions`
  - `purpose`: to parallelize a topic to many broker nodes
  - Partitions helps distribute/store messages in multiple brokers/consumers setting

## Components

### Producer

- `Producers` are responsible for publishing data to Kafka topics.
  - create records(messages)
  - send records(messages) to Kafka brokers

### Broker

- `brokers` distribute records from producers to consumers
- `a broker` is a VM that runs Kafka process
- `brokers` are nodes in a Kafka cluster
  - receive records from producer
  - store records in partitions
  - serve records to consumers
- Broker can be `scaled horizontally`

### Consumer

- `Consumers` are applications or processes that subscribe to Kafka topics, and pull messages from Kafka topics

- `consumer groups`: multiple consumers to consume messages from a topic
  - Kafka automatically balances the load. Ensuring that each `partition` is `processed by only one consumer at a time`

## Implementation

### Connectors

- connectors connects Kafka cluster to external applications
  - `Connect Source Connectors`: act as `Producers`
    - ingest data from external systems into Apache Kafka
    - eg: databases(e.g., MySQL, PostgreSQL), MQ(RabbitMQ), cloud source(AWS S3)
  - `Connect Sinks Connectors`: act as `Consumers`
    - export data from Apache Kafka topics to external systems
    - eg: databases (e.g., Elasticsearch, Cassandra), AWS S3, analytics platforms (e.g., Hadoop, Spark)...

### Kafka Controller (admin)

- Kafka Controller is responsible for managing Kafka cluster
  - leader election for partitions
  - broker health monitoring
  - topic configuration changes.

### Kafka Streams API (Java)

- Kafka Streams API is a `Java library`

- Kafka Streams provides a way to process and analyze data in real-time as it flows through Kafka topics

  - recieve stream
  - process stream: filtering, grouping, aggregating, joining, etc
  - put stream back to broker

- Application
  - real-time analytics,
  - data transformation,ETL
  - Data enrichment
  - Event-driven microservices

## Features

### Ordering (TODO)

### Retention (TODO)

### Scaling (TODO)
