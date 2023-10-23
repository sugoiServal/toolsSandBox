- resource:

  - https://www.youtube.com/watch?v=f3acAsSZPhU

- tools

  - ReactiveX (RxJS, RxJava)
  - Reactor(WebFlux),
  - `gRPC` uses Reactive Paradigm

- Reactive programming is a programming paradigm that

  - handle `asynchronous, message/event driven data streams` (arrives at irregular intervals)
  - `pub-sub model`
  - `lazy serving`
  - `handle errors in a predictable way`
  - can easily transformed into parallel code
  - provides a set of tools, principles, and abstractions
  - Suitable for high performance web content serving, scalable, resilient(robust), responsive

- `asynchronous data streams`

  - such as user interactions, sensor data(IoT)

- Reactive Observables vs Java 8 Stream

  - `Observables` deal with a potentially infinite data streams, `Java 8 Streams` is more like a fancier iterator over a finite data pool
  - `Data Source` of:
    - `Observables` can be `network requests, sensor data, user input(eg. infinite scroll)`...
    - `Java 8 Streams` are in-memory Java collections like list/array
  - `Channels`: `Observables has data/complete/error channels, Java 8 Stream has only data channel without built-in error handling mechanisms
  - `Observables` are `lazy`, means that data is not processed until someone subscribes to the observable. Java 8 Streams are usually evaluated eagerly with few operators except.
  - `Observables` are designed for `asyn stream`, `Java 8 Streams` is primarily designed for synchronous stream
  - `Observables` often support backpressure, `Java 8 Streams` has no concept of backpressure(as it is finite)

- Reactive programming vs message broker (eg, Kafka)
  - Reactive programming 是一种编程范式, 意味着它被用于一个应用程序内数据处理 (使用 Reactive 的设计逻辑来设计应用程序内 sync/async 的数据交互)。 例如 Spring WebFlux
  - message broker 是用于在分布式系统中分发信息的消息系统，也就是说它不是存在单一的应用程序中。

# Concepts

## Observable (Publishers)

- An observable is a source of data that can emit values over time

  - can be subscribed to, and subscribers can react to the emitted values (similar to observer pattern)

- An Observable might have `3 channels`

  - `data channel (onNext())` transmiting the data
  - `complete channel (onComplete)`:
    - signal when data transmitting is complete, no need to fetch/pull more data, data channel will be close
  - `error channel`: error as first class citizen(as data)
    - signal when error occurs, data channel will be suspended

- Creation APIs:
  - in a Observable you can expect A variety of methods for creating observables from different data sources,
    - such as arrays, iterables, events, and user inputs.

## Observers(Subscribers)

- Components that `subscribe to observables` to receive and react to emitted items.
  - there should be `apis to subscribe()/unsubscribe()` a Observer to a Observable

### Operators

- Reactive programming offers a wide range of operators, for `transforming and manipulating data streams` between Observable and Observer
  - map, filter, merge, combineLatest, and more.

### Backpressure Handling

- `Backpressure` occurs when data is produced faster than it can be consumed
- Reactive programming frameworks often provide mechanisms for handling backpressure, such as

  - buffering (when there are busy time and chill time),
  - dropping (eg, you don't care about old data)
  - slowing down the data stream

### Error Handling

- Errors also comes through `Observable`, through a dedicated error channel: (error as first class citizen: data)

### Cold /Hot Observables

- Observables can be categorized as hot or cold

  - Hot observables emit data regardless of whether there are subscribers,
  - Cold observables start emitting data only when a subscriber subscribes

# Implements

### Java: RxJava, Reactor, WebFlux

- RxJava 和 Reactor 是 Java 中反应式编程的两个流行库。
  - RxJava：
    - RxJava 是更大的 ReactiveX（反应式扩展）生态系统的一部分, 其中包括多种编程语言的实现。
    - RxJava Java 中最早的反应式编程库之一。更通用，不依赖于任何特定的框架或生态系统。
  - Reactor
    - 它专门设计用于为 Spring 框架(WebFlux)提供响应式编程支持，尽管它`可以独立于 Spring 使用。`
    - 更新的项目, 更多功能支持
