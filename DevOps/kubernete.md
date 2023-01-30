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
