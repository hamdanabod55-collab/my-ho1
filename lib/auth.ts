import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_client_secret"
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        
        if (!user || !user.password) {
          // User might not exist or logged in via Google previously without password
          return null;
        }
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          isSubscribed: user.isSubscribed
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'USER';
        token.isSubscribed = user.isSubscribed || false;
      }
      
      // Sync from DB for Google logins just in case, on first creation
      if (account?.provider === "google") {
         const dbUser = await prisma.user.findUnique({ where: { email: user?.email as string } });
         if (dbUser) {
           token.id = dbUser.id;
           token.role = dbUser.role;
           token.isSubscribed = dbUser.isSubscribed;
         }
      }

      if (trigger === "update" && session?.isSubscribed) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        if (dbUser) {
           token.isSubscribed = dbUser.isSubscribed;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isSubscribed = token.isSubscribed as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: "jwt" }
};
