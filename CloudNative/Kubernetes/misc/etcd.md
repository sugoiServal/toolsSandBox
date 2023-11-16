# ETCD

- [etcd](https://etcd.io/) is a standalone project `used` by kubernetes

### quick start

- [install](https://etcd.io/docs/v3.5/install/)

```bash
# install pre-built binaries: https://github.com/etcd-io/etcd/releases/
ETCD_VER=v3.4.27

# choose either URL
GOOGLE_URL=https://storage.googleapis.com/etcd
DOWNLOAD_URL=${GOOGLE_URL}

rm -f /tmp/etcd-${ETCD_VER}-linux-amd64.tar.gz
rm -rf /tmp/etcd-download-test && mkdir -p /tmp/etcd-download-test

curl -L ${DOWNLOAD_URL}/${ETCD_VER}/etcd-${ETCD_VER}-linux-amd64.tar.gz -o /tmp/etcd-${ETCD_VER}-linux-amd64.tar.gz
tar xzvf /tmp/etcd-${ETCD_VER}-linux-amd64.tar.gz -C /tmp/etcd-download-test --strip-components=1
rm -f /tmp/etcd-${ETCD_VER}-linux-amd64.tar.gz


echo 'export PATH=/tmp/etcd-download-test:$PATH' >> ~/.bashrc
source ~/.bashrc
```

- `API Version`
  - etcd has two api version (2 or 3). Choose either one to use

```bash
# either of the command check api version
./etcdctl version
./etcdctl --version

# change api version: export the ETCDCTL_API variable
export ETCDCTL_API=3
```

# Usage

```bash
  # Interact with etcd, a highly-available key-value pair store.
  # More information: https://etcd.io/docs/latest/dev-guide/interacting_v3/.

  # - Display the value associated with a specified key:
    etcdctl get my/key

  # - Store a key-value pair:
    etcdctl put my/key my_value

  # - Delete a key-value pair:
    etcdctl del my/key

  # - Store a key-value pair, reading the value from a file:
    etcdctl put my/file < path/to/file.txt

  # - Save a snapshot of the etcd keystore:
    etcdctl snapshot save path/to/snapshot.db

  # - Restore a snapshot of an etcd keystore (restart the etcd server afterwards):
    etcdctl snapshot restore path/to/snapshot.db

  # - Add a user:
    etcdctl user add my_user

  # - Watch a key for changes:
    etcdctl watch my/key
```

# ETCD in K8S

- When setting up the K8s from scratch, you download/install the etcd, then register it to the K8S services.
