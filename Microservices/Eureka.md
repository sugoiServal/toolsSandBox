- Think service discovery mechanism like `Eureka` as internal DNS (Domain Name System) for a virtual private network (VPN) of microservices.

  - Similarity

    - 地址解析：Eureka 和 DNS 都充当解析地址的机制。DNS 将人类可读的域名转换为 IP 地址，而 Eureka 将服务名称映射到微服务的网络位置（IP 地址和端口）。
    - 动态更新：在微服务架构中，服务的网络位置可能会因扩展、负载平衡、故障或更新而频繁变化。Eureka 与 DNS 一样，旨在处理动态更新并维护可用服务的最新目录。

    - 负载平衡：Eureka 和 DNS 都可以与负载均衡结合使用。它们帮助在服务的多个实例之间分发请求，以提高性能、可用 ​​ 性和容错能力。
    - 集中登记处：Eureka 通常提供一个集中式服务注册表，微服务可以在其中注册自身并查询其他服务的位置。类似地，DNS 采用集中式或分布式分层结构进行名称解析。
    - 服务发现：这两种机制都支持服务发现。就 Eureka 而言，微服务可以查询注册表以发现其他服务的位置。通过 DNS，客户端可以查询 DNS 服务器来发现与域名关联的 IP 地址。
    - 安全和访问控制：Eureka 和 DNS 可以包含安全和访问控制机制，以确保只有授权的客户端才能访问注册表或解析域名。

  - difference:
    - Eureka 和其他服务发现工具通常提供特定于微服务的附加功能，例如运行状况检查、元数据以及与负载均衡器的集成。
