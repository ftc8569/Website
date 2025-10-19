import NextAuth, { AuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"
import * as argon2 from "argon2"

const prisma = new PrismaClient()

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "bedson26t@ncssm.edu"
        },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null

        let user
        try {
          user = await prisma.user.findFirst({
            where: {
              email: credentials.email
            }
          })
        } catch (error) {
          console.error(error)
          return null
        }

        if (!user) return null

        const password = Buffer.from(user.passwordHash).toString("utf8")

        const correctPassword = await argon2.verify(
          password,
          credentials.password
        )

        if (correctPassword)
          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt", // Use JWT-based sessions
    maxAge: 60 * 60 * 24 * 30
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to the JWT
      if (user) {
        token.id = parseInt(user.id.toString())
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      // Add user ID to the session
      session.user.id = token.id
      session.user.email = token.email
      session.user.firstName = token.firstName
      session.user.lastName = token.lastName
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions }
