# Gitlab CICD
- [lecture](https://www.youtube.com/watch?v=qP8kir2GUgo)
- [repo](https://gitlab.com/nanuchi/gitlab-cicd-crash-course)


- gitlab Server and gitlab Runner
  - pipeline job are run by `Gitlab Runners` (SaaS)
  - gitlab still allow some **Customization**, eg. use your own source code server

- gitlab pipeline is written in yaml (.gitlab-ci.yml)
- gitlab runners use Docker containers

### .gitlab-ci.yml

- general guides to write a automatic pipeline
  - disable all `interactive elements` (eg. user y/n confirmation) 
  - set things `quite` so there are no stdout


- define a `job`
```yaml
image: specify parents docker layer from dockerHub 

before_script: preparational commands run before 'script' 

script: the job (test, build, deploy, etc)

after_script: comments that run after each job, including resolve failed job  
```

- `service` (parallel job), and `stage` (add stage to jobs)
```yaml
services: another container that run in parallel with the job container. Provide services during the job execution(eg. run a database container)
stage: Multiple jobs in the same stage are executed in parallel; Jobs in later stage run after the previous stage
```


### Variables, Secrets:
- setting => CI/CD => Variables
- store things like credientials for other services (eg, dockerHub) that need to hide from the repository
- **Mask Variable**: Variables containing secrets should always be masked, masked variables will not be logged in job output
- **file Type** variable:
  - value is saved to a temporary file
  - The variable stored path to the temporary file


### .gitlab-ci.yml snippet

```yaml
variables:
  IMAGE_NAME: nanajanashia/demo-app
  IMAGE_TAG: python-app-1.0

stages:
  - test
  - build
  - deploy

run_tests:
  stage: test
  image: python:3.9-slim-buster
  before_script:
    - apt-get update && apt-get install make
  script:
    - make test


build_image:
  stage: build
  image: docker:20.10.16
  services:
    - docker:20.10.16-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - docker login -u $REGISTRY_USER -p $REGISTRY_PASS
  script:
    - docker build -t $IMAGE_NAME:$IMAGE_TAG .
    - docker push $IMAGE_NAME:$IMAGE_TAG


deploy:
  stage: deploy
  before_script:
    - chmod 400 $SSH_KEY
  script:
    - ssh -o StrictHostKeyChecking=no -i $SSH_KEY root@161.35.223.117 "
        docker login -u $REGISTRY_USER -p $REGISTRY_PASS &&
        docker ps -aq | xargs docker stop | xargs docker rm &&
        docker run -d -p 5000:5000 $IMAGE_NAME:$IMAGE_TAG"
```

# TODO:
- Artifacts
  - test reports, passing data
- Caching:
  - speed up pipeline and save cost
- job templates
  - avoid code duplication
- setup own runners, local or remote
- use built-in docker registry

