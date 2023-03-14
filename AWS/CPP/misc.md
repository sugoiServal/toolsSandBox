# Amazon Cognito
- create `user Identity (id)` for `Web and Mobile applications` users login with Oauth
![](https://imgur.com/N2yqQpp.jpg)


# AWS Directory Services
- use `Microsoft Active Directory (AD)`

# Amazon WorkSpaces
- Managed `Desktop as a Service (DaaS)` solution to `provision Windows or Linux desktops `
> A hybrid company would like to provision desktops to their employees so they can access securely both the AWS Cloud and their data centers.
- to `eliminate management` of `on-premise VDI (Virtual Desktop Infrastructure)`


# Amazon AppStream 2.0 
- Desktop In-browser Application:  `content/desktop Streaming Service`, 
    - `stream content/ desktop applications` to any computer `without acquiring infrastructure`


# Amazon Sumerian
- Create and run virtual reality (`VR`), augmented reality (`AR`), and `3D applications`
    -  create `3D models` with animations
    - `render` show through `browser`/ AR,VR hardware

# AWS IoT Core
-  allows you to easily `connect IoT devices` to the `AWS Cloud`
- Serverless, secure & scalable
- Integrates with a lot of AWS services (Lambda, S3, SageMaker, etc.)

![](https://imgur.com/pKeRqk7.jpg)


# Amazon Elastic Transcoder
- `transcode media file in S3`
    - Highly scalable – can handle large volumes of media files and large file sizes
    - media duration based pricing
    - Fully managed
![](https://imgur.com/3ePXvR5.jpg)

# AWS AppSync
- `Store and sync data `across `mobile` and `web` apps
- technology:
    - `GraphQL`
    - DynamoDB / Lambda Integration 

# AWS `Amplify`
- A `set of tools and services` to `develop` and `deploy` `full stack/ mobile` app
    - leveraging AWS services with your config: `wrapper of services`

# AWS Device Farm
- tests your web and mobile against `desktop browsers`, real `mobile devices, and tablets`
    - device settings (GPS, language, Wi-Fi, Bluetooth, …)
    - Run tests concurrently on multiple devices

- fully-managed



# AWS DataSync
- `synchronize(replicate)` large amount of `data from on-premises to AWS`
    - Can synchronize(replicate) to: S3, EFS, FSx
    - The replication tasks are `incremental` after the first full load

![](https://imgur.com/OS76gCe.jpg)

# AWS Backup
- `centrally manage` and `automate` `AWS services backups`
    - corss-Resion/corss-account backup
    - event-driven/scheduled backups
    - Supports PITR (Point-in-time Recovery)
![](https://imgur.com/nsp4ShS.jpg)
# Disaster Recovery
## Cloud Disaster Recovery Strategies 
### price 1: backup and restore
backup to S3, restore when disaster happens
### price 2: Pilot Light
backup app core function to running EC2, no scale, minimal setup
### price 3: Warm Standby
backup full version of app to running EC2, but not scale
### price 4: Multi-Site / Hot-Site
backup full version of app, at full size to running EC2
### alternative: multi-region services, failover to another region with route 53
## AWS Elastic Disaster Recovery (DRS)
- used to name `CloudEndure Disaster Recovery`
- `recover` your in-premise/cloud data center continuously intto AWS cloud

# Migration
## AWS `Application Discovery` Service
- `plan` your `migration` from local to the cloud
    - `scan server`, gather usage data, dependency maps..
- types of scan:
    - `Agentless Discovery` (AWS Agentless Discovery Connector): `less information`
        - VM inventory, configuration, and performance history such as `CPU`, `memory`, and disk usage
    - `Agent-based Discovery` (AWS Application Discovery Agent): `more information`
        - `System` configuration, system performance, running `processes`, and details of the network connections between systems

- Resulting data can be viewed within `AWS Migration Hub`

## AWS `Application Migratio`n Service (MGN)
- simplified migrating applications to AWS
- Converts your physical, virtual, and cloud-based servers to run natively on AWS
- Minimal downtime, reduced costs

![](https://imgur.com/9FKBEQt.jpg)
# AWS Fault Injection Simulator (FIS)
-  running `fault injection experiments` on AWS workloads
- `fault injection experiments`: Based on `Chaos Engineering` – stressing an application by creating `disruptive events` (e.g., sudden increase in CPU or memory), observing how the `system responds`, and
`implementing improvements`
- Supports the following AWS services: EC2, ECS, EKS, RDS…
![](https://imgur.com/yNW5He9.jpg)
# AWS Step Functions
- `serverless` visual `workflow` to `orchestrate your Lambda functions`
- integrate with EC2, ECS, On-premises
servers, API Gateway, SQS queues, `human-approve interface`, etc
- Use cases: order fulfillment, data processing,
web applications, any workflow

![](https://imgur.com/JGEtMDF.jpg)
# AWS Ground Station
-  lets you `control sattelite communications`, `obtain process satellite data`
- global network of satellite
ground stations -> AWS resource -> user access
    - Send satellite data to S3 or EC2 instance
- Use cases: weather forecasting, surface
imaging, communications, video broadcasts
# Amazon Pinpoint
- 2-way (outbound/inbound) `marketing communications service`
    - personalize messages with the
right content to customers
    - can receive replies
    - send Pinpoint events to other services

- Use cases: run campaigns, transactional SMS messages


- Versus Amazon `SNS` or Amazon `SES`
    - in SNS & SES `you managed each message's audience`,
`content`, and delivery schedule
    - In Amazon Pinpoint, you create message templates
# AWS Cloud9
- An AWS `IDE in the cloud` (writing, running, debugging codes)
- Allows `code collaboration` (pair programming)