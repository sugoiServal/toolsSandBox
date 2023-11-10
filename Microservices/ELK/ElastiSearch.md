### resource

- tutorials

  - [full](https://www.bilibili.com/video/BV1LQ4y127n4/?p=103&vd_source=c2cab8b68e17f7406c35e588a940b4ae)
  - [101](https://logz.io/blog/elasticsearch-tutorial/)
  - [data ETL to ES](https://www.youtube.com/watch?v=EYtAaCcTfdk)
  - [Inngress Pipe example: Lambda to Elasticsearch](https://www.youtube.com/watch?v=O7KBDGsFNOo)
  - [an application](https://quoeamaster.medium.com/how-to-build-real-world-applications-with-elasticsearch-part-01-622b5d7b683b)

- Docs:

  - [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
  - [Elasticsearch client](https://www.elastic.co/guide/en/elasticsearch/client/index.html)

- cluster
  - k8s, container deployment:
    - [image](https://hub.docker.com/_/elasticsearch)
    - [run in docker](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-cli-run-dev-mode)
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
  - Logstash: Data ETL (you don't need to use it though, SQS+Lambda, Kafka Stream, AWS Glue...)
  - Kibana: data visualization (dashboarding, GUI, run query DSL)

- features:

  - `Elasticsearch client` (SDK for admin, indexing, searching): Java, JavaScript, Go, .NET, PHP, Perl, Python or Ruby.
  - `Document`: `JSON document` as data
  - `Indexes`: collection of documents, can be applied with schemas
  - `Mapping`: provide schema
  - `Inverted Index`:
    - `tokenization`: ingress documents are broken into tokens (`Semantically`: words, numbers, geospacial...)
    - `Inverted Index`: a mapping of tokens to documentId is created: Inverted Index (eg: "fox" -> docID_list[1,3,4,5])
    - when searching, Elasticsearch scan through tokens to collect the documents' id, then retrieve these documents
    - `Ranked Result`: use ranking to sort return documents
      - by default, rank is based on Positional Information - where in the document the term appears.
  - `Query DSL` (ElasticSearch's query language), HTTP request like
    - `Write, Query, Analysis, Aggregations...`
  - `Elasticsearch Cluster`:
    - 存储的文档分布在整个集群中，并且可以`从任何节点开始搜索`(每个 node 都具有 HTTP server)
    - `Shard Routing`: Elasticsearch 自动在所有可用节点上分配/平衡数据(shards)
      - shard routing: determine which shard a document belongs to
      - routing is typically based on a document's id and a hash function
    - `coordinating node`: responsible for coordinating `distributed query`
      - When a query is issued to an Elasticsearch cluster, it is routed to a coordinating node, which
        - `scatter` query to the correct data nodes, then data node execute their query locally,
        - `gather` data node's results into a result set
    - `Circuit Breakers`: ES uses circuit breakers to prevent overloading a node with queries or data
    - ES uses `read-replica shards` and `Cross-cluster replication (CCR)` for reading/backup/fail-tolerant

- Fuzzy searching: tokenizes indexed can create issues with typos, capitalization, and other text-related challenges. you can implement various strategies
  - `Token Filters`: tools provided by ES to address issues like capitalization, stemming(eg. run == "running,"/ "ran,"/ "runs"...), accent marks, asciifolding (e.g., "é" becomes "e")
  - `Custom Analyzers`: create custom token filters to suit your data and query requirements (eg. "u.s.a" == "united states")
  - `Fuzzy Matching`: allows for approximate(fuzzy) matching of terms, which can handle minor typos
  - `Data Preprocessing`: you can perform data pre-processing as part of ELT to ES
  - `Did You Mean (DYM) Suggestions`: You can implement Did You Mean (DYM) suggestions to correct user's query (algorithms like Levenshtein distance/ phonetic matching/ Machine Learning-Based)

# Basics Usage

## Get Started

- [Start the Elastic Stack with security enabled automatically](https://www.elastic.co/guide/en/elasticsearch/reference/current/configuring-stack-security.html)
- [run ELK from docker](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-cli-run-dev-mode)

- install elasticsearch

```bash
docker network create elastic
docker pull docker.elastic.co/elasticsearch/elasticsearch
docker run --name es01 --net elastic -p 9200:9200 -p 9300:9300 -it -m 1GB -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch
  # 9200: client API
  # 9300: cluster inter-node

# get a password, default username is 'elastic'
docker exec -it es01 /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic
export ELASTIC_PASSWORD="your_password"
# get TLS token from container to localhost
docker cp es01:/usr/share/elasticsearch/config/certs/http_ca.crt .
# test
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD https://localhost:9200
```

- install kibana

```bash
# creates enrollment tokens for Elasticsearch nodes and Kibana instances
docker exec -it es01 /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana --url https://localhost:9200
export ENROLL_TOKEN='your_token'

docker pull docker.elastic.co/kibana/kibana:8.10.4
docker run \
  --name kibana \
  --net elastic \
  -p 5601:5601 \
  docker.elastic.co/kibana/kibana:8.10.4

# paste the enrollment token to localhost:5601, then input the verification from Kibana server
# Login from GUI with elastic:$ELASTIC_PASSWORD
# All Set
```

- curl examples

```bash
# POST
  # request adds a new document that has an ID of 1, and creates indexes of the document
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD -X POST "https://localhost:9200/customer/_doc/1?pretty" -H 'Content-Type: application/json' -d '
{
  "firstname": "Jennifer",
  "lastname": "Walters"
}
'
# GET single doc
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD -X GET "https://localhost:9200/customer/_doc/1?pretty"

# _bulk API: bulk operation. data must be newline-delimited JSON (each line end in \n)
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD -X PUT "https://localhost:9200/customer/_bulk?pretty" -H 'Content-Type: application/json' -d'
{ "create": { } }
{ "firstname": "Monica","lastname":"Rambeau"}
{ "create": { } }
{ "firstname": "Carol","lastname":"Danvers"}
{ "create": { } }
{ "firstname": "Wanda","lastname":"Maximoff"}
{ "create": { } }
{ "firstname": "Jennifer","lastname":"Takeda"}
'

# search (query)
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD -XGET 'https://localhost:9200/_search?q=Jennifer' # URL query

curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD -X GET "https://localhost:9200/customer/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query" : {
    "match" : { "firstname": "Jennifer" }
  }
}
'
```

### Admin endpoints

```bash
# `/`: Cluster state Endpoint
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD -XGET 'https://localhost:9200/'

# `/_cluster/state`: current state of the entire cluster: nodes, indices, shards
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD -XGET 'https://localhost:9200/_cluster/state'

# `/_nodes` and `/_nodes/{nodeId}`: Provides information about nodes
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD -XGET 'https://localhost:9200/_nodes'

# `/_cat`: Cat APIs, A group of endpoints that provide various info in a human-readable format
# /_cat/indices: list all indices
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD -XGET 'https://localhost:9200/_cat/indices?v&pretty'
```

## Plugins

- [doc](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/modules-plugins.html)

# Elsticsearch Cluster

- [node types](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-node.html)

### Sharding

- `shards (primary shards)`: Each shard is a self-contained index. Shards are distributed inside many physical nodes.
- `Elasticsearch index`: a logical grouping of all indexes in many physical shards. These segments are periodically merged.
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
