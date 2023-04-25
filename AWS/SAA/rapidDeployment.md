# Elastic Beanstalk 
- `Deploying` an application (`upload codes`) use the `typical architecture presets`
    - use CloudFormation => EC2, ASG, ELB, RDS... resources
    - free but pay for underlining resource

- Components
    - `Application`: environments + code
    - `Application Version`: manage Application Version
    - `Environment`: AWS resources to run an application 
        - web Server tier (incoming request)
        - Worker tier (cloud computing)

![](https://imgur.com/C5GHB6p.jpg)
![](https://imgur.com/hDUfnLR.jpg)

- Deployment
    - dev: can use `Single Instance`
    - Prod: good to use High Availability with Load Balancer (ELB, ASG, multi-AZ)


# AWS App Runner
- deploy `code` or `container image` at scale without worry about infrastructure (web applications and APIs)
    - No infrastructure experience required
    - ASG, highly available, ELB, encryption, VPC, Database...
    - Use cases: web apps, APIs, microservices, `rapid production deployments `