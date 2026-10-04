import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: number
      email: string
      firstName: string
      lastName: string
    }
  }

  interface User {
    id: number
    email: string
    firstName: string
    lastName: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number
    email: string
    firstName: string
    lastName: string
  }
}
