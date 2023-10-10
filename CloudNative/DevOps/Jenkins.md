# Jenkins
[course](https://www.youtube.com/watch?v=6YZvp2GwT0A)
[github](https://github.com/mlpppp/jenkins-101)

- `Jenkins`: `open source` CICD automation platform: Test, Build, Deploy Pipeline


- `Jenkins Infrastructure`:
    - `Master Server(admin)`: control pipeline, schedule builds
    - `Agents(Runner)`
        - `Pernament Agents`: any linux server
            - require `java` runtime
            - `connect to Master` Server via `SSH`
        - `Cloud Agents`: automatically spawn ephemeral agents that run on demand, (eg. `docker, AWS AMI...`)
            - use plugins + config certain cloud provider
    - `Labels`: Labels (or tags) are used to group multiple agents into one logical group.
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
### Nodes (`Pernament Agents/Slave Agent`)
- [ref video](https://www.youtube.com/watch?v=fphtfmAsfhU)
    - Manage Jenkins -> Nodes -> New Node
    - configure the node's Label and SSH/credientials, etc
    - run two command inside the agent machine (require Java runtime installed)

### Cloud (`Cloud Agents`)
- Manage Jenkins -> Cloud -> Install Plugin for the Cloud Provider
    - setup EC2 Cloud [FollowVideo](https://youtu.be/RkaqRsockfg?t=1156) 

# Setup Jobs 
- Job: 
    - A job may contains multiple build.
    - Job is a config/template on how builds are run
        - build trigger
        - source code Repository
        - build runner (Label)
        - pre-build actions 
        - build environment var/files
        - build actions
        - after build actions
- Build: 
    - builds are actual tasks that run in the runner
    - build will be logged

## Setup Source Repository
- provide `Git repository url`, will automatically clone the repo to job folder
    - public repo don't need any Credential
    - private repo need to setup Credentials

### Setup ssh between Jenkins and Github
- [video](https://www.youtube.com/watch?v=9-ij0cJLDz4)
- [generate SSH Keypair](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- setup `public key` in Github Setting
- In Job configuration, add `private key` to the Git repo crediential 
    - kind: SSH Username with private key
    - Username: should be Github.com username

- troubleshoot
    - provide ssh url to the repo (eg: git@github.com:mlpppp/repoName)
    - test ssh to github: ssh -T git@github.com
    - Manage Jenkins -> Security -> Git Host Key Verification Configuration -> Accept first connection


## Setup Build Trigger
- pull SCM: periodically scan for change (eg, 5 mins)
    - [follow](https://youtu.be/6YZvp2GwT0A?t=2882)
- `github webhook` (github send notification to jenkins)
    - [follow](https://www.youtube.com/watch?v=PhxZamqYJws)
    - Select `GitHub hook trigger for GITScm polling`
    - whithlist Github hook ips in Jenkins Server's firewall 
        - eg: Security Group, allow Custom TCP from Github ips to port 8080 (where Jenkins run)
        - about [github IP range](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-githubs-ip-addresses) [meta](https://api.github.com/meta)
        - [ref] (https://stackoverflow.com/questions/48930089/setup-github-webhook-for-jenkins-installed-on-aws-ec2)
    - Github -> Settings -> Webhooks -> Add webhook
        - Payload URL: Jenkins Master url (eg. http://ec2-XX-XXX-XX-XXX.eu-west-1.compute.amazonaws.com:8080/github-webhook/)
        - Content type: json




# Pipeline (Groovy), 
- `Declarative pipeline`: write pipeline inside a `Jenkinsfile` and link jenkins job to the file
    - use `Pipeline script from SCM`
- Agent vs Node:
    - Node can be thought of as a `single worker machine` that execute your pipeline's steps. `Node can use label but Agent cannot`
    - Agent is used in `Declarative pipeline` context, represents a machine (Node) where `pipeline stages` are executed
- keywords
    - agent: It is defined for either an entire pipeline or a specific stage.
    - node: A node is a machine that executes an entire workflow, 
    - label: use label to group nodes
    - triggers: trigger to run a build
    - stage: each stage performs a specific task.
    - steps: a sequence of command to be run sequentially

```groovy
pipeline {
    agent { 
        node {
            label 'docker-agent-python'
            }
    }
    triggers {
        pollSCM '* * * * *'
    }
    stages {
        stage('Build') {
            steps {
                echo "Building.."
                sh '''
                cd myapp
                pip install -r requirements.txt
                '''
            }
        }
        stage('Test') {
            steps {
                echo "Testing.."
                sh '''
                cd myapp
                python3 hello.py
                python3 hello.py --name=Brad
                '''
            }
        }
        stage('Deliver') {
            steps {
                echo 'Deliver....'
                sh '''
                echo "doing delivery stuff.."
                '''
            }
        }
    }
}
```
# Misc
### Commonly Jenkins env var
- commonly used:
    - JOB_URL: Full URL of this job\
    - BUILD_URL: Full URL of this build
    - BUILD_ID: The current build ID

# Hands-on (TODO): 
- try to migrate [this](https://gitlab.com/nanuchi/gitlab-cicd-crash-course) to Jenkins

