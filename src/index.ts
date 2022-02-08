import express, { Express, Request, Response } from 'express';
import http from 'http';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import validateTokensMiddleware from './middleware/validateTokens';
import { port, frontendDevURL, frontendProdURL, apolloStudioURL } from './config/environment';
import schema from './graphql/';
import connectDB from './db';

async function startApolloServer(schema) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    introspection: true,
    context: ({ req, res }) => ({ req, res }),
  });
  
  await server.start();

  const corsOptions = {
    credentials: true,
    origin: [frontendDevURL, frontendProdURL, apolloStudioURL],
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept', 'Origin', 'X-Signature'],
  };

  app.use(cors(corsOptions))
  app.use(cookieParser());
  app.use(validateTokensMiddleware);
  app.use(graphqlUploadExpress());
  server.applyMiddleware({
    app,
    cors: false
  });

  await connectDB();

  app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Mercado GraphQL API</h1>');
  });

  await new Promise<void>(resolve => httpServer.listen(port, resolve));
  console.log(`🚀 Server ready and running on ${port}${server.graphqlPath}`);
}

startApolloServer(schema);
