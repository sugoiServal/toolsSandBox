- Resource:
  - https://www.youtube.com/watch?v=DU-q5kOf2Rc
  - dependencies
    - https://github.com/grpc/grpc-java
- Protobuf: 数据编码（serialize/deserialize）， `think json/text` alternative

  - 在 `.proto` 文件中定义数据结构(eg, parameters)
  - `binary` based (instead of text based) 非常高效
  - 允许您添加、删除或修改字段
  - [代码生成器](https://protobuf.dev/reference/java/java-generated/)，可以自动生成数据序列化和反序列化的代码
    - C++, C#, Go, Java, Python, Kotlin, Dart

- HTTP/2 vs HTTP/1.1: HTTP/2 can

  - much faster than HTTP/1.1
  - `Multiplexing`: allows `multiple requests and responses` to be sent and received on a `single connection`: `streaming` is first-class citizen
  - `Binary Protocol`: HTTP/2 uses a binary protocol, while HTTP/1.1 uses plain text => more efficient
  - `Header Compression`: smaller request size
  - other features: Stream Prioritization, Server Push, => more efficient

- gRPC: `a RPC(Remote Procedure Call) framework`. 允许客户端应用程序对远程服务器服务进行调用，就好像它们是本地函数调用一样

  - 使用
    - `HTTP/2`: transport layer
    - `Protobuf 3` (protobuf files)
  - `高效`、低延迟 (`binary-based`)
  - `Strongly Typed`
  - support any direction: real-time `Bi-Directional Streaming`, unary(`req-res`), Server Streaming, Client Streaming,
  - open-source, ecosystem: protobuf, code generation tools, load balancing, authentication, ...

  - 构建`微服务`和分布式系统的可靠选择, reason why gRPC go popular

- 4 communication technologies:

  - REST: a architectural style: unidirectional(req-res)
  - GraphQL(`enhanced REST`): a query language for APIs: unidirectional(req-res)
  - webSocket(old technology): a `communication protocol` for `bidirectional communication`(online gaming, chat...): bidirectional Streaming, handshake in HTTP, stream in TCP
  - gRPC(`RPC, microservice`):
    - a `RPC framework` (remote procedure call),
    - a standard approach to modern microservice communication:
      - HTTP/2, very fast
      - any kind of communication: bidirectional Streaming, unidirectional streaming, req-res

- Why RPC:
  - RPC 机制抽象了网络通信的复杂性，使远程服务能够像本地服务一样被访问。允许`分布式系统无缝运行`，使开发人员更容易构`建跨多台机器或服务的应用程序`。
  - a typical RPC:
    - Client-Stub Procedure: client `initiates the RPC` by `calling a procedure(Client-Stub)` that appears as if it's a local function call
    - `Parameters and Metadata` to the procedure are `packaged into a Message`, then `serialized` before `transmitted` over the network
    - Server Stub Procedure: a procedure in `server side (Server Stub) listen to RPC calls` in a network address and port
    - Server Stub
      - `deserializes the message`,
      - `locates servers that implement the requested procedure`,
      - `calls the procedure with deserialized parameters`
    - Server Response: After executing the requested procedure, the server procedure a `response (return values, metadata)`, then `serialized `the response before `transmitted` over the network
    - Client Application Integration: client stub `returns the result to the client application`, which can continue its execution as if the remote procedure call is local function call
    - Error Handling: `Both client and server components handle errors` (network failures, timeouts, or exceptions in the remote procedure call)
