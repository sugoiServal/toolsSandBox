# [What is DevOps](https://about.gitlab.com/topics/devops/)


# [What is CI/CD?](https://about.gitlab.com/topics/ci-cd/)
- **continuous integration** and **continuous delivery**
- **What it does**: automates manual work from a commit into production: build, test, deploy, infrastructure provisioning... 
## What is continuous integration (CI)? 
- the practice of: integrating all your code changes into the main branch of a shared repository, automatically **testing** each change, **merge** them, and automatically kicking off a build (as Docker).

- 8 key practices 
  - A single source repository
  - Frequent check-ins to main branch: 
    - Avoid sub-branches and work with the main branch only
    - Use small segments of code and merge them into the branch as frequently as possible
    - Don't merge more than one change at a time.
  - Automated builds
    - Scripts should include everything you need to build from a single command.
    - i: the code; o: a usable application.
  - Self-testing builds
    - failure of a test results is a failed build
  - Frequent iterations
  - Stable testing environments
    - test in a cloned environment that's as close as possible to the production environment
  - Maximum visibility
    - Every developer should be able to access the latest executables and see any changes made to the repository
    - everyone can monitor progress and identify potential concerns.
  - Predictable deployments anytime
    - CI/CD testing and should be rigorous and reliable, making deployments so routine and low-risk that the team’s comfortable doing them anytime.

## What is continuous deployment (CD)? 
- the practice of: DevOps teams set the criteria for code releases ahead of time and when those criteria are met and validated, the code is deployed into the production environment. 
- CI practice is the Prerequisite of CD 

## pro of CI/CD

  - merging changes frequently can minimize the possibility of code conflict beacuse of auto testing
  - don't have to wait long for feedbacks and can fix bugs while the topic is still fresh. (real-time feedback makes it easier to work on one, less context switching and minimize cognitive load. )
  - Continuous deployment practices mean frequent small software updates so when bugs appear, it's easier to pin them down.
  -  Breaking work into smaller, manageable bites means it's easier to complete each stage on time and track progress. 

## GitLab CI/CD
- similar CI/CD products(platforms)
  - Azure Pipelines, Jenkins, AWS CodePipeline...
  - Gitlab: SaaS, everything maintained by Gitlab 

- gitlab Server and gitlab Runner
  - **pipeline job**: Running source code through the pipeline is a computational intense work so it is called a job. Gitlab managed servers provide the computational service. These servers are **Gitlab Runners**
  - gitlab provide some level of **customization**, for example connect the source code server to your own runner.
  
### use Gitlab infrastrature and free features [course](https://www.youtube.com/watch?v=qP8kir2GUgo) [repo](https://gitlab.com/nanuchi/gitlab-cicd-crash-course)
- the whole pipeline is written as script (.gitlab-ci.yml)
- gitlab runners use Docker containers

### .gitlab-ci.yml
- general guides to write a pipeline
  - we want to disable all interactive steps in commands
  - set things quite
```bash
image: specify parents docker layer available in dockerHub (the default is ruby if no image specified)

before_script: preparational commands that should be run before 'script' 

script: script of the job (test, build, deploy, etc)

after_script: comments that run after each job including solving failed job  

services: service is another container taht run in parallel with the job container to provide some kinds of service during the job execution(most common use case is to run a database container)

stage: Jobs that belongs to different stage run in the defining stage order, multiple jobs in the same stage are executed in parallel
```
### project variables:
- setting => CI/CD => Variables
- store things like credientials for other services (eg, dockerHub) that need to hide from the repository
- **Mask Variable**: Variables containing secrets should always be masked, masked variables will not be logged in job output
- **file Type** variable:
  - value is saved to a temporary file
  - The variable stored path to the temporary file

## gitlab CICD more to learn(TODO):
### Gitlab features
- Artifacts
  - test reports, passing data
- Caching:
  - speed up pipeline and save cost
- job templates
  - avoid code duplication
- setup own runners, local or remote
- use built-in docker registry
### CI/CD use cases
- Docker Compose
- Kubernetes
- Microservices
- Multi-Stage
- Dynamic Versioning
- Config SAST tests
