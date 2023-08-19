# Well Architected Framework
## general guildline
- use auto scaling
- test system at production scale
    - architectural experimentation
- Design system based on changing requirements: flexible
- design:
    - vertical & horizontal `Scalability`
    - Disposable Resources: servers should be disposable & easily re-configured (IaaCode)
    - Automation: Serverless, Infrastructure as a Service, Auto Scaling…
    - Loose Coupling: not cascade failure
    - Think Services, not Servers

- Well Architected Framework 6 Pillars: they are `synergy`
    - 1) Operational Excellence
    - 2) Security
    - 3) Reliability
    - 4) Performance Efficiency
    - 5) Cost Optimization
    - 6) Sustainability
## 1) Operational Excellence
- ability to `run and monitor systems` to deliver business value and to continually `improve support`

- guideline
    -   Perform `operations as code` - Infrastructure as code
    -   Annotate `documentation` - Automate the creation of annotated documentation after every build
    -   Make `frequent, small, reversible changes` - So that in case of any failure, you can reverse it
    -   `Refine operations procedures` frequently - And ensure that team members are familiar with it
    -   Anticipate failure, `Learn from` all operational `failures`
- `CloudFormation` is a `key service to Operational Excellence` as it prepares, operates, and evolves, but also performs operations as code.

## 2) Security
- ability to protect information, systems, and assets
- guideline
    - Implement a `strong identity`  - Centralize privilege management  - Principle of least privilege - IAM
    - Enable `traceability` - Integrate logs and metrics - CloudTrail,CloudWatch
    - Apply `security at all layers` - Like edge network, VPC, subnet, load balancer, every instance, operating system, and application
    - `Protect data` in transit and at rest - `Encryption`, tokenization, and access control - KMS
    - Reduce or `eliminate` the need for `direct access data` 
    processing of data
    - Prepare for `security events` - increase your speed for detection, investigation, and recovery - Shield, WAF,  Inspector

## 3) Reliability
- Ability of a system to `recover from` infrastructure or service `disruptions`
- guideline
    - `Test recovery procedures` - `simulate different failures` 
    - `Automatically recover` from failure 
    - `Scale horizontally` to increase aggregate system availability - Distribute requests across regions, avoid single point of failure
    - Use Auto Scaling
    - Use automation to make changes to infrastructure

##  4) Performance Efficiency
- use computing resources efficiently as demand changes
- guideline:
    -  `technologies as services` - you can focus more on product development
    -  `Go global` - Easy deployment in multiple regions
    -  Use `serverless architectures` - Avoid `burden of managing servers`
    -  Experiment more often - Easy to carry out comparative testing
    -  Mechanical sympathy - Be aware of all AWS services
## 5) Cost Optimization
- deliver business value at the lowest cost
- guideline
    -  Pay only for what you use
    - `Measure` overall `efficiency` - Use CloudWatch
    -  `Analyze` and `attribute expenditure` - Accurate identification of system usage and costs, `use tags`
    -  Use `managed services` to `reduce cost of ownership` - economic of scale

## 6) Sustainability
- minimizing the environmental(energy) impacts
- guideline:
    - understand your impact – `performance indicators`
    -  Establish `sustainability goals` –  model return on investment (ROI), etc
    -  `Maximize utilization` – maximize the `energy efficiency of the underlying hardware` and `minimize idle` resources.
    -  `adopt new, more efficient hardware and software` offerings 
    -  Use `managed services` – economic at scale
    -  Reduce the `downstream impact` of your cloud workloads – eg. customers workload


## AWS Well-Architected Tool
- `answer questions` about 6-Pillars
- return a `recommendation to setup the architected` that `conform Well-Architected framework`




# Right Sizing
- `Right sizing` is the `process` of `matching resource to your workload performance`  at the lowest possible cost
    - Scaling up is easy `so always start small`
    - look for chance to downsize without compromising
- when to Right Sizing:
    -  `before a Cloud Migration`
    - `continuously after onboarding` (`requirements change` over time)

# AWS Ecosystem - where to find helps 
## questions
- AWS Forums (community)
- AWS re:Post
    - AWS-managed Q&A service 
        - crowd-sourced, expert-reviewed answers to your technical questions
        - Forums alternative
        - AWS `Premium Support customers` can pass their question to AWS support
        - not for time-sensitive issues
- AWS Knowledge Center
    - FAQs in AWS

## Learning
- AWS Blogs: https://aws.amazon.com/blogs/aws/
-  AWS Whitepapers & Guides: official tutorials
-  AWS Quick Starts:  quick solution to a need, cloudFormation template
- AWS Solutions: Vetted solutions and guidance for business and technical use cases
- AWS Training and Certification




## Misc
- AWS Marketplace:  listings from
independent software vendors
    - Custom AMI
    - CloudFormation templates
    - Software as a Service
    - Containers

## support
- AWS Professional Services & Partner Network
    - APN: AWS Partner Network : group of folks(global) very good at AWS and could help your team
        - APN `Technology` Partners: hardware, software, connect...
        - APN `Consulting` Partners: architecture consult
        - APN `Training` Partners: help you learn
        - AWS Competency Program: given to technical proficiency partners
        - AWS Navigate Program: train Partners

- AWS IQ
    - Quickly find `professional help for your AWS `projects
    - `pay` AWS Certified `3rd party experts`
    - marketplace, `kinda like uber`

- AWS Managed Services (AMS)
    - AMS offers `a team of AWS experts` who `manage and operate your infrastructure` 
    - Helps organizations offload routine management tasks
        - change requests, 
        - monitoring, 
        - patch management, 
        - security
        - backup services
    - available 24/365