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
- migrate databases to AWS
    - source database remains available during the migration
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