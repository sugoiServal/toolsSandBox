# EBS
- `use in AZ level` `Attach/detach` to EC2 instance. Use `snapshot to migrate across AZ/region`. 
- performance specification
    - `IOPS`: #I/O operations per second (IOPS)
    - `throughput`: eg 125 MiB/s
    - `size`
- `root EBS`
    - attach to any new EC2 instance by default
    - deleted after EC2 instance terminated (can be disable)
## EBS volumn types
- Only `gp/io` can be used as `boot volumes`
### gp2 / gp3 (SSD): General purpose SSD
- `mostly used General purpose`, up to 16 TiB
- `gp2`:
    - `Size and IOPS are linked`
    - samll gp2 burst 3,000 GB , max 16,000
- `gp3`: 
    - `independently Size and IOPS`
    - Baseline of 3,000 IOPS, max 16,000
- `remember: 3000/ 16000` 
### io1 / io2 (SSD): Highest-performance SSD 
- `Critical applications` that need `more than 16,000`
- `io1 / io2`: up to 16 TiB
    - `independently Size and IOPS`
    - 32,000 IOPS, 64,000 for Nitro EC2 instances
- `io2 Block Express`: up to 64 TiB
    - Max IOPS: 256,000
    - `Supports EBS Multi-attach`
        - Up to `16 EC2 Instances at a time`
        - Each instance has full read & write permissions
        - Must use a file system that’s cluster-aware (manage concurrent write)
- `remember 32,000, 256,000`

### st1 / sc1: low cost HDD
- Throughput Optimized HDD (st1) 
    - Max throughput 500 MiB/s – max IOPS 500
- Cold HDD (sc1):
    - For `infrequently accessed` data, `lowest cost` 
    - Max throughput 250 MiB/s – max IOPS 250

## EBS Snapshots
- Use `snapshot to migrate EBS across AZ/region`. 
    - snapshot use IO, but don't need to stop EBS, careful your EBS volumn load
- utilities
    - `EBS Snapshot Archive`
        - Move a Snapshot to an ”archive tier” that is 75% cheaper, take time to restore
    - `Recycle Bin for EBS Snapshots`
        - deleted snapshots are retained for a time (optional)
    - `Fast Snapshot Restore (FSR)`
        - Force full initialization of snapshot to have no latency on the first use ($$$)

# EFS
- features
    - `regional` service (multi-AZ by default)
    - `Highly availablility`, works with EC2 instances in multi-AZ
    - pay per use, `auto scale`
    - `Only compatible with Linux` based AMI

## options (set at EFS creation time)
### Performance Mode
- General Purpose (default): low latency
- Max I/O: `highly parallel (big data`, media processing

### Throughput Mode
- Bursting: `Throughput linked to size` 
- Provisioned: `throughput not related to size`, `provision a throughput`
- Elastic: `auto scale throughput `

### Storage Tiers
- Standard: for frequently accessed files 
- Infrequent access (EFS-IA): lower price to store + retrieve fee, 
    - use with `Lifecycle` Policy to `move file to IA`

### Availability and durability
- Standard (default): `Multi-AZ`, great for `prod` availability
- One Zone: `One AZ`, great for `dev`, 
    - one zone + IA (EFS One Zone-IA) given over 90% saving

# FSx:
- Launch `3rd party` `file systems` on AWS
    - FSx for `Windows File Server`
    - FSx for `Lustre`
    - FSx for NetApp `ONTAP`
    - FSx for OpenZFS
- FSx `Deployment options`
    - `Scratch` File System:
        - one copy of data
        - Usage: `Temporary` storage, short-term processing, low-cost
    - `Persistent` File System
        - `data replicated within same AZ`, file failover
        - Usage: `Long-term` storage, long-term processing
- FSx `Windows File Server`
    - usage: `SMB/ Windows NTFS` File System, Active Directory, ACL
    - misc:
        - `can` be mounted on `Linux EC2 instances`
        - Supports `Microsoft's Distributed File System (DFS) Namespaces` (group files across multiple FS)
        - Storage Options: `SSD/HDD`
        - VPN /Direct Connect from on-premises
        - support Multi-AZ(high availability)
        - backed-up to S3

- FSx Lustre
    - Lustre == `Linux+Cluster`
    - usage: `parallel distributed file system(large-scale computing)`, High Performance Computing (`HPC`) ...
    - misc:
        - Storage Options: `SSD/HDD`
        - VPN /Direct Connect from on-premises
        - `integration to S3: `
            - read S3 as a FSx file system 
            - write to S3
- FSx NetApp ONTAP
    - usage: 
        - `Highly compatible` FS (`most platform/protocol`), 
        - Move workloads running on `ONTAP or NAS` to AWS
    - misc
        - Point-in-time `instantaneous cloning`, (helpful for `quick staging and testing`)

- FSx OpenZFS
    - usage: `OpenZFS file system`,  Move workloads running on ZFS to AWS
    - misc
        - only compatiable with NFS
        - Point-in-time `instantaneous cloning`, (helpful for `quick staging and testing`)


# S3
### misc
- After a successful write of a new object or an overwrite of an existing object, any subsequent read request immediately receives the latest version of the object.
- The minimum storage duration is 30 days before you can transition
objects from S3 Standard to S3 One Zone-IA. 
------
- `Buckets` 
    - must have a `globally unique name` (across all regions all accounts)
    - defined at the `region level`
    - naming:
        - NOT start with the prefix `xn--`
        - NOT end with the suffix `-s3alias`
    - `flat` architecture(key-value pair), no directory
- Objects
    - key: refix + object name
    - Metadata, Tags, Versioning ID
    - Max. Object `Size is 5TB`, must use `Multi-Part Upload for file > 5GB`

    
### S3 – `Access Points`
- Access Points = access endpoint + access policy
    - eg: and `access endpoint` own by `Finance team`, grant access to `/finance prefix` with `R/W Privilege`

- use `Access Points` within `VPC`
    - EC2 in VPC -> `VPC Endpoint`(Gateway/Interface) -> `S3 Access Points` -> S3 Bucket
    - The `VPC Endpoint Policy` must allow access to the target bucket and Access Point
![](https://imgur.com/aiB4GV8.jpg)

- use `Lambda function` to change the object
    - object in bucket -> S3 Access Point -> Lambda Function -> S3 Object Lambda Access Points -> client
    - usage (eg):
        - `Converting data formats`
        - `Resizing/watermarking images on the fly` 
        - `(remove) personally identifiable information` for analytics

![](https://imgur.com/Bu4Qh5h.jpg)


## Storage
### S3 Replication
- make another copy of objects elsewhere (ASYNC replication)
    - options
        - `Cross-Region Replication (CRR)`：compliance, lower latency access
        - `Same-Region Replication (SRR)`： production and test purpose...
        - `Cross Account Replication`
- misc:
    - `Must enable Versioning` in src/destination
    - Must give proper IAM permissions to S3
    - possible to replicate `delete markers` from source to target.
    - There is `no “chaining” of replication`
- `S3 Replication` vs `S3 Batch Replication`
    - `S3 Replication`: `only new objects` are replicated
    - `S3 Batch Replication`: can used to `replicates existing objects` and objects that failed replication
    
### Versioning(`bucket level`)
- usage: able to `rollback to previous version`, prevent `unintended deletion/overwrite`
- misc (略)
    - after opt-in versioning, objects will be `version Null`
    - with versioning, deletion in fact add `delete marker `to objects and hide them 
    - Suspending versioning does not delete the previous versions

### S3 Storage Classes
- for `infrequently accessed object`, move them to `Standard IA`. For `archive` objects move them to `Glacier or Glacier Deep Archive`
- for more than 12 h retrieval, use Glacier Deep Archive, else Glacier Flexible/Instant
- options list
    - S3 Standard - General Purpose
    - S3 Intelligent Tiering, no retrival fee!!
    - S3 Standard-IA : backup
    - S3 One Zone-IA: Secondary backup (`no availability`)
    - S3 Glacier Instant Retrieval
    - S3 Glacier Flexible Retrieval:        
        - Expedited (1 to 5 minutes), Standard (3 to 5 hours), Bulk (5 to 12 hours)
    - S3 Glacier Deep Archive
        - Standard (`12 hours`), Bulk (48 hours)

### S3 Lifecycle Rules(`bucket level`)
- target: `prefix`(eg: s3://mybucket/mp3/*) or `tags`
- actions
    - `Transition Actions`:
        - move objects to another storage class after some time(eg: after 6 months move to Glacier)
    - `Expiration actions`:
        - `delete object/incomplete parts` or `old versions` after some time
- `S3 Analytics – Storage Class Analysis`
    - analysis and give storage `class transition recommendations` for `Standard and Standard IA`




## CURD
- S3 baseline performance
    - at least `3,500 PUT/COPY/POST/DELETE` or `5,500 GET/HEAD requests` per `second/prefix` in a bucket.

### performance optimization
- `S3 Transfer Acceleration`:   
    - transferring files through an `AWS edge location`, upload to CloudFront

- `Multi-Part upload `=> parallelize upload (recommend for file > x00 MB)

### S3 Byte-Range Fetches 
- Parallelize GETs/retrieve only partial data 
    - by `requesting specific byte ranges` 
    - eg. GET first 10 bytes of each file

### S3 Event Notifications
- S3 Event: `CURD of object` (eg, upload, deletion) 
- Event destinations: `EventBridge, SNS, SQS, Lambda`  
    - events sent to `EventBridge` can be forward to more destinations
- can create `infinite S3 events` as desire


### S3 Select & Glacier Select
- using `simple SQL statements` to `filter files in server` before transfering 
    - fetch less data, Less network transfer
    - especially `CSV files`

### S3 Batch Operations
- Perform `Batch/bulk operations` on S3 objects with a single request
    - `Encrypt un-encrypted object` 
    - Invoke `Lambda function` 
    - Modify object configs: metadata & properties, ACL, tags...
    - `S3 Batch replication `: Copy objects between buckets

- A job = `list of objects`,  `action`,  `optional parameters`
    - use `S3 Inventory` to `get object list`  
    - use `S3 Select` to `filter` objects before Batch Operations


### Misc
- `S3 Requester Pays` (`bucket level`)
    - requester pay for the cost of `data transfer out`. The requester `must be authenticated in a AWS`
- S3 Pre-Signed URLs
    - pre-signed URL give `client with the url` `operation permissions (eg. download/view)`, think Google docs share
    - generate pre-signed URLs in `S3 Console, AWS CLI or SDK`
    - URL Expiration (TTL): 
        - S3 Console: 1 min to 12 h
        - AWS CLI or SDK: up to 168 h
    - usage example: 
        -  allow user to temporarily upload/download a file


- S3 CORS (Cross-Origin Resource Sharing)
    - origin(host+port): 
        - eg, https://www.example.com:443
        - object in `differnt S3 bucket` are considered `cross origin`
    - CORS:
        - a service provider (ie. an API) must allow a list of origin to request resource, using `CORS Headers`
            - `CORS Headers` example: 
                - scenerio: http://www.example.com want to request resource from http://apis.example.com
                - APIs: http://apis.example.com
                - CORS: `Access-Control-Allow-Origin: http://www.example.com` 
    - S3 CORS issue:
        - if client cannot request S3 resource, it may be CORS issue, we need to `enable the client Origin in S3 bucket's CORS headers`
        - can allow for a specific origin or for `* (all origins)`


# DBs ------------------------------------------------

# RDS
- support 
    - `RDS` support: Postgres, MySQL, MariaDB, Oracle, MS SQL Server
    - `Aurora` support: Postgres, MySQL

- run in `EC2`, storage is backed by `EBS(gp2 or io1)`

### `SSH` into RDS instance
- generally `cannot SSH` into the RDS instance
- `RDS custom` allow access to OS through `SSH or SSM Session Manager `

### RDS custom
- target: `Oracle and Microsoft SQL Server`
- goal: access OS to do OS level database customization
    - allow `SSH or SSM Session Manager` into RDS instance
- misc:
    - need to `De-activate Automation Mode` before making customization
    - better take snapshot before access OS
    - use RDS custom, the RDS service will not be managed by AWS

### RDS Proxy
- `serverless` `database proxy`
    - `pool many clients` as `single client` to RDS/Aurora (clients -> single proxy -> RDS)
    - use case:
        - `reduce RDS open connections`
        - `reducing the stress` on database resources
        -  `Reduced failover time` in failover event
    - misc:
        - RDS Proxy must be accessed from VPC

- Can be use to `Enforce IAM Authentication for DB`: `RDS proxy + Secretes Manager`


### `Storage Auto Scaling` (optional)
- by default you manually managed the RDS scaling
- opt-in Storage Auto Scaling
    - set a `Maximum Storage Threshold` (cannot scale more than the value)
    - RDS detects running out of database storage => scale out
- usage: applications with `unpredictable workloads`

### High availability
- `Read Replicas`
    - `ASYNC` replication: data only guarantee to be `eventually consistent`
    - up to `5 Read replicas` per RDS `instance`
    - deployment:
        - single AZ, `multi-AZ`, `multi-region`
    - misc:
        - `Read Replica` may be `promoted to an independent RDS instance`
        - `Applications` must update the `connection string` to `Read Replicas`
        - only `pay for data out of Region`: `multi-region deployment`
    - usage: 
        - read performance(scaling)
        - disaster recovery (high availability)
        - run non-prod workload
- `multi-AZ RDS`
    - `standby` instance/ `master` instance model
    - `SYNC` replication: `immediately data sync`
    - misc:
        - get `a DNS each DB`, Automatically `failover DNS to standby`
        - `no downtime` during setting up multi-AZ RDS
            - created master instance snapshot
            - restore standby instance from snapshot
            - estabilish SYNC between master and standby
    - usage: high availability only, `not used for scaling!!`


## RDS/Aurora backup/migration
### RDS/Aurora Snapshot/Restore
- take `RDS/Aurora Snapshot` anytime 
    - use Snapshot for `migration within AWS` (account/region/az)
    - use Snapshot for `backup` (`unlimited retention` period)

### RDS/Aurora Automated backups
- `automatical backup transaction log`
    - every x mintue backup + `rollback` to any retention time point
    - set a `retention period`

### Aurora Database Cloning
- Create a new `Aurora Cluster` from an existing one, 
    - `faster` than `snapshot + restore`
    - `no performance impact` to the original Aurora cluster
- `use case`: create a `“staging” database` from a `“production” database` without impacting the production database



## Aurora
- features:
    - deployment: `multi-AZ` by default
        - `1 writing master + 5 standby` over 3 AZ (`30s automatically failover`)
        - up to 15 `read replicas` (ASG+ALB read replicas)
        - Aurora expose to user `Aurora Endpoints`
            - `Writer Endpoint`: a `DNS` to current `writing master`
            - `Reader Endpoint`: a `DNS` to `ALB of read replicas`
            - `Custom Endpoint`: user defined `Custom Endpoint` for differnt `subsets of read replicas` (eg. for a DA team)
    - misc
        - optimized performance: 5x mySQL, 3x Postgres
        - self-healing(automatically failover)
        - Auto Expanding 10GB-128TB
         
### Aurora Multi-Master (instant failover)
- use `Multi-Master(writer)` for `instant failover (0s)`
    - use multiple writer masters

### Aurora Global Database
- `multi-region` disaster recovery `(high availability)`
    - `replication in 1 second` 
    - 1 Primary Region(r/w) + Up to 5 secondary (read-only) regions, 16 Read Replicas per secondary regions

### Serverless Aurora
- make Aurora Serverless
    - `pay by second`, auto storage scaling
    - Good for `intermittent or unpredictable workloads `
    - under the hood: AWS use `proxy fleet`

### Aurora Machine Learning 
- integarte ML services into Aurora (SageMaker, Comprehend), Aurora as `SQL Interface and proxy`
    - user query prediction/recommendation/classification(SQL)
    - Aurora send data to ML mechanism
    - result return to Aurora -> forward to user
![](https://imgur.com/Jys2Da7.jpg)


# ElastiCache
- managed `Redis` or `Memcached`
    - high performance, low-latency
    - `reduce load` off of databases
    - require heavy `application code change`
- Redis vs Memcached
    - redis: generally cache usage
    - Memcached: `Multi-threaded architecture`, `no high availability`, `No backup and restore`

|Redis|Memcached|
|-|-|
|Multi AZ, Auto-Failover|`Multi-node` for data sharding|
|Read Replicas, high availability|`no replication`, `no high availability` |
|Data Durability using AOF persistence|`Non persistent`|
|Backup and restore features|`No backup and restore`|
|keyword: Sets and Sorted Sets|keyword: `Multi-threaded architecture`|


- use case
    - `DB Cacheing`: relieve load in RDS
        - need to make sure `serving the latest data(use TTLs)`
    - `User Session Store`
        - application writes the session data into ElastiCache at first connect
        - application query User Session Store in later request
    - Createing `real-time Gaming Leaderboards` with `Redis' Sorted sets`
        - `Redis' Sorted sets` guarantee both `uniqueness` and `element ordering`
        - new element will be ranked and placed in order

### Data Loading (Caching) Pattern (Options)
 - `Lazy Loading`: all the read data that not in the cache is cached, data can become stale in cache (use TTLs)
- `Write Through`: Adds or update data in the cache when written to a DB (no stale data)
- `Session Store`: store temporary session data in a cache (expire using TTL )


# DocumentDB
- AWS-implementation of mangoDB
    - store, query, and index JSON data
    - `high availability` “deployment concepts” as Aurora  (3 AZ, Auto Scales)

# Neptune
- Fully managed `graph database` 
    - usage: social network, knowledge graphs, fraud detection, recommendation
        - optimized for complex queries
    - `highly availability` multi-AZ    

# QLDB (Quantum Ledger Database) (Serverless)
- centralized ledger database(blockchain)
    - `Immutable` system, Used to review `history of all the changes` made to your application data over time
    - High available (3 AZ)


# Amazon Managed Blockchain
- decentralized blockchain
      

# `Keyspaces` (for Apache Cassandra) (serverless)
- `Apache Cassandra` is an open-source `NoSQL distributed database`
    - A managed `Apache Cassandra `(Cassandra Query Language (`CQL`))
    - Use cases: store `IoT devices info`, `time-series` data, …
    - misc.
        - On-demand mode/ provisioned mode
        - Serverless, highly available
# Timestream (serverless)
-  `time series database`
    - Built-in time series analytics functions 
    - Use cases: IoT apps, operational applications, real-time analytics
    - misc
        - Encryption in transit and at rest

###  DynamoDB (serverless)
- AWS technology, `serverless NoSQL database`, millisecond latency,
    - Use Case: Serverless applications development, document database, distributed serverless cache(DAX), global Table
