import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      mcpKey?: string
    }
  }

  interface User {
    id: string
    mcpKey?: string
  }
}