import NextAuth, { NextAuthOptions, getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import jwt from "jsonwebtoken"

const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = client.connect()

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // Always allow sign in - this helps with account linking
      return true
    },
    async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        session.user.id = user.id
        // Generate JWT user key for MCP server authentication
        const userKey = jwt.sign(
          { 
            userId: user.id, 
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year
          },
          process.env.JWT_SECRET!
        )
        session.user.mcpKey = userKey
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}

export default NextAuth(authOptions)

export const getAuth = () => getServerSession(authOptions)

export { clientPromise }