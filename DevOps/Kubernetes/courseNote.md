### exam
- online, 300$, free retake
- 2 hours, complete tasks,
- access to the official documents

- crictl 
    - a user interface for specific use case of debugging CRI(container runtime interface)


# containerd
- `container runtime` derive from docker, 
    - now the `official runtime for docker image` in Kubernetes Container Runtime Interface(`CRI`)
    - not support other docker features like cli, api, build tools, volumes, auth/security
- nerdctl: a docker-like ctl to control containerd(including build/composing)
    - essentially run all docker functionality by `replacing docker with nerdctl`