# EC2
### spot instance
- Define max spot price and get the instance while current spot price < max 
    - If the current spot price > your max price you can choose to `stop` or `terminate` within 2 mins
        - stop: you keep the state so it might resume

- one-time request: 
    - once reclaimed, the instance must be terminated
- persistent request:
    - data range to persist
    - once reclaimed, instance can be `stop`/`hibernated`, if price goes down it will try launch again

- How to terminate Spot Instances
    - Cancelling a Spot Request does not terminate instances automatically, (if instances are terminated first, new spot instances will be created to accomodate the request )
        - You must `first cancel a Spot Request`, 
        - then `terminate the associated Spot Instances`
### Spot Fleets
- 自动用Spot Instances + (optional) On-Demand Instances 来满足你的需求
    - Define (multiple) launch pools: instance type (m5.large), OS, AZ
    - Spot Fleets automatically request Spot Instances in pools to meet capacity/max cost, 只要满足了就停止launch instance
- `smart Spot instance: 我想要这么多的capacity在这个AZ，你自动帮我找到最便宜的选择`
- options
    - lowestPrice: from the pool with the `lowest price` (cost optimization, short workload)
    - diversified: `distributed across all pools` (great for availability, long workloads)
    - capacityOptimized: pool with `the optimal capacity` for the `number of instances`


### Elastic IP
- rare used
- if you dont attach Elastic IP to an active Instance, you will be charge a fee
- can only have 5 Elastic IP in your account (may ask AWS to increase that)
- `try to avoid using Elastic IP`:
    -  often reflect poor architectural decisions
    - alternative: 
        - Route 53 DNS record automatically update to IP change  
            - "DNS Failover Policy" + health check
        - load balancer: use load balancer's domain name

### Placement Group
- control over the EC2 Instance `placement strategy`
    - Cluster—clusters instances into a low-latency group (a physical rack in an AZ)
        - `low-latency, vulnerable to hardware fail`
        - eg: Big Data compute(Hadoop), low-latency task
    - Spread — spreads instances across underlying AZ/Hardware 
        - limit: 7 instances per AZ per placement group
        - `availability`, failure proof: span across Availability Zones (AZ), different hardware
        - `critical tasks`
    - Partition — spreads instances across many different partitions (a physical rack in an AZ).
        - within partition(high performance, 一起死), between partition (failure proof)
        - can have up to 100s EC2 in the setup
        - `balance performance & safty`
        - Use cases: (big data) HDFS, HBase, Cassandra
Kafka

![](https://imgur.com/HsIPR4R.jpg)
![](https://imgur.com/ipELIRp.jpg)
![](https://imgur.com/UmnUFbl.jpg)

### ENI - Elastic Network Interfaces
- `virtual network card` in a `VPC`
- attach an ENI to an EC2 instance to give it Internet attributes
    - a Primary private IPv4 (may + multiple secondary private IPv4)
    - One Elastic public IP per private IPv4
    - One temp Public IP per instance
    - a MAC address
    - belonging security groups
- creating EC2 instance 
    - auto create an ENI for it,
    - will be deleted after terminate the instance
- one EC2 instance can have multiple ENI 
- one ENI can be attach to any EC2 instance
    - attributes will be transfered(eg, private IP), good for `failover`
- Bound to an AZ
### Hibernate EC2
- stop vs terminate
    - Stop – data on disk (root EBS/set-to-destroy EBS) is kept till next start
    - Terminate – data on disk (root EBS/set-to-destroy EBS) is lost
    - in any case (stop/hibernate/terminate), instance store volumn will be lost
- `Hibernate` make `booting from stop state` much faster than vanilla stop(think Windows' sleep)
    - The RAM state is written(encrypted) into `a file in root EBS`
    - when restart, RAM state is restored, make faster bootup

- Use cases:
    - Services that take time to initialize
    - Saving the RAM state
    - Long-running processing
- misc: 
    - Hibernate RAM Size < 150 GB
    - Hibernate keep < 60 days
    - must be Root EBS, must be encrypted, must be large enough(root EBS >= vRAM )
    - Available for On-Demand, Reserved and Spot Instances


# EBS
- AZ level service
- storages are priced by
    - IOPS: I/O operations per second (IOPS)
    - throughput: eg 125 MiB/s
    - size
- PIOPS: Provisioned IOPS (PIOPS) - For EBS volumes, you can specify a consistent IOPS rate when you create the volume.
- only SSD (gp,io) can be used as `boot volumes`
## EBS volumn types
- gp2 / gp3 (SSD): General purpose SSD
    - `general purpose, mostly used`
    - 1 GB - 16 TB
    - `gp2`, older, 
        - IOPS < 16000, 
        - `size are linked to IOPS`(3 IOPS/GB)
    - gp3, 
        - 3000-16000 IOPS, 
        - 125-1000MBps throughput, 
        - `IOPS and throughput/size are independent`
- io1 / io2 (Provisioned IPOS SSD): Highest-performance SSD volume
    - for `Critical` business applications that need` more than 16,000 IOPS`
    - `storage perf` and `consistency`
    - Great for `databases` workloads 
    - io1/io2 (4 GiB - 16 TiB): : 
        - 64,000 IOPS for Nitro EC2 instances & 32,000 IOPS for other
        - PIOPS independently from storage size
    - io2 Block Express (4 GiB – 64 TiB):
        - Max PIOPS: `256,000` with an IOPS:GiB ratio of 1,000:1
    - Supports EBS `Multi-attach`: attach a EBS to `multiple EC2 instance in an AZ` (all able to write/read)
        - Up to `16 EC2 Instances` at a time
        - for `concurrent scenerio`/ `higher application availability`
    - `256,000` is as far as you can go with EBS, `think instance store for larger number`
- st1, sc1: (HDD)
    - 125 GiB to 16 TiB
    - Throughput Optimized HDD (st1):
        - Max throughput 500 MiB/s – max IOPS 500
        - `Big Data, Data Warehouses, Log`
    - Cold HDD (sc1):
        - Max throughput 250 MiB/s – max IOPS 250
        - cheapest, For data that is `infrequently accessed`
### EBS snapshot
- snapshot use IO and you shouldn’t run them while your application is handling a lot
of traffic
- To migrate an EBS volume across AZ
    - Take a snapshot 
    - Restore the snapshot to another AZ
## opt-in EBS Encryption
- what are encrypted:
    - `Data at rest` is encrypted 
    -  data in flight `between the instance and the volume is encrypted`
- encrypted `snapshot`:
    - All `snapshots` of `an encrypted EBS` are encrypted
    - All `snapshots` of `an unencrypted EBS` are not encrypted
    - `copying a snapshot` have the chance to make it encrypted 
    - `all EBS volumn created from an encrypted snapshot will be encrypted`
- benefit of encryption:
    - Encryption and decryption are `handled without user notice (KMS keys)`
    - Encryption has a `minimal impact on latency`, so it is good to use
- How to Encrypt and unencrypted volumn:
    - create a snapshot
    - encrypt the snapshot by make a copy
    - create a rcopy of the volumn from the snapshot

# EFS
- a `regional` service (multi-AZ)
- pay per use/`auto scale`, no need to provision capacity
- Only `compatible with Linux` based AMI (POSIX file system)

## options 
### Performance Mode
- General Purpose (default) – low latency, 
    - server, content management
- Max I/O – higher latency, higher throughput, highly parallel
    - big data application
### Throughput Mode
- Bursting: Throughput linked to scaled size
- Provisioned: decorrelated throughput and size, `provision a throughput` and auto scale size.
- Elastic: automatically scales throughput. Used for `unpredictable workloads`
### Storage Tiers
- Standard: for frequently accessed files 
- Infrequent access (EFS-IA): lower price to store + retrieve fee, 
    - use with `Lifecycle` Policy to `move file to IA`
### Availability and durability
- Regional(Standard), default: Multi-AZ, great for `prod` availability
- One Zone: One AZ, great for `dev`, 
    - backup enabled by default, 
    - one zone + IA (EFS One Zone-IA) given over 90% saving

# Elastic Load Balancer 
- regional service (multi-AZ)
- Load Balancer's job
    - Spread load in downstream servers
    - expose `single DNS access point` to an application
    - Provide SSL termination (HTTPS)
    - handle downstream instances' failure Seamlessly (`health check + pass health status to ASG + ASG replace instance`)
    - `Enforce stickiness with cookies`
- `Managed` Load Balancer:
    - AWS responsible for `upgrades maintenance, high availability`
- `ALB has free-tier!!!`
### ELB options
- Application Load Balancer - ALB
    - layer 7 - HTTP, HTTPS, WebSocket
- Network Load Balancer - NLB
    - layer 4 - TCP, TLS (secure TCP), UDP
- Gateway Load Balancer (GWLB)
    -  layer 3 (Network layer) – IP Protoco
    - analysis traffic, improve security, compliance...

## ALB - Application Load Balancer
- `Listener`: upstream routes rules - route `different types of incoming request` to different `Target Groups`
    - hostname (one.example.com, other.example.com) 
    - url path (/users, /post)
    - query strings('?id=123')
    - HTTP headers, source IP address

![](https://imgur.com/VR5UVBu.jpg)
- protocol features:
    - redirects (`HTTP to/from HTTPs`): force users to access the website using HTTPS instead of HTTP
    - `HTTP to/from WebSocket`

- usage: best fit for
    - `microservices!!!!`
    - container-based application
- ALB `Target Group`
    - EC2 instances ( + ASG)
    - ECS tasks (managed by ECS)
    - Lambda functions – (serverless, HTTP request is translated to Json event)
    - private IPs (eg, on-premise servers)

## NLB - Network Load Balancer
- Network Load Balancer: high performance layer 4
    - layer 4: `TCP & UDP` traffic to your instance
    - `high performance/low-latency`: millions of request, 100ms vs 400ms latency of ALB

![](https://imgur.com/GnLL6KU.jpg)
- NLB has one `static IP per AZ`, and `supports Elastic IP`
    - use case: if you want to `expose your application through few static IP`(instead of Domain Name)
- no free-tier

- NLB `Target Group`
    - EC2 instances 
    - private IPs (eg, on-premise servers)
    - `ALB` instance (front of ALB, eg expose IP instead of Domain Name)

- NLB's health check (communicate to downstream instance) still support `HTTP/HTTPs`. Also `TCP` .
## GWLB - Gateway Load Balancer
- ensure all traffics to go through `a group of instances (eg. for traffic inspecting/intrusion detecting, using 3rd party application)`, before going to ALB/NLB/downstream application, etc
    - the instance essentially `serves as a gateway` to the application

- features:
    - Operates at Layer 3 (Network Layer, IP packet)
    - Load Balancer traffic to your group of virtual appliances (eg. intrusion detecting)
    - `GWLB and virtual appliances` essentially `filtered` the traffic, thr result is transparent for downstream app 
- Uses the `GENEVE protocol on port 6081`

- GWLB `Target Group`
    - EC2 instances
    - private IPs (eg, on-premise servers)
![](https://imgur.com/c59Smyx.jpg)

## SSL/TLS certificates
- `in-flight data encryption` (only end to end(sender/recever) will be able to access)
    - traffic encrypted will be in `HTTPs`
    - SSL refers to Secure Sockets Layer
    - TLS refers to Transport Layer Security, newer version of SSL 
    - Nowadays, `TLS certificates are mainly used`, but people `still refer it as SSL`
- `Public SSL certificates`
    - SSL certificates issued by Certificate Authorities (CA)
    - have an expiration date and must be renewed
### ELB + SSL certficates
- load balancer uses an X.509 certificate (SSL/TLS server certificate). Alternatively user can create/ upload your own certificates
- in AWS user manage certificates using `ACM (AWS Certificate Manager)`
- SSL certficates are load in `Listener` config:
    - specify `a default cert`/ `a list of cert` for multiple domains
    - Clients can use `SNI (Server Name Indication)` to specify the hostname they reach
    - specify rules to forward to different target group 
### `Server Name Indication (SNI)`  -TODO review
- Supported service in AWS:
    - `ALB, NLB`, CloudFront

- solves the problem of `allows multiple SSL/TLS certificates to be served on the same IP address(same server)` 
    - eg. serve multiple websites (ie. downstream instances) in one load balancing instance(single public IP/domain name)
- In the past, only one SSL/TLS certificate could be assigned to a IP address, if a server hosted multiple websites, it would require a separate IP address for each website.
- How: allowing the `client` to include the `hostname` it is trying to connect to in the `initial TLS handshake message` => `server` identify the specific `certificate` through the `hostname field`


![](https://imgur.com/DyCViwP.jpg)

## Misc
- Client IP is inserted in a header `X-Forwarded-For` in the HTTP traffic between ELB and downstream instance
- only NLB can have a `static IP`, ALB got a `static DNS name`


### Target Group - `Sticky Sessions`(session Affinity)
- an implementation that enable clients to be `always direct to same instance for a duration`. make possible by using `cookie` with a TTL  
    - eg. user have a session running in an instance/ user don't need to login each time they refresh 
    - Sticky Sessions may lose the `balancing` quality of a ELB. Alternatively use the `ElastiCache`
- Application-based Cookie
    - Custom cookie - Generated by the `application`(can use a TTL), not name after: `AWSALB, AWSALBAPP, or AWSALBTG`
    - Application cookie - Generated by the load balancer with name `AWSALBAPP`
- Duration-based Cookies(TTL) - , generated by the load balancer with name  `AWSALB` for ALB

### Deregistration Delay (Connection Draining)
- After an instance is `marked as unhealthy`, give it some time to complete `in-flight requests`
    - a pool of request still send to the instance (in `DRAINING state`)
    - stop new requests to the instance after the pool being drained
- option:
    - Between 1 to 3600 seconds (default: 300
seconds)
    - Can be disabled (0 second)
    - set low value if requests time are short
### Cross-Zone Load Balancing Option
- Cross-Zone Load Balancing - in a multi-AZ load balancing setup, distribute traffics evenly to all instance `across AZs`
![](https://imgur.com/9b05naH.jpg)

- ALB: `Enabled` by default, `no charge` for inter AZ data traffic
- NLB/GWLB: `Disabled` by default, `charges` ($) for inter AZ data
### Health Checks - How
- Done by a `port + route` in the instance
    - eg: `/health` in port 4567
    - ELB send a `request` to `/health in port 4567`, if res 200, it is OK, else the instance is unhealth
- Health Checks is done in `Target Gourp level`

### Enhanced downstream security
- ELB can have its own `security group` (it is essentially an EC2 instance)
- `security group` setup:
    - ELB allow all network traffic (HTTP, HTTPS)
    - downstream instance `only allow the ELB instance` 
        - by setting `instance security group's Inbound rules` to the `security group of ELB`

# ASG
- `regional service (multi-AZ)`
- `scale out(+), scale in (-)` instances, `maintaining scale` (recreate terminated instances)
    - min capacity < desire capacity < max capacity
- ELB integration:
    - Automatically `register new instances` to `ELB's target group`
    - if configured the ASG to `use ALB Health Checks`, ASG will `terminate` unhealthy instance `detected by ELB`. (By default ASG use `its own EC2 Status Checks`.)

- `free` service!!!!
- ASG is configured `behind an ELB`

- `Launch Template` - very similar to create EC2:
    - a `config to launch a service` (similar to EC2 instance launching config)
    - all new instance created by ASG will be created according to the `Launch Template`

### ASG + ELB architecture
![](https://imgur.com/Zw3Kbbp.jpg)

### CloudWatch Alarm + ASG architecture
- to `scale an ASG` based on `CloudWatch alarm`, can be `any metric/custom metric`. 
    - Try to meet you bottleneck
- Good `CloudWatch metrics` to scale on
    - `CPUUtilization`: `Average CPU`
utilization across your instances
    - `RequestCountPerTarget`: stable `number of requests per EC2`  
    - `Average Network I/O`
    - any `custom metric` (eg. IO from backend to database)
### Scaling Policies 
- Dynamic Scaling Policies 
    - Target Tracking Scaling
        - `easiest setup`
        - eg. I want the average CPU to be around 40%
    - Simple / Step Scaling
        - when a CloudWatch `alarm is triggered`, `then +/- x instance` 
        - simple vs step: `step have more granularity to the alarm detail`
- Scheduled Action:
    - for known usage pattern (eg. 5 pm on Fridays)
- Predictive Scaling: 
    - ML predicted, on a target metric value.  Good for `time-based patterns usage`
### Scaling Cooldowns
- after scaling event, `instance/scaling metric` need time to stabilize,  
    - user set a `Cooldowns period (default 300s)`, during which `no scaling event will happen`
- goal: minimize the Cooldowns period for more frequent/fluent scaling
    - eg. Use a ready-to-use AMI to reduce instance configuration time
### misc
- `debuging`: if ASG keeping terminating instances and creating new instances, that is because ELB deem the instance as unhealthy. check either the `security group config` or the `user data config`


# RDS
- managed RDB(SQL) in AWS, AZ or multi-AZ
    - Postgres, MySQL, MariaDB, Oracle, Microsoft SQL Server, Aurora 
    - `managed`
        - Automated provisioning, OS patching
        - Continuous backups, Point in Time Restore
        - Monitoring dashboards
    - run in `underling EC2`, storage is backed by `EBS(gp2 or io1)`!!
        - `cannot ssh` into the instance
   
### Storage Auto Scaling - option: `no need storage provision/management`
- by default you manually managed the RDS scaling
- opt-in Storage Auto Scaling
    - RDS detects running out of database storage (eg, 10% free space, for 5 minutes, etc) => scale automatically

- must set a `Maximum Storage Threshold` to avoid infinite storage growth
- Useful for applications with `unpredictable workloads`

## Read Replicas vs Multi-AZ
- both are `service for an RDS instance`
### Read Replicas 
- up to `5 Read replicas` per RDS `instance`
- `ASYNC` replication:
    - the read data only guarantee to be `eventually consistent`
- Read Replicas deploy options: 
    - `single AZ` 
    - `Cross AZ`
    - `Cross Region`: outbound traffic is not free 

- a Read Replica may be `promoted to an independent RDS instance` (free from the Read Replica mechanism)

- Applications must update the `connection string` to leverage read replicas (`multi-AZ don't require that`)

- `use case!!!`
    - data analytics task
    - increase read performance(scaling)
    - disaster recovery (`Read Replica can be deploy in Cross AZ for disaster recovery`)

### Multi-AZ
- `Only` use is `disaster recovery`, 
    - `not used for scaling!!`
    - standby instance/ `master` instance
- `SYNC` replication:
    - every write to an instance will immediately sync to the repliacation
- `single DNS` name:
    - if one instance fail, the `DNS will automatically failover` to the other instance => increased `availability`

- what happens after set an single-AZ RDS multi-AZ
    - `no downtime` for the change. Will be some `performance impact` (due to snapshot)
        - snapshot created from master instance
        - standby instance restored from snapshot
        - SYNC estabilished between the two



### RDS custom
- for `Oracle and Microsoft SQL Server`. User can
    -  `access OS(SSH or SSM Session Manager)` 
    - `do OS level database customization`
        - Configure settings, Install patches, Enable native features...
- `De-activate Automation Mode (manual/no management)` so AWS management dont perform database and the OS management. (may break things, better take snapshot)
- RDS vs. RDS Custom
    - managed, no access vs manual, full admin access
 
## RDS Security
- Data encryption
    - at-rest: KMS, 
        - `master encryption must enable before read replicas encryption`
        - how: create DB snapshot => restore DB as encrypted
    - in-flight: TLS enable default

- access control
    - Within AWS: [IAM Database Authentication](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html)
        - support MariaDB, MySQL, and PostgreSQL
    - Network: Security Groups
    - No SSH available except `RDS Custom`
- logging: opt-in `Audit Logs` ->  `CloudWatch Logs`

## RDS Proxy
- Fully `managed, serverless` `database proxy`
- proxy:  `pool a number of clients` as `single client` to RDS/Aurora
    - pool and share DB connections => `reduced open connection`
    - `reducing the stress` on database resources, efficiency
    - `Reduced failover time by up 66%` in RDS & Aurora failover event
- Can be use to `Enforce IAM Authentication for DB`: `RDS proxy + Secretes Manager`

- RDS Proxy is `never publicly accessible `(must be accessed `from VPC, not Internet`)

![](https://imgur.com/s33zZI5.jpg)

## Backups, Restore
### Backups
- `automated backup`
    - `Transaction logs` are backed-up every 5mins (1-35 days retention)
    - Daily full backup of the database
    - `RDS` auto backup `can be disabled`(set retention to 0), `Aurora` auto backup `cannot be disabled`
- `Manual DB snapshots`
    - take snapshot anytime, save snapshot as long as you like
    
- misc: (saving trick for unused RDS resource): you still pay for the storage for stoped RDS database. if you're not going to use an RDS database for a long time take a snapshot and terminate it.
### Restore Database
- Restore single RDB/Aurora instance in AWS 
    - use RDS/Aurora snapshot
- Restoring `on-premise` MySQL RDS database(S3->RDS)
    - Create a backup of your on-premises database
    - store in `S3`
    - Restore from S3 to create new RDS instance
- Restore on-premise `MySQL cluster` to AWS `Aurora cluster`(Percona XtraBackup->S3->RDS)
    - Create a backup of your on-premises database using `Percona XtraBackup`
    - store in S3
    - Restore from S3 to create new Aurora cluster running MySQL


### Aurora Database Cloning
- Create a new `Aurora Cluster` from an existing one, 
    - `faster` than `snapshot + restore`
    - `no performance impact` to the original Aurora cluster
- Useful to create a `“staging” database` from a `“production” database` without impacting the production database


## Aurora
- Aurora support `Postgres and MySQL` 
- `multi-AZ / high availability` by default
    - 6 copies of data in 3 AZ
        - 1 writing master
        - 5 standby for `failover in less than 30s` 
- up to 15 `read replicas `
    - `read replicas auto scaling + load balancing`  
    - `opt-in cross region` replication (but think `Aurora Global` for test)
    
- feature:
    - `part of RDS service`, optimized for AWS: 5x mySQL, 3x Postgres, cost 20% more
    - 10GB- 128TB auto grows storage
    - `backtrack`: restore data at any point of time without using backups
- for any logical data: `Shared storage Volume Replication` + `Self Healing` + `Auto Expanding 10GB-128TB`
![](https://imgur.com/SQCVfiP.jpg)






### Endpoints
- `endpoints` ensure `user always has access to correct instance` for read/write (to master/failover/replicas)
    - `Writer Endpoint`: a DNS always point to the `current write master instance`
    - `Reader Endpoint`: connect to `load balancer to read replicas`. Read `replicas auto scaling` will `register` read replicas to the `load balancer`.
    - `Custom Endpoint`: can define multiple Custom Endpoint for differnt `subsets` of `read replicas` (eg, different performance, different purpose) and `expose` these Custom Endpoints `for different applications` (eg, a DA team)


### Aurora Global Database
- for multi-region, disaster recovery purpose 
    - better choice than `cross region read replication`
-  Global Aurora can `cross-region replication in 1 second`
- 1 Primary Region(r/w) + Up to 5 secondary (read-only) regions
    - `replication lag < 1s`, 
    - 16 Read Replicas per secondary region `(5*16)`
    - Helps for decreasing latency, & failover (<1min)


### Serverless Aurora
- Aurora can be Serverless service:
    - `pay by second`
    - No storage provision, auto storage scaling
    - Good for `intermittent or unpredictable workloads `
    - `proxy fleet` (AWS managed aurora instances) & expose client an endpoint
![](https://imgur.com/Xqv48iz.jpg)

### Aurora Multi-Master (instant failover)
- use `Multi-Master(writer)` for `instant failover (0s)`
    - Normally, promote Read replica to Master Node takes some time' (`failover in less than 30s`)
    - Multi-Master unlock `instant failover`

![](https://imgur.com/7HpSDQH.jpg)

### Aurora Machine Learning 
- integarte ML services into Aurora, Aurora as `SQL Interface and proxy`
- support
    - Amazon SageMaker (use with any ML model)
    - Amazon Comprehend
![](https://imgur.com/Jys2Da7.jpg)



## Important ports: differentiate
- you `should be able to differentiate between an Important (HTTPS - port 443) and a database port (PostgreSQL - port 5432) `

- Important ports:
    - FTP: 21
    - SSH: 22
    - SFTP: 22 (same as SSH)
    - HTTP: 80
    - HTTPS: 443

- RDS Databases ports:
    - PostgreSQL: 5432
    - MySQL: 3306
    - Oracle RDS: 1521
    - MSSQL Server: 1433
    - MariaDB: 3306 (same as MySQL)
    - Aurora: 5432 (if PostgreSQL compatible) or 3306 (if MySQL compatible)

- just read that list once today and once before going into the exam and you should be all set :)


# ElastiCache
- managed `Redis` or `Memcached`
    - in-memory databases with really high performance, low-latency
    - `reduce load` off of databases/ make your `application stateless`
    - require heavy `application code change`
    - `managed`: OS patching, optimizations, setup, config, failure recovery and backups

|Redis|Memcached|
|-|-|
|Multi AZ, Auto-Failover|`Multi-node` for data sharding|
|Read Replicas, high availability|`no replication`, `no high availability` |
|Data Durability using AOF persistence|`Non persistent`|
|Backup and restore features|`No backup and restore`|
|keyword: Sets and Sorted Sets|keyword: `Multi-threaded architecture`|


## Caching target
### DB Cache
- relieve load in RDS
- need to make sure only the most current data is used in there (eg, ttl)

![](https://imgur.com/lQmVaFY.jpg)
### User Session Store
- make stateless user session for microservice pattern
    - User logs into any of the applications
    - The application writes the session data into ElastiCache
    - user hits another instance of our application
    - The instance retrieves the session data from cache and see user as logged in

![](https://imgur.com/yoHFGQp.jpg)
## Data Loading (Caching) Pattern
- `Lazy Loading`: all the read data that not in the cache is cached, data can become stale in cache
- `Write Through`: Adds or update data in the cache when written to a DB (no stale data)
- `Session Store`: store temporary session data in a cache (expire using TTL )

## Use case: Createing `real-time Gaming Leaderboards`
- use `Redis' Sorted sets`: guarantee both `uniqueness` and `element ordering`
    - Each time a new element `added`, it’s `ranked and placed in order`

## ElastiCache Security 
### Redis
1. `IAM Authentication` for `Redis only` ensure `API-level security`
2. `Redis AUTH`, authentication within Redis software
    - Redis also support `SSL in flight encryption`
### Memcached
1. Supports SASL-based authentication (advanced)

 
# Route 53
- fully `managed` and `Authoritative DNS(server) + Domain Registrar`
    - Authoritative: customer (you) can update the DNS records
    - `global service`

- terms
    - `DNS Records`: contain routing information about an domain name
    - `Zone File`: a file containing `DNS records`, in a `hosted zone` context
    - Hosted Zone: a `collection of DNS Record` used by Name Server to resolve DNS query
    - `Name Server(NS)`: resolves DNS queries (Authoritative or Non-Authoritative)
    - Top Level Domain (TLD): .com, .us, .in, .gov, .org, …
    - Second Level Domain (SLD): amazon.com, google.com, …

![](https://imgur.com/qUwJwq8.jpg)
### Hosted Zone 
- A `container` for `DNS record` for `routing purpose`
- types of Hosted Zone 
    - `Public Hosted Zones` – contains records that specify how to `route traffic on the Internet` (public domain names)
    - `Private Hosted Zones` – contain records that specify how `route traffic within one or more VPCs` (private domain names, can `only resolved request within a private network or VPN: DNS => private IP`)
![](https://imgur.com/pE1EErU.jpg)
- what Hosted Zone contains:
    - NS record (eg. example.com)
    - A/AAAA records (eg. test.example.com)
## `DNS Records`
- a record includes 
    - `Domain Name(record name)`: e.g., example.com.
    - `subdomain Name`, eg  `demo.`example.com.
    - `Record Type` – e.g., A/AAAA/CNAME/NS
    - `Value` – e.g., 12.34.56.78
    - `Routing Policy` – how Route 53 responds to queries
    - `TTL` – amount of time the record cached at DNS Resolvers

### `record types`
- A – maps a hostname to IPv4
- AAAA – maps a hostname to IPv6
- CNAME – maps a hostname to another hostname
    - Can’t create a CNAME record for the top node of a DNS namespace (Zone Apex)   
    - (eg. can’t create for `example.com` (a top node), but you can map `www.example.com` to `example.com`)
- NS – DNS name/IP of the `Name Server of the Hosted Zone` (servers that response to DNS queries)
    - owned by AWS, eg: ns-252.awsdns-31.com.
### Record TTL
- how long `client` `caches` the DNS record `without querying the Name Server` again
    - `High TTL`: e.g., 24 hr. Route 53 traffic `low`, 
        - `user may get outdated record for a day!!!`
    - `Low TTL`: e.g., 60 sec. Route 53 traffic `high`, 
        - `more cost, easier to change records`

### CNAME vs Alias
- AWS Resources (Load Balancer, CloudFront...) are accessed as `AWS hostname`:
    - eg • lb1-1234.us-east-2.elb.amazonaws.com
- you may want to map it to your host name, there are two ways
    - CNAME
    - Alias (AWS specific record type)
- CNAME:
    - Points a hostname to `any other hostname`. 
    - `Non-root Domain Only` (not works for mydomain.com) 
- Alias: 
    - is an AWS specific record type
    - Points ant hostname, includes root (the apex of zone) to `an AWS resource hostname` 
    - you `cannot set TTL` when use Alias (set by Route 53)
    - Free of charge 
- !!`cannot set an Alias record for an EC2 DNS name`
- Alias supported hostname(不考):
    - `Elastic Load Balancer`
    - CloudFront Distributions
    - API Gateway
    - Elastic Beanstalk environments
    - S3 Websites
    - VPC Interface Endpoints
    - Global Accelerator 
    - Route 53 record in the same hosted zone

## Routing Policies
- Routing in Route 53 context is: to define how DNS server responds to DNS queries when `multiple IP(resource)` are associated to the `same domain name`
### Simple
- when multiple resources share the same domain name, client choose a `random` IP
- Cannot opt-in Health Checks
![](https://imgur.com/y39Ag3I.jpg)

### Multi-Value
- return multiple values/resources, allow Health Checks (return only healthy resource)
- Multi-Value is `not a substitute for having an ELB`

### Weighted
- Control the `% of the query` that go to each resource
- to use Weighted, each weighted record must have the same domain name and type
- Can opt-in Health Checks
- use case: load balancing between resources, debug for Stageing 
- `set 0 to stop using an IP; if all assigned 0 then traffic will be equal`

### Latency
- return `resource with least latency`(traffic time between users and AWS Regions), the latency is `not related to geolocation` but `handshake time`
- Can opt-in Health Checks, has a failover capability
### Failover
- return `primary resource if it passed the Health Check`, `otherwise return the Secondary`(Disaster Recovery/Standby) resource
    - Failover record type can be either `Primary` or `Secondary`
    - `must associate a Health Check` with the `Primary`
    - optionally associate a Health Check with the `Secondary`


### Geolocation
- route based on the `most precise user location able to get`
    - eg. go to `record a` if user is located in `France`
    - need a `Default Routing Record` for not match or no location 
- Can opt-in Health Checks, has a failover capability

- Use cases: website localization, restrict content distribution
### Geoproximity
- User `bias` to shift more/less traffic to resource
- bias 
    - increase bias (1 - 99) => more traffic to resource
    - shrink bias (-1 - -99) => less traffic to resource
- You must use `Route 53 Traffic Flow` to use this feature
- use when you want to route based on location in general, but also want to `focus/avoid certain region`
### IP based
- provide `a list of CIDR` (client `IP address range`), route each CIDR to its corresponding resource
- use case: Route end users from a particular ISP to a resource

## Health Check
- Resource Health Check => Automated DNS Failover 
### Monitor an Public Endpoint
- check an IP endpoint (200 status)
- About 15 global health checkers (in AWS public domain) will check the endpoint health
    - If > 18% of health checkers report the endpoint is healthy, Route 53 considers it Healthy. Otherwise, it’s Unhealthy
    - Must allow incoming requests from Route 53 Health Checkers IP address range
### Calculated Health Checks - Combined Health Check
- Combine the results of multiple Health Checks into a single Health Check
    -  OR, AND, or NOT rules
    - Usage: perform maintenance to your website without causing all health checks to fail
### Monitor an CloudWatch Alarm - Private Resource Health Check
- Route 53 `health checkers` are outside VPC or Private Hosted Zones, `can’t access private endpoints`
- To monitor private endpoints Health, 
    - You can create a `CloudWatch Metric`
    - associate a` CloudWatch Alarm`
    - create a `Health Check that checks the alarm` 

## Domain Registar
- `Domain Registar` is where you buy and own a domain name
- Route 53 `DNS service` and `Domain Registar` are two separate service: means that you can
    - buy Domain Name else where and use Route 53 DNS service for management
    - buy Domain Name in Route 53 and manage else where
- to use Route 53 DNS Service
    - Create a Public Hosted Zone in Route 53
    - Update `Route 53 NS Records` to 3-rd party website `NS Records`


# Solution Architect
## Stateless Application
- `Stateless` means `no need to use Database`, all instance of the application can work independently
    - eg:  `WhatIsTheTime`

## Stateful Application
### to preserve use's state 
- ELB stickiness 
    - load unbalance
    - cling to an instance
- Cookies stored in client
    - heavy HTTP request, limit data size(4KB)
    - security: altered Cookie
- Server Session:
    - client send `session_id` in Cookies
    - `session_id` point to ElastiCache `Redis user session data`, or DynamoDB

## Microservice
- Many services `interact with each other directly using a REST API`
    - `Synchronous` patterns: API, Load Balancers url...
    - `Asynchronous` patterns:  SQS, Kinesis, SNS, Lambda triggers (S3)...
- `architecture for each micro service may vary `in form and shape
- We want a micro-service architecture so we can have `a leaner development lifecycle for each service`

- Challenges with micro-services:
    - repeated overhead for creating each new microservice,
    - issues with optimizing server density/utilization
    - complexity of running multiple versions of multiple microservices simultaneously
    - proliferation of client-side code requirements to integrate with many separate services. 

![](https://imgur.com/seJjuKD.jpg)


### Use Data Storage
- use EFS instead of EBS for multi-AZ/multi-instances application
![](https://imgur.com/4niOp5N.jpg)
### To Scaling Database Reads Operation(for performance):
- RDS read replicas
- ElastiCache Lazy Loading
    - cache fail: read RDS -> cache
    - cache hit -> use cache




### Typical stateful architectures:
- `3-tier Architecture`: client tier, web tier, database tier

## High availability (Survive Disaster)
- Route 53: Global Service, multi-AZ by default
- ELB: Regional service, can be multi-AZ
- ASG: Regional service, can be multi-AZ
- ElastiCache, RDS: opt-in Multi-AZ


## Infrastructure Security:
- ELB listen to all Internet traffic
- ASG (EC2s) allow only `security groups from ELB`
- Databases allow only `security groups from EC2 instance`

## Speedup Instantiating Applications 
- EC2 Instances:
    - Use a `Golden AMI`: Install your `applications`, OS `dependencies` ... in AMI, launch EC2 instance from the Golden AMI
        - `Golden AMI ` is an image that contains all your software installed and configured so that future EC2 instances can boot up quickly from that AMI.
    - Bootstrap using `User Data`: For `dynamic configuration`, use User Data scripts
    - Hybrid: mix Golden AMI and User Data(Elastic Beanstalk)
- RDS Databases:
    - Restore from a snapshot
- EBS Volumes:
    - Restore from a snapshot
- misc: user docker container


# Elastic Beanstalk 
- Elastic Beanstalk is a `developer centric view` of `deploying` an application use the `typical architecture presets`
    - managed service: EC2, ASG, ELB, RDS... all managed
    - expose `some architectural configuration` in single UI
    - use CloudFormation behind the scene
    - just upload the `code` and it run in the cloud
- free but pay for underlining resource

### Components:
- `Application`: collection of Elastic Beanstalk components: environments + code, configurations
- `Application Version`: an application code version
- `Environment`: Collection of AWS resources to run an application version
    - You can create multiple environments (`dev, test, prod`, …)
- `Tiers`: Web Server Environment Tier & Worker Environment Tier
![](https://imgur.com/C5GHB6p.jpg)

### Tier Options: Web Server Tier VS Worker Tier
- web application(incoming request) vs cloud computing
![](https://imgur.com/hDUfnLR.jpg)

### Deployment Options
- single instance vs high-availability
![](https://imgur.com/aoB0eja.jpg)

# S3
## basic
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
- S3 Static Website: 
    - If you get a `403 Forbidden error`, make sure the `bucket policy` allows public reads!


### Versioning: 
- enabled at the `bucket level`
- usage: roll back unintended deletes
- `overwrite` creates new versions
- deletion with versioning in fact add `delete marker `to objects and hide them 
- `Suspending versioning` does not delete the previous versions. 
- File will be `version Null` after opt-in versioning.
### Replication: replicate S3 bucket 
- `Must enable Versioning` in src/destination
- different options
    - `Cross-Region Replication (CRR)`: data compliances/lower latency
    - `Same-Region Replication (SRR)`: replication/test account
    - `Cross Account Replication`
- Copying is asynchronous
- After you enable Replication, only new objects are replicated
    - you can replicate existing objects using `S3 Batch Replication`
- Possible to replicate `delete markers` from source to target. 
- There is `no “chaining” of replication`
### S3 Storage Classes
- options
    - S3 Standard - General Purpose
    - S3 Standard-Infrequent Access (IA): backup
    - S3 One Zone-Infrequent Access: Secondary backup
    - S3 Glacier Instant Retrieval
    - S3 Glacier Flexible Retrieval:        
        - Expedited (1 to 5 minutes), Standard (3 to 5 hours), Bulk (5 to 12 hours)
    - S3 Glacier Deep Archive
        - Standard (12 hours), Bulk (48 hours)
    - S3 Intelligent Tiering, no retrival fee!!
- for `infrequently accessed object`,
move them to `Standard IA`. For `archive` objects move them to `Glacier or Glacier Deep Archive`
### S3 Lifecycle Rules
- rule target:
    - bucket wide 
    - filter by prefix (example: s3://mybucket/mp3/*)
    - objects Tags (example: Department: Finance)
- rule actions
    - `Transition Actions`:
        - move objects to another storage class
        - eg: Move to Glacier for archiving after 6 months
    - `Expiration actions`:
        - delete object or old versions after some time
        - eg: delete access logs after 365 days, delete incomplete Multi-Part uploads
- `S3 Analytics – Storage Class Analysis`:
    - analysis and give storage class transition `recommendations` for `Standard and Standard IA`
    - 24 - 48 h to see the report
    - Good first step to put together Lifecycle Rules

### S3 Requester Pays
- Normally bucket owner pay for data storage and data transfer out 
- In `Requester Pays` enabled Bucket, the requester pay for the cost of `data transfer out`. The the requester `must be authenticated in a AWS`

### S3 Event Notifications
- S3 Event: `CURD of object`, 
    - in S3, 
        - can filter through file name or extension
        - Event destinations: `EventBridge, SNS, SQS, Lambda`     
    - when sent to `EventBridge`, 
        - more filter options  
        - more destinations
        - EventBridge Capabilities 

- can create `infinite S3 events` as desire
### Performance
- S3 baseline performance
    - at least `3,500 PUT/COPY/POST/DELETE` or `5,500 GET/HEAD requests` per `second` per `prefix` in a bucket. 
    - If you spread reads across all four prefixes evenly, you can achieve `22,000 GET/HEAD requests` per second  
- performance optimization:
    - `Multi-Part upload => parallelize upload`: recommended for files > 100MB, must use for files > 5GB
    - `S3 Transfer Acceleration`: transferring file(`upload/download`) to/from an `AWS edge location` => forward to the S3 bucket
- S3 Byte-Range Fetches: 
    - to `speed up downloads`(increase read efficiency): Parallelize `GETs` by breaking transfer by `byte ranges`
    - to retrieve only partial of data
### S3 Select & Glacier Select
- `server-side filtering(query) data` using `simple SQL statements `
    - fetch less data, Less network transfer
    - `CSV files`
### S3 Batch Operations
- Perform `Batch/bulk operations` on S3 objects with a single request
    - `Encrypt un-encrypted object` 
    - Invoke `Lambda function` to perform custom action
    - Modify object metadata & properties, ACL, tags
    - Copy objects between buckets
- A job consists of a `list of objects`, the `action` , and optional `parameters`
- You can use `S3 Inventory` to `get object list` and use `S3 Select` to `filter` objects before Batch Operations
## S3 Security
### S3 Access
- `User/Services`
    - `IAM Policies, IAM Role`
- `Resource-Based`
    - Bucket Policies – bucket level security control
        - Grant/disable `public access`
        - `Force objects encryption`
        - Grant `Cross Account access`
    - Object Access Control List (ACL) – object level access(can disable)
    - Bucket Access Control List (ACL) - not common (can disabled)
- `Block Public Access` Options: extra layer of security to prevent company data leak

### S3 Encryption
- It’s important to understand which `1 of 4 encryption solution` to use for a situation
    - Server-Side Encryption (SSE)
        - Encryption with Amazon S3-Managed Keys (SSE-S3) – Enabled `by Default`
        - Encryption with KMS Keys stored in AWS KMS (SSE-KMS)
        - Encryption with Customer-Provided Keys (SSE-C)
    - Client-Side Encryption


- Amazon S3-Managed Keys (SSE-S3)
    - Encryption using `keys managed and owned by AWS S3`
    - Encryption type is `AES-256`
    - Must set header `"x-amz-server-side-encryption": "AES256"`
    - Enabled by default for new buckets/objects
![](https://imgur.com/OI18Ksn.jpg)

- KMS Keys stored in AWS KMS (SSE-KMS)
    - Encryption using `keys managed by AWS KMS, owned by user`
    - KMS advantages: user control + `audit key usage using CloudTrail`
    - `another layper of security`
    - Must set header `"x-amz-server-side-encryption": "aws:kms"`
    - limitaion: 
        - upload files requires `GenerateDataKey KMS API`, reading files requires calls `the Decrypt KMS API`, 
        - Count towards the `KMS quota` per second ( may request a quota increase: Service Quotas Console )
![](https://imgur.com/AawOno4.jpg)

- Customer-Provided Keys (SSE-C)
    - `key` own, managed by the customer outside of AWS, `Encryption still happen in AWS`
    - `HTTPS` must be used: `Encryption key` must provided in `HTTP headers`, for every request 
    - not supported by console, only cli/sdk 

![](https://imgur.com/BoO3p87.jpg)
- Client-Side Encryption
    - use Library like `Amazon S3 Client-Side Encryption Library`, use `mananage encryption on-premise`
    - the file in transit/ stored in S3 has already be encrypted
    - AWS don't know if object is encrypted or not
![](https://imgur.com/Bff7xFZ.jpg)

- setting `default encryption` type:
    - `SSE-S3 encryption is default` encryption to new objects
    - Optionally, you can “`force using SSE-KMS or SSE-C encryption`” by using a `bucket policy`
        - `deny` API calls to `PUT an S3 object` without `encryption headers (SSE-KMS or SSE-C)`
        - `bucket policy` are always evaluated `before “Default Encryption”`
### Forcing HTTPS connection (Encryption in Transit)
- use bucket policy to force SSL/TLS transit
    - `deny` operations if `"aws:SecureTransport":"false"`
![](https://imgur.com/PPdZrt1.jpg)

### S3 CORS
- CORS: Cross-Origin Resource Sharing 
- Origin = protocol(eg, HTTPs) + host (domain) + port
    - Origin example: https://www.example.com:443
    - different Origin example: : http://www.example.com, http://api.example.com
- Origin in S3:
    - object in the` same bucket` share the `same origin`
    - object in the` differnt bucket` are the `cross origin`
- CORS:  a web browser security mechanism: `Requests from one Origin to another Origin` won’t be fulfilled (protected) `unless the other origin allows for the requests`
    - by using `CORS Headers` in the destination Origin
        - example: (for http://apis.example.com): `Access-Control-Allow-Origin: http://www.example.com` (GET/PUT)

- CORS in S3: a popular exam question
    - If a client makes a cross-origin request `from an Origin` to `our S3 bucket`, we need to `enable the Origin in CORS headers`
    - You `can allow for a specific origin or for * (all origins)`
![](https://imgur.com/HI1C8AZ.jpg)      


### MFA Delete
- MFA (Multi-Factor Authentication) Delete – force users to `do MFA before Deletion` (hardware/App)
    - protection `against accident deletion`
    - operations require MFA: 
        - Permanently delete an version
        - Suspend Versioning 
    - operations not require MFA: 
        - add delete marker 
        - Enable Versioning
        

- Feature requirements
    - To use MFA Delete, `Bucket Versioning` must be enabled
    - Only the bucket owner `(root account)` can enable/disable MFA Delete, `through cli`
### S3 Access Logs
- `log all access request (success or not) to S3 buckets (audit purpose)`
    - log can be analysised such as `Athena`
    - `logging storage bucket` must be in the `same AWS region`
- Do not set your logging bucket to be the monitored bucket (create a `logging loop`, and your bucket will grow exponentially)

### S3 Pre-Signed URLs
- pre-signed URL: 
    - url give `permissions to the user with the url` for operation such as GET / PUT 
    - think sharing a Google doc link
- S3 Pre-Signed URLs
    - Generate pre-signed URLs using the `S3 Console, AWS CLI or SDK`
    - give `permissions to the user with the url` to download/view file `(even if the bucket is private)`
    - URL Expiration (TTL)
        - S3 Console: 1 min to 12 h
        - AWS CLI/SDK: default 10 h, up to 168 h

- Examples:
    - Allow only `logged-in users to download a premium video` from your S3 bucket
    - Allow an ever-changing list of users to download files by `generating URLs dynamically`
    - Allow `temporarily a user to upload a file to a precise location` in your S3
    bucket

### Locks
- lock: Adopt a WORM (Write Once Read Many) mode, `Data retention Compliance`, etc. : `cannot be delete by anyone`
- Glacier Vault Lock `(bucket level lock)`
    - put Object in `Glacier Vault`
    - enable `Glacier Vault Lock`
    - Object can `no longer be changed or deleted by anyone`
- S3 Object Lock `(object level lock)`
    - `retention modes` - Compliance 
    - `retention modes` - Governance 
    - Retention Period
    - Legal Hold:
        - protect the object indefinitely (eg, for legal purpose) 
        - `s3:PutObjectLegalHold IAM permission` to set/remove legal hold
        - independent from `retention modes`
      
|Compliance|Governance|Legal Hold|
|-|-|
|`Strict`|Loose|
|`anyone` cannot change|Most users can't change|
|`retention modes` can't be changed|user with special permissions can change retention modes|
|`retention periods` cannot be shorten(can be extended)|user with special permissions can shorten retention periods|

### S3 – Access Points
![](https://imgur.com/o6gqPiR.jpg)
- Access points: an endpoint
    - with a `DNS name` (Internet Origin or VPC Origin)
    - with a `access point policy  (similar to bucket policy) ` that grant permission to a bucket 
- Access Points `simplify Access security management` for S3 Buckets

- to use `VPC Origin` Access Points 
    -  must create a `VPC Endpoint `(`Gateway or Interface Endpoint`) to access the Access Point
    - The `VPC Endpoint Policy` must allow access to the target bucket and Access Point
![](https://imgur.com/aiB4GV8.jpg)

### Access point + `Object Lambda`
- `use Lambda Functions (preprocess for different purpose)` before send to S3 `Access Points`
- Use Cases (Lambda):
    - Redacting`(remove) personally identifiable information` for analytics
    - `Converting data formats`
    - `Resizing/watermarking images on the fly` using `caller-specific details`, such as the user who requested the object.
![](https://imgur.com/Bu4Qh5h.jpg)
# CloudFront
- Content Delivery Network (`CDN`):     
    - `improves read performance` by `cached static contents` at the `edge`
    - (AWS reources) Use `AWS private Network` for fast and security transfer 
    - Cache for a TTL

- DDoS protection: integration with `Shield`, `WAF`
![](https://imgur.com/inUJJvE.jpg)
### CloudFront Origins
- `Origins`: target(files/content) to be cached 
    - S3 bucket
        - Enhanced security with CloudFront `Origin Access Control (OAC)`
        - `S3 Transfer Acceleration`: use CloudFront to upload to S3
    - Custom Origin (HTTP):
        - AWS resource: ALB, EC2.., or Any non-AWS HTTP backend
        - `CloudFront facing Server must allow Public IP of Edge Location` (there is a list)
    
### CloudFront Geo Restriction
- Geo Restriction `control access to you Content` by `country`
    - support Allowlist/ Blocklist
    - “country” is determined using a 3rd party `Geo-IP database`
- Use case: `control County access to content`
### CloudFront Price Classes
- CloudFront are priced by `amount of data(eg.TB) cached` in edge locations. `Deiffernt edge location are priced differently`. 
- Price Classes:
    - reduce the cost by restrict edge location used by CloudFront
        - Price Class All: most expensive
        - Price Class 200: excludes the most expensive regions
        - Price Class 100: only the least expensive regions

![](https://imgur.com/Sf53Z3p.jpg)

### CloudFront Cache Invalidation
- Issue: CloudFront `doesn't know content in Origin` has been updated  `until TTL has expired`
- `Cache Invalidation`: `force (manually)` an entire or partial `cache refresh`
- In S3, this can either be
    - all files (*)
    - a special path (/images/*)

# Global Accelerator
- global service
- `Instead of using Public Internet`, Leverage the `AWS internal network` to route to your application
    - eg. you application is only deployed in one region and you want users from the worlds to access it faster
    - `Intelligent routing` to closest Edge Location
    - Endpoint Group: Support `Elastic IP, EC2 instances, ELB(ALB&NLB), public or private`
    - Leaverage all `Failover/Health Check/Security(Shield DDos Protect)` benefits

- pricing:
    - fixed fee for each hour(partial hour)
    - data transfer fee (depend on region)
- usage: 
    - `Improves performance`(TCP/UDP)
    - edge location `Proxying packets`
    - Good for `non-HTTP` use cases, such as `gaming` (UDP), `IoT` (MQTT),
    - Good for `HTTP` use cases that require `static IP addresses`, fast `regional failover`
### Unicast IP vs Anycast IP
- Unicast IP: the normal behavior. `A server have its unique public IP`
- Anycast IP: 
    - `multiple servers hold the same IP`
    - when a `client` request it will be `routed to the nearest one`

- How Global Accelerator work:
    - 2 `Anycast IP` are created for your
application
    - Anycast IP send traffic to closest Edge Locations
    - client talk to Edge Locations
![](https://imgur.com/WCdtt2z.jpg)


# Data Misc
## Snow Family
- Data migration: (If it takes `more than a week to transfer over the network`, use Snow devices!)
    - Snowcone:8(HDD), 14 TB
        - Use Snowcone where Snowball does not fit (space constrained..) 
    - Snowball Edge: 42, 80 TB
    - Snowmobile: 100 PB
        - Better than Snowball if you transfer more than 10 PB
- Edge computing:
    - Snowcone: 2 CPUs, 4 GB of memory
    - Snowball Edge - Compute: 52 vCPUs, 208 GiB, 42TB
    - Snowball Edge – Storage: 40 vCPUs, 80 GiB, 80 TB
- OpsHub: snow device client software, GUI(management, AWS services, copy, compute, Monitor...)
    
### Snowball into S3 Glacier
- Snowball `cannot import to Glacier directly`
- Correct way: Snowball -> S3 -> lifecycle policy -> S3 Glacier
![](https://imgur.com/BWrFI1g.jpg)

## AWS Transfer Family
- transfers file into and out of `S3 or EFS` using the `FTP protocols` (without using S3/EFS apis)
- support: 
    - `FTP` (File Transfer Protocol (FTP)
    - `FTPS` (File Transfer Protocol over SSL (FTPS))
    - `SFTP` (Secure File Transfer Protocol (SFTP))
- usage: sharing files, public datasets, CRM, ERP, …

- misc:
    - Managed infrastructure, Scalable, Reliable, Highly Available (multi-AZ)
    - `Pay per provisioned endpoint per hour + data transfers in GB`
    - Integrate with existing `authentication systems (Microsoft Active Directory`, LDAP, Okta, Amazon Cognito, custom)
    - Store and manage users’ credentials within the service

![](https://imgur.com/NXFhTw3.jpg)


## FSx:
- `Managed` service, Launch `3rd party` `file systems` on AWS
    - FSx for `Lustre`
    - FSx for NetApp `ONTAP`
    - FSx for `Windows File Server`
    - FSx for OpenZFS
- `Deployment options`
    - Scratch File System:
        - `Only one copy of data`(not persist when fail)
        - `High burst` computing 
        - Usage: `Temporary` storage, short-term processing, cost optimize
    - Persistent File System
        - Data is `replicated within same AZ `, Replace failed files within minutes
        - Usage: `Long-term` storage, long-term processing

### FSx `Windows File Server`
- `SMB/ Windows NTFS` File System, Active Directory, ACL
- `Microsoft's Distributed File System (DFS)` Namespaces: join MS file system in cloud and on-premise



### FSx Lustre
- Lustre: `Linux+Cluster`,  a `parallel distributed file system(large-scale computing)`
- usage: Machine Learning, High Performance Computing (HPC), Financial Modeling...
- misc:
    - Storage Options: `SSD/HDD`
    - `VPN /Direct Connect from on-premises`
    - integration to S3: 
        - `read` S3 `as a FSx file system` 
        - `write` to S3



### FSx NetApp ONTAP
- `Highly compatible` FS
    - compatible with `NFS, SMB, iSCSI protocol`
    - Works with:Linux, Windows, MacOS, VMware, Amazon...
    - Move workloads running on `ONTAP or NAS` to AWS
- misc
    - Point-in-time `instantaneous cloning`, (helpful for `quick staging and testing`)
    - Storage shrinks or grows automatically
    - Snapshots, replication, low-cost, compression, data de-duplication

### FSx OpenZFS
- Managed `OpenZFS file system`,
    - compatible `only NFS`
    - Works with:Linux, Windows, MacOS, VMware, Amazon..
    - Move workloads running on ZFS to AWS
- misc
    - Point-in-time `instantaneous cloning`, (helpful for `quick staging and testing`)


## Storage Gateway
- `Hybrid cloud File System` solution: Bridge between on-premises data and cloud data, `access AWS storages in on-premise file system`
    - eg: `expose the S3 data on-premises`
- Use cases:
    - backup & restore
    - `tiered storage`
    - on-premises cache & low-latency files access
- Types of Storage Gateway:
    - S3 File Gateway 
    - FSx File Gateway
    - Volume Gateway
    - Tape Gateway

### Amazon S3 File Gateway
- `S3 buckets` are accessible using the `NFS and SMB protocol(file system)`, `SMB + Active Directory (AD)` for user `authentication`
    - Only most recently used data is `cached` in the `file gateway`
    - supports S3 Standard, S3 Standard IA, S3 One Zone A, S3 Intelligent Tiering
    - not support `S3 Glacier`: use `Lifecycle Policy instead`

![](https://imgur.com/3oR1yI6.jpg)


### FSx File Gateway
- Access to Amazon `FSx for Windows File Server` with `Local cache for frequently accessed data`
    - `FSx for Windows File Server already provides on-premise access,` `the purpose is to used the local cache!!!`
    - automatically backup to S3
    - Windows native compatibility (SMB, NTFS, Active Directory...)

![](https://imgur.com/0i9PgQM.jpg)

### Volume File Gateway
- `Block storage` (iSCSI protocol backed by S3)
    - Backed by `EBS snapshots` which can help `restore on-premises volumes`!
    - `Cached volumes`: low latency access to most recent data
    - `Stored volumes`: entire dataset is on premise, scheduled backups to S3
- main usage: `backup on-premise volume storage to EBS Snapshots`

![](https://imgur.com/r1cjWaC.jpg)


### Tape Gateway
- usage: backup on-premise `physical tape storage` to S3
    - `Virtual Tape Library (VTL)` backed by Amazon S3 and Glacier
    - iSCSI interface
    - Works with leading backup software vendors

![](https://imgur.com/13dzC31.jpg)


### Storage Gateway Hardware appliance
- Storage Gateway Hardware Appliance: `AWS hardware to run Gateways on-premise`
    - Works with File Gateway, Volume Gateway, Tape Gateway


## AWS DataSync
- Move large amount of data to and from(sync)
    - `On-premises / other cloud` to AWS  – `needs agent`
        - Snowcone pre-installed agent
    - `AWS` to AWS (different storage services) – `no agent needed`
- `can be good choice to migrate data on Network!!!`

- sync data from and to:
    - FSx, EFS, `S3(include Glacier)`
- `DataSync(two-way replication) is not instant(lag), schedule on hourly/daily... basiss`

- can set band width limit

### `On-premises / other cloud` to AWS

![](https://imgur.com/GdWOs0Y.jpg)


### `AWS` to AWS
![](https://imgur.com/wxWQUWy.jpg)

# Big Data Application
## Athena
- `Serverless SQL query document stored in S3`
    - documents: support CSV, JSON, ORC, Avro, and Parquet 
    - pay $5.00 per TB of data scanned
    - used with Amazon Quicksight(BI dashboard) for reporting/dashboards
- usage: BI, analysis logs, etc

- Performance Improvement
    - use `columnar data for cost-savings` (less scan)
    - use `parquet or ORC data format`(`Glue` to convert data)
    - `Compress data` for smaller retrievals
    - `Partition datasets in S3` for easy querying
    - Use `larger files` for quicker scan

- Athena – Federated Query
    - Athena query/analysis `not just S3`, but `relational, non-relational,object, and custom data sources` (AWS or on-premises)
    - use `Data Source Connectors` that run on AWS Lambda to run Federated Queries
    - Store the results back in Amazon S3
    ![](https://imgur.com/kqmQu64.jpg)
## Redshift 
- `OLAP – online analytical processing` (`high performance analytics` and `data warehousing`) based on `PostgreSQL`(`SQL query`)
    - Columnar storage of data 
    - Amazon Quicksight or Tableau integrate
    - provision + pay as you go
    -` vs Athena`: `faster` queries / joins / aggregations thanks to `indexes`

- Redshift Cluster
    - `Leader node`: for query planning, results aggregation
    - `Compute node`: for performing the queries, send results to leader
    - can used Reserved Instances for cost savings
    ![](https://imgur.com/Gqrkob4.jpg)
- DR
    - `most single-AZ`, some clusters `Multi-AZ`
    - Snapshots
        - incremental (only what has changed is saved)
        - can restore a snapshot into a new cluster 
        - Automated mode (limit retention), manual mode: unlimited retention
        - `can configure Amazon Redshift to automatically copy snapshots to another AWS Region `
- `Loading data into Redshift`: 
![](https://imgur.com/DsuahkM.jpg)

- Redshift Spectrum
    - `Query` data in `S3` `without loading data` into `Redshift`
        - Must have a `Redshift cluster` available 
        - `Redshift Spectrum nodes` conducts the query
        ![](https://imgur.com/PsIyxOy.jpg)
- `Enhanced VPC Routing`:  forces all COPY and UNLOAD traffic moving between your cluster and data repositories through your VPCs
## OpenSearch (used name ElasticSearch)
- `store` data, perform `search` any field, even `partially matche`s to another database
    - (not serverless)
    - not natively support SQL
    - Comes with 
    - integration
        - Ingestion from Kinesis Data Firehose, AWS IoT, and CloudWatch Logs
        - Security through Cognito & IAM, KMS encryption, TLS

- search dynamoDB
![](https://imgur.com/sZm6kFm.jpg)

- search CloudWatch Logs
![](https://imgur.com/zgiPCVU.jpg)

- load data with Kinesis Data Stream/Kinesis Data Firehose
![](https://imgur.com/i9PYrsG.jpg)


## EMR (Elastic MapReduce)
- `Hadoop clusters` (Big Data) 
    - clusters can be made of `hundreds of EC2 instances`
    - EMR takes care of all the provisioning and configuration, Auto-scaling and integrated with Spot instances
    - Use cases: `big data`… (data processing, machine learning, web indexing)

- Node types  
    - Master Node (long running): : Manage the cluster, coordinate, manage health 
    - Core Node (long running): Run tasks and store data
    - Task Node (optional): runner

- purchasing options:
    - `On-demand:` 
    - `Reserved` (min 1 year): cost savings(`Master Node, Core Node`)
    - `Spot Instances`: cheaper, can be terminated, less reliable(`Task Node`)
## QuickSight
-  `serverless BI service` to create `interactive dashboards`
    - `In-memory computation using SPICE`
    - `Enterprise` edition: `Column-Level security (CLS)`
- integration
    - RDS, Aurora, Redshift, Athena
![](https://imgur.com/u6HL2KE.jpg)

- Dashboard & Analysis
    - Users (standard versions) and Groups (enterprise version): they are not IAM
    - dashboard: a read-only snapshot of an analysis (congif: filtering, parameters, controls, sort)
    - You can share `analysis` or  `dashboard` with `Users or Groups`
## Glue
- `serverless, Managed` extract, transform, and load `(ETL) service`, most frequently load to `Redshift or Athena`
- things to know at a high-level
    - `Glue Job Bookmarks`: track `previous jobs, prevent re-processing` old data
    - `Glue Elastic Views`:
        -  `combined view (“virtual table” ) (SQL) from multiple data stores`
    - `Glue DataBrew`:` clean and normalize data` using pre-built transformation
    - `Glue Studio`: new `GUI` to create, run and monitor ETL jobs 
    - ` Glue Streaming ETL`: `run job as streaming job instead of batch job` 


- usage: `Convert data into Parquet(columnar, bettter for Athena analysis) format`
![](https://imgur.com/M4Cakl3.jpg)

- ` Glue Data Catalog`: 
    - catalog of datasets
    ![](https://imgur.com/9mexuA4.jpg)
## Lake Formation
- Data lake = central place to have all your data for analytics purposes
    - `Out-of-the-box data source blueprints`: S3, RDS, Relational & NoSQL DB…
    - `Fine-grained Access Control `for your applications (row and column-level)
![](https://imgur.com/eu06vHs.jpg)
- purpose of Data Lake:
    - `Centralized Permissions (manage access in one place)`
    ![](https://imgur.com/Z8pHqmL.jpg)

## Kinesis Data Analytics
- Kinesis Data Analytics `for SQL applicaitions`
    - Real-time `analytics` on `Kinesis Data Streams & Firehose` using `SQL`
    - Add `reference data from Amazon S3` to enrich streaming data
    - managed, auto scale, pay for consumption rate
    - input/ output: `Kinesis Data Streams & Firehose`
    - use case: Time-series analytics, Real-time dashboards/metrics..
![](https://imgur.com/khXcgYF.jpg)

- Kinesis Data Analytics `for Apache Flink`
    - Use Flink (Java, Scala or SQL) to process and analyze streaming data
        - Flink: more powerful than SQL, need provisioning compute resources
    - Flink does `not read from Firehose!`
    ![](https://imgur.com/TE99Mo4.jpg)

## Managed Streaming for Apache Kafka (MSK)
- `Kafka` is `Alternative to Amazon Kinesis (stream data)`
- Fully managed Apache `Kafka` on AWS
    - create, update, delete clusters in your VPC, multi-AZ
    - Data is stored on EBS volumes for `as long as you want`
    ![](https://imgur.com/GCLcmsH.jpg)
    ![](https://imgur.com/SFjjpLp.jpg)
- MSK Serverless
    - Run MSK without management, automatically provisions resources and scales
- MSK vs Kinesis 

|Kinesis|MSK|
|-|-|
|1MB message size|more than 1MB ability |
|limited retention|keep as long as you want|
|use Shards to stream|use Topics and Partitions|

# All MLs
### Rekognition
- CV: objects recognition, Facial, text...
- `Content Moderation`:
    - `Detect visual content that is inappropriate`, unwanted, or offensive (image and videos)
    - Set a `Minimum Confidence Threshold` for items that will be flagged, Flag sensitive content for `manual review` in `Amazon Augmented AI (A2I)`

### Transcribe
- speech to text
    - remove `Personally Identifiable Information (PII)` using `Redaction`
    - Automatic `Language Identification `for `multi-lingual` audio

### Polly
- text to speech 
- Polly `Lexicon`
    - Customize the `pronunciation` and  `aberration` with Pronunciation lexicons
    - use `SynthesizeSpeech` operation
- use documents marked up with `Speech Synthesis Markup Language (SSML)`  
    - emphasizing, pronunciation...

### Translate
- language translation

### Lex
- Alexa, Speech Recognition (ASR) + Natural Language Understanding
### Connect
- Receive calls, create contact flows, cloud-based `virtual contact center`
![](https://imgur.com/ONJyolJ.jpg)

### Comprehend
-  Natural Language Processing application
    - group articles, sentimental analysis...
    - Fully managed and serverless service
- `Comprehend Medical`
    - detects and returns useful `information` in `unstructured clinical text`
    - detects `Protected Health Information (PHI) – Detect PHI API`
### SageMaker
- ML models, data science
    - prediction, etc...
- not managed/serverless, more involved and low level, for experts...
### Forecast
- Fully managed service, forecasts model
![](https://imgur.com/lIiDLG4.jpg)

### Kendra
- `Natural language document search service` powered by ML 
    - `Natural language search , Extract answers` from within a document
    - Learn from user interactions/`feedback` to promote preferred results `(Incremental Learning)`

### Personalize
- Fully managed personalized recommendations
    - Same technology used by Amazon.com

### Textract
- extracts text, handwriting, and data from any scanned
documents using AI and ML


# All Database 
- choose the right database is a big part of questions
### RDS (略)
- Managed RDS, Use case: Store relational datasets 
### Aurora (略)
- Use case: same as RDS, but with less maintenance / more flexibility / more performance / more features

### ElastiCache (略)
- Managed Redis / Memcached
    - Use Case: Key/Value store, Frequent reads, less writes, cache results for DB queries, store session data for websites, cannot use SQL. 

###  DynamoDB (略)
- AWS technology, `serverless NoSQL database`, millisecond latency,
    - Use Case: Serverless applications development, document database, distributed serverless cache(DAX), global Table

### S3 (略)
- Use Cases: static files, big files, website hosting

### DocumentDB
- `AWS-implementation of DocumentDB `
    - store, query, and index JSON data
    - `Similar “deployment concepts” as Aurora`
    - highly availability 3 AZ, Auto Scales

### Neptune
- Fully managed graph database (eg. social network, knowledge graphs, fraud detection, recommendation)
    - optimized for these complex and hard queries
    - highly availability multi-AZ

### `Keyspaces` (for Apache Cassandra)
- `Apache Cassandra` is an open-source `NoSQL distributed database`
    - A managed `Apache Cassandra `(Cassandra Query Language (`CQL`))
    - Serverless, Scalable, highly available, fully managed by AWS
    - On-demand mode or provisioned mode
    - Use cases: store `IoT devices info`, `time-series` data, …
### Timestream
- fully managed, fast, scalable, serverless `time series database`
    - Built-in time series analytics functions 
    - Encryption in transit and at rest
- Use cases: IoT apps, operational applications, real-time analytics, …

### QLDB (Quantum Ledger Database)
- centralized ledger database(blockchain)
    - Fully Managed, Serverless, High available, Replication across 3 AZ
- `Immutable` system, Used to review `history of all the changes` made to your application data over time

### Amazon Managed Blockchain
- decentralized

# Integration & Messaging
- `multiple applications` in microservice system need to `talk to each other`
    -  `Synchronous` communications (app2app) is `dangerous`
        - eg. spikes of traffic
    - `Asynchronous` / Event based communications is `better choice(decouple)`
        - SQS: queue model
        - SNS: pub/sub model
        - Kinesis: real-time streaming model

![](https://imgur.com/45IyrgQ.jpg)
## SQS
- `Producers` send=> SQS Queue => `Poll` to `Consumers` 
    - SQS `cannot attach security group`
![](https://imgur.com/ptykYtb.jpg)
### SQS Standard
- Fully managed service
    - `capacity automatically scale` to demand, no provision
    - `unlimited number of messages` in queue
    - retention of messages: 4 days default - 14 days
    - Low latency
    - May have duplicate messages
    - not guarantee order 

### SQS Standard Producing & Consuming Pipeline
- the pipeline
    - `upstream application(producer)` produced messages to SQS using the `SDK (SendMessage API)`
        - Message Up to 256 kb
    - messages are `persisted in SQS` until a consumer precessed and deletes it
        - `retention`: default 4 days, up to 14 days
    - downstream application(Consumers) Poll SQS for messages (up to 10 messages at a time), then Process the messages
        - Consumers can poll messages `in parallel`
        - A message `may be deliveried multiple time` if process time is to long(`at least once delivery`)
        - Best-effort message ordering, `not guarantee order`
    - Consumer Delete the messages using the `DeleteMessage API`

### SQS FIFO 
- FIFO = First In First Out 
    - `(order is guaranteed)`
    - each message deliverd `Exactly-once`
    - `Limited throughput`: 300 msg/s without batching, 3000 msg/s with batching




### SQS - Security
- Encryption:
    -  `In-flight encryption` using `HTTPS API`
    -  `At-rest` encryption 
        - `SQS key(SSE-SQS)`: SQS created, managed
        - `KMS keys(SSE-KMS)`: managed by user in KMS
    -  `Client-side encryption` 
- Access Controls: 
    - `IAM policies` to regulate access to the `SQS API`
    - `SQS Access Policies` (similar to S3 bucket policies)
        - Useful for `cross-account access` to SQS queues
        - Useful for allowing `other services` (SNS, S3…) to write to an SQS queue
### SQS – Message Visibility Timeout
- `After` a message is `polled` by a consumer, it `becomes invisible to other consumers`
    - `By default`, the “message visibility timeout” is `30 seconds`
    - If a message is not processed within the visibility timeout, it will be `processed twice`
- `change Visibility Timeout`
    - call `ChangeMessageVisibility API` or change in the `Console`
    -  `high Timeout` (hours): if consumer crashes after a poll, the message need hours to be re-processing
    - `low Timeout(seconds)`: may get many duplicates if process time is long

### SQS - Long Polling
- When consumer poll from an `empty queue`, `Long Polling` allow consumer `“wait” for messages to arrive without make another poll request`
    - wait time 1 sec to `20 sec(preferred)`, `long poll is better` than short poll
    - `decreases the number of API` calls made to SQS, `reducing latency` of your application
- enabled at the console or API `WaitTimeSeconds`

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

## SNS
### Topic Publish
- Topic Publish: `publisher -> topic -> topic subscribers receive notification`
    - `event producer` sends message to one SNS `topic`
    - `event receivers (subscriptions)` can `subscribe to topic`, and `receive notifications` for new topic event
- wide selection of `AWS services as publisher/subscribers` + `SMS(Mobile), HTTPs endpoints, Emails...`
- limits
    - 100,000 topics limit
    - 12,500,000 subscriptions per topic

### Direct Publish (for mobile apps SDK)
- another type of publish:
    - Create a platform application 
    - Create a platform endpoint 
    - Publish to the platform endpoint 
    - Works with Google GCM, Apple APNS, Amazon ADM…

### SNS FIFO
- Similar FIFO features as SQS FIFO
    - `Ordering` by `Message Group ID` (all messages in the same group are ordered)
    - `Deduplication` using a `Deduplication ID` or Content Based Deduplication
- `Can only have SQS FIFO queues as subscribers`
    - `Limited throughput` because of SQS FIFO throughput limit

- `SNS FIFO + SQS FIFO fan out pattern`
    - usage: `ordered fan out + deduplication`
![](https://imgur.com/naUT7Ml.jpg)
### SNS – Security 
- same as SQS
- `SNS Access Policies`, just like SQS Access Policies

### SNS + SQS: Fan Out Patterns
- `single source, multiple SQS (fan out) for different downstream application`
    - Why SQS in the pattern:s data persistence, delayed processing and retries of work
    - Ability to expand SQS subscribers over time
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


## Kinesis
- collect, process, and analyze `streaming data` in real-time 
    - `streaming data`: Application logs, Metrics, Video, Website clickstreams, IoT...
- services:
    - Kinesis `Data Streams`: capture, process, and store `data streams`
    - Kinesis `Data Firehose`: `save data streams` to AWS `data stores`
    - Kinesis `Data Analytics`: `analyze` data streams with `SQL or Apache Flink`
    - Kinesis `Video Streams`: capture, process, and store `video streams`

|difference|Data Streams| Data Firehose|
|-|-|-|
|usage|Streaming data at scale|Load streaming data into storages/HTTP: `S3 / Redshift / OpenSearch` / 3rd party|
|Managed|User write custom code (producer /consumer)|Fully managed|
|real-time|Real-time (~200 ms)|Near real-time (60 sec minimal delay)|
|scaling|Manage scaling/Auto Scaling|Auto Scaling|
|Data storage|Data storage for 1 to 365 days|No data storage|
|replay|support|not support|

### Kinesis Data Streams
- The system
    - Data Streams Is made of `shards`, `shards need to be provisioned` 
        - data is stream through shards
        - shards define stream capacity
    - Streaming data is Records:
        - `Partition Key` define which `shard` to go. Data sharing the same partition goes to the same shard (ordering)

![](https://imgur.com/RVifRNp.jpg)

- Data Streams `features`
    - `Retention` between 1 day to 365 days
    - Ability to reprocess `(replay) data`
    - Once data is inserted in Kinesis, it can’t be deleted (immutability)

- Shard Capacity Options:
    - Provisioned mode
        - Provisioned number of shards
        - pay per shard per hour
        - scale manually or using API
        - `Each shard gets 1MB/s, or 1000 records/s IN, 2MB/s OUT`
    - On-demand mode
        - `auto scale capacity`, no provision
        - Pay per  data in/out per hour 
        - Default capacity (4 MB/s in or 4000 records per second)
        - then adjust based on observed throughput peak
        


- Procuder  
    - AWS SDK, 
    - `Kinesis Producer Library (KPL)`, - `Kinesis Agent`

- Consumer
    - `Kinesis Client Library (KCL)`,
    - AWS `Lambda`, 
    - Kinesis Data `Firehose`, 
    - `Kinesis Data Analytics`, 

- Security
    - Encryption
        - in flight using HTTPS endpoints
        - at rest using KMS/ client side
    - access
        - `IAM policies`: Control access / authorization  
        - `VPC Endpoints` available for Kinesis to access within VPC 
    - Monitor API calls using CloudTrail

![](https://imgur.com/mHQ9fK1.jpg)
### Kinesis Firehose

![](https://imgur.com/YPR63xK.jpg)

- Fully Managed, automatic scaling, serverless
    - Pay for data going through Firehose 
    - (many data formats, conversions, transformations, compression)
    - `Near Real Time` Service: 60 sec minimal
    - Can send failed or all data to a `backup S3 bucket`
    -  custom `data transformations` using AWS `Lambda`

- Procuder  
    - AWS SDK, 
    - `Kinesis Producer Library (KPL)`, - `Kinesis Agent`
    - `Kinesis Data Streams`
    - `CloudWatch logs`

- Consumer
    - `S3`
    - `Redshift (COPY through S3)` 
    - `Amazon OpenSearch`
    - HTTP Endpoint
    - 3rd-party Destination


## Amazon MQ
- `MQTT, AMQP, STOMP, Openwire, WSS`: SQS and SNS alternatives `protocal` outside AWS
- Amazon MQ  is a managed message broker service for: `RabbitMQ, ACTIVEMQ`
    - (`both SQS and SNS feature`)
    - Amazon MQ `doesn’t “scale” as much` as SQS / SNS
    - Amazon MQ runs `on servers`, can run in `Multi-AZ with failover`
- failover
![](https://imgur.com/5yQnSOF.jpg)
## misc
### Ordering data
- Ordering data: Kinesis
    - with `partition key`, Kinesis guarantee data `in order within shard` (`data always goes to one shard, and it goes in the shard in time order`)
- Ordering data: SQS FIFO
    - SQS don't guarantee order
    - with only `one consumer`, `SQS FIFO guarantee order`, but not when there are multiple consumers
    - SQS FIFO `guarantee order` with multiple consumers when `Group ID` (similar to Partition Key in Kinesis) is used 
- Kinesis vs SQS FIFO ordering

![](https://imgur.com/VN85CLL.jpg)


# Containers: ECS, ECR, EKS
- Docker vs VM:
    - Docker is `”sort of” a virtualization technology, but not exactly`
    - `EC2 instance is a Virtual Machine `
![](https://imgur.com/W9BPapa.jpg)

## ECS
### EC2/Fargate Launch type
- Each `running container` application is a `ECS Task`
- Tasks are created from `task definition`, which specify the image to run and Launch type, ALB...

- ECS - EC2 Launch Type
    - `must provision & maintain EC2instances`
    - Each EC2 Instance run `ECS Agent` to register in a `ECS Cluster`. 
    - `Run containers` as `ECS Tasks` on ECS Clusters 
    - use `ECS service` to control (managed) `starting / stopping containers`


- ECS – Fargate Launch Type
    - `no provision/management of infrastructure(Serverless)`
    - AWS run ECS Tasks based on the CPU / RAM you need, just `create a task with image` (`task definition`)
    - To `scale`, just `increase the number` of `tasks` (abstracted infrastructure)
    - `much easier to manange`

- IAM Roles for ECS:
    - each `task` can have its own `IAM role` to `access different AWS resource`
    - Task Role is defined in the `task definition`


### ECS + EFS
- `EFS` can be mount to `both EC2 and Fargate launch types`
    - `Fargate + EFS = Serverless`
    - Use cases: persistent multi-AZ shared storage for containers
![](https://imgur.com/qMW5Uu8.jpg)
### ECS Load Balancer Integration
- Able to `use ALB/NLB in front of ECS Tasks`, just like in front of EC2 instances
    - ALB: works for most use cases
    - NLB: 
        - `high throughput / high performance` use cases
        -  pair it with `AWS Private Link`
![](https://imgur.com/qQPpWnp.jpg)

### ECS Service `Auto Scaling`
- Fargate:
    - Automatically increase/decrease the desired `number of ECS tasks`
    - `ECS Auto Scaling` uses `AWS Application Auto Scaling(task level)` , it is different from EC2 Auto Scaling (user don't see the infrastructure)
        - scale on Average `CPU` Utilization
        - scale on Average `Memory` Utilization
        - scale on `Request from ALB`
    - scaling strategies:
        - `Target Tracking` – scale based on CloudWatch metric target value
        - `Step Scaling` - CloudWatch Alarm evnet triggered
        - `Scheduled Scaling`: time based
- EC2 launch type
    - `use AGS`:
        - eg, EC2 instance CPU utilization
    - or use `ECS Cluster Capacity Provider`
        - Used to `automatically scale the infrastructure` for your `ECS Tasks`
        - work with AGS, but higher level(user don't see ASG)
        - scale based on `capacity (CPU, RAM… etc)`
### ECS patterns
- Event Bridge Event triggered ECS tasks
![](https://imgur.com/idBwHfZ.jpg)

- Event Bridge Schedule triggered ECS tasks
![](https://imgur.com/39RD1MW.jpg)

- ECS + SQS Queue
    - similar to poll from EC2 instance, but it is ECS task 
![](https://imgur.com/4sAXLxL.jpg)

## ECR
- Store and manage Docker images on AWS
    - `Private` or `Public` (Amazon ECRPublic Gallery)
    -  backed by Amazon S3
    - `Access ECR image` through `ECS IAM role` (if permission errors => check policy)
    - misc:
        - image vulnerability scanning,
        - versioning, image tags
        - image lifecycle

## EKS
- launch `managed Kubernetes clusters` on AWS
    - Kubernetes is an `open-source` system for `automatic deployment, management`, scaling of `containerized` app
    - can be seen as `alternative system to ECS`
    - Kubernetes is `cloud-agnostic` (can be used in any cloud – Azure, GCP…)

- deployment options
    - For multiple regions, deploy one EKS cluster per region
    - supports `EC2` for deploying worker nodes in `EC2 instances as backbone`, or `Fargate` to deploy `serverless containers`


- integration:
    - Collect `logs and metrics` using `CloudWatch Container Insights`
- Use case: if your company is `already using Kubernetes on-premises or in another cloud`, and wants to `migrate to AWS` using Kubernetes

### EKS node types
- Managed Node Groups:
    - `managed Nodes` in `EC2 instances`
    - `nodes ASG managed by EKS`, `On-Demand` or `Spot Instances `support
- Self-Managed Nodes
    - node created by you, registered to EKS cluster, 
    - `nodes ASG managed by EKS`, `On-Demand` or `Spot Instances `support
- AWS Fargate
    - fully-managed
### EKS storage - Data Volumes 
- Need to specify `StorageClass` manifest on your EKS cluster
    - Leverages a `Container Storage Interface (CSI)` compliant `driver`
- Support: EBS, FSx(Lustre, NetApp), EFS(Fargate only work with EFS)

## AWS App Runner
- rapid deploy code or container image at scale without worry about infrastructure
    - Fully managed service, No infrastructure experience required
    - pipe
        - specify source code or container image
        - Automatically builds and deploy
        - Automatic scaling, highly availablility, load balancer, encryption, VPC access, AWS service integration... etc
        ![](https://imgur.com/0Zzc4bW.jpg)

- Use cases: web apps, APIs, microservices, `rapid production deployments`


# Serverless 
> The SA exam is pretty `lightweight on the details on Serverless` services

- Serverless means you don’t manage / provision / see the resources
    - FaaS (Function as a Service, anything as a service)
- AWS serverless services
    - AWS Lambda 
    - DynamoDB 
    - AWS Cognito 
    - AWS API Gateway 
    - Amazon S3 
    - AWS SNS & SQS 
    - AWS Kinesis Data Firehose 
    - Aurora Serverless 
    - Step Functions 
    - Fargate

## Lambda
- features
    - Pay per `request(calls)`/ `compute time per compute resource (duration)`
        - It is usually very cheap to run AWS Lambda 
    - auto scaling resource to meet load
    - Integrated with whole AWS suite
    - wide `lanaguage support`(略),  `Container` Image must implement the `Lambda Runtime API`


- Lambda Limits
    - execution:
        - REM:128MB to `10GB`(other resources (vCPUs) scale on REM)
        - Disk capacity 512MB to `10GB`
        - Environment variables (4 KB)
        - `Maximum execution time: (15 minutes)`
        - Concurrency executions: `1000` (quota)
    - deployment:
        - deployment size (compressed .zip): 50 MB, (uncompressed, code + dependencies)250 MB
        - Size of environment variables: 4 KB

### Lambda at CloudFront Edge
- `Edge function`: Many modern applications execute some `logic at the edge`(attach to `CloudFront distributions`), Runs close to your users to `minimize latency`
    - eg: customize the CDN content, Website Security and Privacy, Dynamic Web Application at the Edge, Bot Mitigation at the Edge, User Tracking and Analytics...
- CloudFront provide two solutions: `CloudFront Functions` & `Lambda@Edge`
    - CloudFront Functions, Native, large scale, limit capability
    - Lambda@Edge, integrated, small scale, more capability
![](https://imgur.com/aEHaz5b.jpg)

||CloudFront Functions|Lambda@Edge|
|-|-|-|
|language|JS|JS or Python|
|# of Requests|Sub-ms startup times, Millions per sec|Thousands per sec|
|support modification|Viewer Req/Res|Viewer or Origin Req/Res|
|Native|Native feature of CloudFront|CloudFront + Lambda Integration, deploy functions in one  Region, then CloudFront replicates to its locations|
|Max. Memory|2MB|128MB-10GB|
|Exec time limit|< 1 ms|5 – 10 seconds|
|typical usage|Cache key normalization; Header manipulation; URL rewrites or redirects, Request authentication & authorization(JWT, etc)|code depends on a 3rd
libraries; Memory/Computation requirement; require Network access to use external
services;  Require access to the
body of HTTP requests|

### Lambda launched in VPC
- `By default`, Lambda function is `launched in an AWS-owned VPC`. , it `cannot access resources in your VPC`
- Alternatively, Lambda can be launched in you VPC
    - `define the VPC ID, the Subnets and the Security Groups`
    - Lambda will `create an ENI` to use the VPC
    ![](https://imgur.com/abwgxJc.jpg)

### RDS/Aurora + Lambda integration   
- `RDS Proxy`
    -  `RDS Proxy` requires Lambda to be launched in you VPC, because RDS Proxy is never publicly accessible
    ![](https://imgur.com/M13WI9v.jpg)

- `RDS/Aurora data CURD invoked Lambda` function
    - it is possible to your invoked Lambda by RDB/Aurora instance to `process data`
        - RDS (PostgreSQL) and Aurora (MySQL)
        - must setup outside the console
        -` DB instance must have required permissions to invoke`(Lambda Resource-based Policy & IAM Policy) and `Lambda must allow traffic from DB instance` (Public, NAT GW, VPC Endpoints)
        - usage: Allows you to process data when data CURD events happens
        ![](https://imgur.com/Dn8qiuA.jpg)
- `RDS Event Notifications` invoked Lambda
    - RDS Event Notifications `don't have access to the data`, it is `about the DB instance itself` (created, stopped, start, …)
        - DB instance, DB snapshot, DB Parameter Group, DB Security Group, RDS Proxy, Custom Engine Version...
        - setup in the console (SNS, SQS, EventBridge...)
        ![](https://imgur.com/wiiva9h.jpg)

## DynamoDB
- `NoSQL` database fully managed: 
    - `multiple AZs`
    - auto scale
    - high-performance
    - IAM control
    - `Standard & Infrequent Access (IA) Table` Class
- DynamoDB data structure
    - `schemaless`
    - `Tables` contains `items`
    - Itam access by `Primary Key`, has `attributes`
    - `Maximum size` of an item is `400KB`
    - Data types support: Scalar, Document(containers), Set
    ![](https://imgur.com/W0slf8F.jpg)

- DynamoDB Capacity Modes
    - `Provisioned` Mode (default)
        - specify the `reads/writes per second`, `Pay for Read/Write Capacity Unit(RCU/WCU)`
        - `RCU and WCU are decoupled`
        - Possibility to add auto-scaling to RCU/WCU
        - `known work load, save money`
    - `On-Demand` Mode
        - Read/writes automatically scale with workload
        - Pay for what you use, `more expensive` ($$$)
        - `unpredictable` workloads, steep sudden `spikes`

### DynamoDB Accelerator (`DAX`)
- `in-memory cache` for DynamoDB
    - increase `read performance`
    - `ms latency` for cached data
    - `No API/code change need`
    - `5 minutes TTL` in cache (default)
- DAX vs. ElastiCache
    ![](https://imgur.com/zByeiy0.jpg)

### DynamoDB – Stream Processing
- Ordered stream process: `item-level modifications - create/update/delete`
    - Use cases:
        - React to changes in real-time (welcome email to users)
        - Real-time usage analytics...

- Alternative: Kinesis
    - DynamoDB Stream Processing vs Kinesis
    ![](https://imgur.com/IQd6Fx6.jpg)

|Stream Processing|Kinesis|
|-|-|
|24 hours retention|1 year retention|
|Limited # of consumers|High # of consumers|
Process using AWS Lambda Triggers, or DynamoDB Stream Kinesis adapter|Process using AWS Lambda, Kinesis Data Analytics, Kineis Data Firehose, AWS Glue Streaming ETL… |

### DynamoDB Global Tables 
- A table replicated to `multiple regions`
    - accessible table with low latency in multiple-regions
    - `Active-Active` replication (two-way replication)
    - (`READ/WREITE in any place`)
    -` Must enable DynamoDB Streams` as a pre-requisite

### DynamoDB data TTL
- Allow automatically delete items after TTL
    - Use cases: 
        - reduce stored data by keeping only current items, 
        - adhere to regulatory obligations
        - `web session`
    ![](https://imgur.com/aNfjqvY.jpg)

### DynamoDB Backups
- `Continuous` backups using `point-in-time recovery (PITR)` - optional
    - recovery to any time(point-in-time) within the 35 days backup window
 

- `On-demand` backups
    - Full backups for long-term retention 
    - Doesn’t affect performance or latency
    - configured and managed in AWS Backup (enables cross-region copy)
### DynamoDB Integration with `S3`
- `Import` from S3
    -  `Creates a new table` from file format: `CSV, DynamoDB JSON` or ION format...
    - Import errors are logged in CloudWatch Logs
- `Export` to S3 (must enable `PITR`). 
    - export any point in time in last `35 days`(PITR)
    - Export in DynamoDB `JSON` or ION format
    - `Doesn’t affect the read capacity` of your table
    - usage: data analysis, ETL, Retain snapshots for auditing...

## AWS API Gateway
- AWS API Gateway
    - an example: let `client use an Lambda` function `without IAM role/load balancer... configuration`
- features(略)
    - Support for the `WebSocket Protocol (real-time, eg dashboard)`
    - Handle API versioning (v1, v2…) 
    - Handle different environments (dev, test, prod…) 
    - Handle security (Authentication and Authorization) 
    - Create API keys, handle request throttling 
    - Swagger / Open API import to quickly define APIs 
    - Transform and validate requests and responses 
    - Generate SDK and API specifications 
    - `Cache API responses`
- Common usage
    - expose `Lambda Function`
        - expose REST API to invoke Lambda fucntion
    - `HTTP endpoint`
        - Add `rate limiting`, caching, `user authentications`, `API keys`, etc
        - Example: internal HTTP API on premise, Application Load Balancer, EC2 instance…
    - expose `any AWS Services(API)`
        - Add `authentication`, deploy publicly, `rate limiting`... 
        - Example: start an AWS Step Function workflow, post a message to SQS
        - Example: expose an Kinesis Data Streams
        ![](https://imgur.com/G3kGNvy.jpg)

### API Gateway - Endpoint Types
- `Edge-Optimized` (default): 
    - `For global clients`, Requests are `routed through the CloudFront Edge` locations
    - `API Gateway` service itself is still `regional`
- `Regional`
    - For `clients within the same region`
    - manually combine with CloudFront(give more control)
- `Private`
    - Can only be accessed from your `VPC`
    - Use a `resource policy` to define access

### API Gateway – Security
- Auth
    - `IAM Roles`: useful for internal applications
    - `Cognito`: identity for external users(client, `eg. mobile`)
    - Custom Authorizer (your own logic in `Lambda`)
- Custom Domain Name `HTTPS` through `AWS Certificate Manager (ACM)`
    - for `Edge-Optimized endpoint`, certificate must be in `us-east-1`
    - for `Regional endpoint`, certificate should be in the same region
    - Must setup `CNAME or alias record in Route 53`

## AWS Step Functions
- Build `serverless` `visual workflow` to
`orchestrate your Lambda functions`
    - workflow: sequence, parallel, conditions, timeouts, error handling, `Human Approval`…
    - integrate:  EC2, ECS, On-premises, API Gateway, SQS queues, etc
    ![](https://imgur.com/AKYN24H.jpg)

## Amazon Cognito
- `Give users an identity` to interact with our web or mobile application

- When Choose Cognito over IAM:     
    - `hundreds of users`, `mobile users`, 
    - `SAML authenticate`

### Cognito User Pools
- `Sign use in app`
    - `Create a serverless database of user` for your web & mobile apps ( `Username+password`)
    - Password reset, Email & Phone Number Verification, Multi-factor authentication (MFA), Oauth...
    - integration: `API Gateway & ALB integration`
    ![](https://imgur.com/LgXdyDy.jpg)

### Cognito Identity Pools (old name: Federated Identities)
- Provide `AWS credentials to users` so they have `temporary identities(STS)` to `directly access AWS resources`
    - Users can then access AWS services `directly`, or through API Gateway
    - able to `create Default IAM roles` for authenticated and guest users
    - Users source can be `Cognito User Pools`, or `3rd party login`...
- Cognito Identity Pools enable `Row Level Security` to access `DynamoDB`
    - eg, user can only read the `rows` where `the identity field` match `you identity `

# Monitoring 
## CloudWatch Metric
- monitor `metrics`
    - metrics belong to `namespaces`, used for `filtering/categorizing metrics`
    - Metrics have `timestamps`
    - `Dimension`: any `attribute of a metric` (instance id, environment, etc…).  `Up to 30 dimensions per metric`
    - Can create CloudWatch `Custom Metrics`
### Metric Streams
- `stream metrics` to a `destination`
    - `near-real-time delivery`
    - use `Kinesis Data Firehose `
    - Option to `filter metrics by namespaces` for steaming only a subset
    ![](https://imgur.com/ejaArAX.jpg)

## CloudWatch Logs
- log source
    - SDK, CloudWatch Logs Agent, CloudWatch Unified Agent 
    - Elastic Beanstalk: from application 
    - ECS: from containers 
    - AWS Lambda: from function logs 
    - VPC Flow Logs: VPC specific logs 
    - API Gateway 
    - CloudTrail 
    - Route53: Log DNS queries
- log destination
    - Amazon S3 (exports)
    - Kinesis Data Streams
    - Kinesis Data Firehose
    - AWS Lambda
    - OpenSearch
- logs components
    - `Log groups`:` name a set of logs `(eg, from an application)
    - `Log stream`: `subsets`, eg instances in the application 
    - log `expiration policies` (never expire, 30 days, etc..)
### Logs `Metric Filter & Insights`: filter/serach
- `Metric filter` expressions: 
    - (eg, find IP inside log, find ERRORs...)
    - Metric filters can be used to `trigger CloudWatch alarms`
- `Logs Insights:`
    - `query logs` and add queries to CloudWatch Dashboards

### Logs S3 Export
- Log data can take `up to 12 hours` to
become `available for export`
    - `not real-time`, for real-time/ near-real-time, use `Logs Subscriptions`
- use `CreateExportTask API`
![](https://imgur.com/undefined.jpg)

### Logs Subscriptions Export Pattern
- `real-time/ near-real-time` log export
    - use `Subscription Filter`
    - destination: `Lambda, Kinesis Data Firehose, Kinesis Data Streams`
![](https://imgur.com/ZWL97gg.jpg)

### Logs Aggregation Export (Multi-Account & Multi Region)
- use `Subscription Filter`
![](https://imgur.com/ryERWPY.jpg)

### CloudWatch Unified Agent
-  run a `CloudWatch agent on EC2` to `push` the log to `CloudWatch`
    - Make sure `IAM permissions` are correct
    - CloudWatch log agent can be setup on-premises too
- CloudWatch `Logs Agent`
    - `Old version` of the agent, 
    - only collect `logs`

- CloudWatch `Unified Agent`
    - collect `logs` and `additional system-level metrics` 
        - metrics: CPU, RAM, Disk, Net, Processes, Swap Space

## CloudWatch Alarms
- trigger notifications
    - alarm `source`: 
        - `metric`, 
        - `function` of metric
        - `CloudWatch Logs Metrics Filters` (eg. too many 'ERROR' words)
        - `Composite Alarms`: AND and OR conditions
    - Alarm States: OK, INSUFFICIENT_DATA, ALARM
    - alarm `target`:         
        - `EC2` Instance Actions(Stop, Terminate, Reboot, Instance Recovery...)
            - `EC2 Instance Recovery`: Same Private, Public, Elastic IP,
        - `ASG` Action (scale-in/out)
        - `SNS notification(which can be combine and trigger anything)`
- `To test alarms` set the alarm state `to ALARM using CLI`
> aws cloudwatch set-alarm-state --alarm-name "myalarm" --state-value
ALARM --state-reason "testing purposes"

## CloudWatch Insights
### CloudWatch Container Insights
- Collect `metrics and logs from containers`
    - support: ECS, Fargate, EKS, Kubernetes on EC2
    - under the hood: for EKS and Kubernete, using a `containerized version of the CloudWatch Agent` to discover containers
### CloudWatch Lambda Insights
- Monitoring and troubleshooting for `serverless applications running on AWS Lambda`
    - `system metrics`: CPU time, memory, disk, and network
    - `diagnostic information` such as cold starts and Lambda worker shutdowns
### CloudWatch Contributor Insights
- `Analyze log` data and `create time series` that `display contributor data`
    - `See the top-N contributors to a metric  `
    - helps you `find who is impacting system performance`
    - Works for any AWS-generated logs (VPC, DNS, etc..)
    ![](https://imgur.com/oxcfuK9.jpg)
### CloudWatch Application Insights
- Provides automated `dashboards` that `alert potential problems(troubleshoot)` to your `applications and related AWS services`
    - Findings and alerts are sent to Amazon EventBridge and SSM OpsCenter


## EventBridge
- Example usage:
    - Schedule Cron jobs
    - react to event
        - IAM user/root sign-in

![](https://imgur.com/8j5U0BO.jpg)
- Event Bus
    - AWS service event is `Default Event Bus`
    - allow event from not just AWS services, but also from `3rd party app`(`Partner Event Bus`)/ `custom app (Custom Event Bus)`
    - You can `archive events` (all/filter) sent to an event bus for a period
    - Ability to `replay archived events`
- Schema Registry
    - `events are in JSON format`
    - EventBridge can infer these `JSON's schema`, and create `Schema Registry` allowing you to generate schema code for your application
    - Schema can be `versioned`
- `Resource-based Policy`
    - Manage `permissions` for a specific `Event Bus`
    - Example: allow/deny events from `another AWS account or AWS region`
    - Use case: `aggregate all events from your AWS Organization`


## CloudTrail
- audit your AWS Account: `log the history of events / API calls` made `within your AWS Account`
    - enabled by default
    - logs goes to `CloudWatch Logs` or `S3`
    - A trail can be applied to `All Regions (default)` or `a single Region`.
![](https://imgur.com/AMtXgt2.jpg)
- CloudTrail Events
    - Management Events:
        - by `default on`
        - Operations that are `performed on resources` in your AWS account (`Read/Write Events` can be separate)
        - eg: IAM security, VPC
    - Data Events:
        - By `default off (due to high volumn)`
        - eg:  S3 object-level activity, Lambda Invoke
    - CloudTrail Insights Events
        - `CloudTrail Insights` `detect unusual activity` in your account
            -  analyzes normal management events to create a `baseline`
            - `continuously analyzes` `WRITE` events to detect unusual patterns
        - eg: inaccurate provision, Burst of actions, quotas, maintainance gaps..
        - integration
        ![](https://imgur.com/lGV6H3J.jpg)
- CloudTrail Events Retention
    - Events are `stored for 90 days` in CloudTrail
    - `export to S3/Athena` for longer period
- Intercept API Calls (CloudTrail + EventBridge)
![](https://imgur.com/uH6tPnS.jpg)
## AWS Config
- record `resources` `configurations changes`, and `alert compliance rules`
    1. (compliance)  `rules` are set, if `config change trigger some rules`, you will be notified/event triggered... Config Rules `does not prevent actions` from happening (no deny)
        - eg: Is there unrestricted SSH access to my security groups? Do my buckets have any public access? ...
    2. (history)
        - View `configuration of a resource over time`
    - can filter resource by type/tag, etc
    - A `Regional service`, can be aggregated `across regions and accounts`
    - `SNS` notifications alerts
    - `-> S3 -> Athena` pattern
- Config Rules
    - `AWS managed config rules` (over 75)
    - `custom config rules` (defined in  Lambda)
    - Rules can be triggered:
        - For each config change
        - at regular time interval
### Remediations & Notifications
- Remediations 
    - You can setup `automate remediation` of non-compliant resources using `SSM Automation Documents`
    - can setup `Remediation Retries` (retry) if first attemp is not successful
    ![](https://imgur.com/OZgZmpc.jpg)
- notification
    - can `trigger SNS/SQS notifications` when `resources are noncompliant`
    ![](https://imgur.com/opYVXhf.jpg)

# Access Control
- chain of Access Control
![](https://imgur.com/Q8eCPYb.jpg)
## Organization
- `Global service`, `manage multiple AWS accounts `
    - `management account`, the `top` account. Other accounts are `member accounts `
    - `aggregated usage, consolidated Billing`. 
    - `Shared reserved instances and Savings Plans discounts`
    - integrations:
        - Enable `CloudTrail` on all accounts
        - Use tagging standards for billing purposes
        - Send `CloudWatch Logs` to `central logging account`
        - `Cross account IAM Roles`
- Organizational Unit (OU) + Service Control Policies (SCP)
    - Organizational Unit (OU): abstracted unit within an Organization, can be an `account`, or `nested OU`
    - Service Control Policies (SCP): `IAM policies` applied to `OU or Accounts`
        - Default is deny, must have an explicit allow
        - apply to OU or Account, `tree-like hierarchy/inheritance`
## IAM SAA level
- IAM policy options
    - IAM Condition:
        - `aws:SourceIp` - restrict the client IP from
        - `aws:RequestedRegion` - restrict the access to services in certain AWS region 
        - `ec2:ResourceTag` - restrict based on tags
        - `aws:MultiFactorAuthPresent` - force MFA
        - `aws:PrincipalOrgID `-  restrict access by AWS Organization (affect member of orgainzation)
    - conflicted Deny and Allow ?
        - an explict `Deny` will negate all `Allow` statement
        - Also, resource `cannot be accessed by default` without ` explict Allow`
###  Choose between `IAM Roles` and `Resource Based Policies`
- A resource (eg, S3, SNS, SQS) can be accessed either through a `IAM Role` (attach to user), or `Resource Based Policies`(attach to S3) that explicitly allow a user
- When you `assume a role`, you have the permission granted by the role, but `need to give up your original permissions` through `Resource Based Policies`  --  `role` is higher than `Resource Based Policies`

- AWS services
    - `Support Resource-based policy`: Lambda, SNS, SQS, CloudWatch Logs, API
    Gateway…
    - `Support IAM role`: Kinesis stream, ECS tasks...

### IAM Permission Boundaries
- specify `the boundry of permission` a `user/IAM role` can get  (not incl groups)
    - even if `other IAM policy` is attached to the user, if permission is outside the boundary, it will be `invaildated` (even admin permission policy)
    - `make sure user cannot escalate their permission`
    - Useful to `restrict one specific user` (instead of a whole account using Organizations & SCP)
![](https://imgur.com/OPXtVau.jpg)

## IAM Identity Center
- One login (single sign-on) for all your
    -  AWS accounts in AWS Organizations
    - Identity providers
        - `Built-in` identity store in `IAM Identity Center`
        - `3rd party: Active Directory (AD)`, OneLogin, Okta…
- Permission Set:
    - provide `user/groups` in `IAM Identity Center` access to Account/OUs
![](https://imgur.com/XKvO4PS.jpg)
- Fine-grained Permissions in IAM Identity Center
    - `Multi-Account Permissions`
        - Manage access across AWS accounts in your AWS Organization
    - `Application Assignments`
        - SSO access to many SAML 2.0 business applications
    - `Attribute-Based Access Control (ABAC)`
        - Fine-grained permissions based on users’ attributes stored in IAM Identity Center Identity Store
        - Use case: Define permissions once, then modify AWS access by `changing the attributes (eg, Junior senior...)`

        
## AWS Directory Services
- Microsoft Active Directory (AD)
    - `Database` of objects: UserAccounts, Computers, Printers, File Shares, Security Groups
    - `For Centralized security/permissions management`
- AWS Directory Services 
    - AWS Managed Microsoft AD
        - Create your `Managed AD in AWS`, `user` sit in `both on-premise and AWS AD`. support MFA
        - Establish `“trust” connections` between `AWS AD` and `On-premise AD`
        ![](https://imgur.com/RwlR7pf.jpg)
    - AD Connector
        - Directory Gateway (`proxy`) to connect AWS Directory Services and on-premise
        - use case: managed on-premises AD from AWS, `user` sit only in `on-premise`, support MFA
        ![](https://imgur.com/NW5sRWM.jpg)
    - Simple AD
        - AD-compatible managed directory on AWS
        - don't have a on-premise AD component
- integrate `Identity Center` and `Active Directory`
    - Connect to an `AWS Managed Microsoft AD` : Integration is `out of the box`
    ![](https://imgur.com/2gCnkTO.jpg)
    - Connect to a Self-Managed Directory
        - use `AWS Managed Microsoft AD` to create Two-way Trust Relationship
        - OR use `AD Connector`
    ![](https://imgur.com/tfdHGEU.jpg)
## AWS Control Tower
- Easy way to `set up and govern a secure and compliant multi-account AWS environment` based on best practices
    -` set up of your multi-account `environment in a few clicks
    - ongoing policy management using `guardrails` , `detect policy violations and remediate them, Monitor compliance`
    
### Guardrails
- `ongoing governance management` for `AWS Accounts` within Control Tower environment
    - actually a wrapper to other service(..
    - Preventive Guardrail 
        - prevent accoutn from doing sth
        - `using SCPs`
    - Detective Guardrail 
        - detect non compliance: (e.g., identify untagged resources)
        - `using AWS Config`
# Encryption & Security
## AWS KMS (Key Management Service)
- pay for API call to KMS ($0.03 /10000 calls)
### KMS Keys Types
- Technologies
    - Symmetric (AES-256 keys)
        - `Single encryption key` that is used to `both Encrypt and Decrypt`
        - `KMS Symmetric Key are encrypted` (must call `KMS API` to use)
        - • AWS services that are integrated with KMS use Symmetric CMKs
    - Asymmetric (RSA & ECC key pairs)
        - `Public (Encrypt)` + `Private Key (Decrypt)`
        - Use case: encryption outside of AWS by users who can’t call the KMS API
- Ownership
    - AWS Owned Keys (free): SSE-S3, SSE-SQS, SSE-DDB (default key)
    - AWS Managed Key: free (aws/service-name, example: aws/rds or aws/ebs)
    - Customer managed keys created in KMS: $1 / month
    - Customer managed keys imported (must be symmetric key): $1 / month 
### Key rotation
- `AWS-managed` KMS Key: automatic every 1 year
- `Customer-managed` KMS Key: `(must be enabled)` automatic every `1 year`
- `Imported KMS Key`: `only manual rotation`, possible using alias
### KMS Key Policies
- `Control access to KMS keys`, “similar” to S3 bucket policies (resourse based policy)
    - `Default` without KMS Key Policies, no one can access these keys (`deny all by default`)
    - Custom KMS Key Policy:
        - Define users, roles that can access the KMS key
        - Useful for cross-account access of your KMS key
### KMS Multi-Region 
- replicate your `primary key` to other regions
    - `Identical KMS keys` in different AWS `Regions` that can be used interchangeably
    - eg: Encrypt in one Region and decrypt in other Regions, No need to re-encrypt or making cross-Region API calls
    - use case: `DynamoDB Global Table, Aurora Global Table`... `protect specific fields`
        - We can encrypt specific attributes client-side in our DynamoDB table using the Amazon `DynamoDB Encryption Client`
        - We can encrypt specific attributes client-side in our Aurora table using the `AWS Encryption SDK`
    - Each Multi-Region key is `managed independently`
### Application1: copying Encrypted EBS volumn to another Region
1. EBS Volume Encrypted With KMS Key A
2. Create EBS Snapshot from EBS Volume, will also Encrypted With KMS Key A
3. Copy Snapshot to other region, Must use KMS ReEncrypt to encrypt the snapshot with KMS Key B
4. restore EBS volumn in other region with with KMS Key B
### Application2: copying Encrypted EBS volumn across accounts
1. Create a Snapshot, encrypted with
your own KMS Key (Customer
Managed Key)
2. Attach a KMS Key Policy to
authorize cross-account access
3. Share the encrypted snapshot
4. (in target) Create a copy of the
Snapshot, encrypt it with a CMK in
your account
5. Create a volume from the snapshot
### Application3: S3 Replication Encryption
- replicate objects from bucket A to bucket B
    - `Unencrypted objects` and objects encrypted with `SSE-S3` are replicated by default
    - Objects encrypted with `SSE-C` (customer provided key) are never replicated
    - For objects encrypted with `SSE-KMS`, you need to enable many options to replicate
- You can use multi-region AWS KMS Keys, but they are currently treated as
independent keys by Amazon S3 (the object will still be decrypted and then
encrypted)

### Application4: Encrypted AMI Sharing Process 
- AMI `in Source Account` is encrypted with `KMS Key`, want to launch Instance with AMI in `target account `
    - Must modify the image attribute to add a `Launch Permission` in target AWS account
    - `share the KMS Keys` used to encrypted the AMI snapshot to target account
    - target account must have the permissions to DescribeKey, ReEncrypted, CreateGrant, Decrypt APIs
    - target account can now launching an EC2 instance from the AMI, maybe specify a new KMS key in its own account to re-encrypt

## SSM Parameter Store
- Secure storage for `configuration` and `secrets`
    - integration
        - Optional Encryption using KMS
        - Security through IAM
        - Notifications with Amazon EventBridge
        - Integration with CloudFormation
    - Versioning
    - Parameter Store Hierarchy - tree directory (eg, /aws/reference/secretsmanager/secret_ID_in_Secrets_Manager)
    - Standard and advanced tier 
        - size of parameters
        - Parameter policies availability
    ![](https://imgur.com/UhFW2BI.jpg)

- Parameters Policies (for advanced parameters)
    - Allow to assign a TTL to a parameter -> force update/deletion
    - Can assign multiple policies at a time

## AWS Secrets Manager
- Newer service, storing secrets
    - scheduled rotation of secrets
    - integration:
        - RDS, documentDB, redshift (Mostly meant for RDS integration)
        - KMS
    - Multi-Region Secrets
        - Replicate Secrets (read replicate) across multiple AWS Regions
        - Ability to promote a read replica Secret to a standalone Secret
        - Use cases: multi-region apps, disaster recovery strategies, multi-region DB

## AWS Certificate Manager (ACM)
-  provision, manage, and deploy `TLS Certificates (HTTPs)`
    - Supports both public and private TLS certificates
    - Free of charge for public TLS certificates
    - Automatic TLS certificate renewal
    - integration:
        - ELB
        - CloudFront
        - API Gateway
        - • Cannot use ACM with EC2!
![](https://imgur.com/NWGpXSJ.jpg)

### Requesting Public Certificates
1. List domain names to be included in the certificate
2. Select Validation Method: `DNS Validation` or `Email validation`
3. It will take a few hours to get verified
4. The Public Certificate will be enrolled for automatic renewal
    - ACM automatically renews ACM-generated certificates 60 days before expiry

### ACM Certificates renewal
- imported Certificates must be manually renew
- able to alert Certificates expiration 
    - option1 : `ACM` sends daily expiration events (`EventBridge`) starting x days prior to expiration
    - option1 : `AWS Config` has a managed rulenamed acm-certificate-expiration-check to check for expiring certificates => triggers `EventBridge`
![](https://imgur.com/XvvFQ4U.jpg)

### Integration
- ALB
![](https://imgur.com/9oX82xa.jpg)
- API Gateway
    - to integrate ACM, must Create `Custom Domain Name` in API Gateway
    - API Gateway Endpoint Types
        - Edge-Optimized (default): For global clients, The API Gateway still lives in only one region
            - `The TLS Certificate must be in the same region as CloudFront, in us-east-1`
        - Regional: For clients within the same region
            - `The TLS Certificate must be imported on API Gateway, in the same region as the API Stage`
        - Private: Can only be accessed from your VPC using an interface VPC endpoint (ENI)
            - not appliable to ACM


## WAF - Web `Application` Firewall
- protect wen application in `Layer 7 (HTTP)`
    - integrations
        - ALB
        - API Gateway
        - CloudFront
        - AppSync GraphQL API
        - Cognito User Pool
    - Define `Web ACL (Web Access Control List) Rules`:
        - `IP` Set Rules: up to 10,000 IP addresses
        - HTTP `headers`, HTTP `body`, or `URI strings`: protect `SQL injection` and `Cross-Site Scripting (XSS)`
        - `geo-match (block countries)`
        - Rate-based rules (count occurrences of events) – for `DDoS protection`
    - A `rule group` is a `reusable set of rules that you can add to a web ACL`
    - `Web ACL` can be `attached` to resources
- WAF + `ALB`, with `fix IP` solution
    - We can use `Global Accelerator` for fixed IP 
![](https://imgur.com/JYhcCnC.jpg)

## AWS Shield - DDoS attack
- protect DDoS attack: many distributed requests at the same time
- AWS Shield Standard:
    - `Free service for every AWS customer`
    - protect `SYN/UDP Floods`, Reflection attacks and other `layer 3/layer 4 attacks`
- AWS Shield Advanced:
    - Protect against more sophisticated attack on Amazon EC2, Elastic Load Balancing (ELB), Amazon CloudFront, AWS Global Accelerator, and Route 53
    - 24/7 access to AWS `DDoS response team (DRP)`
    - automatically create WAF rules

## Firewall Manager
- Manage `security rules` in `all accounts of an AWS Organization`
    - WAF rules 
    - AWS Shield Advanced 
    - Security Groups 
    - AWS Network Firewall (VPC Level)
    - Amazon Route 53 Resolver DNS Firewall
    - Policies are created at the region level
- Rules are applied automatically to new resources across future accounts in your Organization
- usage: `cross-accounts` rule managements

## GuardDuty
- `ML` `Threat discovery` (through `analysising logs`)
    - inputs
        - `CloudTrail Events Logs` – unusual API calls, unauthorized deployments
        - `CloudTrail Management Events` – create VPC subnet, create trail, …
        - `CloudTrail S3 Data Events` – get object, list objects, delete object, …
        - `VPC Flow Logs` – unusual internal traffic, unusual IP address
        - `DNS Logs `– compromised EC2 instances sending encoded data within DNS queries
        - `Kubernetes Audit Logs` – suspicious activities and potential EKS cluster compromises
    - output: EventBridge rules, EventBridge rules + SNS/Lambda
- Can protect against `CryptoCurrency attacks` (has a dedicated “finding” for it)

## Inspector
- Instance/ application level risk check
    - `EC2 instances`
        - use System Manager (`SSM`) `agent`
        - `OS vulnerabilitie`, unintended network accessibility
    - Container `Images` push to `ECR`
        - Assessment when images are pushed
    - `Lambda Functions`
        - find software vulnerabilities in function code and package dependencies
- A risk score is associated with all vulnerabilities for prioritization
- output: `Security Hub`, `EventBridge`

## Macie
- ML discover sensitive data in AWS.
    - such as `personally identifiable information (PII)`
![](https://imgur.com/dqc1NWr.jpg)

## DDoS Resilient Archetectures
- Edge Location Mitigation
    - edge location have the `default DDoS protection`: `Infrastructure layer defense` (BP1, BP3, BP6)
        - CloudFront
        - Global Accelerator
        - Route 53
- DDoS mitigation
    - EC2 with `Auto Scaling`, `ELB`: `(BP7, BP6)`
        - Allocate more resource to accommodate users if the traffic do reach the EC2 instance.
- Application Layer Defense 
    - `WAF` detect and filter malicious web requests  (BP1, BP2)
    - `Shield Advanced` (BP1, BP2, BP6)
- Attack surface reduction
    - Hide AWS resources from attacker: 
        - CloudFront, API Gateway, ELB
    - Security groups and Network ACLs
        - filter traffic based on specific IP at the subnet or ENI-level
    - Protecting API endpoints (BP4)
        - API Gateway, WAF + API Gateway
# VPC

- CIDR
    - define an IP address range
    - CIDR =  Base IP + Subnet Mask
        - Subnet Mask: Defines how many bits can change in the IP
    - rules: 
        -  /32 => allows for 1 IP (2^0)
        -  /31 => allows for 2 IP (2^1)
        - ...
        -  /16 => allows for 2 IP 65,536 (2^16)
        
- VPC = Virtual Private Cloud
    - max. 5 VPC per region, can increase the limit 
    - Max. `CIDR per VPC is 5`, for each CIDR:
        - Min. size is /`28` `(16 IP addresses)`
        - Max. size is /`16` `(65536 IP addresses)`
- `Your VPC CIDR` should `NOT` overlap with `your other networks` (e.g., corporate), `VPC subnets` should `NOT` have `overlaping CIDR range`

- Subnet (IPv4)
    - AWS `reserves 5 IP addresses` (first 4 & last 1) in each subnet, `not available for use`
        - `Exam Tip`: if you need 29 IP addresses for EC2, use CIDR /26 (64 IP addresses)

![](https://imgur.com/5ttxQoZ.jpg)

- misc:
    - Private DNS + Route 53 – enable DNS Resolution + DNS Hostnames (VPC)
    -` Reachability Analyzer` – perform network connectivity testing between AWS resources
## Subnets
- `By default` instance launching inside a VPC subnet has not accessed to the Internet. In effect they are all private
### Internet Gateway - Adding Internet to `Public Subnet` 
- `Internet Gateway (IGW)` Allows resources (e.g., EC2 instances) in a VPC connect to the Internet
    - indepent resource to VPC (`attached`)
    - One VPC can only be attached to one IGW and vice versa (`one to one`)

- must also edit a `Route Tables` to config the `instance/Subnet's Route to IGW`
 
![](https://imgur.com/rH8KnuV.jpg)

### `Bastion Hosts` proxy traffic/ ssh into private subnet`
- User want access an instance inside a private subnet, but not directly, only through a host in the public subnet to redirect
- `bastion host` is an `instance` in the `public subnet`
    - Bastion Host `security group`
        - natrually have `access to Private subnets (in same VPC)`
        -  must `allow inbound SSH from the internet on port 22 (but also restricted, eg from instances in public CIDR)` 
    - Instances in Private Subnet `security group`
        - must `allow inbound SSH from the Bastion Host on port 22`, or the `security group of Bastion Host`
- The connection between `bastion host` and the `private instance` can be done through `ssh command`
![](https://imgur.com/172o6aC.jpg)

### NAT Instances/ NAT Gateways - private subnets `OUTBOUND Internet  connect`
- NAT Instance (outdated)
    - NAT = Network Address Translation
    - an `EC2 instance`, configured to `redirect IP packet to the destination` private instance want 
    - details:
        - Must be launched in a public subnet
        - Must disable EC2 setting: `Source /destination Check`
        - Must have Elastic IP attached to it
        - `Route Tables` must be configured to route traffic from private subnets to the NAT Instance      
    - review
        - complex solution
        - `Not highly available` setup out of the box
        - complex security group setup
        - Internet traffic bandwidth depends on EC2 instance type

![](https://imgur.com/VvbEj41.jpg)

- NAT Gateways 
    - AWS-managed NAT, higher bandwidth, high availability
    - Pay per hour for usage and bandwidth
    - created `in a specific Availability Zone`, uses an `Elastic IP`
    - `Route Tables` must be configured to route traffic from private subnets to the NAT Gateway 
    - no need to manage Security Groups

![](https://imgur.com/SXoRDbx.jpg)
-  High Availability NAT Gateway
    - Must create multiple NAT
Gateways in multiple AZs for High Availability
    ![](https://imgur.com/lPfdAgD.jpg)

![](https://imgur.com/PmycZDB.jpg)


## NACLs
- a `firewall` to `Subnets`
    - `One NACL per subnet`, 
    - new subnets are assigned the `Default NACL`,  Default NACLs will `Allow everything`
    - `Rules are evaluated in order` (lowest to highest, (1-32766, last one is `*`)) when deciding whether to allow traffic, `first match wins` when there are conflicts.


- `Security Groups` vs NACL: NACL 更加严格

|spec|Network ACL (NACL)|Security Groups|
|-|-|-|
|level|`subnet level`|`EC2 instance`|
|rule types|ALLOW/ DENY|only ALLOW|
|rule target|only IP|IP, `security groups`|
|statefulness|`stateless`: return traffic must be explicitly allowed|`stateful`: return traffic is automatically allowed|
|rule evaluation|Rules are `evaluated in order` (lowest to highest) when deciding whether to allow traffic, `first match wins` |All rules are evaluated before deciding whether toallow traffic|


- `Ephemeral Ports` with NACL
    - when clients connect to a server, they don't use a fixed ports, but `Ephemeral Ports` (ie. port open so long as the connection's lifecycle)
        - the `Ephemeral Ports range` is OS specific
    - since the `client's port is Ephemeral`, when server response the request, the `NACL must config to allow all ports in the possible range`

![](https://imgur.com/ll99kgk.jpg)

- multiple private/public subnet
    - NACL rules must be config for each possible private/public subnet combination
    ![](https://imgur.com/OuzpFRh.jpg)


## VPC Peering
- Privately `connect two VPCs` as if they were in the same network using AWS’
network 
    - `NOT transitive `
    - Must not have overlapping CIDRs
    - You must `update route tables` in `both VPC’s subnets` to ensure EC2 instances in different VPC can communicate with each other
    - can create `VPC Peering` connection between VPCs in `different accounts/regions`

## VPC Endpoints (AWS PrivateLink)
- `VPC Endpoints` allows `instances in private/public subnet connect to AWS services` using a `Amazon private network` instead of using the public Internet (without need for Internet Gateway/ NAT Gateway)
    - Interface Endpoints (powered by PrivateLink)
        - Provisions an `ENI` (private IP address) as an `entry point` (must attach a `Security Group`)
        - Supports `most AWS services`
        - cost $
    - Gateway Endpoints
        - Provisions a `gateway` and  `the gateway must be a target in subnet route table` (does not use security groups)
        - `S3` and `DynamoDB`
        - most of time Gateway Endpoints is `preferred for S3`
        - free
        ![](https://imgur.com/XjYFDjt.jpg)

- In case of issues:
    - Check DNS Setting Resolution in your VPC
    - Check Route Tables
### PrivateLink
- To `expose a service within a VPC`  to `1000 of VPCs` possibly in multiple accounts
    - eg. as a service to other account users
    - requirements:
        - service end: `NLB - Network Load Balance`
        - User end: `ENI - Elastic Network Interface`
## VPC Flow Logs
- log IP traffics
    - VPC Flow Logs
    - Subnet Flow Logs
    - Elastic Network Interface (ENI) Flow Logs
    - AWS managed: ELB, RDS, ElastiCache, Redshift, WorkSpaces, NATGW, Transit Gateway...
- integration
    - go to S3/ CloudWatch Logs
    - Query using `Athena on S3` or `CloudWatch Logs Insights`
- troubleshooting
    ![](https://imgur.com/neUTqbn.jpg)
- VPC Flow Logs – Architectures
![](https://imgur.com/0ul6zAh.jpg)

## Site-to-Site VPN
- Connect `On premise` data center to `VPC` through `VPN connect`
    - `Customer Gateway (CGW)` in `on premise data center` 
        - (Software or Physical Embedded Device)
    - `Virtual Private Gateway (VGW)` in your VPC
        - created and `attached` to the VPC
- `Important step`: enable `Route Propagation` for the Virtual Private Gateway in the route table 
- `Ping EC2` from on-premise: add the `ICMP protocol` on the inbound of your `security groups`



### AWS VPN CloudHub
    - communicate between `multiple Customer Networks`, where `Virtual Private Gateway (VGW)` is the hub (hub-and-spoke model)
    1. `connect multiple VPN connections on the same VGW`, 
    2. setup dynamic routing 
    3. configure route tables
![](https://imgur.com/DTTegdT.jpg)


## Direct Connect (DX)
- slow: more than 1 month to estabilish the connection
- a `dedicated private connection` from a `custom network` to `VPC`
    - `Virtual Private Gateway (VGW)` in your VPC
    - custom network connect to `AWS Direct Connect Location` (physical location)
    - connections: 
        - Private virtual interface
        - Public virtual interface
- Use Cases:
    - Increase bandwidth 
    - More consistent network experience 
![](https://imgur.com/SF0Q5J7.jpg)

- Connection Types
    - Dedicated Connections:
        - large capacity: 1Gbps,10 Gbps and 100 Gbps capacity
    - Hosted Connections:
        - small capacity:50Mbps, 500 Mbps, to 10 Gbps
        - `Capacity can be added or removed on demand `

- Encryption
    - Data in transit is not encrypte but is private
    - AWS Direct Connect + VPN provides an IPsec-encrypted private connection (complex, more secure)
    ![](https://imgur.com/pWqKFFQ.jpg)


- Resiliency
    ![](https://imgur.com/ZiMfwIF.jpg)
### Direct Connect Gateway
- setup a `Direct Connect` to `more than one VPC` in many different regions (same account)

![](https://imgur.com/KrhT976.jpg)

### Site-to-Site VPN as a backup to Direct Connect
- In case `Direct Connect fails`, you can set up `a backup Direct Connect`
connection (expensive), or a `Site-to-Site VPN connection`
![](https://imgur.com/Kq0hQS5.jpg)


## Transit Gateway
- `hub-and-spoke (star)` connection connect `thousands of VPC/ 
on-premises`
    - `Regional` resource, but can work cross-region 
    - Share cross-account using Resource Access Manager (RAM)
    - use `Route Tables` to `limit which VPC can talk with which VPC`
    -  `Direct Connect Gateway` or `VPN connections`
    - `Only Service` that Supports `IP Multicast` (not supported by any other AWS service)
    ![](https://imgur.com/KdRGS48.jpg)

### Transit Gateway: Site-to-Site VPN ECMP
- ECMP = Equal-cost multi-path
routing
    - Routing strategy: route packet over multiple best path  
- Use case: `increase` the `bandwidth` of your Transit Gateway connection

### Application: Share Direct Connect between multiple accounts
![](https://imgur.com/YV0gTzs.jpg)


## Traffic Mirroring
- allows `replicate and inspect network
traffic` in your VPC
    - Route the traffic to security appliances
    - Source and Target can be in the same VPC or different VPCs (VPC Peering)
    - capture:
        - `From (Source) – ENIs`
        - `To (Targets) – an ENI or a Network Load Balancer`

- `Use cases`: content inspection, threat
monitoring, troubleshooting, …

## IPv6
- misc
    - Every IPv6 address is public and Internet-routable `(no private range)`
    - `IPv4 cannot be disabled for your VPC and subnets, each IPv6 Instance must have at least one IPv4 address`
        - can enable IPv6 in parallel with IPv4 (can communicate using either IPv4 or IPv6)
- IPv6 Troubleshooting: cannot launch an IPv6 EC2 instance
    - must not be because it cannot acquire an IPv6 (the space is very large)
    - but because there are no available IPv4 in subnet => create a new IPv4 CIDR
 
### Egress-only Internet Gateway
- `IPv6`version `NAT Gateway`  
    - Allows instances in your VPC connect outbound over IPv6
    -  preventing internet inbound connect to your instances over IPv6 
    - `You must update the Route Tables`

![](https://imgur.com/JyJkITh.jpg)

## AWS Network Firewall
- Protect your entire Amazon VPC
    - From Layer 3 to Layer 7 protection
    - `inspection` any kind of traffic, all direction
    - set rules:
        - Supports 1000s of rules
        - IP & port/ Protocol/ domain list/regex pattern
        - `Traffic filtering`: Allow, drop, or alert for the traffic that matches the rules
        - Rules can be centrally managed `cross- account` by `AWS Firewall Manager`
    - Active flow inspection to protect against network threats with intrusion-prevention capabilities
    - Send logs of rule matches to Amazon S3, CloudWatch Logs, Kinesis Data Firehose


## Networking Pricing
- Pricing facts
    - pay for per GB traffic 
    - traffic-in(`Ingress`) is free, traffic to Internet(`Egress`) is not free
    - communication within VPC within same AZ is free
    - traffic through `public IP` is always more `expensive` than `private IP` 
    - inter-AZ/ inter-region communication is not free
        - trade-off: high-availability vs cost

- strategy
    -  keep as much Internet traffic within AWS to minimize costs
    - use private IP
    - Use same AZ unless high-availability is need
    - use Direct Connect locations in same AWS Region for lower egress cost


- S3 data transfer pricing fact
    - ingress free
    - traffic within same AZ free
    - to CloudFront free, out from CloudFront to Internet is not free
    - S3 Cross Region Replication, S3 Transfer Acceleration, all paid service

- access AWS service from VPC: 
    - NAT Gateway vs Gateway VPC Endpoint
    - `Gateway VPC Endpoint is cheaper`

## Network Protection
- possible Protections:
    - NACLs
    - security groups
    - WAF
    - Shield & AWS Shield Advanced
    - Firewall Manager (to manage them across accounts)
    - `AWS Network Firewall`


# Disaster Recovery & Migrations
- `Disaster`: event that negatively impact  business continuity
- `Disaster recovery (DR)`: is about preparing for and recovering from a
disaster
- RPO, RTO
    - `RPO`: Recovery Point Objective
        - restoration time grainularity (frequent to run backup)
        - objective: minimize the time gap between a disater and the last backup(RPO)
    - `RTO`: Recovery Time Objective
        - how fast a recovery is finished (down time)
        - objective: minimize the down time
    - trade-off: RPO/RTO and cost

- Disaster Recovery Strategies
    - backup and restore: restore from S3 when disaster happens   (`hours`)
        - need long time to restore function
    - Pilot Light: core function running without scale (`10s Minutes`), . 
        - need little time to restore function
    - Warm Standby: full version of app running without scale (`Mintues`)
        - can handle traffic at reduced levels immediately
    - Multi-Site / Hot-Site: full version of app, at full size in EC2 (`Realtime`)
    ![](https://imgur.com/2aQTFde.jpg)
        - Can be implement as AWS Multi Region site through Route 53
        ![](https://imgur.com/C3cOt3c.jpg)

### DR implementations in AWS
- Backup 
    - EBS Snapshots, RDS automated backups / Snapshots, etc… 
    - Regular pushes to S3 / S3 IA / Glacier, Lifecycle Policy, Cross Region Replication 
    - From On-Premise: Snowball or `Storage Gateway` 
- High Availability 
    - Use `Route53` to migrate DNS over from Region to Region 
    - RDS Multi-AZ, ElastiCache Multi-AZ, EFS, S3 
    - `Site to Site VPN` as a recovery from `Direct Connect`
- Replication 
    - RDS Replication (Cross Region), AWS Aurora + Global Databases 
    - Database replication from on-premises to RDS 
    - Storage Gateway 
- Automation 
    - CloudFormation / Elastic Beanstalk to re-create a whole new environment 
    - Recover / Reboot EC2 instances with CloudWatch if alarms fail 
    - AWS Lambda functions for customized automations 
- Chaos testing
    - Netflix has a “simian-army” randomly terminating EC2
## DMS – Database Migration Service
- migrate databases to
AWS
    - source database remains available
during the migration
    - Homogeneous/Heterogeneous migrations
    - Continuous Data Replication using CDC
    - `must create an EC2 instance` with `DMS` to perform the replication tasks
    - sources, targets
        - SOURCES: On-Premise, in-EC2, RDS(Aurora), S3, DocumentDB
        - TARGETS: SOURCES + most AWS data services

### AWS Schema Conversion Tool (SCT)
- Convert Database’s Schema from one engine to another (eg: SQL Server to AUrora)
    - `Heterogeneous migrations = SCT + DMS`
    - SCT is `compute-intensive`, preferred compute optimized EC2 instance

## Migrations Solutions
### RDS & Aurora MySQL Solutions 
- from RDS MySQL/PostgreSQL to Aurora MySQL/PostgreSQL
    - option 1: downtime
        - DB Snapshots from RDS MySQL
        - restored as MySQL Aurora DB
    - option 2: no downtime, more cost(network)
        - Create an Aurora Read Replica from your RDS MySQL
        - when the replication lag is 0, promote it as its own DB cluster
- External MySQL to Aurora MySQL
    - option 1: 
        - Use Percona XtraBackup to create a file backup in Amazon S3
        - Create an Aurora MySQL DB from backup file in Amazon S3
    - option 2: 
        - Create an Aurora MySQL DB
        - Use the mysqldump utility to migrate MySQL into Aurora (slower than S3 method)
- External PostgreSQL to Aurora PostgreSQL
    - Create a backup and put it in Amazon S3
    - Import it using the aws_s3 Aurora extension
- DMS work for both scenerio


### Transferring large amount of data into AWS

## AWS Backup
- Centrally manage and `automate backups` across AWS services (managed service)
- features: 
    - you create backup policies named as `Backup Plans`
        - Backup frequency/ windows
        - lifecycle policy to cold storage
        - Retention Period
    - On-Demand / Scheduled backups
    - Tag-based backup policies
- Supported services: 
    - Amazon EC2
    - EBS, S3, EFS, FSx
    - RDS (all DBs engines) / Aurora / DynamoDB, DocumentDB, Neptune
    - AWS Storage Gateway (Volume Gateway)
- Supports cross-region/ cross-account backup

![](https://imgur.com/Vip0TEy.jpg)

### AWS Backup Vault Lock
- Enforce a WORM (Write Once Read Many) state for all the backups 
    - malicious delete operations
    - shorten or alter retention periods
- Even the `root user cannot delete backups when enabled`
## AWS Application Discovery Service
- plan migration, plan resource provision...
    - Gather information about your on-premises servers 
    - Server utilization and dependency mappings 
    - Integrated view in `AWS Migration Hub `
- Agents
    -  `Agentless` Discovery (AWS Agentless Discovery Connector)
        - VM inventory, configuration, and performance history such as CPU, memory, and disk usage
    - `Agent-based` Discovery (AWS Application Discovery Agent)
        - `System configuration, system performance`, `running processes`, and `details of the network` connections between systems\

## Application Migration Service (MGN)
- replacing AWS Server Migration Service (SMS)
- simplify `migrating applications` to AWS
    -  physical/ virtual/ or cloud-based application (OS, platform , DB..)
    - continuous replication, Minimal downtime
    ![](https://imgur.com/IejCWtw.jpg)

## `VMware Cloud` on AWS
-  Some customers use VMware Cloud to manage their on-premises Data Center
    -  extend the Data Center capacity to AWS, but keep using the VMware Cloud software
![](https://imgur.com/Dtp4CR0.jpg)

# Misc services
### On-Premise Services 
- download Amazon Linux 2 AMI as a VM (.iso format) 
    - VMWare, KVM, VirtualBox (Oracle VM), Microsoft Hyper-V 
- `VM Import / Export `
    -` Migrate existing VM applications into EC2` 
    - Create a DR repository strategy for your on-premises VMs 
    - Can export back the VMs from EC2 to on-premises 
### CloudFormation
- IaaC
    - `replicate infrastracture`, Don’t re-invent the wheel (cross-region/account, prod/stage/dev..)
    - No resources are manually created, excellent for control
    - Changes to the infrastructure are reviewed through code
    - estimate the costs of your resources using the `CloudFormation template`
    - `Supports (almost) all AWS resources`, can use “custom resources” for resources that are not supported
- CloudFormation Stack Designer  
    - see all the resources
    - see the relations between the components
    ![](https://imgur.com/kkT3Vjf.jpg)
### Amazon Simple Email Service (Amazon SES)
- send emails securely, globally and at scale ( managed service )
    - inbound/outbound emails
    - dashboard, insights, statistics, anti-spam feedback
    - Send emails using your application using `AWS Console, APIs`, or `SMTP`
- `Use cases`: `transactional, marketing` and `bulk email` communications

### Pinpoint
- 2-way (outbound/inbound) `marketing communications service`
    - personalize messages
    - receive and replies
    - use: `run campaigns, transactional SMS messages`
- Versus Amazon SNS or Amazon SES
    - In SNS & SES `you managed each message's audience, content, and delivery schedule`
    - (Managed, easier to use) In Amazon Pinpoint, you create message templates, delivery schedules, highly-targeted segments, and full campaigns
- architecture
![](https://imgur.com/w0WOvSx.jpg)


## Systems Manager (SSM)
- centrally manage/view `EC2 and On-Premises infrastructure`  (`Hybrid` AWS service)
    - `run scripts/patches to a fleet of servers`
    - get `insight` about your infrasturcture
    - SSH into instances
### SSM session Manager
- `start a secure browser shell` to EC2/On-Premises servers
    - no need to manage `SSH`/ `bastion hosts` or `port 22`
    - through SSM Agent running in Instance
    ![](https://imgur.com/MXHJ6t8.jpg)

- Allows you to start a secure shell on your EC2 and
on-premises servers
### SSM – Run Command
- Execute a script or just run a command
    - across multiple instances
    - not need SSH
    - Command Output can be shown in the AWS Console or to S3, SNS
    - Integrated with IAM & CloudTrail
    - EventBridge invoke

### SSM - Patch Manager
- Automates patching instances: OS updates, applications updates, security updates
    - Supports EC2 instances and on-premises servers
    - executed with `Run Command`
    - with `Maintenance Windows`: on-demand or scheduled
    - scan instance and patching report
### SSM - Maintenance Windows
- Defines a schedule for when to perform actions on your instances
    - Example: OS patching, updating drivers, installing software, …
    - components:
        - Schedule
        - Duration
        - Set of registered instances
        - Set of registered tasks

### SSM - Automation
- Simplifies common maintenance and deployment tasks of EC2 instances and other AWS resources
    - Examples: restart instances, create an AMI, EBS snapshot
    - `Automation Runbook` – SSM Documents to define actions to EC2 instances or AWS resources
    - `triggers` 
        - Manually using AWS Console, AWS CLI or SDK
        - Amazon EventBridge
        - On a schedule using Maintenance Windows
        - By AWS Config for rules remediations
### Cost Explorer
- `detailed visual cost overview`, more `filtering options`
- `forcast` usage
- `Savings Plan` recommendat portal

### Amazon Elastic Transcod
- convert media files stored in S3
    - Fully managed & secure, pay for what you use
    - S3 input -> transcoder -> S3 output

### AWS Batch

- a `batch job` is a job with a start and an end
- `Batch` is `AWS managed` batch processing service. 

- `fully managed`, 
    - `Run in EC2/spot instances` 
    - jobs are defined as `docker image`,  run on `ECS`
    - auto provision resources
- Batch vs Lambda
    - Lambda: 
        - `runtimes limit `
        - `Serverless` 
        - Limited temporary disk space 
    - Batch: 
        - `No time limit`
        - `not serverless(underlining resource)`
        - Rely on EBS / instance store for disk space 
        - Relies on EC2 (can be managed by AWS)

### Amazon AppFlow
- enables you to securely `transfer data` between `3rd-party SaaS applications` and `AWS`
    - sources: `Salesforce`, `SAP`, `Zendesk`, `Slack`, and `ServiceNow`
    - Destinations:  `S3,  Redshift` or `non-AWS` such as SnowFlake and Salesforce
    - features:
        - Data transformation
        -  schedule, events-driven...
        - encrypted over public internet or privately over AWS PrivateLink

### Well-Architected Tool
- Free tool to review your architectures against the 6 pillars Well-Architected 
    - Select your workload and answer questions
    - get feedback, risks and advices

### Trusted Advisor
- AWS account assessment at high level
    - `cost`
    - `performance`
    - `security`
    - `Fault Tolerance`
    - `Sevice Quotas`
- 7 Core Checks and recommendations – `all customers`, mostly security related
    - `S3 Bucket Permissions`
    - `Security Groups (port risks)`
    - `at least one IAM user`
    - `MFA on Root account`
    - `EBS public snapshot`
    - `RDS public snapshot`
    - `service limits`
- Full Trusted Advisor for `Business & Enterprise` support plans
    - `AWS support API`
    - alarm when trigger limits
    - many others