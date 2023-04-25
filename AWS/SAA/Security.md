# Access

## Organization
- `Global service`, manage your multi-account
    - benefits
        - `aggregated usage, consolidated Billing`. 
        - `Shared reserved instances and Savings Plans discounts`
        - centrally manage `CloudTrail`, `CloudWatch Logs` (send to logging account)
    - OU (Organizational Unit)
        - abstracted unit within an Organization, can be an `account`, or `nested OU`
    - SCP (Service Control Policies)
        - `IAM policies` applied to `OU or Accounts`
            - must have an explicit allow to use resource
            -  `tree-like hierarchy/inheritance` pattern
    - misc
        - Use `tagging` for billing purposes
        - possible to use `Cross account IAM Roles`


## IAM
- IAM policy, IAM `user groups`
- Password Policy
- MFA:
    - Virtual MFA /  (U2F) Security Key 
    - protect root/ user
- Access Keys
    - use to access CLI/SDK
- IAM `Roles`
    - Provide Services permissions

- IAM Security Tools
    - IAM Credentials Report (account-level)
        -  report that lists all your account's users and their Credentials
    - IAM Access Advisor (user-level)
        - show all users' permission and last access to resource
- `Deny/Allow rule`
    - first. resource `cannot be accessed by default` without ` explict Allow`
    - then, an explict `Deny` will negate all `Allow` statement

- some IAM policy Condition
    - `aws:SourceIp` - restrict the client IP from
    - `aws:RequestedRegion` - restrict the access to services in certain AWS region 
    - `ec2:ResourceTag` - restrict based on tags
    - `aws:MultiFactorAuthPresent` - force MFA
    - `aws:PrincipalOrgID `-  restrict access by AWS Organization (affect member of orgainzation)


- `IAM Roles` vs `Resource Based Policies`
    - support `Resource Based Policies`: Lambda, SNS, SQS, CloudWatch Logs, API Gateway…
    - support `IAM Roles`: most services
    - priority: `IAM Role`  > `Resource Based Policies`
        - When you `assume a role`, any `Resource Based Policies` permission will be discard

- IAM Permission Boundaries
    - specify `the boundry of permission` a `user/IAM role` can get  (not incl groups)
    - even if `other IAM policy` is attached to the user, if permission is outside the boundary, it will be `invaildated` (even admin permission policy)
    - usage: `restrict one specific user` (instead of a whole account using Organizations & SCP)


- IAM Identity Center
    - `single sign-on` for
        - AWS accounts in AWS Organizations
        - identity store in `IAM Identity Center`
        - `3rd party auths`: AD, OneLogin, Okta…
    - Permission Set:
        - provide `user groups` in `IAM Identity Center` access to Account/OUs
![](https://imgur.com/XKvO4PS.jpg)
    - Permissions management in Identity Center
        - Multi-Account Permissions: 
            - Manage access across AWS accounts in your AWS Organization
        - Application Assignments: 
            - SSO access to many SAML 2.0 business applications
        - Attribute-Based Access Control (ABAC):
            - permissions based on users’ attributes (eg. Define permissions now, then modify AWS access by attribute(Junior senior...))

## AWS Directory Services
- manage `Microsoft Active Directory (AD)` (database for security/permissions management)
    - `AWS Managed Microsoft AD`
        - use `Microsoft AD` in AWS or on-premise, manage in AWS 
    - AD Connector
        - Directory Gateway (proxy) to onnect AWS Directory Services and on-premise AD
    - Simple AD
        - AD-compatible managed directory on AWS. No on-premise support. 


- integrate to `Identity Center`
    - Connect `Identity Center` to an `AWS Managed Microsoft AD`: no setup need, out-of-box
    - Connect `Identity Center` to an `Self-Managed Directory(on-premise)`
        - solution1: use `AD Connector` for `proxy`
        - solution2: use  `AWS Managed Microsoft AD` for `Two-way Trust Relationship`
    ![](https://imgur.com/tfdHGEU.jpg)


## AWS Control Tower
- quickly `setup` secure and compliant `multi-account AWS environment` based on best practices
    -  ongoing policy management using `guardrails` (tool within Control Tower)

- Guardrails
    - a wrapper to other service  
        - Preventive Guardrail: prevent account from doing sth
            - using SCPs
        - Detective Guardrail: detect non compliance: (e.g., identify untagged resources)
            - `using AWS Config`
# Encryption
### EBS Encryption (opt-in)
- what are encrypted:
    - encrypted target: `snapshot` or `EBS volumn `
    - benefit of encryption: `Data at rest + data in flight` will be protected. Encryption has a minimal impact on latency
- encryption rules:
    - `snapshots` of `an encrypted EBS` are encrypted
    - `copying a snapshot` have the chance to make it encrypted 
    - `EBS volumn` created from an `encrypted snapshot` will be encrypted
    - `snapshots` of `an unencrypted EBS` will not be encrypted
- How to Encrypt an unencrypted volumn
    - create a snapshot
    - make a `copy` to the snapshot and `choose encryption` 
    - create volumn from encrypted snapshot

- EBS Encryption leverages keys from KMS (AES-256)


## AWS KMS (Key Management Service)
- KMS
    - Keys Types
        - Symmetric (AES-256 keys): `Single encryption key` that is used to `both Encrypt and Decrypt`
            - KMS API provide Symmetric AES-256 encrypt
        - Asymmetric (RSA & ECC key pairs): `Public (Encrypt)` + `Private Key (Decrypt)`
            - used by user outside AWS who cannot call the API
    - price
        - AWS Owned/Managed keys: free
        - User key managed in KMS: 1$/month + API call fee
    - Automatic Key rotation:
        - keys created in AWS: every 1 year
        - Imported KMS Key: only manual rotation 
    - Key `Policies`: control `access` to KMS keys, similar to other `resource policies`
        - `default KMS Key Policy`: `deny all`
        - `Custom KMS Key Policy`: Define users, roles that can access the KMS key  
    - Multi-Region Keys
        - `replicate` your KMS key to other regions, key is used `interchangeably`
        - usage: can Encrypt data in one Region and decrypt data copy in another region seamlessly, `without re-encryption`
        - copy encrypted resource(eg. EBS) snapshot to other region
            - if without Multi-Region Keys, the options are:
                1. decrypt snapshot -> copy to another region -> reencrypt snapshot -> create volumn from snapshot
                2. use `Custom KMS Key Policy` to allow copied region to access the original region's key
    -

## SSM Parameter Store
## AWS Secrets Manager
## AWS Certificate Manager (ACM)

# Network Security
## WAF - Web `Application` Firewall
## AWS Shield - DDoS attack
## Firewall Manager



# Monitor
## CloudWatch 
### CloudWatch Metric
- monitor `metrics`
    - `namespaces`: `filtering/categorizing` metrics
    - Metrics have `timestamps`
    - `Dimension`: `attributes` of a metric (eg. instance id, environment, etc…)
    - Can create `Custom Metrics`  

- Metric Streams
     - `stream metrics` to a `destination` (near real-time)
        - destination: Amazon Kinesis Data Firehose/ third-party
        - can `filter streaming metrics` by `namespaces 

### CloudWatch Logs
- logs
    - `Log groups`:` a set of logs `(eg, myApp1)
    - `Log stream`: `subsets of logs`, (eg myApp1-instance1)
    - `source/ dest`
        - log source
            - anywhere you can think
        - log destination
            - Amazon S3 (exports)
            - Kinesis Data Streams/ Firehose (OpenSearch...)
            - AWS Lambda
    - misc
        - `expiration policies`: how long the log expire
        - `Metric filter` expressions: filter information through Logs
            - eg: find IP inside log, find ERRORs...
        - `Logs Insights:` query logs and add queries to CloudWatch Dashboards
- Export Logs 
    - `S3 export`
        - `not real-time`: data take up to `12 hours` to become available for `export` 
        - use `CreateExportTask API`
    - `Subscriptions Export `
        - `real-time export`
        - use `Subscription Filter`, 
        - log export to:
            - `Lambda`, `Kinesis` Data Firehose/ Data Streams`
    ![](https://imgur.com/ZWL97gg.jpg)
    - `Logs Aggregation Export` 
        - (multiple log source) => `Subscription Filter` => aggregation Kinesis => S3
    ![](https://imgur.com/ryERWPY.jpg)

### CloudWatch Unified Agent
-  run a `CloudWatch agent on EC2 /on-premise OS` to push the `system log` to `CloudWatch`
    - misc:
        - system-level metrics: CPU, RAM, Disk, Net, Processes, Swap Space...
        - Make sure `IAM permissions` are correct
         
### CloudWatch Alarms
- trigger alarm
    - triggers: 
        - `metric`, f(metric)
        - `Composite Alarms`: AND and OR conditions of `many alarms`
        - `Metric Filter`: (eg: too  much ERRORs)
    - Alarm Targets: `EC2`, ASG, SNS => anything...

### CloudWatch Insights
- Container Insights
    - Collect `metrics and logs from containers`
    - misc:
        - `support all AWS container` related: ECS, Fargate, EKS, Kubernetes on EC2
        - use containerized version of the CloudWatch Agent to implement
- Lambda Insights
    - Monitoring `Lambda applications`: OS metrics, `diagnostic information` (cold starts, Lambda worker shutdowns...)
     
- Application Insights
     - automated `dashboards` to your applications and related AWS services. `alert` potential problems(troubleshoot)
    
- `Contributor Insights`
    - Analyze log: `See the top-N contributors to a metric`, find who is impacting system performance




## EventBridge
- EventBridge
    - usage
        1. react to AWS events (eg: IAM user sign-in)
        2. Schedule Cron jobs
    - target: Lambda, SQS/SNS...
    - misc
        - events format is in `JSON`
        - able to `archive events` and `replay` archived events

- event bus: specify the source of event
    - `Default Event Bus`: AWS sevices events
    - `Partner Event Bus`: 3rd party partner app events
    - `Custom Event Bus`: custom app events
- Schema Registry
    - EventBridge can `analyze you events(JSONs)` to infer its `schema`
    - create `Schema Registry` to `generate schema code` for you application, allow `versioning schema`

- `Resource-based Policy`
    - Manage `access permission` for a specific `Event Bus`
    - Use case example: use `Lambda` to aggregate all events from your AWS Organization in a `single AWS account` 
  
## CloudTrail
-  log the `history of events / API calls` made within your `AWS Account` (account level)
    - CloudTrail Events
        - `Management Events`:
            - operations performed to `AWS resources` in a AWS  account (eg: `IAM security`, VPC)
        - CloudTrail Insights Events:
            - `detect unusual activity` in your account
            - create a `baseline` from normal management events, then detect unusual patterns (eg. inaccurate provision, Burst of actions)
        - Data Events: (default off)
            - (eg:  S3 object-level activity)
    - Events Retention:
        - `stored for 90 days` in CloudTrail
        - export: S3/Athena
    - misc:
        - enabled by default
        - log applied to `All Regions` by default
        - destination: `CloudWatch Logs` or `S3`


## AWS Config
- log `resource-level config changes`(eg: S3), and `alert compliance rules`
    1. `config changes`
        - View `config change over time`
        - misc:
            - `filter` resource by type/tag
            - common patterns: SNS/SQS, `-> S3 -> Athena`
    2. `alert compliance rules`
        - set `complience rules`, if `config change` trigger a rule, you will be `alerted` (does not prevent actions)
- Config Rules
    - `AWS managed config rules` (over 75)/ `custom config rules` (defined in Lambda)
    - Rules can be triggered:
        - For each config change
        - at regular time interval     

- setup Remediations
    - setup `automate remediation` of non-compliant resources using `SSM Automation Documents`
        - can setup `Remediation Retries` (retry) if first attemp is not successful
        ![](https://imgur.com/OZgZmpc.jpg)



# Misc
## GuardDuty
## Inspector
## Macie

# architectures
- Intercept API Calls (CloudTrail + EventBridge)
![](https://imgur.com/uH6tPnS.jpg)

## KMS applications
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