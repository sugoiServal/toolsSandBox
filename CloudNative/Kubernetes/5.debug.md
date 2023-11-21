# POD status

- `CrashLoopBackOff`: CrashLoop: pod repeatedly crashes immediately upon starting, BackOff: attempting to restart after crash
- `ImagePullBackOff`: image cannot be retrieved from the container registry.

- Pod phase

  - `Pending`: pod 成功被创建，但是可能 pod 还没有被 schedule， 或者有容器还没有被 set up。
  - `Running`: 所有容器已经创建完成。
  - `Succeeded`: 所有容器成功退出。(eg, a batch job)
  - `Failed`: 所有容器已经退出,至少有一个不成功。
  - `Unknown`: For some reason the state of the Pod could not be obtained (eg, network issue)

- Container states

  - `Waiting`: neither Terminated or Running: for example, pulling the container image, or applying Secret data
  - `Running`: executing without issues.
  - `Terminated`: Either ran to completion or failed for some reason.

# Pod Controller

- DESIRED: # replicaset specified
- CURRENT: # pod currently runing
- READY: # service ready
- UP-TO-DATE: # pod in the latest version
