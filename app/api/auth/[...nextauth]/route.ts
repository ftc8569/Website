import NextAuth, { AuthOptions, Session, User } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"
import * as argon2 from "argon2";
import { JWT } from "next-auth/jwt"
import { AdapterUser } from "next-auth/adapters"

const prisma = new PrismaClient()

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "bedson26t@ncssm.edu" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        if(!credentials) return null;

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email
          }
        })

        if(!user) return null;

        const password = Buffer.from(user.passwordHash).toString('utf8');

        const correctPassword = await argon2.verify(password, credentials.password)

        if(correctPassword) return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }

        return null;
      }
    })
  ],
  session: {
    strategy: "jwt", // Use JWT-based sessions
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to the JWT
      if(user) {
        token.id = parseInt(user.id.toString())
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.email = user.email
      }
      return token;
    },
    async session({ session, token, user}) {
      // Add user ID to the session
      session.user.id = token.id
      session.user.email = token.email
      session.user.firstName = token.firstName
      session.user.lastName = token.lastName
      return session;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions }