# minikube

- `minikube`: minikube run Kubernetes cluster locally(single host). Education and Local development.

  - create a `virtual box` in host
  - create/run nodes in the virtual box

```bash
# install https://minikube.sigs.k8s.io/docs/start/
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# start a cluster
minikube start # create a cluster
minikube stop # stop a cluster
minikube delete # delete a cluster

# troubleshooting
minikube status # check cluster running status
minikube ip # ip address that minikube run
```
