import { MongoClient, Db, Collection } from 'mongodb'
import { clientPromise } from './auth'

export interface JournalEntry {
  _id?: string
  user_id: string
  timestamp: Date
  text: string
  mood: number
  energy_level: number
  stress_level: number
}

export interface ExerciseEntry {
  _id?: string
  user_id: string
  timestamp: Date
  exercise_type: string
  duration_minutes: number
  intensity: number
  energy_after: number
  notes?: string
}

export interface FoodEntry {
  _id?: string
  user_id: string
  timestamp: Date
  meal_type: string
  foods: string[]
  satisfaction: number
  energy_after: number
  notes?: string
}

export interface SleepEntry {
  _id?: string
  user_id: string
  timestamp: Date
  bedtime: string
  wake_time: string
  quality: number
  dreams: boolean
  notes?: string
}

class DatabaseService {
  private client: MongoClient | null = null
  private db: Db | null = null

  async connect(): Promise<Db> {
    if (!this.client) {
      this.client = await clientPromise
      this.db = this.client.db()
    }
    return this.db!
  }

  async getJournalEntries(userId: string, limit = 50): Promise<JournalEntry[]> {
    const db = await this.connect()
    return db.collection<JournalEntry>('journal_entries')
      .find({ user_id: userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()
  }

  async getExerciseEntries(userId: string, limit = 50): Promise<ExerciseEntry[]> {
    const db = await this.connect()
    return db.collection<ExerciseEntry>('exercise_entries')
      .find({ user_id: userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()
  }

  async getFoodEntries(userId: string, limit = 50): Promise<FoodEntry[]> {
    const db = await this.connect()
    return db.collection<FoodEntry>('food_entries')
      .find({ user_id: userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()
  }

  async getSleepEntries(userId: string, limit = 50): Promise<SleepEntry[]> {
    const db = await this.connect()
    return db.collection<SleepEntry>('sleep_entries')
      .find({ user_id: userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()
  }

  async getRecentStats(userId: string, days = 7) {
    const db = await this.connect()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [journalStats, exerciseStats, foodStats, sleepStats] = await Promise.all([
      db.collection('journal_entries').aggregate([
        { $match: { user_id: userId, timestamp: { $gte: startDate } } },
        { $group: {
          _id: null,
          avgMood: { $avg: '$mood' },
          avgEnergy: { $avg: '$energy_level' },
          avgStress: { $avg: '$stress_level' },
          count: { $sum: 1 }
        }}
      ]).toArray(),
      
      db.collection('exercise_entries').aggregate([
        { $match: { user_id: userId, timestamp: { $gte: startDate } } },
        { $group: {
          _id: null,
          totalMinutes: { $sum: '$duration_minutes' },
          avgIntensity: { $avg: '$intensity' },
          count: { $sum: 1 }
        }}
      ]).toArray(),
      
      db.collection('food_entries').aggregate([
        { $match: { user_id: userId, timestamp: { $gte: startDate } } },
        { $group: {
          _id: null,
          avgSatisfaction: { $avg: '$satisfaction' },
          avgEnergyAfter: { $avg: '$energy_after' },
          count: { $sum: 1 }
        }}
      ]).toArray(),
      
      db.collection('sleep_entries').aggregate([
        { $match: { user_id: userId, timestamp: { $gte: startDate } } },
        { $group: {
          _id: null,
          avgQuality: { $avg: '$quality' },
          count: { $sum: 1 }
        }}
      ]).toArray()
    ])

    return {
      journal: journalStats[0] || { avgMood: 0, avgEnergy: 0, avgStress: 0, count: 0 },
      exercise: exerciseStats[0] || { totalMinutes: 0, avgIntensity: 0, count: 0 },
      food: foodStats[0] || { avgSatisfaction: 0, avgEnergyAfter: 0, count: 0 },
      sleep: sleepStats[0] || { avgQuality: 0, count: 0 }
    }
  }
}

export const dbService = new DatabaseService()