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

