- resources

  - [quickstart](https://kafka.apache.org/documentation/#quickstart)
  - [image](https://hub.docker.com/r/bitnami/kafka)
  - [manually build cluster](https://www.bilibili.com/video/BV19y4y1b7Uo?p=4)

- API list:
  - `Admin API`: manage and inspect topics, brokers, and other Kafka objects.
  - `Producer API`: publish stream of events
  - `Consumer API`: subscribe, read stream of events
  - `Kafka Streams API`: higher-level functions to stream processing (transformations, aggregations)
  - `Kafka Connect API`: build and run reusable data import/export connectors (from/ to external system)

# Setting up Kafka Cluster

- Kafka Cluster can either started using `ZooKeeper` or `KRaft (Kafka Raft, recommend)`
  - these are distributed coordination and synchronization services

### 文件夹

- root
  - bin: .sh for various functionalities (kafka-server-start, kafka-topics, kafka-console-producer...)
  - config: configuration files (server, zookeeper, kraft...)
  - libs: dependencies (Scala/Java)
  - site-docs：帮助文档

```bash
# download https://www.apache.org/dyn/closer.cgi?path=/kafka/3.6.0/kafka_2.13-3.6.0.tgz
wget https://dlcdn.apache.org/kafka/3.6.0/kafka_2.13-3.6.0.tgz
tar -xzf kafka_2.13-3.6.0.tgz
cd kafka_2.13-3.6.0
ls -al
```

### Manually, Zookeeper

- [manually build cluster](https://www.bilibili.com/video/BV19y4y1b7Uo?p=4)

```bash
cd kafka_2.13-3.6.0
vim server.properties   # setting node configurations
    # 1.更改 broker.id: id of node in the cluster. 每一个node的id必须是unique！
    # 2.设置 log.dirs: where kafka data are stored

# start Kraft cluster service
KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"
bin/kafka-storage.sh format -t $KAFKA_CLUSTER_ID -c config/kraft/server.properties

# start Kafka server
bin/kafka-server-start.sh config/kraft/server.properties
```

### Dockerized Kafka Cluster

- [image, docs](https://hub.docker.com/r/bitnami/kafka)
- [Kubernetes](https://github.com/bitnami/charts/tree/main/bitnami/kafka)
