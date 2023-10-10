# Communication
- `Asynchronous` / `Event based` communications decouple applications
        - SQS: queue model
        - SNS: pub/sub model
        - Kinesis: real-time streaming model

## SQS queue
- `Producers` send=> SQS Queue =>  `Consumers Poll` 

- Standard vs FIFO
    - SQS Standard
        - not guarantee order (May have duplicate messages)
        - misc
            - `unlimited number of messages` in queue
            - `automatically scale capacity` to demand
            - retention of messages: 4 days default to more
    - SQS FIFO 
        - `(order is guaranteed)`, each message deliverd `Exactly-once`
        - misc
            - `Limited throughput`: 300 msg/s without batching, 3000 msg/s with batching


- Producing & Consuming pipeline
    - `upstream application(producer)` produced messages(up to 256 kb) to SQS using the `SDK (SendMessage API)`
    - messages are `persisted in SQS` untill deleted by consumer. (retention up to 14 days)
    - `downstream application(Consumers)` Poll messages (up to `10 messages at a time`), then Process the messages. 

    - Consumers Delete the messages using the `DeleteMessage API`


- `Message Visibility Timeout`
    - After a message is polled by a consumer(being processed), it becomes `invisible to other consumers`. By default it is `30 seconds`
    - In Standard SQS, A message `may be deliveried multiple time` if process time is longer than Message Visibility Timeout
    - possible to `change Message Visibility Timeout`
        - call `ChangeMessageVisibility API`
        - `high Timeout` (hours): if consumer crashes after a poll, the message need more time to wait for another poll
        - `low Timeout(seconds)`: may get many duplicates 
- Long Polling
    - When consumer poll from an `empty queue`, `Long Polling` allow consumer `“wait” for messages to arrive without make another poll request` 
        - long poll is preferrey (1s-20s)
            - `decreases the number of API` calls made to SQS, 
            - `reducing latency` of your application
        - enable with API `WaitTimeSeconds`
## SNS notification
- vanilla SNS
    - `publisher -> topic -> topic subscribers receive notification`
        - `event producer` create `topic`
        - `event receivers` subscribe to topic
        - receivers `receive notifications` when `event producer` send message to topic
- SNS FIFO
    - Guarantee `Order` by `Message Group ID`
    - Deduplication using a `Deduplication ID` or Content Based Deduplication
    - misc
        - only available subscribers: `SQS FIFO queues`, `Limited throughput` because of SQS FIFO throughput limit
            - `SNS FIFO + SQS FIFO fan out pattern`

![](https://imgur.com/naUT7Ml.jpg)

- Direct Publish
    - another type of publish for` mobile apps SDK`
        - Create a platform application 
        - Create a platform endpoint 
        - Publish to the platform endpoint 
    - Works with Google GCM, Apple APNS, Amazon ADM…

## Kinesis
- `streaming data` from source to destination(analysis/storage...)
    - data source: Application logs, Metrics, Video, Website clickstreams, IoT...
    - data destination: AWS services, HTTP Endpoint...
    - services: 
        - Kinesis `Data Streams`: stream data (mostly for analysis, eg. `Kinesis Data Streams + Kinesis Data Analytics`)
        - Kinesis `Data Analytics`: real-time data analyze (SQL or Apache Flink)
        - Kinesis `Data Firehose`: `managed(no code)`, `better integration to AWS` (eg, to S3, Redshift/Athena/OpenSearch)
        - Kinesis `Video Streams`: for video streams

- Kinesis `Data Streams` vs Kinesis `Data Firehose`

|difference|Data Streams| Data Firehose|
|-|-|-|
|usage|Streaming data at scale|Load streaming data into storages/HTTP: S3 / Redshift / OpenSearch / 3rd party|
|Managed|User `write custom code` (producer /consumer)|Fully managed|
|real-time|`Real-time (~200 ms)`|`not real-time` (60 sec minimal delay)|
|scaling|Manage scaling/Auto Scaling|Auto Scaling|
|Data storage|Data `storage for 1 to 365 days`|`No data storage`|
|replay stream|`support replay`|`not support replay(no storage)`|


- Kinesis Data Streams
    - Shard, Partition
        - provision `shards`, data stream through shards, more shards more stream capability (provision(pay per shard)/ on-demand)
        - `Partition Key`: Data with `same partition` always goes to the `same shard` (ordering)
    - misc:
        - `retention`: up to `1 year`, able to `replay`. 
        -  shard capacity: `Each shard gets 1MB/s, or 1000 records/s IN, 2MB/s OUT`
        - real-time (~200 ms)
![](https://imgur.com/RVifRNp.jpg)

- Kinesis Firehose (serverless)
    - vs Data Streams
        - serverless, managed, no code
        - pay on-demand, no provision
        - many data formats, conversions, transformations, compression ooptions
        - not real-time
        - no retention/replay
    - `data transformations` using AWS `Lambda`

## Amazon MQ
- Third-party message broker service(SNS/SQS alternative): `RabbitMQ, ACTIVEMQ`
    - `doesn’t “scale” as much` as SQS / SNS
    - runs `on servers(instance)`, can config `Multi-AZ / failover`

## Messaging architecture patterns
### SQS with ASG + CloudWatch Alarm pattern
- ASG scale Comsumer instances based on SQS Queue Length: 
    - `CloudWatch monitor` metric `ApproximateNumberOfMessages` increase/decrease
    - `CloudWatch Alarm` triggered
    - ASG Consumer adjust instance number

![](https://imgur.com/TT1mgfh.jpg)

### Pattern: SQS as a buffer to database writes`
- EC2 receive `request and directly write to a database`, if request spike in request and EC2 instance has limited write capability, `transaction data may be lost`
![](https://imgur.com/L2xvod5.jpg)
- SQS as transaction write buffer solved the issue
    - `In the pattern, client cannot receive confirmation that data have been saved to database `
![](https://imgur.com/PYQKOIz.jpg)


### SNS + SQS: Fan Out Patterns
- `single source, multiple SQS (fan out) for different downstream application`
    - Why SQS in the pattern: data persistence, delayed processing and retries of work
    - expandability: add SQS subscribers over time
    - `SQS Access Policies must allows SNS write`
    - `Cross-Region Delivery`: works with `SQS Queues in other regions`


![](https://imgur.com/dXa4xgN.jpg)

- SNS + SQS: Fan Out Application 1: `S3 Events to multiple destinations`
![](https://imgur.com/KrkYMxN.jpg)


- SNS + SQS: Fan Out Application 2: `SNS Message Filtering to filter messages for different Applications`
    - `SNS Message Filtering`: JSON rules to filter incoming messages, and send to different subscribers
![](https://imgur.com/qV5oJ9p.jpg)


### SNS + Kinesis Data Firehose pattern
![](https://imgur.com/Z0QuFxG.jpg)


### Solution: Ordering data
- Ordering data: Kinesis
    - with `partition key`, Kinesis guarantee data `in order within shard` (`data always goes to one shard, and it goes in the shard in time order`)
- Ordering data: SQS FIFO
    - SQS don't guarantee order
    - with only `one consumer`, `SQS FIFO guarantee order`, but not when there are multiple consumers
    - SQS FIFO `guarantee order` with multiple consumers when `Group ID` (similar to Partition Key in Kinesis) is used 
        - `Group ID` “groupes” related message, consumer can poll from only one Group ID, thus data will be in-order 
![](https://imgur.com/naMUu5j.jpg)
- Kinesis vs SQS FIFO ordering
![](https://imgur.com/VN85CLL.jpg)
