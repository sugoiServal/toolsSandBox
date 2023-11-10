- client: construct and send DSL query, receive response, json object mapper
- two clients

  - high level:
    - Java API client (current)
    - RestHighLevelClient (HLRC, deprecated), [ref](https://www.bilibili.com/video/BV1LQ4y127n4/?p=93)
  - low level:
    - RestClient: Low Level Rest Client

- API client refs
  - [ref](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/getting-started-java.html#_deleting_documents)
  - using an [asyncClient(with callback)](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/blocking-and-async.html)

# Getting started

- [install, connection](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/_setup.html)

```xml
<dependency>
    <groupId>co.elastic.clients</groupId>
    <artifactId>elasticsearch-java</artifactId>
</dependency>

<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

- connecting

```java
@Configuration
public class ESConfig {
    @Bean
    ElasticsearchClient elasticsearchClient() throws IOException {
        // if use CA cert file
        File certFile = new File("/home/ฅ^｡ꞈ｡^ฅ/http_ca.crt");
        SSLContext sslContext = TransportUtils
                .sslContextFromHttpCaCrt(certFile);

        // if use certificate fingerprint
        // String fingerprint = "<certificate fingerprint>";

        // SSLContext sslContext = TransportUtils
        //     .sslContextFromCaFingerprint(fingerprint);

        // username/pw
        BasicCredentialsProvider credsProv = new BasicCredentialsProvider();
        credsProv.setCredentials(
                AuthScope.ANY, new UsernamePasswordCredentials("elastic", "jfYsA7=-j_dSUWfmp6HK")
        );

        // Create the low-level client
        RestClient restClient = RestClient
                .builder(new HttpHost("localhost", 9200, "https"))    // host:string, port: int, protocol: string
                .setHttpClientConfigCallback(hc -> hc
                        .setSSLContext(sslContext)
                        .setDefaultCredentialsProvider(credsProv)
                )
                .build();

        // Create the transport
        ElasticsearchTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());

        // Create Blocking clinet
        ElasticsearchClient esClient = new ElasticsearchClient(transport);

        // Create Asynchronous non-blocking client
        // ElasticsearchAsyncClient asyncClient = new ElasticsearchAsyncClient(transport);

        return esClient;
    }
}
```

# Indexing

- [single create](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/indexing.html)
- [bulk create](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/indexing-bulk.html)

```java
// Dynamic Mapping & index document with POJO
Product product = new Product("bk-1", "City bike", 123.0);

IndexResponse response = esClient.index(i -> i
    .index("products")    // provide index name
    .id(product.getSku())  // provide id field
    .document(product)
);

logger.info("Indexed with version " + response.version());



// Explicit mapping with raw json
final String INDEX_STRING = "{\"mappings\":{\"properties\":{\"age\":{\"type\":\"integer\"},\"email\":{\"type\":\"keyword\",\"index\":false},\"name\":{\"properties\":{\"firstName\":{\"type\":\"keyword\"},\"lastName\":{\"type\":\"keyword\"}}},\"employee-id\":{\"type\":\"keyword\",\"index\":false},\"info\":{\"type\":\"text\",\"analyzer\":\"standard\"}}}}";
Reader input = new StringReader(INDEX_STRING);
IndexRequest<JsonData> request = IndexRequest.of(i -> i
        .index("my-index")
        .withJson(input)
);
IndexResponse response = esClient.index(request);
System.out.println("Indexed with version " + response.version());


// using async client
// https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/indexing.html#_using_the_asynchronous_client
```

- index exist/delete

```java
@Test
void testIndexExistandDeletion() throws IOException {
    BooleanResponse existsResponse = esClient.indices().exists(i->i.index("my-index"));
    if (existsResponse.value()) {
        System.out.println("index exist, now execute deletion");
        DeleteIndexResponse deleteResponse = esClient.indices().delete(i->i.index("my-index"));
        System.out.println("deleted index: " + deleteResponse.toString());
    }
}
```

# Document Operations

- write index documents

```java
// Dynamic Mapping & index document with POJO
Product product = new Product("bk-1", "City bike", 123.0);

IndexResponse response = esClient.index(i -> i
    .index("products")    // provide index name
    .id(product.getSku())  // provide id field
    .document(product)
);

logger.info("Indexed with version " + response.version());
```

- bulk index document
- [ref](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/indexing-bulk.html)

```java
// bulk index pojo
List<Product> products = fetchProducts();

BulkRequest.Builder br = new BulkRequest.Builder();

for (Product product : products) {
    br.operations(op -> op
        .index(idx -> idx
            .index("products")
            .id(product.getSku())
            .document(product)
        )
    );
}

BulkResponse result = esClient.bulk(br.build());

// Log errors, if any
if (result.errors()) {
    logger.error("Bulk had errors");
    for (BulkResponseItem item: result.items()) {
        if (item.error() != null) {
            logger.error(item.error().reason());
        }
    }
}

// bulk index from raw json: https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/indexing-bulk.html#indexing-raw-json-data
File[] logFiles = logDir.listFiles(
    file -> file.getName().matches("log-.*\\.json")
);

BulkRequest.Builder br = new BulkRequest.Builder();

for (File file: logFiles) {
    FileInputStream input = new FileInputStream(file);
    BinaryData data = BinaryData.of(IOUtils.toByteArray(input), ContentType.APPLICATION_JSON);

    br.operations(op -> op
        .index(idx -> idx
            .index("logs")
            .document(data)
        )
    );
}

BulkResponse result = esClient.bulk(br.build());
```

- get documents

- [ref](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/reading.html)

```java
// use json object mapper
GetResponse<Product> response = esClient.get(g -> g
    .index("products")
    .id("bk-1"),
    Product.class
);

if (response.found()) {
    Product product = response.source();
    logger.info("Product name " + product.getName());
} else {
    logger.info ("Product not found");
}

// read raw json
GetResponse<ObjectNode> response = esClient.get(g -> g
                .index("customer")
                .id("1"),
                ObjectNode.class
);

if (response.found()) {
    ObjectNode json = response.source();
    String name = json.get("firstname").asText();
    System.out.println("firstname " + name);
} else {
    System.out.println("Product not found");
}
```

- delete document

```java
esClient.delete(d -> d.index("products").id("bk-1"));
```

# Query

- [search](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/searching.html)

  - [compound queries](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/searching.html#_nested_search_queries)
  - [use queries templated](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/searching.html#_templated_search)
    - think a DSL template just provide field and value to search

- Querys
  - MatchQuery
  - TermQuery
  - RegexpQuery
  - GeoBoundingBoxQuery
  - GeoDistanceQuery
  - ...

```java
// match query
String searchText = "bike";

SearchResponse<Product> response = esClient.search(s -> s
        .index("products")
        .query(q -> q
            .match(t -> t           // query type: match
                .field("name")
                .query(searchText)
            )
        ),
    Product.class                   // pojo mapper reference
);

// compound query
String searchText = "bike";
double maxPrice = 200.0;

// Search by product name
Query byName = MatchQuery.of(m -> m
    .field("name")
    .query(searchText)
)._toQuery();

// Search by max price
Query byMaxPrice = RangeQuery.of(r -> r
    .field("price")
    .gte(JsonData.of(maxPrice))
)._toQuery();

// Search by term
Query byTerm = TermQuery.of(t -> t
        .field("Nation")
        .value("Russia")
)._toQuery();

// Combine name and price queries to search the product index
SearchResponse<Product> response = esClient.search(s -> s
    .index("products")
    .query(q -> q
        .bool(b -> b
            .must(byName)
            .must(byMaxPrice)
        )
    ),
    Product.class
);

// or get raw json (ObjectNode)
SearchResponse<ObjectNode> response = esClient.search(s -> s
    .index("products")
    .query(q -> q
        .bool(b -> b
            .must(byName)
            .must(byMaxPrice)
        )
    ),
    ObjectNode.class
);
```

- response

```java
// hit numbers
TotalHits total = response.hits().total();
boolean isExactResult = total.relation() == TotalHitsRelation.Eq;

if (isExactResult) {
    logger.info("There are " + total.value() + " results");
} else {
    logger.info("There are more than " + total.value() + " results");
}

// hit collection
List<Hit<Product>> hits = response.hits().hits();
for (Hit<Product> hit: hits) {
    Product product = hit.source();
    logger.info("Found product " + product.getSku() + ", score " + hit.score());
}
```

# Result set: Pagination, Sort, Aggregation

- [Aggregation](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/aggregations.html)

- for analytics it is typical to set the result size to 0 and the target class to Void.class

```java
// define query
Query query = MatchQuery.of(m -> m
    .field("name")
    .query("bike")
)._toQuery();

SearchResponse<Void> response = esClient.search(b -> b
    .index("products")
    .size(0)
    .query(query)
    .aggregations("price-histogram", a -> a
        .histogram(h -> h
            .field("price")
            .interval(50.0)
        )
    ),
    Void.class
);


@Test
void testAggregation() throws IOException{
    Query query = MatchQuery.of(m -> m
            .field("name")
            .query("bike")
    )._toQuery();

    GeoDistanceSort geoDistanceSort = GeoDistanceSort.of(g->g
            .field("location")
            .location(l->l.latlon(f->f.lat(31.21).lon(121.5)))
            .unit(DistanceUnit.Kilometers)
            .order(SortOrder.Asc)
    );

    SearchResponse<Void> response = esClient.search(b -> b
                    .index("products")
                    .query(query)
                    .sort(s->s.field(f->f.field("price").order((SortOrder.Asc))))    // field sort
                    .sort(s->s.geoDistance(geoDistanceSort))                         // geoDistanceSort
                    .from(0)                                                            // pagination
                    .size(0)
                    .aggregations("bucketAgg", a -> a                         // bucket aggregation on terms and nested aggregation
                            .terms(t->t
                                    .field("Nation")
                                    .size(10)
                                    .order(NamedValue.of("scoreAgg.avg", SortOrder.Asc))
                            )
                            .aggregations("scoreAgg", agg->agg
                                    .stats(s-> s.field("price")))
                    ),
            Void.class
    );
}
```

# Highlighter

```java
@Test
void testHighlighter() throws IOException {
    SearchResponse<ObjectNode> response = esClient.search(s->s
            .index("products")
            .query(q->q
                    .match(m->m
                        .query("bike")
                        .field("product"))
            )
            .highlight(h->h
                    .fields("name", f->f
                            .preTags("<em>")
                            .postTags("</em>")
                            .requireFieldMatch(false)
                    )
            )
            , ObjectNode.class);
}
```

# Completion (suggestion)

- 应用：搜索框自动补全 [](https://www.bilibili.com/video/BV1LQ4y127n4?p=131)

```java
@Test
void testCompletion(String prefix) throws IOException{
    SearchResponse<ObjectNode> response = esClient.search(b->b
                .suggest(s ->s.suggesters("my-suggest", suggest->suggest
                                                .prefix(prefix)
                                                .completion(c->c.field("title").skipDuplicates(true).size(10))
                )), ObjectNode.class
    );

    Set<Map.Entry<String, List<Suggestion<ObjectNode>>>> entries = response.suggest().entrySet();
}

// DSL
{
  "suggest": {
    "<suggestionName:my-suggest>": {
      "prefix": "s",    // prefix to be completed (eg: user input from frontend)
      "completion": {
        "field": "<products_name>",   // match a completion type field
        "skip_duplicates": true,    // 不获取重复结果
        "size" : 10               //获取前十条
      }
    }
  }
}
```
