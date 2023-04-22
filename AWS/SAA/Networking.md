# Elastic IP
- Elastic IP - fixed public IP, rare used, alternatives
    - use `Route 53` DNS record automatically update to IP change  ("DNS Failover Policy" + health check)
    - `ELB`: use load balancer's domain name

- can only have 5 Elastic IP in your account (can ask to increase)

# ELB
- ALB expose an DNS
- NLB has one `static IP per AZ`, and `supports Elastic IP`

# ENI - Elastic Network Interfaces
- `virtual network card`, 
    - properties:
        - Primary private IPv4 (may + multiple private IPv4)
        - One Elastic public IP per private IPv4
        - One temp Public IP per instance
        - a MAC address
        - belonging security groups
    - `attachable/detachable`
        - attributes will be transfered, good for `failover`
        - one EC2 instance can have multiple ENI 
    - `Bound to an AZ`
- default ENI: 
    - creating EC2 instance will auto create an ENI for it, will be deleted after terminate the instance



# Route 53
- `Authoritative DNS(DNS server, DNS management) + Domain Registrar`, global service

- terms
    - `DNS Records`: contain routing information about an domain name
    - `Zone File`: a file containing `DNS records`, in a `hosted zone` context
    - `Hosted Zone`:  A `container` for `DNS record` for `routing purpose`, used by Name Server to resolve DNS query
        - Public Hosted Zones, Private Hosted Zones
    - `Name Server(NS)`: resolves DNS queries (Authoritative or Non-Authoritative)


- a DNS record includes 
    - `Domain Name(Second Level Domain (SLD))`: e.g., example.com.
    - `subdomain Name`, eg  `demo.`example.com.
    - `Record Type` – e.g., A/AAAA/CNAME/NS
    - `Value` – e.g., 12.34.56.78
    - `Routing Policy` – how Route 53 responds to queries
    - `TTL` – amount of time `cached DNS record` are served to client, instead of `querying the Name Server` again
    
### `record types`
- A – maps a hostname to IPv4
- AAAA – maps a hostname to IPv6
- CNAME – maps a hostname to another hostname
    - Can’t create a CNAME record for the top node (`Zone Apex`), eg. `example.com`
    - alternative: use `Alias`
- NS – DNS name/IP of the `Name Server of the Hosted Zone`
    - Name Servers are owned by AWS, eg: ns-252.awsdns-31.com.

### Record TTL
- how long 
    - `High TTL`: e.g., 24 hr. Route 53 traffic `low`, 
        - `user may get outdated record for a day!!!`
    - `Low TTL`: e.g., 60 sec. Route 53 traffic `high`, 
        - `more cost, easier to change records`

### CNAME vs Alias
- CNAME:
    - Points a hostname to `any other hostname`. 
    - not works for top node (`Zone Apex`), eg. `example.com`
    - can set TTL
- Alias (an AWS record type): 
    - can point top node (`Zone Apex`) to `AWS resource hostname` (eg. lb1-1234.us-east-2.elb.amazonaws.com(`ALB`))
    - `cannot set TTL` when use Alias
    - `cannot` set Alias to an `EC2 DNS name`


### Health Check
- `AWS health checkers`
    - About 15 global health checkers (in AWS public domain) will check the endpoint health (200 status)
    - Route 53 consider resource unhealthy if < 18% of health checkers report healthy
    - Must allow AWS health checkers IP range
- `Calculated Health Checks`
    - Combine the results of multiple Health Checks into a single Health Check (OR, AND, or NOT rules)
    - `Usage`: perform maintenance to your website without causing all health checks to fail
- `Private Resource Health Check - CloudWatch Alarm`
    - `AWS health checkers` are public, cannot check private resource
    - solution:
        - create a `CloudWatch Metric`
        - associate a` CloudWatch Alarm`
        - create a `Health Check that checks the alarm` 


## Routing Policies
- define how DNS server responds when `multiple IP(resource)` are associated to the `same domain name`

- Simple
    - choose a `random` IP
    - no Health Checks
- Multi-Value
    - return multiple values/resources to query
    - with Health Checks

- Weighted
    - define `x% of the query` that go to each resource
    - with Health Checks
    - an `load balancing mechanism` between resources
    - assign 0% stop traffic to resource. if all set to 0% then traffic will be equally balanced 
- Latency
    - return `resource with least latency to client` (handshake time)
    - with Health Checks, has a failover capability
- Geolocation
    - route to the `closest record` to `user location`
    - need a `Default Routing Record` if user location is not available
    - with Health Checks, has a failover capability

- Geoproximity
    - Use resource `bias` to shift more/less traffic to resource
        - increase bias (1 - 99) => more user traffic
        - shrink bias (-1 - -99) => less user traffic
    -  must use `Route 53 Traffic Flow` to use this feature
    - `use case`: want to route `based on location in general`, but also `focus/avoid certain resource`
- IP based
    - provide `a list of CIDR` (client `IP address range`), route each CIDR to its corresponding resource
    - use case: Route end users from a particular `ISP to a resource`
- Failover
    - return `primary resource` if it passed the `Health Check`, otherwise return the `Secondary resource`
    - must associate a `Health Check` with the `Primary resource`, 
    - Health Check to secondary resource is optional


### Domain Registar
- Route 53 also privde Domain Registar, you can
    - buy Domain Name else where and use Route 53 DNS service for management
    - buy Domain Name in Route 53 and manage else where
- import 3rd-party domain name 
    - Create a Public Hosted Zone in Route 53
    - Update `Route 53 NS Records` to 3-rd party website `NS Records`



# CloudFront
- Content Delivery Network (`CDN`):     
    - `improves read performance` by `cached static contents` at the `edge`, with TTL, use `AWS Network`
    - integrated with `Shield`, `WAF` (DDOS protection)

- Cacheable resources
    - S3
    - Any HTTP endpoint
        - AWS resource: ALB, EC2.., 
        - Any non-AWS HTTP backend

- CloudFront `security` setup
    - resource must allow `Public IP of Edge Location` (there is a list)
    - use  `CloudFront Origin Access Control (OAC)` to enhance security


- CloudFront Geo Restriction
    - `control access to you Content` by `country` (allowlist, blocklist)
    - Use case: `control County access to content`
    - misc
        - “country” is determined using a 3rd party `Geo-IP database`

- CloudFront `Cache Invalidation`
    - `manually request cache refresh `
        - target
            - all files (*)
            - a special path (/images/*)
    - usage: TTL too long for an update

### Price Classes
- CloudFront are priced by `amount of data(eg.TB) cached` in edge locations. 
- edge regions (eg. NA, Europe...) are priced differently
- `Price Classes` help you reduce cost by `providing less serving regions`
    - Price Class All
    - Price Class 200: excludes the most expensive regions
    - Price Class 100: only the least expensive regions



# Global Accelerator
- use `AWS private network` to route client to your AWS application deployment
    - client -> `cloest Edge Location` -> AWS network 
        - use `Anycast IP`: all edge Location hold the same IP address, the client is routed to the nearest one
    - `servering endpoint` options
        - Public IP, EC2 instance
        - ALB, NLB
    - usage: 
        - `Improves performance`(AWS network)
        - edge location `Proxying packets`
        - Good for `non-HTTP` use cases, such as `gaming` (UDP), `IoT` (MQTT),
        - Good for `HTTP` use cases that require `static IP addresses`, fast `regional failover`
    - misc: 
        - integrated with `Shield`, `WAF` (DDOS protection)
        - global service
