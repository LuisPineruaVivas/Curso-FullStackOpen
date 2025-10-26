const { ApolloServer } = require('@apollo/server')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@as-integrations/express4')
const { createServer } = require('http')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')

const express = require('express')
const cors = require('cors')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const jwt = require('jsonwebtoken')
require('dotenv').config()

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const User = require('./models/user')

const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const start = async () => {
  const app = express();
  const httpServer = createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers})
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
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

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
          const decodedToken = jwt.verify(
            auth.substring(7), process.env.JWT_SECRET
          )
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        }
      }
    })
  );

  const PORT = 4000;

  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
  });

  wsServer.on('connection', (socket) => {
    console.log('🔌 WebSocket connection established');
  });

  wsServer.on('error', (err) => {
    console.error('❌ WebSocket server error:', err);
  });


  }


start()










