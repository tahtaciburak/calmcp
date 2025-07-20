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
    const days = parseInt(searchParams.get('days') || '7')
    
    const client = await clientPromise
    const db = client.db()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [exerciseStats, foodStats] = await Promise.all([
      db.collection('exercise_entries').aggregate([
        { $match: { user_id: session.user.id, timestamp: { $gte: startDate.toISOString() } } },
        { $group: {
          _id: null,
          totalMinutes: { $sum: '$duration_minutes' },
          totalCaloriesBurned: { $sum: '$calories_burned' },
          count: { $sum: 1 }
        }}
      ]).toArray(),
      
      db.collection('food_entries').aggregate([
        { $match: { user_id: session.user.id, timestamp: { $gte: startDate.toISOString() } } },
        { $group: {
          _id: null,
          totalCalories: { $sum: '$total_calories' },
          count: { $sum: 1 }
        }}
      ]).toArray()
    ])

    return NextResponse.json({
      calories: {
        consumed: foodStats[0]?.totalCalories || 0,
        burned: exerciseStats[0]?.totalCaloriesBurned || 0,
        goal: 2400, // This should come from user profile
        balance: (foodStats[0]?.totalCalories || 0) - (exerciseStats[0]?.totalCaloriesBurned || 0),
        protein: 0, // Will be calculated from daily balance
        carbs: 0,
        fat: 0
      },
      exercise: exerciseStats[0] || { totalMinutes: 0, totalCaloriesBurned: 0, count: 0 },
      food: foodStats[0] || { totalCalories: 0, count: 0 }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}