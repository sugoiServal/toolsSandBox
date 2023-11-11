- [officialDocs](https://www.rabbitmq.com/getstarted.html)
- [list of client](https://www.rabbitmq.com/devtools.html)
- [image](https://registry.hub.docker.com/_/rabbitmq/)

```bash
docker run \
   -d \
   --name some-rabbit \
   --hostname rabbit \
   -e RABBITMQ_DEFAULT_USER=user \
   -e RABBITMQ_DEFAULT_PASS=password \
   -p   15672:15672 \
   -p   5672:5672 \
   rabbitmq:management
# management distribution includes a GUI admin tool in port :15672
## admin panel: http://localhost:15672/
```

- features:

# Concepts

- components

  - `Publisher/Consumer`: your application act as publisher/consumer to publish or consume messages
    - AMQP: a standard protocol for messaging middlewares (language/platform agnostic)
  - Message: message body and message headers
  - `Queue`: A buffer that `stores` messages. Messages are either pull from or push to Consumer. `Message are deleted after being consumed.`
  - `Exchange`: An entity that responsible for routing: receives messages from producers and pushes them to queues based on routing rules.
  - `Connection`: A TCP connection between your application and the RabbitMQ server.
    - `Channel`: A virtual connection inside a TCP connection. Channels are used to multiplex multiple logical connections over the same physical TCP connection.
  - `VirtualHost`: A way to create multiple isolated environments within a RabbitMQ server. Each virtual host has its own exchanges, queues...

- RabbitMQ manages Queue, Exchanges, Connection/Channel, VirtualHost
- Publisher/Consumer are implemented with clients

![](https://imgur.com/NjslONS.jpg)

- a sample message

```json
// an example json message
{
  "headers": {
    "Content-Type": "application/json",
    "routing-key": "example.routing.key"
  },
  "body": "{'key': 'value'}"
}
```

# Message Model

- simple: work queue
- pub-sub (with exchange)
  - Fanout
  - Direct
  - Topic

## Common concepts

- `Ack (message acknowledgments)`: if enable, message are persisted in queue until consumer send back an ack (message had been received and processed)

  - A timeout (30 minutes by default) is enforced on consumer delivery acknowledgement.
  - if worker terminates without sending back ack, all unacknowledged messages will be redelivered.
  - Manual ack are `turned on` by default

- `prefetch`: a mechanism to allow workers to prefetch messages. Queue will dispatch message to worker regardless if workers has processed and acknoledged the last messages. by default prefetch => unlimited: whenever there are new messages it will be prefetched
  > The prefetch default value used to be 1, which could lead to under-utilization of efficient consumers. Starting with version 2.0, the default prefetch value is now 250, which should keep consumers busy in most common scenarios and thus improve throughput.

## Work Queue

- [ref](https://www.rabbitmq.com/tutorials/tutorial-two-python.html)

- `Work Queues` (aka ask Queues): multiple workers (as consumer) consume message from single queue -> scale message consuming

- dispatch
  - `round-robin dispatching`: by default when there are multiple workers, without an exchange, the message will be distribute in round robin
  - `Fair dispatch`: Change prefetch to 1 globally(apply to all customer in channel): avoid dispatch a new message to a worker until it has processed and acknowledged the previous one
    - channel.basic_qos(prefetch_count=1):

## Exchange

- Exchange model:

  - producer send message -> `exchange` -> message route to different queue -> each queue has a group of consumer (same as Work Queue)

- based on the `type of exchange`, there are

  - Fanout: broadcast: every queue get a copy of the message
  - Direct: routing:
    - routing by matching `bindKey`(queue-exchange) to `routingKey` (producer send with message)
    - a queue can bind to multiple `bindKey`, exchange send a message to all queues that has a matching bindKey to the message's routingKey
  - Topic: Direct Exchnange but with several keywords(separate by `.`) and wildcard (`#`: 0 or more words, `\*`: 1 word)

- [fanout](https://www.rabbitmq.com/tutorials/tutorial-three-python.html)
- [direct](https://www.rabbitmq.com/tutorials/tutorial-four-python.html)
- [topic](https://www.rabbitmq.com/tutorials/tutorial-five-python.html)

- binding: That relationship between exchange and a queue is called a binding : this queue is subject to the messages from the exchange and the associated exchange rules

```python
# declare exchange
channel.exchange_declare(exchange='logs', exchange_type='fanout')
channel.exchange_declare(exchange='logs', exchange_type='direct')
channel.exchange_declare(exchange='logs', exchange_type='topic')
# binding
hannel.queue_bind(exchange='logs',
                   queue=result.method.queue)
```
