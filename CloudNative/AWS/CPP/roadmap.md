# Cloud computing

- Cloud Computing:
    - The on demand delivery of compute power, database, storage, applications and other IT resources
    - pay as you go service

- Three types of clouds:
    - private cloud: (eg rackspace), used and managed by a single organiztion 
    - publilc cloud: owned and operate by third party cloud service providers (AWS, Azure, Google Cloud)
    - Hybrid Cloud: keep some servers on premises and extend the capabilities to the cloud



- 5 characteristics of Cloud
    - self-services
    - Resource available to the network
    - multi-tenancy and resource pooling:
        - multiple customers can share the same infrastructure, but still with security and privacy
    - Rapid elasticity and scalability
        - quickly acquire/dispose resource, scale up/down (on demand)
    - Measured service:
        - like hydro, usage is measured, and pay according to the measure
- 6 benefit of cloud: save cost and spare the planning
    - Trade `capital expense` for `operational expense`
        - renting insead of owning 
        - save cost in data center maintainance 
    - economies of scale: AWS is more efficient in large scale
    - Stop guessin gcapacity, use on demand
    - high speed and agility
    - Easy global expansion: AWS global infrastructure
    - fault tolerance

## IaaS vs PaaS vs SaaS

|name|for|role|example|
|-|-|-|-|
| Iaas |Infrasture as a Service| provide building block: networking, computing, data storage|AWS EC2,  Azure, Digital Ocean, GCP, Rackspace, Linode|
| PaaS |Platform as a Service| Remove need to configure infrastructure but focus on deployment and management of applications|AWS Elastic Beanstalk, Heroku, FIrebase, Windows Azure|
| SaaS |Software as a Service| Complete web software to use|AWS service (Rekognition for ML...), zoom, dropbox|

![](https://imgur.com/1tJl1Kz.jpg)

## Scalability, High Availability, Elasticity

|vertical scalability|Horizontal Scalability/Elasticity|High Availability|
|-|-|-|
|individual upgrade|number of instance|cross availability zone|
|t2.nano to t2.large|10 instances to 100 instances|US-East and US-West|

### Scalability: 
- means that an application or system can handle greater load
- Two kinds of Scalability:
    - `vertical scalability`: increase the capacity of individual (eg, from t2.micro to t2.large)
        - common for `non-distributed systems`, such as `database`
        - Scalability limit: hardware limit
    - `Horizontal Scalability = Elasticity`: increase the number of instances(nodes) in the system (eg. hire more staff, use more AWS EC2 instances)
        - horizontal scaling implies `distributed system`
        - very common for `web applications/ modern applications`
    - `Elasticity`: the system have some level of `auto-scaling` based on the load, for example, AWS on-demand, pay-per-use usage

### High Availability
Horizontal Scalability is linked but different to High Availability
- `High Availability` means `running your application /system across multiple (at least two) availability zones`
    - eg. setup your application in both US-East and US-West
    - High Availability automatically implies `distributed system`
    - the goal is to survive a data center loss/disaster

## Certification roadmap
![](https://imgur.com/MUJ7yC6.jpg)

## misc
### paying rule of AWS

|type|charge by|
|-|-|
|Compute|compute time|
|Storage|amount of data|
|Data IO|transfer in is free, charge by `data out`|

## `shared responsibility model` (AWS limited responsibility)
![](https://imgur.com/l1B2x1b.jpg)
AWS take responsibility of `the infrastructure`
Customer take responsibility of `using the infrastructure`

- Use policy:
    - No illegal harmful or offensive use of content
    - no security violation
    - no network/Email/Messages abuse
# AWS services overview
- Here are some of the most popular AWS services

|||
|-|-|
|Identity and Access Management (IAM)|Manage access to AWS resources|
|Amazon EC2 (Elastic Compute Cloud)| EC2 provides scalable computing capacity in the cloud. You can launch virtual machines (VMs), called `instances`, and `configure security, storage, and network` settings.|
|Amazon Elastic Container Registry (Amazon ECR)| ECR is a fully managed `Docker container registry` that makes it easy to store, manage, and deploy Docker images. |
|Amazon Elastic Kubernetes Service (EKS)|Fully managed `Kubernetes` control plane|
|AWS CodeDeploy, CodePipeline, CodeBuild, CodeCommit|`CICD`|
|Amazon S3 (Simple Storage Service)| S3 is an object storage service that provides `unlimited storage capacity for data and files`. It is designed for high durability and scalability, making it a popular choice for storing and retrieving `large amounts of data`.|
|Amazon DynamoDB|A fast and flexible NoSQL database service for any scale|
|Amazon RDS (Relational Database Service)| RDS is a managed `relational database service` that makes it easy to set up, operate, and scale a relational database in the cloud. It `supports popular database engines` such as Amazon Aurora, `MySQL`, MariaDB, Microsoft SQL Server, and Oracle.|
|Amazon Lambda| Lambda is a `serverless computing service` that `lets you run code without thinking about servers`. You can use Lambda to build and run applications and services, as well as to extend other AWS services with custom logic.|
|Amazon VPC `(Virtual Private Cloud`)| VPC is a logically isolated section of the AWS Cloud where you can `launch AWS resources in a virtual network that you define`. You can use VPC to secure and control access to your resources and data, as well as to connect to other VPCs or your own on-premises data centers.|
|Amazon CloudFront| CloudFront is a `content delivery network (CDN)` that speeds up the `delivery of static and dynamic web content, such as HTML, CSS, JavaScript, and images`.|
|Amazon SNS (`Simple Notification Service`)| SNS is a fully managed `messaging service` that enables you to send messages to a variety of endpoints, such as `email addresses, mobile devices, and HTTPS endpoints`.|
|Route 53 |A reliable way to route users to internet applications: registering a domain, configuring `DNS`, route control...|

### AWS UI

|||
|-|-|
|AWS cli|cli tool|
|AWS CloudShell|web-based cli|


### AWS SDK
- supports: JS, Python, PHP, .NET, Ruby, Java, Go, Nodejs, C++
- mobile SDKs: Android, IOS
- IoT Device SDKs(Arduino...)

# AWS global

## region
- AWS has `regions` around the world. 
- a region is `a cluster of data center` with name like `us-east-1`
- `region` is of several (usually 3, max 6) `zones`

![](https://imgur.com/GzMnlwU.jpg)

### available zones (AZ) 
- each region have multiple available zones 
    - eg: `us-east-1a, us-east-1b, us-east-1c`
- each zone is `one or more` `data center`: guarantee to be isolated from disaters
- Each data centers with redundant power, networking, and high speed connectivity

### Edge locations (points of presences)
- 216 points of presence (205 edge locations & 11 regional caches) in 84 cities /42 countries
- for CDN (cloudFront)
### [AWS Regional Service List (link)](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/)
### What to consider choosing an AWS region?


|||
|-|-|
|Compliance|data governance and legal requirement: where the data located and go|
|Proximity|latency reduce|
|Feature availability|some features might not be available to certain regions|
|Price|pricing veries regional region|
 