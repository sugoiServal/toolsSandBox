# Redis

- what it is: in-memory database
- usage: cache, improve read performance

- features

  - Fast (in-memory), base on ANSI C
  - NonSQL, Schemaless, key-value
  - `single-thread process`
  - operations are `atomic`
  - support `data persistence`
  - support `cluster` (master-replica cluster, shard cluster)
  - `clients` (js, java, python....)
  - `Extendable` data model
    - Redis Core: key-value
    - RediSearch, RedisGraph, RedisTimeSeries, RedisJSON...

- resources

  - [image](https://hub.docker.com/_/redis)
  - basics
    - [data types](https://redis.io/docs/data-types/)
    - [commands](https://redis.io/commands/)
    - [crud, transaction, pub/sub](https://redis.io/docs/interact/)
  - [advanced usage](https://redis.io/docs/manual/)
  - [management](https://redis.io/docs/management/)
  - [cluster 101](https://redis.io/docs/management/scaling/)

- tools
  - [clients](https://redis.io/resources/clients/)
  - [GUI](https://www.dragonflydb.io/guides/redis-gui)

### Get started

- Installation

```bash
sudo apt-get update
sudo apt-get install redis
npm -i redis  # node

redis-server  # start backend, (not detached)
redis-cli     # then start client
quit          # quit client


# start in detached mode, with password
# https://www.inmotionhosting.com/support/server/how-to-edit-the-redis-configuration-file/
redis-server redis.conf # start from the redis.conf (detached)
redis-cli -a 123123   # w/ password
redis-cli -u 123123 shutdown
```

# redis-cli Basic

- [ref](https://redis.io/commands/)

### Admin

```bash
AUTH 123123  # login

# get help
HELP Keys # get doc to a commands
HELP @Generic # get commands filter by Generic
```

### Data Type

- key datatype: string
- value datatypes:

  - String (include numeric: int, float, serialized json...)
  - Hash: hash list
  - List: a linked list
  - Set
  - SortedSet
  - (for special needs)
    - GEO: geo-location
    - BitMap: represents a sequence of bits
    - HyperLog(HLL): a probabilistic data structure (application eg, memory efficiently estimate the number of unique elements in a large dataset )

- key hierarchy (:)
  - key 允许通过(:)建立多 string 的层级结构，这样可以存储处于不同业务 namespace 的相同 id.
  - eg:
    - project:product:mirror:1
    - project:user:1

## 常见命令

### Generic command (apply to any data type), string

- 不区分大小写

```bash
#  case does not matter!!
# variable are string by default

# write
SET name kyle              # add or update key / value
MSET k1 v1 k2 v2 k3 v3     # Set multiple keys / values
SETNX k v                  # add a key-value, execute only if key not exist

# get by key
GET name
MGET k1 k2
EXIST name

# query key that matches (https://redis.io/commands/keys/)
  # key matches is costly, not recommend for production environment
KEY *
KEY <pattern>

# delete a key
DEL k1 k2

# delete everything
flushall

# TTL
ttl name                # query key's ttl
  # -1 : 永久有效
  # -2 ：已经删除
expire name 10          # make key expire in 10 seconds
setex name 10 kyle      # set variable ttl when declare them (varName, ttl, value)

# string(numeric)
INCR key                # add int by 1
INCRBY key 2            # add int by a value (can be negative)
INCRBYFLOAT key 2.2     # add float by a amount
```

### Containers

- Hash Table: allow a nested layer of key-value

```bash
# https://redis.io/commands/?group=hash
HSET key hashKey value       # set a hashkey-value
SETNX key hashKey value      # add nx a hashKey-value, execute only if key not exist
HGET key hashKey             # get a hashkey's value
HMSET key hk1 v1 hk2 v2      # batch HSET
HMGET key hk1 hk2            # batch HGET
HINCRBY key hashKey 2        # Increment a int hash value by 2

HEXIST key hashKey           # check an hashKey exist
HGETALL key                  # get all Hashkey-value from a hash table
HKEYS key                    # get all Hashkey
HVALS key                    # get all values

HDEL person age             # delete an attribute
```

- Lists (linked list): read 比较慢 o(n)

```bash
# https://redis.io/commands/?group=list
lpush key v1 v2 v3    # push to list start, order; 1->2->3
rpush key v1 v2 v3    # push to list end

lpop key              # pop from start
rpop key              # pop from end
blpop key timeout     # (block) pop, if fail(nothing in list), block for a time interval and wait for new value, instead of return nil
brpop key timeout

lrange key start end   # print in range: -1 means end of list
```

- Set:
  - set is unique-valued list
  - can be seen as a hashmap with all null value. O(1) read/write

```bash
# https://redis.io/commands/?group=set
SADD key value              # add to set

SCARD key                   # return set size
SISMEMBER key value         # check is member
SMISMEMBER key v1 v2 v3     # check multiple members
SMEMBERS key                # print all set members

SREM key value              # remove members from set

# set operation, store: store the result to a new set
SDIFF k1 k2             # SDIFFSTORE destKey k1 k2
SINTER k1 k2            # SINTERSTORE destKey k1 k2
SUNION k1 k2            # SUNIONSTORE destKey k1 k2
```

- SortedSet: 可排序 set
  - 类似 TreeSet in java。 实现是 SkipList and hashTable
  - each member has a `score` property for sorting
  - fast - application: eg. real-time gaming ranking table

```bash
# https://redis.io/commands/?group=sorted-set
ZADD key score1 value1 score2 value2            # add to set, update score if value already exist
ZREM key value                                  # remove a value

ZPOPMIN key count              # Removes and returns up to count members with the lowest scores
BZPOPMIN                        # blocking ver
ZPOPMAX key count              # Removes and returns up to count members with the highest score
BZPOPMAX                        # blocking ver

Z(M)SCORE key value            # get score of a/multiple value
ZRANK key value                # get rank of a value (rank start from 0)
ZCARD key                      # get number of member

ZCOUNT key min max             # count #value whose score in range (min, max)
ZRANGE key min max             # after sorted, get elements in a SortedSet whose rank in range (min, max)
ZRANGEBYSCORE key min max      # after sorted, get elements in a SortedSet whose score in range (min, max)

ZINCRBY key 2 value                       # increment a value's score by
ZDIFF, ZINTER, ZUNION                     # set operator
ZDIFFSTORE, ZINTERSTORE, ZUNIONSTORE      # set operator then store result in a key

ZREV...                       # result in reverse order
```

### misc

- use **replica** of Redis (multiple processes) that share the data memeory

- **Snapshot** of data that stored in disk (dump.rdb), eg every 5 mins

- AOF(Append Only File)

  - logging every write operations to disk
  - when restored from snapshot, Redis replay the AOF

- Best practice in Cloud: Separate Persistent Storage(Snapshot/AOF) from the Data Service
  - save these logger and snapshot to another host, instead of the host that runs Redis

### scale Redis

- clustering

  - primary for write, multiple replica(copy of primary instance) for read
  - distribute Redis to different nodes

- sharding
  - Divide the whole data set into small chunk of shards each contains a small subset of the data
  - scale database horizontally
