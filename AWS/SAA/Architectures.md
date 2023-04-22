# Resource Access
- NLB: static IP
- ALB: DNS name
- CloudFront: DNS
- Aurora: Aurora Endpoints (DNS)
- RDS Proxy: (pool client access) only private connection from VPC


# Solutions
### static public IP
- Elastic IP
- NLB - Network Load Balancer, has one `static IP per AZ`
- alternative: expose DNS
    - use ALB's DNS
    - use Route 53 to expose single DNS, and dynamically replace changed public IP (`DNS Failover Policy` + health check)

### Control County access to content
- CloudFront Geo Restriction 
    - Allowlist/ Blocklist by `country`
    - “country” is determined using a 3rd party `Geo-IP database`

### User Session
- ELB (ALB, NLB) Sticky Sessions
    - enable clients to be `always direct to same instance for a duration`. make possible by using `cookie` with a TTL
- ElastiCache - User Session Store
    - application writes the session data into ElastiCache at first connect
    - application query User Session Store in later request


## Improve performance
- `ElastiCache` (DB Cache), relieve load from database
- S3 performance optimization:
    - upload
        - `Multi-Part upload` => parallelize upload
        - `S3 Transfer Acceleration`: upload through `AWS edge location` 
    - download
        - `S3 Byte-Range Fetches`: breaking transfer by `byte ranges`
- CloudFront (CDN)   
    - `improves read performance` by cache `static contents` at the `CloudFront edge`

- Global Accelerator
    - use `AWS private network` to route client, from CloudFront Edge, to your AWS application deployment (EC2, ELB)
    - Improve performance through `leverage AWS private Network`
    - Good fit for `non-HTTP` use cases, such as `gaming (UDP), IoT (MQTT), or Voice over IP`

- `Aurora Global Database`: increase multi-region read performance (Global performance)
    - 1 Primary Region(r/w) + Up to 5 secondary (read-only) regions(16 read replicas each)

- Athena Query Performance Improvement
    - use `columnar data for cost-savings` (less scan)
    - use `parquet or ORC data format`(`Glue` to convert data)
    - `Compress data` for smaller retrievals
    - `Partition datasets in S3` for easy querying
    - Use `larger files` for quicker scan

    
# Architected `Security`
### ELB + EC2 `security group`
- ELB allow all network traffic (HTTP, HTTPS) from Internet
- downstream EC2 instance `only allow the ELB instance`, 
    - setting instance security group's Inbound rules to accept only the ELB


### RDS/Aurora Security
- Data encryption
    - at-rest: KMS, 
        - master encryption must enable before read replicas encryption
    - in-flight: TLS enable default
- access control
    - `IAM Database Authentication`: use IAM roles to connect to your database (instead of username/pw)
    - `Security Groups`: Network level 
- logging: RDS `Audit Logs` -> `CloudWatch Logs`

### ElastiCache Security 
- Data encryption
    - Support SSL in flight encryption
- access control
    - IAM Authentication for Redis
    - `Redis AUTH`, authentication within Redis software
    - `Memcached`: Supports SASL-based authentication (advanced)

## S3 Security
### S3 Data Encryption
- at rest encryption
    - S3-Managed Keys (SSE-S3), (default)
        - `keys managed and owned by AWS S3` 
        - misc: 
            - (Must set header "x-amz-server-side-encryption": "AES256")
    - KMS Keys stored in AWS KMS (SSE-KMS)
        - `keys managed by KMS, owned by user`
        - `use case`: user controlled key + `audit key usage using CloudTrail`
        - misc:
            - limitaion: Count towards the `KMS quota` per second
            - use APIs to encypt/decrypt 
            - Must set header `"x-amz-server-side-encryption": "aws:kms"`
    - Customer-Provided Keys (SSE-C)
        - `key` own, managed by the customer outside of AWS, `Encryption happen in AWS`
        - misc:
            - `Encryption key` must provided in `HTTP headers` for every request 
            - support only cli/sdk
    - Client-Side Encryption
        - `key` own, managed by the customer, `Encryption outside AWS`. File from/to AWS in transit already encrypted.
        - use Library like `Amazon S3 Client-Side Encryption Library` 

|name|key owner|key management|encryption location|
|-|-|-|-|
|SSE-S3|S3|S3|AWS|
|SSE-KMS|user|KMS by user|AWS|
|SSE-C|user|on-premise|AWS|
|Client-Side|user|on-premise|on-premise|

- In transit Encryption
   - use `bucket policy` to `force SSL/TLS` transit
        - `deny` operations if `"aws:SecureTransport":"false"`
![](https://imgur.com/PPdZrt1.jpg)
        

### S3 Access Control
- user: IAM Policies
- AWS services: IAM Role
- `S3 Resource-Based`
    - `Bucket Policies` – bucket level access
        - control `public Internet access`
        - control `Cross Account access`
        - force object enctyption
    - `Object Access Control List (ACL)` – object level access
    - `Bucket Access Control List (ACL)` - less common, use `Bucket Policies` instead 
- `S3: Block Public Access`
    - an option to `block all public access` `over all other access control `
    - extra layer of security




### misc

- `MFA Delete`
    - force users to `do MFA before Deletion`
    - `usage`: protection `against accident deletion`
    - misc:
        - dangerous deletion includes:
            - Permanently delete an version
            - Suspend Versioning 
        - `Bucket Versioning` must be enabled to use `MFA Delete`
        - only root account bucket owner can enable MFA Delete

- S3 Locks
    - `WORM (Write Once Read Many) mode`, ban overwrite/deletion (retention Compliance)
    - options:
        - `Glacier Vault Lock` (bucket level lock)
            - Glacier Vault (enable Lock) prevent object in bucket from deletion
        - `S3 Object Lock` (object level lock)
            - `Compliance`:
                - protect from all user (`incl root`) 
            - `Governance`:
                - protect from Most users (`not incl root`)
            - `Retention Period:`
                - protect for a `fixed period`(no extention)
            - `Legal Hold`:
                - protect the object `unconditionally`
                - `freely placed and removed` using the s3:PutObjectLegalHold IAM permission

- S3 Access Logs
    - log all access request (success or not) to a S3 bucket
    - `usage`: audit purpose
    - misc: 
        - `logging storage bucket` must be in the `same region`
        - integration: `Athena` analysis


## SQS/ SNS / Kinesis Security
- Encryption:
    -  `In-flight encryption` using `HTTPS API/Endpoint`
    -  `At-rest` encryption 
        - `SQS key(SSE-SQS)`: SQS owned, managed
        - `KMS key(SSE-KMS)`: owned and managed by user in KMS
    -  `Client-side encryption`: Data encrypted by client 
- Access Controls: 
    - `IAM policies` to regulate access to the `SQS/SNS/Kinesis API`
    - `SQS Access Policies` (similar to S3 bucket policies)
        - Useful for `cross-account access` to SQS queues
        - Useful for allowing `other services` (SNS, S3…) to write to an SQS queue
    - `SNS Access Policies`, similar to SQS Access Policies
    - `VPC Endpoints` available for `Kinesis` to access within VPC 
- Monitor API calls using `CloudTrail`

# Architected `High availability`
### RDS
- RDS multi-AZ/multi-region `Read Replicas` (`ASYNC` replication)
- `Multi-AZ RDS` (Master/Standby, immediately `SYNC`)
    - one DNS access, automatically `DNS failover`
### Aurora
- Aurora is availability by default (1 writing master + 5 standby in 3 AZs)
- Aurora Global Database: for `multi-region disaster recovery`
    - `cross-region replication in 1 second`
### Route 53
- use Failover DNS policy:
    - return `primary resource if it passed the DNS Health Check`, `otherwise return the Secondary`(Disaster Recovery/Standby) resource
# Common Architecte
### ELB Health Checks + ASG: replace unhealthy instances
- Configured the ASG to `use ALB Health Checks`, ASG will `terminate` unhealthy instance `detected by ELB Health Checks`
- ASG Automatically `register new instances` to `ELB's target group`

### CloudWatch Alarm trigged ASG
-  CloudWatch Metric/Alarm + ASG Target Tracking Scaling/ Step Scaling
    -  eg. I want the average CPU to be around 40%
    - choose metric to `meet your bottleneck`
- typical metrics:
    - `CPUUtilization`: `Average CPU`
    - `RequestCountPerTarget`: `number of requests per EC2`  
    - `Average Network I/O`
    - IO from backend to database...

### ELB + SSL certficates (ACM)
### ALB + EC2/ECS containers



# Important ports: differentiate
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