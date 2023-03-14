# EC2
### spot instance
- Define max spot price and get the instance while current spot price < max 
    - If the current spot price > your max price you can choose to `stop` or `terminate` within 2 mins
        - stop: you keep the state so it might resume
- How to terminate Spot Instances
    - Cancelling a Spot Request does not terminate instances, 
    - if instances are terminated first, new spot instances will be created to accomodate the request 
        - You must `first cancel a Spot Request`, 
        - then `terminate the associated Spot Instances`

### Spot Fleets
    - Spot Fleets = set of Spot Instances + (optional) On-Demand Instances