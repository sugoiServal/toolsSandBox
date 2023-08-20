# Jenkins
[course](https://www.youtube.com/watch?v=6YZvp2GwT0A)
[github](https://github.com/devopsjourney1/jenkins-101)

- `Jenkins`: automation platform: Test, Build, Deploy Pipeline
    - web GUI

- Infrastructure:
    - Master Server: control pipeline, schedule builds
    - Agents(Runner)
        - `Pernament Agents`: any linux server
            - need java runtime
            - Master Server connect to it via SSH
        - `Cloud Agents`: ephemeral agents that run on demand, via various template(`docker, AWS AMI...`)

- Commit to repo 
    -> Master Server aware of the commit, and `trigger pipeline`
    -> Master Server `select Agent` based on `Configured Labels` 
    -> Agent runs `build (eg. bash scripts)`


- Freestyle Build vs Pipelines
    - Freestyle Build: 
        - feels like bash script triggered by different events
        - easy setup by web GUI, for learning
    - Pipelines:
        - `real-life` way to use Jenkins
        - use Groovy Syntax
    


## Pipeline
- Pipeline are divide by stage, common stages are:
    - Clone: fetch from codebase
    - Build: build the application
    - Test: run tests
    - Package: ready to deploy
    - Deploy 
