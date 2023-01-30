# Redis
- what it is: In-memory database
- often used as cache to improve performance
### features
- Faster (in-memory)
- Schemaless

### Extended Redis Data-Models with Modules 
- Redis Core: key-value type of data
- RediSearch
- RedisGraph
- RedisTimeSeries
- RedisJSON
<hr>

## Data Security 
### use **replica** of Redis (multiple processes) that share the data memeory
### **Snapshot** of data that stored in disk (dump.rdb), eg every 5 mins
### AOF(Append Only File)
- logging every write operations to disk 
- when restored from snapshot, Redis replay the AOF

### Best practice in Cloud: Separate Persistent Storage(Snapshot/AOF) from the Data Service
- save these logger and snapshot to another host, instead of the host that runs Redis
<hr>

## Redis on Flash
- it is a Enterprise Service that give large data storage (comparable to disk) but at relative low cost (to the actual REM cost)

### how:
- Hot value (freq used): stored in RAM
- Warm values (infreq used): stored in SSD

<hr>

## Redis scaling bottleneck [link](https://youtu.be/OqCK95AS-YE?t=755)
- how would you do if you want to scale Redis
### clustering
- primary for write, multiple replica(copy of primary instance) for read
- distribute Redis to different nodes
### sharding
- Divide the whole data set into small chunk of shards each contains a small subset of the data
- scale database horizontally


<hr>

# In Action

### Installation 
```bash
apt-get update
apt-get install redis
npm -i redis  # for project
```

### basic commands
- Redis store KEY-VALUE pair, generally variable name is refered as KEY 
  - variable(varName:value), 
  - List of key-value
- case does not matter!!

- run
```bash
redis-server  # backend
redis-cli     # UI
quit
```

- variable defaultly be string
```bash
SET name kyle
SET name "kyle Max"
GET name
EXIST name
DEL name
flushall # delete everything
```

- query
```bash
KEY * # query all
KEY <pattern>
```

### TTL
```bash
ttl name                # query variable 'name's time to live
expire name 10          # make 'name' expire in 10 seconds
setex name 10 kyle      # set variable ttl when declare them (varName, ttl, value)
```

### other Containers
- Lists
```bash
lpush friends john    # push to list start: (key, value)  
rpush friends john    # push to list end: (key, value)  

lpop friends          # pop from start
rpop friends          # pop from end

lrange friends 0 -1   # print in range: (key, start, stop)
```
- Set: set is unique-valued list
```bash
SADD friends john    # push to set: (key, value)  
SMEMBERS friends     # print set
SREM friends john    # remove value from set
```


- Hash Table: hash allow two layer of key-value
```bash
HSET person name kyle       # set a key-value
HSET person age 25          # set anther key-value    
HGETALL person              # get all key-value
HDEL person age             # delete an attribute
HEXIST person age           # check exist an attribute

```
## query syntax TODO!


# nodejs example [link](https://youtu.be/jgpVdJB2sKQ?t=805)
```bash
npm -i redis
```


```js
const Redis = require('redis')
const redisClient =  Redis.createClient()
```

- every command is translated to **redisClient.method('parameter1', 'parameter2', ...)**
- some method allow callback to the result
```js
const DEFAULT_EXPIRATION = 3000
app.get("/photo", async (req, res) => {
  const ablumID = req.query.albumID
  redisClient.get("photos", async (error, photos)=> {
    if (error) console.log(error)
    if (photo != null) {
      return res.json(JSON.parse(photo))
    } else {
      const {data} = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        {params: {albmuID}}
      )
      redisClient.setex("photo", DEFAULT_EXPIRATION, JSON.stringify(data))
      res.json(data)
    }
  })
})
```