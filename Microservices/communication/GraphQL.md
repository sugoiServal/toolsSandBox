## Resource
- old way to create server schema: [netninja](https://www.youtube.com/watch?v=5RGEODLhjhY&list=PL4cUxeGkcC9iK6Qhn-QLcXCXPQUov1U7f) + [code](https://github.com/iamshaunjp/graphql-playlist)
- newer schema syntax: **buildSchema**+**resolvers** [tutorial1](https://circleci.com/blog/introduction-to-graphql/?utm_source=google&utm_medium=sem&utm_campaign=sem-google-dg--uscan-en-dsa-maxConv-auth-nb&utm_term=g_-_c__dsa_&utm_content=&gclid=CjwKCAiA76-dBhByEiwAA0_s9Y3NEmzOXJnOOWPsalhtnjLKXW_tNAvsroYeG6HBLk5lgkflXAp26BoC9wUQAvD_BwE) 
- resolvers 
  - A resolver is a function. It has the same name as the field in your schem. It can fetch data from any data source.
  - [AWS data source](https://aws.amazon.com/graphql/resolvers/#:~:text=A%20GraphQL%20resolver%20is%20a,data%20sources%20and%20micro%2Dservices.) 
  - [apollo resolver](https://www.apollographql.com/tutorials/lift-off-part2/journey-of-a-graphql-query)
- [apollo server with express](https://www.apollographql.com/docs/apollo-server/api/express-middleware/)

- client query: 
  - [vanilla fetching](https://graphql.org/graphql-js/graphql-clients/)
  - [@apollo/client-v3](https://www.apollographql.com/tutorials/lift-off-part1/apollo-client-setup) + [code](https://github.com/apollographql/odyssey-lift-off-part1)
  - [apollo-client](https://www.youtube.com/watch?v=gAbIQx26wSI) video tutorial

## Tools
### Install
```bash
npm install graphql express-graphql 
npm install graphql @apollo/client
```
### GraphQL server
- [express-graphql](https://www.npmjs.com/package/express-graphql): Express middleware for composing a GraphQL server.
- [express-graphql vs apollo-server]([apollo](https://stackoverflow.com/questions/58593497/what-is-the-difference-between-apollo-server-and-express-graphql#:~:text=express%2Dgraphql%20contains%20code%20for,Server%20is%20built%20with%20TypeScript.)) 
### GraphQL client
- @apollo/client
- fetching
### [GraphiQL](https://github.com/graphql/graphiql)
- web-based GUI for testing our GraphQL queries.
```js
graphiql: true
```

## Overview
### basic
- GraphQL is a query language for read/write
    - graphQL use a syntax to describe (**query**) the kind of data we want to fetch from a server endpoint
    - the GraphQL syntax is universal to any programming language, GraphQL is platform agnostic
    - Client side write GraphQL query, while service side write code to resolve the query
    - under the hook GraphQL is still HTTP API fetching
- drawback of RESTful
    - underfetching: require multiple fetch to get a desired data
    - overfetching: get a whole data object while we only want some field in it

- abstract view: [ninja](https://www.youtube.com/watch?v=bUD6ERbcXrQ&list=PL4cUxeGkcC9iK6Qhn-QLcXCXPQUov1U7f&index=2)

### When not use graph QL [6 min read](https://blog.logrocket.com/graphql-vs-rest-api-why-you-shouldnt-use-graphql/)
- GraphQL performance issues
- REST can do much of what GraphQL does
- GraphQL makes some tasks more complex

## syntax
### schema definition with buildSchema
```js
/* schema.js */
const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type Query {
        users: [User!]!,
        user(id: Int!): User!
    }


    type User {
        id: ID!
        name: String!
        email: String
        posts: [Post!]
    }

    type Post {
        id: ID!
        title: String!
        published: Boolean!
        link: String
        author: User!
    }
`);

module.exports = schema;
```
### Resolvers
- Resolver functions have a specific signature with four optional parameters: parent, args, context, and info.
```js
/* resolvers.js*/
const resolvers = {
  query: {
    tracksForHome: (parent, args, context, info) => {}
  }
};
module.exports = resolvers;
```
|||
|-|-|
|parent|parent is the returned value of the resolver for this field's parent. This will be useful when dealing with resolver chains.|
|args|args is an object that contains all GraphQL arguments that were provided for the field by the client GraphQL operation. |
|context|context is an object shared across all resolvers that are executing for a particular operation. The resolver needs this context argument to share state, like authentication information, a database connection, or data caching|
|info|info contains information about the operation's execution state, including the field name, the path to the field from the root, and more. It's not used as frequently as the others|


### use express-graphql in server
```js
const express = require("express");
const graphqlHTTP = require("express-graphql");
const app = express();

// import schema and resolvers...

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
);
```
### Client Query
```
{
	post(id : 2){
		title
		link
		author {
			name
		}
	}
}
```
```js
mutation {
    addAuthor(name: "shaun", age: 30) { 
        // get back data field 
        name 
        age
    }
}
```
### Types
- ObjectType
- IDType
- NonNull
- QueryType
  - Resolvers
- Mutation
# Apollo
- [tutorial code](https://github.com/apollographql/odyssey-lift-off-part4)
```
git clone https://github.com/apollographql/odyssey-lift-off-part4
```
## Apollo Server
- [RESTDataSource](https://www.apollographql.com/tutorials/lift-off-part2/implementing-our-restdatasource) [Connect to Server](https://www.apollographql.com/tutorials/lift-off-part2/connecting-the-dots-in-server-land)
- [Mutation Schema](https://www.apollographql.com/tutorials/lift-off-part4/adding-a-mutation-to-our-schema)
- [Mutation Resolver](https://www.apollographql.com/tutorials/lift-off-part4/resolving-a-mutation-with-errors)

- [Query Schema](https://www.apollographql.com/tutorials/lift-off-part3/graphql-arguments)
- [Query Resolver](https://www.apollographql.com/tutorials/lift-off-part2/implementing-query-resolvers) [Resolver Chain](https://www.apollographql.com/tutorials/lift-off-part3/resolver-chains)

## Apollo client
- [client setup](https://www.apollographql.com/tutorials/lift-off-part1/apollo-client-setup)
- [useMutation](https://www.apollographql.com/tutorials/lift-off-part4/the-usemutation-hook)
- [useQuery](https://www.apollographql.com/tutorials/lift-off-part3/the-usequery-hook---with-variables)

## Schema Registry
- [what is](https://www.apollographql.com/tutorials/lift-off-part5/what-is-the-schema-registry)