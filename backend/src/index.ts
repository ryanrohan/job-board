import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { verifyToken } from './auth';
import prisma from './prisma';
import 'dotenv/config';

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) return { user: null };

    try {
      const { userId } = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { listings: true, applications: true }
      });
      return { user };
    } catch {
      return { user: null };
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});