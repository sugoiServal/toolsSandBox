- [All ES REST APIs](https://www.elastic.co/guide/en/elasticsearch/reference/current/rest-apis.html)

- index: a collection of document
- document: json format, an data entry
- field: json field of a documnet

- API endpoints:
  - `/{index}/_search`: perform search queries
  - `_doc`: get single doc
  - `/_bulk`: send multiple document operations in a single request
  - `_analyze`: Performs analysis on a text string and returns the resulting tokens.

# Mapping, Index Creation

- `Mapping` are schemas to indexes: defining document and the fields are indexed and stored
- There are two types of mappings

  - Dynamic Mapping: automatically Mapping, by default you don’t need to create an index and mapping, PUT any document and it will be automatically indexed
  - Explicit Mapping: you define your own mapping explicitly

- [docExplicit Mapping:](https://www.elastic.co/guide/en/elasticsearch/reference/current/explicit-mapping.html)
  - `PUT /<index>`: create index API
  - [Field data types](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html)
    - text: unstructured text, could be tokenized
    - keyword: keyword, cannot be tokenized (eg. brands, Nation, email)
    - Numbers: long, integer, short, double, float...
    - boolean
    - date
    - object: {}, []
    - geo_point: Latitude and longitude points
    - alias: Defines an alias for an existing field.
    - completion: generate suggestions as type completion for the field
  - `properties`: indicate an object or an nested object
  - `index`: whether or not creating an index for search (default: true)
  - analyzers:
    - `analyzer`: which tokenizer to used (for a text type) during index creation
    - `search_analyzer`: which tokenizer to used (for a text type) during search

```json
PUT /my-index-000001
{
  "mappings": {
    "properties": {
      "age":    { "type": "integer" },
      "email":  {
        "type": "keyword",
        "index": false
      },
      "name":   {
        "properties": {
          "firstName": {"type": "keyword"},
          "lastName": {"type": "keyword"}
        }
      },
      "employee-id": {
        "type": "keyword",
        "index": false
      },
      "info": {
        "type" : "text",
        "analyzer": "standard"
      }
    }
  }
}

// get an index's mapping
GET /my-index-000001/_mapping

// add new field
PUT /my-index-000001/_mapping
{
  "properties": {
    "office-id": {
      "type": "keyword",
      "index": false
    }
  }
}

// update to an existing field is not allowed!

// delete
DELETE /my-index-000001
```

# Document CRUD

```json
// POST /<indexName>/_doc/<docid>
POST /customer/_doc/1
{
  "firstname": "Jennifer",
  "lastname": "Walters"
}
// GET, DELETE
GET /customer/_doc/1
DELETE /customer/_doc/1

// PUT _doc:
    // document id exist: delete old and create new
    // document id not-exist: create new
PUT /customer/_doc/1
{
  "firstname": "Crag",
  "lastname": "Walters"
}

// PUT _bulk: bulk operation. Data must be newline-delimited JSON (each line end in \n)
PUT /customer/_bulk
{ "create": { } }
{ "firstname": "Monica","lastname":"Rambeau"}
{ "create": { } }
{ "firstname": "Carol","lastname":"Danvers"}
{ "create": { } }
{ "firstname": "Wanda","lastname":"Maximoff"}
{ "create": { } }
{ "firstname": "Jennifer","lastname":"Takeda"}



// POST _update: partial update fields of an existing document
POST /customer/_update/1
{
  "doc": {
    "lastname": "W"
  }
}
```

# Query

[query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)

- 分类

  - `match_all`: return all documents, eg. for test
  - Full text queries: (for text) typically used in `search bar`
    - `match`: tokenize query and then query tokens in Inverted Index
    - `multi_match`: match with multiple fields
  - Term-level queries: (for keywords and datatypes) find documents based on precise values in structured data. Eg. 价格 range, 品牌分类， 城市分类...
    - `ids`: id
    - `range`: 根据数值范围
    - `regexp, wildcard, fuzzy`: 根据匹配
    - `term, terms, terms_set`: 根据精确值(keyword)
  - geo queries: 根据经纬度, 距离, eg. 查询我附近的餐馆、出租车。
    - geo_bounding_box: 位置处于一个 bounding_box 内的点
    - geo_distance: 位置到圆心距离小于某值的点
  - compound queries:
    - `function_score`: customize the ranking score function
      - filter: 哪些 doc 要改分
      - weight: 怎么计算 weight
      - boost_mode: weight 怎么 apply to 原始分数
    - `bool`: eg. combined result of search bar(Full text) and filters(Term-level)
      - must: query 必须出现(AND)， 参与算分
      - filter: query 必须出现(AND)， 不参与算分
      - should: query 可以出现(OR)， 参与算分
      - must_not: query 必须不出现(EXCLUDE)， 不参与算分
      - 一般来说搜索关键词用 must, filters 用 filter 或 must_not

- query efficiency:
  - 搜索的 field 越多，查询效率越低。
  - wildcard and regexp queries, WARNING: slow

```json
// match_all
GET /indexName/_search   // or /_search apply to all indexes
{
    "query": {
        "match_all": {}
    }
}

// match: https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html
GET /indexName/_search
{
  "query": {
    "match": {
      "<FIELD>": "<SEARCH>"
    }
  }
}

GET /indexName/_search
{
  "query": {
    "multi_match": {
      "query": "<SEARCH>",
      "fields": ["<FIELD1>", "<FIELD2>"..]
    }
  }
}

// Term-level queires: https://www.elastic.co/guide/en/elasticsearch/reference/current/term-level-queries.html

// Term query
GET /_search
{
  "query": {
    "term": {
      "<FIELD>": {
        "value": "<SEARCH>",
      }
    }
  }
}

// Range query
GET /_search
{
  "query": {
    "range": {
      "<FIELD>": {
        "gte": 10,
        "lte": 20,
      }
    }
  }
}

// wild card, regexp match
GET /_search
{
  "query": {
    "wildcard": {
      "field_name": "*substring*"
    }
  }
}

GET /_search
{
  "query": {
    "regexp": {
      "field_name": ".*substring.*"
    }
  }
}

// Geo queries
// geo_bounding_box
GET /my_locations/_search
{
  "query": {
    "geo_bounding_box": {
      "<GEO_POINT_FIELD>": {
        "top_left": {
          "lat": 40.73,
          "lon": -74.1
        },
        "bottom_right": {
          "lat": 40.01,
          "lon": -71.12
        }
      }
    }

  }
}
// geo_distance
GET /my_locations/_search
{
  "query": {
    "geo_distance": {
        "distance": "15km",
        "<GEO_POINT_FIELD>": {  // center coordinate
          "lat":31.21,
          "lon": 121.5
        }
      }
  }
}


// Compound queires: https://www.elastic.co/guide/en/elasticsearch/reference/current/compound-queries.html
// 1. functions: https://www.bilibili.com/video/BV1LQ4y127n4?p=106
// 2. bool: https://www.bilibili.com/video/BV1LQ4y127n4?p=107
GET _search
{
  "query": {
    "bool" : {
      "must" : {
        "term" : { "user.id" : "kimchy" }
      },
      "filter": {
        "term" : { "tags" : "production" }
      },
      "must_not" : {
        "range" : {
          "age" : { "gte" : 10, "lte" : 20 }
        }
      },
      "should" : [
        { "term" : { "tags" : "env1" } },
        { "term" : { "tags" : "deployed" } }
      ],
      "minimum_should_match" : 1,
      "boost" : 1.0
    }
  }
}
```

# Suggestion

- [completion type](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/completion.html)
- [completion suggester](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/search-suggesters.html#completion-suggester)

- completion suggestion requirements:
  - field type: completion
  - field data: array of keywords

```json
// field: completion type
PUT products
{
  "mappings": {
    "properties": {
      "<FieldName:name>": {
        "type": "completion"
      }
    }
  }
}

// documents: array of keywords
PUT products/_doc/1
{
  "<FieldName:products_name>" :  [ "Sony", "WH-1000XM3" ]
}
PUT products/_doc/2
{
  "<FieldName:products_name>" :  [ "SK-II", "PITERA" ]
}
PUT products/_doc/3
{
  "<FieldName:products_name>" :  [ "Nintendo", "Switch" ]
}

// query
POST music/_search?pretty
{
  "suggest": {
    "<suggestionName>": {
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

# Result Set

- Result Set:

  - [Paginate](https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html)
  - [sort](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/sort-search-results.html)
  - [highlighting](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/highlighting.html)

  - [Aggregation](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/search-aggregations.html)

### Paginate

- By default, searches return the top `10 matching hits`. You can change the return number

  - `from`: defines the number of hits to skip
  - `size`: the maximum number of hits to return

- By default, cannot use `from` and `size` to page more than `10,000 hits`. (search requests usually span multiple shards. Deep pages or large sets of results can significantly increase CPU/Memory)
  - `search_after`: 解决一次查询 10000 以上条的方案

### Sort

- can define `custom sort criteria`.
  - keyword, number, date
  - `_geo_distance`
- by default docs are sorted by `_score` (BM25 algorithm)
  - 使用 custom sort 后不再算分

### Highlighting

- 使用 highlighting
  - 默认情况下，query filed 必须与 highlight field 一致。to override add
    - `"require_field_match": "false"`

```json

GET _search
{

  "query": {
    // define queires
  },

  // sort by multiple criterias
  "sort": [
    {
      "<FIELD1>": "desc"    // sortBy fields: keywords, numbers, date
    },
    {
      "<FIELD2>": "asc"
    },
    {
      "_geo_distance" : {  // sortBy geo_distance: FIELD loc's distance to a point
        "<FIELD2: GEO_POINT>": { "lat":31.21, "lon": 121.5},
        "order": "asc",
        "unit": "km"
      }
    }
  ],

  // paginate
  "from": 15,   // skip
  "size": 25,  // number

  // highlight
  "highlight": {
    "fields": {
      "<FIELD>": {   // highlight field
        "pre_tags": "<em>",  // default is <em>, </em> if not specified
        "post_tags": "</em>",
        "require_field_match": "false"
      }
    }
  }
}
```

## Aggregation

- Aggregations categories

  - `Bucket` aggregations: group documents into buckets (subset)
  - `Metric` aggregations: calculated metrics (sum or average)
  - `Pipeline` aggregations: input from other aggregations/ output to other aggregation (eg> Bucket aggregation to Metric aggregations)

- Aggregation do not support `text`

  - could be: term , numbers, dates...

- docs
  - [Bucket](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/search-aggregations-bucket.html)
  - [Metric](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/search-aggregations-metrics.html)
  - [Pipeline](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/search-aggregations-pipeline.html)

### Bucket aggregations

- common type of Bucket Aggs
  - [terms](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/search-aggregations-bucket-terms-aggregation.html)
  - [range](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/search-aggregations-bucket-range-aggregation.html)
  - [date_histogram]https://www.elastic.co/guide/en/elasticsearch/reference/8.10/search-aggregations-bucket-datehistogram-aggregation.html
  - ...

### Metric Aggregation

- common type of Metric Aggs
  - Avg, Min, Max, Stats, ...

```json
GET /my-index-000001/_search
{
  "query": {
    // placing a query before aggs will limit the aggregation to the query result set
  },

  "aggs": {
    "<aggName>": {
      "terms": {   // term aggregation
        "field": "<my-field>",
        "size": 10 , // number of result to return
        "order": {   // alter sorting behavior by sub agg's calculated value
          "scoreAgg.avg": "desc"
        },
      },
      "aggs": {     // sub Aggs to each bucket: Metric
        "<aggName: scoreAgg>":  {
          "stats": {  // calculate stats: min, max, avg, sum
            "field": "<my-field>"
          }
        }
      }
    }
  }
}
```
