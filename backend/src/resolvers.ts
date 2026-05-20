import prisma from './prisma';
import { hashPassword, comparePassword, signToken } from './auth';

export const resolvers = {
  Query: {
    listings: () => {
      return prisma.listing.findMany({
        include: { employer: true, applications: true }
      });
    },

    listing: (_: any, { id }: { id: number }) => {
      return prisma.listing.findUnique({
        where: { id },
        include: { employer: true, applications: true }
      });
    },

    me: (_: any, __: any, context: any) => {
      return context.user || null;
    }
  },

  Mutation: {
    register: async (_: any, { email, password, role }: any) => {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new Error('Email already in use');

      const hashed = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashed,
          role: role === 'EMPLOYER' ? 'EMPLOYER' : 'APPLICANT'
        },
        include: { listings: true, applications: true }
      });

      const token = signToken(user.id, user.role);
      return { token, user };
    },

    login: async (_: any, { email, password }: any) => {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { listings: true, applications: true }
      });
      if (!user) throw new Error('Invalid email or password');

      const valid = await comparePassword(password, user.password);
      if (!valid) throw new Error('Invalid email or password');

      const token = signToken(user.id, user.role);
      return { token, user };
    },

    createListing: (_: any, args: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return prisma.listing.create({
        data: { ...args, employerId: context.user.id },
        include: { employer: true, applications: true }
      });
    },

    applyToListing: (_: any, { listingId }: { listingId: number }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return prisma.application.create({
        data: { listingId, applicantId: context.user.id },
        include: { applicant: true, listing: true }
      });
    }
  }
};