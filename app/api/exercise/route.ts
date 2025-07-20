import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@/lib/auth'
import { clientPromise } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getAuth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const client = await clientPromise
    const db = client.db()
    
    const entries = await db.collection('exercise_entries')
      .find({ user_id: session.user.id })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()
      
    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching exercise entries:', error)
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
  }
}