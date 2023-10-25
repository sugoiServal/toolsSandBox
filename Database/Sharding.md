- [101](https://www.youtube.com/watch?v=XP98YCr-iXQ)
- [Chatgpt: Query and backup of sharded database](https://chat.openai.com/share/f23c52db-f576-4049-9750-07120e626a6d)

- queries in sharded DB:

  - Query Routing & Parsing: decide which shards are involve, whether there are needs to split the query to multiple shards
  - Query Distribution & Execution: If the query requires data from multiple shards,
    - the shard router will distribute subqueries to shard nodes
    - shards of interest processes subqueries independently
    - Each shard will return a subset of the result set.
  - Result Aggregation: shard router aggregate and merge the results, can be complex if query involves joins/aggregateion

- trade-of (multi-targets optimize):
  - data should be distribute evenly (the purpose of sharding: horizontal scaling)
  - minimize cross shard query (subquries degraded query performance)
- key: choose `shard key` properly
