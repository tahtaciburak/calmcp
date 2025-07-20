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
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    
    const client = await clientPromise
    const db = client.db()
    
    const dailyBalance = await db.collection('daily_balance').findOne({
      user_id: session.user.id,
      date: date
    })

    if (!dailyBalance) {
      // Return empty balance if no data found for today
      return NextResponse.json({
        user_id: session.user.id,
        date: date,
        calories_consumed: 0,
        calories_burned: 0,
        calorie_balance: 0,
        protein_consumed: 0,
        carbs_consumed: 0,
        fat_consumed: 0
      })
    }

    return NextResponse.json(dailyBalance)
  } catch (error) {
    console.error('Error fetching daily balance:', error)
    return NextResponse.json({ error: 'Failed to fetch daily balance' }, { status: 500 })
  }
}
