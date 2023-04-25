> The SA exam is pretty `lightweight on the details on Serverless` services (focus on hige level)

# overview
- FaaS (Function as a Service, anything as a service): you don’t manage / provision / see the resources
- AWS serverless services
    - AWS `Lambda` 
    - `DynamoDB` 
    - AWS `Cognito` 
    - AWS `API Gateway `
    - Amazon S3 
    - AWS SNS & SQS & Kinesis Data Firehose 
    - Aurora Serverless 
    - `Step Functions `
    - Fargate

# Lambda
- misc:
    - Pay per `request(calls)`/ `compute time(duration)` 
    - Increasing RAM will also improve CPU and network! (resource auto-scale)
- support
    - most programming language
    - Container (must implement `Lambda Runtime API`)
- Limits
    - `Maximum execution time: (15 minutes)`
    - REM: up to 10G
    - Disk: up to 10G
    - Concurrency executions: 1000 (can be increase)

# DynamoDB
- serverless `NoSQL`
    - default: `multiple AZs`, ASG
    - `schemaless`
        - Table, `Primary Key`: `attributes` access pattern
        - `Maximum size` of an item is `400KB`
        - data types: Scalar, Document(containers), Set
    - capability modes: Provisioned/ On-demand
        - `Provisioned`: 
            - `Pay for Read/Write Capacity Unit(RCU/WCU)`
            - `RCU and WCU are decoupled`
        - `On-Demand`
            - `unpredictable` workloads, `more expensive` ($$$)
    - misc:
        - Standard & Infrequent Access (IA) Class
- DynamoDB Accelerator (DAX)
    -  `in-memory cache` for DynamoDB, increase `read performance`, no API change
    - `ms latency` for cached data
    - for DynamoDB, use DAX instead of ElastiCache

- DynamoDB Stream Processing
    - Ordered stream process: `item-level modifications - create/update/delete`
    - usage: 
        - React to changes in real-time (welcome email to users)
        - Real-time usage analytics...
    - vs Kinesis Data Streams (newer solution)
        - less retention time(24 hour)
        - limit # of consumers

- DynamoDB Global Tables 
    - tables replicated to `multiple regions`
    - `Active-Active` replication (two-way replication, (`READ/WREITE in any place`))
    - usage: reduce latency in multiple regions 
    - misc
        -` Must enable DynamoDB Streams` as a pre-requisite

- DynamoDB import/export to S3
    - `Import` from S3
        -  `Creates a new table` from file format: `CSV, DynamoDB JSON` or ION format...
    - `Export` to S3 (`must enable PITR`). 
        - `export DB state at any time point` in last `35 days`(PITR)
        - usage: data analysis, ETL, Retain snapshots for auditing...
        - misc
            - Export in DynamoDB JSON or ION format
            - Doesn’t affect the read capacity of your table


## API Gateway
- expose `any AWS Services(API)` (eg. Lambda) without IAM, expose any HTTP 
    - `Lambda function`: Easy way to expose REST API backed by AWS Lambda
    - `HTTP endpoints`: eg: HTTP API on-premise, ALB endpoint
    - `AWS Service`: expose any AWS APIs
        - Example: expose endpoint to send data to Kinesis Data Streams 
        ![](https://imgur.com/G3kGNvy.jpg)

- Endpoint Types
    - `Edge-Optimized` (default):     
        - `For global clients`, Requests are routed through the `CloudFront Edge` 
        - `API Gateway` service itself is still `regional`
    - `Regional`
        - For `clients within the same region`, can still manually combine with CloudFront(give more control to use CloudFront)
    - `Private`
        - Can only be accessed from your `VPC`
        - Use a `resource policy` to define access
- API Gateway Security
    - Auth
        - `IAM Roles`: useful for AWS internal applications
        - `Cognito`: identity for external users(client, `eg. mobile`)
        - `Custom Authorizer` (your own logic in Lambda)
    - in-flight encryption: HTTPs (`AWS Certificate Manager (ACM)`) 
        - for `Edge-Optimized endpoint`, certificate must be in `us-east-1`
        - for `Regional endpoint`, certificate should be in the same region
        - Must setup `CNAME or alias record in Route 53`
## AWS Step Functions
- `visual workflow` to build your `Lambda functions`
    - workflow: sequence, parallel, conditions, timeouts, error handling, `Human Approval`…
    ![](https://imgur.com/AKYN24H.jpg)

## Cognito
- external users identity (Auth), a serverless database of user ID
    - usage: `hundreds of users`, `mobile users`, `non IAM identity`, authenticate with SAML

- `Cognito User Pools` (CUP):
    - `Create a serverless database of user` for your web & mobile apps ( `Username+password`)
    - usage: 
        - `Cognito User Pools` => API Gateway => AWS service
        - `Cognito User Pools` => ALB endpoint
- `Cognito Identity Pools` (CIP) (old name: Federated Identities): 
    - Provide `AWS credentials to users` so they have `temporary identities(STS)` to `directly access AWS resources`
    - `Cognito Identity Pools` => AWS service directly(eg. Lambda, just like using IAM)
    - misc: 
        - Users source can be `Cognito User Pools`, or `3rd party login`...
        - Cognito Identity Pools enable `Row Level Security` to  access `DynamoDB` (eg, user can only read the `rows` where `the identity field` match `you identity `)





# Serverless Architectures

## Lambda Architecture
### Lambda at CloudFront Edge
- goal: execute some `logic at the edge`(attach to `CloudFront distributions`)
    - usage: `Runs functions` close to your users to `minimize latency` 
        - customize the CDN content, 
        - Website Security and Privacy, 
        - Dynamic Web Application at the Edge...
- solution
    1. `CloudFront Functions`: large scale, limit capability
    2. `Lambda@Edge`: small scale, more capability
    
||CloudFront Functions|Lambda@Edge|
|-|-|-|
|language|JS|JS or Python|
|# of Requests|Sub-ms startup times, `Millions per sec`|Thousands per sec|
|support modification|Support `viewer Req/Res` only|Viewer Req/Res and `Origin Req/Res`|
|Native|`Native feature of CloudFront`|`CloudFront + Lambda` Integration|



### Lambda in your VPC
- `By default`, Lambda function `cannot access resources in your VPC`. It is because Lambda is `launched in an AWS-owned VPC`. 
- You can `launch Lambda in your VPC`
    - `define the VPC ID, the Subnets and the Security Groups`
    - Lambda will `create an ENI` to use the VPC

![](https://imgur.com/abwgxJc.jpg)

### RDS/Aurora + Lambda    
- `RDS Proxy`(client pool) + Lambda
    - requires Lambda to be launched in you VPC. because RDS Proxy is always private
    ![](https://imgur.com/M13WI9v.jpg)

- RDS/Aurora CURD operation => trigger Lambda (eg. `process data events`)
    - Must allow `outbound traffic` from RDS/Aurora to your Lambda function  (Public, NAT GW, VPC Endpoints)
    - DB must have the permissions to invoke Lambda function (`Lambda Resource-based Policy` & `IAM Policy`)
    ![](https://imgur.com/Dn8qiuA.jpg)

- `RDS Event Notifications`(DB instance events) => trigger Lambda
    - RDS Event Notifications is not about data CURD, but the `DB instance itself` (stopped, start, snapshot, Parameters, Security…)
    - targets: `DB instance, DB snapshot, DB Parameter Group, DBSecurity Group, RDS Proxy, Custom Engine Version`
![](https://imgur.com/wiiva9h.jpg)

