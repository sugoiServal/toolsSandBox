# Jenkins
[course](https://www.youtube.com/watch?v=6YZvp2GwT0A)
[github](https://github.com/mlpppp/jenkins-101)

- `Jenkins`: `open source` CICD automation platform: Test, Build, Deploy Pipeline


- `Jenkins Infrastructure`:
    - Master Server(admin): control pipeline, schedule builds
    - Agents(Runner)
        - `Pernament Agents`: any linux server
            - require `java` runtime
            - `connect to Master` Server via `SSH`
        - `Cloud Agents`: ephemeral agents that run on demand, (eg. `docker, AWS AMI...`)

- Pipeline:
    - Commit to repo 
    -> Master Server aware of the commit(webhook, etc), 
    -> Master Server `trigger pipeline`
    -> Master Server `select Agent` based on `Configured Labels` 
    -> Agent runs `build (aka. bunch of bash scripts)`


- `Freestyle Build` vs `Pipelines`
    - Freestyle Build: 
        - feels like bash script triggered by different events
        - use a web GUI,  easy to setup. Good for learning.
        - not as popular as Pipeline, but still seen in workplace
    - Pipelines:
        - use Groovy Syntax. Similar to your yaml pipeline in other tools
    



# Jenkins file system
```bash
# initial adminPassword
/var/jenkins_home/secrets/initialAdminPassword

# job outputs files location
/var/jenkins_home/workspace/

```

### Docker Volume
- you need to specify docker volumes if Jenkins is running inside docker. Otherwise Jenkins will keeps reset each time you run the container
    - volumes saves: user infomation, plugins, run datas...
```bash
docker run --name jenkins-blueocean --restart=on-failure --detach \
  --network jenkins --env DOCKER_HOST=tcp://docker:2376 \
  --env DOCKER_CERT_PATH=/certs/client --env DOCKER_TLS_VERIFY=1 \
  --publish 8080:8080 --publish 50000:50000 \
  --volume jenkins-data:/var/jenkins_home \
  --volume jenkins-docker-certs:/certs/client:ro \
  myjenkins-blueocean:2.332.3-1
```
 

# Setup Jenkins Agents

### Agents Label

# Create Jobs
## Setup Source Repository
- After setting up Source Code Repo, when the job run code will be automatically clone to job folder
    - public github repo don't need any Credential
    - private github repo need Credentials

## Setup Build Trigger(TODO)
- webhook



# Write Pipeline

### Hands-on (TODO): 
- try to migrate [this](https://gitlab.com/nanuchi/gitlab-cicd-crash-course) to Jenkins

