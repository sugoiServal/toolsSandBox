### resource

- tutorials

  - [101](https://logz.io/blog/elasticsearch-tutorial/)
  - [data ETL to ES](https://www.youtube.com/watch?v=EYtAaCcTfdk)
  - [Lambda pulls data from Amazon Connect, pushes to Elasticsearch, and visualizes it in Kibana](https://www.youtube.com/watch?v=O7KBDGsFNOo)
  - [an application](https://quoeamaster.medium.com/how-to-build-real-world-applications-with-elasticsearch-part-01-622b5d7b683b)

- To learn:

  - [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
  - [Elasticsearch client](https://www.elastic.co/guide/en/elasticsearch/client/index.html)

- cluster
  - k8s, container deployment:
    - [image](https://hub.docker.com/_/elasticsearch)
    - [single node, certs, register nodes](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-cli-run-dev-mode)
    - [k8s] https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-elasticsearch.html
      - [operator](https://operatorhub.io/operator/elastic-cloud-eck)
  - [TLS](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-tls-certificates.html#k8s-setting-up-your-own-certificate)
  - [snapshot](https://www.elastic.co/guide/en/elasticsearch/reference/current/snapshot-restore.html)

### What is it

- ElasticSearch: an open-source `distributed search engine`

  - based on `Apache Lucene (indexing...)`
  - use `schema-less documents`
  - expose `REST API` for search curd
  - `distributed`, high availability, scalability, and fault tolerance
  - `partly open-source`, still most popular

- ElasticStack (ELK Stack)

  - ElasticSearch: distributed searching
  - Logstash: Data ETL (you don't need to use it though, SQS+Lambda, Kafka, AWS Glue...)
  - Kibana: data visualization (dashboarding)

- features:
  - `Mapping`: provide schema, to support non-auto-detected data types
  - `Elasticsearch client` (SDK for admin, indexing, searching): Java, JavaScript, Go, .NET, PHP, Perl, Python or Ruby.
  - `Query DSL` (ElasticSearch's query language), or `SQL-style (JDBC...)`
    - `Analysis, Aggregations...`
  - `distributed Elasticsearch`:
    - 存储的文档分布在整个集群中，并且可以`从任何节点立即访问`。
    - Elasticsearch 自动在所有可用节点上分配/平衡数据(shards)和查询负载。
    - uses `read-replica shards` and `Cross-cluster replication (CCR)` for reading/backup/fail-tolerant
  - `searching`: When a document is stored, it is indexed and fully searchable within 1s
    - structured queries (think SQL)
    - full text queries: return all documents that match the query string, sorted by relevance
    - complex(combined) queries

# Basics:

- ingestion: document creation + indexing
- feed your data into ES (curl: POST, PUT)
- start using it for search (curl: GET)

## Get Started

- run

```bash
docker network create elastic
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.10.4
docker run --name es01 --net elastic -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -t docker.elastic.co/elasticsearch/elasticsearch:8.10.4
# get a password, default username is 'elastic'
docker exec -it es01 /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic
export ELASTIC_PASSWORD="your_password"
# get TLS token from container to localhost
docker cp es01:/usr/share/elasticsearch/config/certs/http_ca.crt .
# test
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD https://localhost:9200
```

- add nodes to cluster:

```bash

```

- CRUD

```bash
# POST
  # request automatically creates the 'customer' index if it doesn’t exist, adds a new document that has an ID of 1, and stores and indexes the 'firstname' and 'lastname' fields.
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD -X POST "localhost:9200/customer/_doc/1?pretty" -H 'Content-Type: application/json' -d'
{
  "firstname": "Jennifer",
  "lastname": "Walters"
}
'
# GET single doc
curl -X GET "localhost:9200/customer/_doc/1?pretty"

```

## SDK

# Distributed Elsticsearch

## Features

### Sharding

- `shards (primary shards)`: Each shard is a self-contained index. Shards are distributed inside many physical nodes.
- `Elasticsearch index`: a logical grouping of all indexes in many physical shards
- `Balancing shards`: Elasticsearch automatically distributing data among shards
- `replicas shards`: A replica shard (`read-replica`) is a `copy of a primary shard` to protect against hardware failure and for reading

  - documents are created in primary shards, then automatically copied to replicas shards
  - `replica synchronization`: a process to keep sync data between primary and replica shards, using "translog"
  - `read-replica`: query/search(read) are balanced to both primary shards and replicas
  - `shard recovery`: when node of primary shards fail, one of the replica shards are promotes to be a new primary shard

- `cluster state`: cluster maintains a real-time "cluster state" that tracks the location and status of shards and nodes. constantly update as new nodes/sharded create or delete happens

- `Sharding trade-off`: shard-size vs shard-number (just like every sharding DB...)
  - more shards -> slower query
  - larger shards -> harder to rebalance and storage requirement

### Cross-cluster replication (CCR)

- CCR provides a way to
  - synchronize indices from your `primary cluster` to a `secondary cluster as hot backup`
- CCR is active-passive: write master and read slave.

### Monitoring
