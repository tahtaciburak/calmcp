import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { clientPromise } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Verify JWT token
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get user details from database
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')
    
    // Convert userId string to ObjectId for MongoDB query
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(decoded.userId)
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Return user details (without sensitive information)
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified
      },
      tokenInfo: {
        userId: decoded.userId,
        email: decoded.email,
        exp: decoded.exp,
        iat: decoded.iat
      }
    })

  } catch (error) {
    console.error('JWT validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST with JWT token in request body.' },
    { status: 405 }
  )
}