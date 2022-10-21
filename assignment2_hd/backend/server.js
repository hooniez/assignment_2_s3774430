// Using Apollo server express
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");

// Added for subscription support
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const express = require("express");
const cors = require("cors");
const http = require("http");
const db = require("./src/database");
const graphql = require("./src/graphql");

// Database will be sync'ed in the background.
db.sync();

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  // Add CORS suport.
  app.use(cors());
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Set up GraphQL subscription server.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // Passing in an instance of a GraphQLSchema and telling the WebSocketServer to start listening
  const serverCleanup = useServer({ schema }, wsServer);

  // Set up Apollo server
  // Include plugin code to ensure all HTTP and subscription connections closed when the server is shutting down.

  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4009;
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startApolloServer(graphql.typeDefs, graphql.resolvers);

// // Parse requests of content-type - application/json.
// app.use(express.json());

// // Add GraphQL to express server.
// // NOTE: You can use the GraphQL web-interface to test the GraphQL schema thanks to the graphiql parameter being true.
// // Access the web-interface when the server is running here: http://localhost:4000/graphql
// app.use(
//   "/graphql",
//   graphqlHTTP({
//     schema: graphql.typeDefs,
//     rootValue: graphql.resolvers,
//     graphiql: true,
//   })
// );

// // Set port, listen for requests.
// const PORT = 4009;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });
