import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from './config/database';
import User from './models/UserModel';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './lib/mongodb';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GoogleProvider()],
  adapter: MongoDBAdapter(clientPromise), // For NextAuth to store sessions in MongoDB

  callbacks: {
    async signIn({ account, profile }) {
      return true;
    },

    async session({ session, token }) {
      // Attach the MongoDB user ID to the session
      session.user.id = token.sub;
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        // Attach the MongoDB user ID to the token
        token.sub = user.id;
      }
      return token;
    },
  },

  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
