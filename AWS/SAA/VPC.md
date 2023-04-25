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