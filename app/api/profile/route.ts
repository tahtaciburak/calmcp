import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@/lib/auth'
import { clientPromise } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getAuth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = await clientPromise
    const db = client.db()
    
    const profile = await db.collection('user_profiles').findOne({
      user_id: session.user.id
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
