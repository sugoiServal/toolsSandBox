- **Docker** is a tool which does two main things.

  - (build) build i.e. docker image, to pack your application
  - (run) Provides a runtime that run the application in a contained/isolated environment

- **kubernetes** : running containers and manage container's lifecycle at scale. Container Orchestration Engine (COE).

- Container vs VMs:
  - solve the `same problem`: run an application with all its dependency in a controlled environment
  - `Container` shared the kernel of the host OS
  - `VM` has its own full operating system
  - container is quicker

### Install docker

- Install Docker inside Amazon Linux(EC2) [link](https://www.cyberciti.biz/faq/how-to-install-docker-on-amazon-linux-2/)

```bash
sudo yum update
sudo yum install docker

# Add group membership for the default ec2-user so you can run all docker commands without using the sudo command:
sudo usermod -a -G docker ec2-user
id ec2-user
# Reload a Linux user's group assignments to docker w/o logout
newgrp docker

# Need docker-compose too?
wget https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)
sudo mv docker-compose-$(uname -s)-$(uname -m) /usr/local/bin/docker-compose
sudo chmod -v +x /usr/local/bin/docker-compose

# test
docker version
docker-compose version
```

## image

- `image`: blueprint to construct a container, including

  - runtime environment
  - application code
  - install dependencies
  - extra configuration files (eg, parameters, env variables)
  - project file system

- properties

  - images are **read-only** after created.
  - Image are small.
  - Image are shared in DockerHub

- `image layers`

  - parent image:
    - OS and the runtime environment (eg, node 17 on ubuntu 2004), [resource](https://hub.docker.com/search?q=)
    - application specific env, source codes, commands, etc. Built on top of parent image

- `image tags`
  - `tag (:)` provide versioning to image (distro, software version...)

## dockerfile

- use `dockerfile` to build image
- a sample dockerfile

```Dockerfile
# pull a parent layer
FROM node:17-alpine

# RUN a command in the root dir
RUN npm install -g nodemon

# specify the working dir in image
  # all following command are run inside the dir
WORKDIR /app

# COPY from src dir(rel:dockerfile) to image dir(rel:working directory)
COPY . .

# RUN command on the image working dir
RUN npm install

# expose a port of the container (require for docker desktop port mapping)
EXPOSE 4000

# AFTER BUILD: command to run after the container loaded(runtime)
CMD ["node", "app.js"]

# use ENTRYPOINT: provide args in runtime
  # docker run my-container 10  (over default 5s)
ENTRYPOINT ["sleep"]  # process to run, but args is provided by docker run
CMD ["5"]  # a default args
```

- `.dockerignore`
  - file/folder to exclude when run `COPY . .`
  - eg> excluding node_modules and all markdown file

```
node_modules
*.md
```

# Docker Cli

### refs

- [101-video](https://www.youtube.com/playlist?list=PL4cUxeGkcC9hxjeEtdHFNYMtCpjNBm3h7)
- [101-github](https://github.com/iamshaunjp/docker-crash-course)

- install [docker desktop](https://www.docker.com/products/docker-desktop/)

- [!cli commands](https://docs.docker.com/engine/reference/run/)

- Install Docker inside Amazon Linux(EC2) [lnik](https://www.cyberciti.biz/faq/how-to-install-docker-on-amazon-linux-2/)
- Check installation

```bash
# Check installation
docker version
```

### Build

```bash
docker build -t imageName ./path_to_dockerfile
# Build a docker image and tag it:
docker build --tag imageName:tag ./path_to_dockerfile
# alternatively use vscode graphical interface
```

### Image Management

```bash
# pull image from dockerhub
docker pull image:tag

# list all available images
docker images

# Deletion
docker image rm image_name
docker image rm -f image_name   # -f force remove in-use image
docker system prune -a  # remove all images, containers and volumes
```

### Run Container

- `container` is built from image

  - `container` can be `run`
  - a `container process` is an isolated process, independent from any other process in the OS

- flags:
  - detach: detach the container process from terminal
  - name: container name
  - publish: port forwarding
  - network: use docker network
  - env: use environment variables
  - env-file: specify a file containing all env vars
  - volume: specify volumes

```bash
docker run <OptionsFlags> imageName


# run a container from image  (image -> built container -> run)
  # can substitute myapp with a ImageId
  docker run --name myapp_container1 myapp
  # -p: map local port 5000 to container port 4000
  docker run --name myapp_container2 -p 5000:4000 myapp
  # -d: detach the container process from terminal
  docker run --name myapp_container2 -p 5000:4000 -d myapp

# restart container
  docker restart containerName


# a bigger example
docker run --name jenkins-blueocean --restart=on-failure --detach \
  --network jenkins --env DOCKER_HOST=tcp://docker:2376 \
  --env DOCKER_CERT_PATH=/certs/client --env DOCKER_TLS_VERIFY=1 \
  --publish 8080:8080 --publish 50000:50000 \
  --volume jenkins-data:/var/jenkins_home \
  --volume jenkins-docker-certs:/certs/client:ro \
  myjenkins-blueocean:2.332.3-1

# start an already built container
docker start myapp_container1
```

### Bssh in Container

- docker exec: Get into the container
  - detach: Run a command in the background (detached)
  - workdir: the workdir inside container the command should be execute in
  - user: run command as a user
  - interactive(-it): start an interactive Bash session
  - env: Set an environment variable in a running Bash session

```bash
# execute a command inside a running container
docker exec container_name command
# Enter an interactive shell session on an already-running container:
docker exec --interactive --tty container_name /bin/bash

# run a docker container and a command in interactive mode (-it = --interactive + --tty), automatically remove the container when it exits (--rm)
docker run -it --rm \
    --network app-tier \
    bitnami/kafka:latest \
    kafka-topics.sh --list  --bootstrap-server kafka-server:9092

# Execute the command inside `path/to/directory`
docker exec --interactive -tty --workdir path/to/directory container_name command
# Set an environment variable in a running Bash session:
docker exec --interactive --tty --env variable_name=value container_name /bin/bash
# Run a command as a specific user:
docker exec --user user container_name command

# Copy the http_ca.crt SSL certificate from the container to your local machine.
docker cp myContainer:/usr/share/elasticsearch/config/certs/http_ca.crt .
```

### Container Management

```bash
# list containers
docker ps

# stop a container
docker stop myapp_container1 # or use container id

# remove a container
docker container rm myapp_container1

# stop and remove all current running images/containers
sudo docker ps -aq | xargs --no-run-if-empty docker stop | xargs --no-run-if-empty docker rm
sudo docker images -aq | xargs --no-run-if-empty docker image rm -f
```

### [dockerHub](https://hub.docker.com/)

```bash
docker login -u userName -p passWord
# Tag your image with your Docker Hub username/repository
docker tag your-image-name:tag mlpppp/your-image-name:tagname
# push to remote
docker push mlpppp/your-image-name:tagname
# pull to local
docker pull mlpppp/your-image-name
```

### Example: a part script in a CICD pipeline

```bash
# connect the remote
ssh -o StrictHostKeyChecking=no -i ~/.ssh/digitalOcean root@137.184.202.238
# login to dockerHub
sudo docker login -u ${{ secrets.REGISTRY_USER }} -p ${{ secrets.REGISTRY_PASS }}
# stop and remove all current running images/containers
sudo docker ps -aq | xargs --no-run-if-empty docker stop | xargs --no-run-if-empty docker rm
sudo docker images -aq | xargs --no-run-if-empty docker image rm -f
# run image from dockerHub
  # with environmentVariable in a file
sudo docker run -p 4000:4000 \
  --env-file /root/survey_collector_config/.env \
  $IMAGE_NAME:$IMAGE_TAG_BACK
sudo docker run -d -p 3000:3000 $IMAGE_NAME:$IMAGE_TAG_FRONT
```

## Volumns

[ref](https://medium.com/techmormo/how-do-docker-volumes-enable-persistence-for-containers-docker-made-easy-4-2093a1783b87)

- `purpose of Volumns:` data persistence

  - container's data lost when it shutdown. If it runs a database, that is disaster.
  - `volume` enable two-way sync between a `directory in the host machine` and `a directory in the container` (aka, mount a storage into container)

- named volume are stored in a directory in host

  - linux: `/var/lib/docker/volumes/`
  - wsl: `\\wsl.localhost\docker-desktop-data\data\docker\volumes`

- 底层：
  - `Storage Driver`: `Storage Driver` help manage physical storage for containers. `Storage Driver` is choices by docker based on their availability in your OS (AUFS, ZFS, Device Mapper...)
  - `Volume Driver Plugins`: Volume driver plugins extend Docker's capabilities by allowing you to use different storage backends.
    - `Local` (default): use storage in localhost
    - third party drivers make it possible to use network storage providers

```bash
# volume driver
docker volume create --driver=rexray/ebs myvolume
docker run -it --name mysql --volume-driver rexray/s3fs -v s3-vol:/var/lib/mysql mysql
```

```bash
docker volume ls # list all volumes
docker volume create <volumeName>  # create a volume.
docker volume inspect <volumeName>  # View mount directory of the volume

# remove volumes
docker volume rm <volumeName>
docker volume prune
```

- Mount volumes to containers

```bash
# mount an anonymous volume, a volume will be automatically created with a random name
docker run -v /data/db --name container1 -d

# mount a named volume. a volume with the name will be created if not already created
docker run -v mongo_data:/data/db --name container1 -d

# bind an arbitrary path in host machine to a path in the container
docker run -v /path/on/your/host:/data/db --name container1 -d

# --mount is more verbose and preferred now to -v: https://docs.docker.com/storage/bind-mounts/
```

## Docker Network

- `Docker networking` enables communication between containers and external networks (eg. host machine or other containers).
  - there are 6 network driver modes [docs](https://docs.docker.com/network/drivers/bridge/)
  - default one is `Bridge Driver`
- [read](https://stackoverflow.com/questions/24319662/from-inside-of-a-docker-container-how-do-i-connect-to-the-localhost-of-the-mach)

```bash
docker network ls  # list all networks
docker network rm elk-net  # remove a network
```

- `Bridge Driver` (default): creates an internal network within a single host
  - Containers can communicate with each other in the Bridge Network
  - Containers can communicate with the host machine
  - Containers are isolated from external newtorks unless specific ports are exposed

```bash
docker network create my_bridge_network
docker run -d --name container1 --network my_bridge_network nginx
docker run -d --name container2 --network my_bridge_network nginx
```

- Containers Communication on the same Network
  - Once the containers are on the same network, you can access one container from another using the `container name as the hostname`

```python
# part of container1's code
# use "container2" as the hostname
db_connection_string = "mysql://username:password@container2:3306/database"
```

### Other Networks Driver modes

- `None`: isolates a container by disabling its network.
- `Host Driver`: allows the container to share the network stack of the host system
- `Overlay Driver`: creates a distributed network able to span multiple hosts.
- Overlay Network
- Macvlan Network
- IPvlan

# docker-compose

- think `docker-compose` as a minimal kubernetes
  - good for small project with a few docker container
  - save the pain of running many cli commands
- `docker-compose` is an application that
  - store multiple image/container running configuration in a file
  - execute the file to `build + run`.
- config are written in `docker-compose.yaml`
  - ex1

```yaml
# docker-compose.yaml
version: "3.8"
services:
  api: # backend
    build: ./api # Dockerfile location
    container_name: api_c
    ports:
      - "4000:4000"
    volumes:
      - ./api:/app
      - ./app/node_modules
  myblog: # frontend
    build: ./myblog
    container_name: myblog_c
    ports:
      - "3000:3000"
    stdin_open: true
```

- docker-compose can also start an DockerHub application without and local code
  - ex2: start an containerized mySQL server

```yaml
version: "3.3"
services:
  db:
    image: mysql/mysql-server:8.0
    restart: always
    container_name: mysql_container
    environment: # environment variable
      MYSQL_DATABASE: "db"
      MYSQL_USER: "user"
      MYSQL_PASSWORD: "password"
      MYSQL_ROOT_PASSWORD: "password"
    ports:
      - "3306:3306" # map local port 3306 to container port 3306
    expose: # expose container port
      - "3306"
    volumes:
      - my-db:/var/lib/mysql
volumes:
  my-db:
```

```bash
# cd <folder containing docker-compose.yaml>
docker compose up
```

### Up/Down docker-compose

- `up` = build container from image + run container
- `down` = stop and delete container (image and volumn are retained by default)

```bash
# dir where docker-compose.yaml located

# up
docker-compose up

# down
docker-compose down
docker-compose down --rmi all -v # these options remove images/volumns as well
```

### Network:

- [docs](https://docs.docker.com/compose/networking/)
- `By default` Compose sets up a single network for your app. Each container for a service joins the default network and is both reachable by other containers on that network, and discoverable by them at a hostname identical to the container name.
