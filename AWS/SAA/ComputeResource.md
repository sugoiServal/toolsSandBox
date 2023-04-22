### misc
- Most AWS services are region-scoped
    - globals: WAF


# EC2
### basic
- Firewall rules: `security group`
    - control `network traffic` in/out of EC2
    - only contain `allow` rules
    - rule target: IP+port/ security group
    - effect outside any EC2 instance
    - default: in blocked, out allowed
- Bootstrap script: `EC2 User Data`
- SSH from AWS console: `EC2 Instance Connect `
    - only Works out-of-the-box with Amazon Linux 2
    - need `port 22` open
- instances types:
    - General Purpose, Compute Optimized, Memory Optimized, Storage Optimized
- AMI
    - Public AMI, your own AMI, AWS Marketplace AMI
    - create AMI:
        - customize instance
        - stop instance and build AMI
    - `use in Region`, can be copied across regions 
- Instance Store: `high-performance`, `lost` after stop/terminate/fail
![](https://imgur.com/XVOfOTN.jpg)

### Instance Purchasing Options
- On-Demand Instances – `short workload`, pay by second(`expensive`)
- - Spot Instances – `short workloads`, `cheap 72% discount`, can lose instances (`less reliable`)
- Reserved (1 & 3 years): 72% discount,  `long workload`
    - Reserved Instances 
    - Convertible Reserved Instances 
- Savings Plans (1 & 3 years) - `long workload`, flexible instance types
    - commitment to an amount of usage ($10/hour for 1 or 3 years)
- Dedicated Hosts 
    - book an entire physical server, control instance placement
    -  compliance requirements, `BYOL – Bring Your Own License`
- Dedicated Instances 
    - `no BYOL`, No control over instance placement
- Capacity Reservations 
    - reserve capacity in a specific AZ for any duration
    - You’re `charged at On-Demand rate whether you run instances or not`

### Spot Instance
- Make `Spot Request`, define `max spot price`, can use instance while current spot price < your price 
    - If the current spot price > your max price you can choose to `stop` or `terminate` within 2 mins
- `Not for critical jobs or databases`
- terminate Spot Instances
    - must firstly `cancel a Spot Request`, then `manually terminate the associated Spot Instances`
    - otherwise new spot instances will be created to accomodate the request 
    - cancelling Spot Request does not automatically terminate Spot Instances
### Spot Fleets
- 自动用Spot Instances + (optional) On-Demand Instances 来满足你的需求
    - Define (multiple) launch pools: how much resources capacity
    - `Spot Fleets` automatically launch Spot Instances in pools to `meet the capacity` (with price constraints)
- strategies:
    - `lowestPrice`: from the pool with the `lowest price` (cost optimization, short workload)
    - `diversified`: `distribute instances across all pools` (great for availability, long workloads)
    - `capacityOptimized`: pool with `the optimal capacity` for the `number of instances`


### Placement Group
- control EC2 Instance `placement strategy`
- `Cluster`: 
    - a `low-latency` group (a physical rack `in an AZ`)
    - eg: Big Data compute(Hadoop)
- `Spread` 
    - spreads instances across AZ
    - `high availability`, failure proof
    - eg: `critical tasks`
- `Partition`
    - partition: essentially is physical rack
    - partitions are spread across AZs
    - `balancing availability and latency`
![](https://imgur.com/HsIPR4R.jpg)
![](https://imgur.com/ipELIRp.jpg)
![](https://imgur.com/UmnUFbl.jpg)

### Hibernate EC2
- `Hibernate` make `booting from stop state much faster` than vanilla stop(`think Windows' sleep`)
    - The RAM state is written(encrypted) into `a file in root EBS`
    - when restart, RAM state is restored, make faster bootup
- Use cases:
    - Services that take time to initialize
    - Saving the RAM state
- misc: 
    - Hibernate `RAM Size < 150 GB`
    - Hibernate `keep < 60 days`
    - `Root EBS` must be encrypted, must be large enough(root EBS >= vRAM )
    - Available for On-Demand, Reserved and Spot Instances
### stop vs terminate vs Hibernate
- Hibernate = stop + fast reboot
- `Stop`: root `EBS is kept`
- `Terminate`: root `EBS will lost`
- `instance store volumn` will be lost in any case (stop/hibernate/terminate)

# ELB
- regional service, 
    - `ALB: multi-AZ (high availability) by default`, free inter AZ data traffic
    - NLB/GWLB: opt-in multi-AZ, charge $ for inter AZ data traffic
- `Load Balances` are servers that 
    - expose `single DNS(ALB), or IP(NLB) access point`
    - Provide `SSL` termination (HTTPS)
    - `Spread load` in downstream servers
    - `health check` downstream instances' failure
    - provide `Sticky Sessions`
- (misc) Client IP is inserted in a header `X-Forwarded-For` in forwarded requests to downstream application
### ALB vs NLB vs GWLB
- ALB 
    - route HTTP, HTTPs, WebSocket traffic. 
    - For general web application. 
    - Expose a DNS
- NLB 
    - TCP, TLS (secure TCP), UDP
    - `high performance/low-latency`
    - has one `static IP` per AZ
    - can be use in front of ALB
- GWLB:
    - layer 3: IP Packets
    - use to setup a `security check loop`, essentially a gateway to check traffic
    - eg: traffic inspecting/intrusion detecting

### ALB - Application Load Balancer
- ALB route incoming traffic, based on `Routing Tables Rules`, to different `Target Group`
    - `Expose a DNS`

- ALB `support traffics`: HTTP, HTTPs, WebSocket
    - protocol redirect: 
        - HTTP<->HTTPs, HTTP<->WebSocket
        - eg: force users to use HTTPs
- ALB `Routing Tables Rules`
    - hostname (one.example.com, other.example.com) 
    - url path (/users, /post)
    - query strings('?id=123')
    - HTTP headers, source IP address...
- ALB `Target Group`
    - EC2 instances ( + ASG)
    - ECS tasks (managed by ECS)
    - Lambda functions – (serverless, HTTP request is translated to Json event)
    - private IPs (eg, on-premise servers)
- use case(eg)
    - `microservices!`
    - container-based application
![](https://imgur.com/VR5UVBu.jpg)


### NLB - Network Load Balancer
- NLB `support traffics`: TCP, TLS (secure TCP), UDP
- NLB `Target Group`
    - EC2 instances 
    - private IPs (eg, on-premise servers)
    - `ALB` instance (front of ALB, eg. expose IP instead of Domain Name)

- `static IP per AZ`, and `supports Elastic IP`
    - use case: if you want to `expose your application through few static IP`(instead of Domain Name)

- use case: 
    - `high performance/low-latency`
    - Load balancer `exposing few static IP` instead of DNS

### GWLB - Gateway Load Balancer
- ensure all traffics to go through `a group of instances (eg. for traffic inspecting/intrusion detecting, using 3rd party application)`
    - a combination of `Transparent Network Gateway` and `Load Balancer`
- GWLB `Target Group`
    - EC2 instances
    - private IPs (eg, on-premise servers)

- Uses the `GENEVE protocol on port 6081`



### ELB - Sticky Sessions (session Affinity)
- enable clients to be `always direct to same instance for a duration`. make possible by using `cookie` with a TTL  
    - a possible `user session implementation`

- cookie options
    - Application-based Cookies
        - Custom cookie: 
            - generated by the target application
            - cannot not name after: `AWSALB, AWSALBAPP, or AWSALBTG`
        - Application cookie: Generated by the load balancer with name `AWSALBAPP`
    - Duration-based Cookies: generated by the load balancer with name  `AWSALB` for ALB

- Sticky Sessions may lose the `balancing` quality of a ELB. Alternatively use the `ElastiCache Cache Session`



### ELB - HTTPs: SSL certificates (ACM)
- for `in-flight data encryption (HTTPs)`
    - TLS == newer version SSL
    - SSL certificates has an `expiration date` and must be renewed
- manage SSL certificates using `ACM (AWS Certificate Manager)`
- SSL certficates are load in `ALB/NLB Listener config`:
    - specify `a default cert`/ `a list of cert`

- support `SNI (Server Name Indication)` => serve certification for multiple site from an ELB
    - `allows multiple SSL certificates to be served on the same IP address (ie. and ELB instance)`
    - usage: for serve multiple websites (ie. downstream instances, each should associated with a SSL), in one ALB/NLB
    - How: allowing the `client` to include the `hostname it trys to connect` with `initial TLS`  in the `handshake message` => `server` identify the specific `TLS certificate` through the `hostname field`

## ELB - Health Checks
- `health check` is done on a route (eg: `/health` in port 4567)
    - ELB sent a request 
    - if response is not 200 (OK), then the instance is unhealthy
- Health checks are done at the `target group` level

- all health checks (ALB, NLB) use `HTTP/HTTPs`, and NLB can use additional `TCP` to make `health checks request` 

- use `ELB Health Checks + ASG architecture` to automatically replace downed instance

### Deregistration Delay 
- After an instance is `marked as unhealthy`, give it some time to complete `in-flight requests` before stop sending request to it
    - a pool of request still send to the instance (aka `in DRAINING state`)
    - stop new requests to the instance after the pool being drained
- option:
    - Between 0 to 3600 seconds (set 0 to disable)
    - set low value if requests time are short


# ASG
- `regional service (multi-AZ)`, free service
- `scale out(+), scale in (-)` instances, `maintaining scale` 

### `Launch Template`
- all new instance created by ASG will be created according to the `Launch Template`

### Scaling Policies 
- Dynamic Scaling Policies 
    - `Target` Tracking Scaling (`easiest setup`)
        - eg. I want the average CPU to be around 40%
    - `Simple / Step Scaling`
        - eg. when a CloudWatch `alarm is triggered`, `then +/- x instance` 
        - Simple ~= Step Scaling
- `Scheduled` Action:
    - for known usage pattern (eg. 5 pm on Fridays)
- `Predictive` Scaling: 
    - ML predicted, on a target metric value.  Good for `time-based patterns usage`


### Scaling Cooldowns
- after scaling event, `instance/scaling metric` need time to stabilize,  
    - user set a `Cooldowns period (default 300s)`, during which `no scaling event will happen`

- overalll goal: `minimize the Cooldowns period` for more frequent/fluent scaling
    - how. Use a `ready-to-use AMI` to reduce instance configuration 
### misc
- `debuging`: if ASG keeping terminating instances and creating new instances, that is because ELB health check deem the instance as unhealthy. check either the `security group config (allow health check)` or the `user data config`


# Containers: ECS, ECR, EKS
## ECS