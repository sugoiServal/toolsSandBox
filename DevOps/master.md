- **Openstack** is a Infrastructure as a Service/Private Cloud Platfrom. You could also look at it as a way to orchestrate Virtual Machines. It could help you to setup a private cloud in your datacenter where you could automate the provisioniong, scaling of VMs, Storage, Network etc.
- **Docker** is a tool which does two main things.
  - Provides a standard packaing format i.e. docker image, to pack your application with the runtime. This provides the portability.
  - Provides a runtime so that your applications packages as docker images can run in a contained/isolated environment on the similar lines of running a VM.

- Docker provides packaging and runtime. However, when it comes to running containers at scale, on more than one nodes, you need a way to manage, scale, connect the containers and the nodes both. This is what **kubernetes** offers. Thats why kubernetes is also called as Container Orchestration Engine (COE). You could look at it as a Container as a Service platform.

![!](https://imgur.com/W4VZwlD.jpg)
# Docker
[netNinja](https://www.youtube.com/playlist?list=PL4cUxeGkcC9hxjeEtdHFNYMtCpjNBm3h7)
## image
- Think of image as the blueprint to construct a container, they store things like
  - runtime environment
  - application code
  - dependencies
  - extra configuration files (eg, parameters, env variables)
  - comments to run applications
  - file system of the project
- images are **read-only** after created
- the main purpose of is to share with others, they are typically small
### breakdown of image
images are made up of several layers
- parent image:
  - OS and sometimes the runtime environment (eg, node 17 on ubuntu 2004)
  - use [dockerhub](https://hub.docker.com/search?q=) to find and download docker parent images
- application specific env, source codes, commands, etc will be packed above parent image, using dockerfile, to make the final image
### dockerfile
- see https://www.youtube.com/watch?v=G07FcRhYB2c&list=PL4cUxeGkcC9hxjeEtdHFNYMtCpjNBm3h7&index=5
- see project docker-crash-course
### image version tag:
- all imagination can be used in combination with a tag(string, number, etc) to specify distribution/version etc
```bash
imageName:tag
```
### image in action
- build docker image:
```bash
docker build -t imageName ./path_to_dockerfile
# Build a docker image and tag it:
    docker build --tag imageName:tag ./path_to_dockerfile
# alternatively use vscode graphical interface
```
- list all images
```bash
# list all available images
docker images
```
- delete docker image:
```bash
docker image rm image_name
# -f force remove in use image
docker image rm -f image_name
# remove all images, containers and volumns
docker system prune -a
```
## container
- container runs instance of images, in order to run the application
- container is isolated process: it is independent to any other process in the OS



- start container, port setup etc: [link](https://www.youtube.com/watch?v=ZPEpreOpqao&list=PL4cUxeGkcC9hxjeEtdHFNYMtCpjNBm3h7&index=8)

```bash
# create container from image (either name or ImageId) and run it
  # can sub myapp with the ImageId
  docker run --name myapp_container1 myapp  
  # -p: map local port 5000 to port 4000 in container
  docker run --name myapp_container2 -p 5000:4000 myapp 
  # -d: detach the container process from terminal  
  docker run --name myapp_container2 -p 5000:4000 -d myapp 

# run already built container
docker start myapp_container1
```

```bash
# list all running docker container (processes) 
docker ps
# list all docker container (Runing or Exited)
docker ps -a
```
```bash
# stop a container
docker stop myapp_container1 # or use container id
# remove a container
docker container rm myapp_container1
```

##  [Volumns](https://www.youtube.com/watch?v=Wh4BcFFr6Fc&list=PL4cUxeGkcC9hxjeEtdHFNYMtCpjNBm3h7&index=10)
- The purpose of volumn is to avoid rebuild images and containers all the time when minor changes occurs frequently in the code
  
- Volumes are a feature of Docker that allow us to specify folders in host computer that can be made available to running containers. these folders will be watched and any changed will be reflected in containers (without the need to rebuild the image)
  
- the feature of volume is only available, in developed time in other words, only in the developing host. to share the application with the others you still need to rebuild the image.

```bash
# -v add volumns when building container
# docker run --name container_name -p 4000:4000 -v abs_from_path:container_path myapp:nodemon
docker run --name myapp_nm_1 -p 4000:4000 -v C:\Users\wli20\OneDrive\Desktop\projectsSandbox\_prj\ninja\docker-crash-course\api:/app -v /app/node_modules myapp:nodemon
```
- TODO: anonymous volume

## [Docker Compose](https://www.youtube.com/watch?v=TSySwrQcevM&list=PL4cUxeGkcC9hxjeEtdHFNYMtCpjNBm3h7&index=11)
Docker compose is able to store multiple image/container configuration into A file And to build/run them simultaneously. this is typically useful when a project need to run multiple container simultaneously.
- Docker Compose is a run-through config file option
- it save the pain of running many complex cli commands

```yaml
# docker-compose.yaml
version: "3.8"
service: 
  api:
    build: ./api  # the Dockerfile location
    container_name: myapp_c1
    ports:
      - '4000:4000'
    volumns:
      - ./api:/app
      - ./app/node_modules
```
- run the docker compose => build image, build container from image, start container
```bash
# in same dir to docker-compose.yaml
docker-compose up
```
- down the docker compose => stop and delete container, retain built image and volumn
```bash
# in same dir to docker-compose.yaml
docker-compose down
docker-compose down --rmi all -v # these options remove images/volumns as well
```
## share image to [dockerHub](https://hub.docker.com/)
```bash 
docker login -u userName -p passWord
# push to remote
docker push thenetninjauk/myapi:tagname
# pull down to local
docker pull thenetninjauk/myapi
```
## misc
- Container vs VMs:
  - they solve the same problem: run an application with all its dependency in a controlled environment
  - Container shared the kernel of the host OS
  - virtual machines has its own full operating system
  - container is typically quicker than VMS
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

# kubernetes
- What's kubernetes: container orchestration tool, for connecting and managing application that makes up of a large scale of container nodes(virtual, physical, hybrid...)
- typical use case: microservices
  - microservices: also known as the microservice architecture - is an architectural style that structures an application as a collection of services that are
    - Highly maintainable and testable
    - Loosely coupled
    - Independently deployable
    - Organized around business capabilities
    - Owned by a small team
  - The microservice architecture enables the rapid, frequent and reliable delivery of large, complex applications. It also enables an organization to evolve its technology stack.
- when an application is made made it up of hundreds of microservices that are deployed in hundreds of containers in different nodes, using script to manage them becomes impossible
### what features container orchestration tools offer?
- high availability, no downtime
- scalability (increasing or decreasing) or high performance
- disaster recovery (backup and restore)
## [kubernetes architecture](https://youtu.be/s_o8dwzRlu4?t=273)
- **control(master) node**, **worker node**, **virtual network**

- control(master) node, running master processes:
  - API SERVER: enterpoint to k8s cluster(UI, API, CLI): **kubectl** 
  - controller manager: keeps track of what happening in the cluster (eg, down nodes)
  - scheduler: manage pods placement based on workload/worker availablilty
  - etcd: key value storage, hold, at any time, index/data of the current state of the cluster. the states also responsible for backup and restore
- **backup of master node**: in production it has at least 1 backup of the master node in case of breakdown
- **kubelet**: a process that run in worker node to communicate with each other

## components of kubernete cluster
### **node**: virtual or physical machine
### **Pods** 
- pod are the smallest, most basic deployable objects in Kubernetes. **It is an abstration of container (one or multiple containers as a whole, usually 1 application per pod).**  When a Pod runs multiple containers, the containers are managed as a single entity and share the Pod's resources.
- each pod gets its **temporary own IP address** in the virtual network
- pods are **ephemeral/die easily**, once a pod die and a new pod replace it with a new IP address
### **service**
- service open an perment incoming ip for incoming request for certain "service", and forward the requests to the correct pod
- service contain an **permanent IP address** that provide certain service. it's an abstraction of pod. even if the pod inside the service died and being replaced, service IP address remains intact
- service types: 
  - external service: service that can be exposed to the outside 
  - internal service: service that cannot be exposed to the outside
### **ingress**
- ingress expose services to outside and forward requests to services

- An Ingress controller is responsible for fulfilling the Ingress, usually with a load balancer,
- Traffic routing is controlled by rules defined on the Ingress resource.
[![](https://mermaid.ink/img/pako:eNqNkstuwyAQRX8F4U0r2VHqPlSRKqt0UamLqlnaWWAYJygYLB59KMm_Fxdax-qmGwbuXA7DwAEzzQETXKutof0OPb8uaoUQkwKUu6hi3FwWM_QUHGBt0VFFt8DRQ2OWSGrKUUMlVQwMmhVLEV1Vcm--aUksiuXRaO_CEhkv4WjBvAkG1TrGaLa-iaUw6a0DcwaI-WgOsF7zq-pF881fvRx1UDzeiFq7ghb1kgqFWiElyTjnuXVG74FkbdumefEuuNuRm_4jZ1pqQ7L5fL6YQPb3NiGuyzsGt_-ihNyUkm6YSONWkjVNM8WUIyaeOJJ-upOnDuRDX4ahHMo888XHjA2YyLGKFEOmVjjHHZiOCh7-xmHw1tjtoIMakzDl1Ozr8GdOwUe90-tPxTBxxkOOfc-pg5Wg4RU7TFoq7a_6yIXTJomnL2Iz3vc?type=png)](https://mermaid.live/edit#pako:eNqNkstuwyAQRX8F4U0r2VHqPlSRKqt0UamLqlnaWWAYJygYLB59KMm_Fxdax-qmGwbuXA7DwAEzzQETXKutof0OPb8uaoUQkwKUu6hi3FwWM_QUHGBt0VFFt8DRQ2OWSGrKUUMlVQwMmhVLEV1Vcm--aUksiuXRaO_CEhkv4WjBvAkG1TrGaLa-iaUw6a0DcwaI-WgOsF7zq-pF881fvRx1UDzeiFq7ghb1kgqFWiElyTjnuXVG74FkbdumefEuuNuRm_4jZ1pqQ7L5fL6YQPb3NiGuyzsGt_-ihNyUkm6YSONWkjVNM8WUIyaeOJJ-upOnDuRDX4ahHMo888XHjA2YyLGKFEOmVjjHHZiOCh7-xmHw1tjtoIMakzDl1Ozr8GdOwUe90-tPxTBxxkOOfc-pg5Wg4RU7TFoq7a_6yIXTJomnL2Iz3vc)
### **configMap/secret**
- set external configuration like: database url, username, pwd in the configMap/secret (both are config file) instead of hard code them in the application
- configMap/secret are **managed by kubernetes**, accessed from the pod
- the **application access** configMap/secret config variables using environment variables or as a properties file
- **purpose**: when these config change, there is no need to rerun the deploy pipeline of the application   
- save unsensitive info in configMap (eg, database url), and sensitive info in secret(userName, pwd)
- Secret is not automatically "secret", you should use third-party encrypt tools before deploy to secret
  - base64 encode: [in action](https://youtu.be/s_o8dwzRlu4?t=2732)
### **volumn**:
- volumn store **a backup of data** in **database sevice pod**. When a database sevice pod crashed and restarted, these data are automatically restored to the service/pod from volumn
- volumn can either by a physical disk in current node or a remote storage node
- kubernetes doesn't manage data persistence, it's the responsibility of the users to construct volumes to backup their data
### **Deployment**
- Deployment is an abstraction of pod, it's basically a blueprint of pod. user can create deployment and  specify how many pods copies they want to deploy into the cluster (as backup, etc)
  - when a active pod die, the **service** will forward upcoming requests to another backup pod deployed by deployment 
- setting up Deployment is declarative: eg. user expect 2 replica of a services in a deployment, and kubernetes try its best to maintain the request at any time
- in production users are mostly work with deployments instead of pods
- deployment is only for **statefulless application** services, **DB can't be replicated via deployment**: multiple pod connect to same date storage create competition!! Alternatively DBs use **Statefulset**
### **Statefulset**
- replica for stateful apps: for example DBs
- use DBs in kubernetes is somewhat tedious, A common practice is to host DBs outside of kubernetes cluster

### declarative kubernetes configuration 
- configuration is declarative, user define the desired running state, kubernetes constantly compare the current state of the service and fix problems automatically if **"status != spec"**
- the current state comes from **etcd process** of the master node 
- config script (infrastructure as code) is stored in .yaml file


## [in action]([https://youtu.be/s_o8dwzRlu4?t=1589]) 
- [document reference](https://kubernetes.io/docs/home/) 

### minikube & kubectl 
- **minikube**  lets you run Kubernetes locally. minikube runs a single-node Kubernetes cluster on your personal computer (including Windows, macOS and Linux PCs) so that you can try out Kubernetes
  - minikube's primary goals are to be the best tool for local Kubernetes application development and to support all Kubernetes features that fit.
- minikube runs in a container/vm in the computer that runs it

- **kubectl**: The Kubernetes command-line tool
  - it is installed when kubernete/minikube installed as an dependency

### demo project: [[demo](https://youtu.be/s_o8dwzRlu4?t=2492)]
- design
![](https://imgur.com/ehyuN2c.jpg)

- install tools [link](https://minikube.sigs.k8s.io/docs/start/)
```bash
minikube start # create a cluster
minikube status # check cluster running status
minikube ip # ip address that minikube run
```
#### **orchestration** [link](https://youtu.be/s_o8dwzRlu4?t=2593)
#### **deployment**
- ConfigMap and Secret must exist before deployments
  - **kubectl apply** manages applications through files that defining k8s resource 
```bash
kubectl apply -f mongo-config.yaml
kubectl apply -f mongo-secret.yaml
```
- deploy database service
```bash
kubectl apply -f mongo.yaml
```
- deploy webapp service
```bash
kubectl apply -f webapp.yaml
```

#### **cluster general infos**
``` bash
## get minikube node's ip address
    minikube ip

## get basic info about k8s components
    kubectl get node
    kubectl get pod
    kubectl get svc
    kubectl get all

## get extended info about components
    kubectl get pod -o wide
    kubectl get node -o wide

## get detailed info about a specific component
    kubectl describe svc {svc-name}
    kubectl describe pod {pod-name}

## get application logs
    kubectl logs {pod-name}
    
## stop your Minikube cluster
    minikube stop

# List information about a resource with more details:
    kubectl get pod|service|deployment|ingress|... -o wide

# Update specified pod with the label 'unhealthy' and the value 'true':
    kubectl label pods name unhealthy=true

# List all resources with different types:
    kubectl get all

# Display resource (CPU/Memory/Storage) usage of nodes or pods:
    kubectl top pod|node

# Print the address of the master and cluster services:
    kubectl cluster-info

# Display an explanation of a specific field:
    kubectl explain pods.spec.containers

# Print the logs for a container in a pod or specified resource:
    kubectl logs pod_name

# Run command in an existing pod:
    kubectl exec pod_name -- ls /
```
# prerequisites TODO
## [yaml](https://www.youtube.com/watch?v=1uFVr15xDGg) 
