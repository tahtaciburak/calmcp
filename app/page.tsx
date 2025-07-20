'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Stats {
  calories: {
    consumed: number;
    burned: number;
    goal: number;
    balance: number;
    protein: number;
    carbs: number;
    fat: number;
  }
  exercise: { totalMinutes: number; totalCaloriesBurned: number; count: number }
  food: { totalCalories: number; count: number }
}

interface UserProfile {
  user_id: string
  age: number
  gender: string
  weight_kg: number
  height_cm: number
  activity_level: string
  goal: string
  daily_calorie_goal: number
  protein_goal_grams: number
  carbs_goal_grams: number
  fat_goal_grams: number
}

interface FoodEntry {
  _id: string
  timestamp: string
  meal_type: string
  food_name: string
  quantity_grams: number
  calories_per_100g: number
  total_calories: number
  protein_grams: number
  carbs_grams: number
  fat_grams: number
  notes?: string
}

interface ExerciseEntry {
  _id: string
  timestamp: string
  activity_name: string
  duration_minutes: number
  calories_burned: number
  intensity: number
  notes?: string
}

interface DailyBalance {
  user_id: string
  date: string
  calories_consumed: number
  calories_burned: number
  calorie_balance: number
  protein_consumed: number
  carbs_consumed: number
  fat_consumed: number
}

const StatCard = ({ title, value, subtitle, icon, color = "blue" }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color?: string;
}) => {
  // Predefined color classes to ensure Tailwind CSS properly includes them
  const colorClasses = {
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    purple: 'text-purple-600 dark:text-purple-400',
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400'
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses[color as keyof typeof colorClasses] || 'text-blue-600 dark:text-blue-400'}`}>{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">{subtitle}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  )
}

const ProfileCard = ({ profile }: { profile: UserProfile }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profil Bilgileri</h3>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="text-gray-600 dark:text-gray-400">Yaş:</span>
        <span className="ml-2 font-medium">{profile.age || 'N/A'}</span>
      </div>
      <div>
        <span className="text-gray-600 dark:text-gray-400">Cinsiyet:</span>
        <span className="ml-2 font-medium">
          {profile.gender === 'male' ? 'Erkek' : profile.gender === 'female' ? 'Kadın' : 'N/A'}
        </span>
      </div>
      <div>
        <span className="text-gray-600 dark:text-gray-400">Kilo:</span>
        <span className="ml-2 font-medium">{profile.weight_kg ? `${profile.weight_kg} kg` : 'N/A'}</span>
      </div>
      <div>
        <span className="text-gray-600 dark:text-gray-400">Boy:</span>
        <span className="ml-2 font-medium">{profile.height_cm ? `${profile.height_cm} cm` : 'N/A'}</span>
      </div>
      <div>
        <span className="text-gray-600 dark:text-gray-400">Aktivite:</span>
        <span className="ml-2 font-medium capitalize">{profile.activity_level || 'N/A'}</span>
      </div>
      <div>
        <span className="text-gray-600 dark:text-gray-400">Hedef:</span>
        <span className="ml-2 font-medium">
          {profile.goal === 'lose' ? 'Kilo Ver' : profile.goal === 'gain' ? 'Kilo Al' : 'Koru'}
        </span>
      </div>
    </div>
  </div>
)

const MacroProgressBar = ({ label, current, goal, unit, color }: {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}) => {
  const percentage = Math.min((current / (goal || 1)) * 100, 100)

  // Predefined color classes to ensure Tailwind CSS properly includes them
  const colorClasses = {
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600'
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium">{current.toFixed(1)}/{goal?.toFixed(1) || 0} {unit}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${colorClasses[color as keyof typeof colorClasses] || 'bg-blue-600'} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
    </div>
  )
}

const EntryCard = ({ title, children, count }: {
  title: string;
  children: React.ReactNode;
  count: number;
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <span className="text-sm text-gray-500 dark:text-gray-400">{count} entries</span>
    </div>
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {children}
    </div>
  </div>
)

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [dailyBalance, setDailyBalance] = useState<DailyBalance | null>(null)
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showMcpKey, setShowMcpKey] = useState(false)

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      const [statsRes, profileRes, balanceRes, foodRes, exerciseRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/profile'),
        fetch('/api/daily-balance'),
        fetch('/api/food?limit=10'),
        fetch('/api/exercise?limit=10')
      ])

      const [statsData, profileData, balanceData, foodData, exerciseData] = await Promise.all([
        statsRes.json(),
        profileRes.json(),
        balanceRes.json(),
        foodRes.json(),
        exerciseRes.json()
      ])

      setStats(statsData)
      setUserProfile(profileData)
      setDailyBalance(balanceData)
      setFoodEntries(foodData)
      setExerciseEntries(exerciseData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Navigation Bar */}
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  🍎 <span className="text-white-500">CalMCP</span>
                </span>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  <a
                    href="#features"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-md font-medium transition-colors"
                  >
                    Özellikler
                  </a>
                  <a
                    href="#mcp-setup"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-md font-medium transition-colors"
                  >
                    Kurulum
                  </a>
                  <a
                    href="#about"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-md font-medium transition-colors"
                  >
                    Hakkında
                  </a>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com/tahtaciburak/calmcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <button
                  onClick={() => signIn('google')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Giriş Yap
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              🍎 <span className="text-white-500">CalMCP</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              AI destekli kalori takibi ve beslenme koçu.
              <span className="text-blue-600 font-semibold"> Model Context Protocol (MCP)</span> ile
              Claude'a entegre edilebilir kişisel sağlık asistanınız.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => signIn('google')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                🚀 Hemen Başla
              </button>
              <a
                href="#mcp-setup"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-lg transition-all duration-200"
              >
                📖 MCP Kurulum Rehberi
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            ✨ Özellikler
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Kalori Takibi
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Günlük kalori alımı ve yakımınızı detaylı şekilde takip edin.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🥗</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Beslenme Analizi
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Protein, karbonhidrat ve yağ alımınızı analiz edin.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Egzersiz Kayıtları
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Spor aktivitelerinizi ve kalori yakımınızı kaydedin.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Claude AI Entegrasyonu
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                MCP protokolü ile Claude'a bağlanarak AI destekli rehberlik alın.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                İlerleme Analizi
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Haftalık trendlerinizi ve gelişiminizi görselleştirin.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Kişiselleştirilmiş Hedefler
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yaşınıza, kilonuza ve hedeflerinize özel öneriler.
              </p>
            </div>
          </div>
        </div>

        {/* MCP Setup Section */}
        <div id="mcp-setup" className="bg-gray-50 dark:bg-gray-800/50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              🔧 MCP Kurulum Rehberi
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12">
              CalMCP'yi Claude Desktop uygulamanıza entegre ederek AI destekli beslenme koçluğu deneyimi yaşayın.
            </p>

            {/* Step by Step Guide */}
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Claude Desktop Kurulumu
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Claude Desktop uygulamasını indirin ve kurulum yapın.
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 code-scroll overflow-x-auto">
                      <code className="text-sm text-gray-800 dark:text-gray-200">
                        # macOS için Homebrew ile kurulum<br />
                        brew install --cask claude
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      CalMCP Server'ı İndirin
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      GitHub'dan CalMCP server'ını klonlayın veya indirin.
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 code-scroll overflow-x-auto">
                      <code className="text-sm text-gray-800 dark:text-gray-200">
                        git clone <a href="https://github.com/tahtaciburak/calmcp.git" target="_blank" rel="noopener noreferrer">https://github.com/tahtaciburak/calmcp.git</a><br />
                        cd calmcp<br />
                        pip install -r requirements.txt
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Claude Desktop Konfigürasyonu
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Claude Desktop'ın MCP konfigürasyon dosyasını düzenleyin.
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 code-scroll overflow-x-auto">
                      <code className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre">
                        {`{
{
	"mcpServers": {
		"calmcp": {
			"command": "uv",
			"args": [
				"--directory",
				"/Users/<YOUR_USERNAME_HERE>/Desktop/calmcp/mcp",
				"run",
				"main.py"
			],
			"env": {
				"AUTH_TOKEN":"<YOUR_MCP_KEY_HERE>"
			}
		}
	}
}
`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Hesap Oluşturun ve MCP Key Alın
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      CalMCP'ye giriş yapın ve MCP authentication key'inizi alın.
                    </p>
                    <button
                      onClick={() => signIn('google')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Giriş Yap ve Key Al
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    ✓
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Hazırsınız! 🎉
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Claude Desktop'ı yeniden başlatın ve CalMCP ile konuşmaya başlayın!
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-green-800 dark:text-green-200 text-sm">
                        <strong>Örnek komutlar:</strong><br />
                        • "Bugün ne kadar kalori aldım?"<br />
                        • "Protein alımımı artırmak için ne önerirsin?"<br />
                        • "Son haftalık ilerlememı göster"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="bg-white dark:bg-gray-800 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              🤖 Model Context Protocol ile Güçlendirildi
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              CalMCP, Claude AI ile doğrudan entegrasyon sağlayan Model Context Protocol (MCP) teknolojisini kullanır.
              Bu sayede verileriniz güvenli bir şekilde AI asistanınızla paylaşılır ve kişiselleştirilmiş beslenme
              tavsiyeleri alabilirsiniz.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Güvenli</h3>
                <p className="text-gray-600 dark:text-gray-300">Verileriniz şifrelenir ve güvenli bir şekilde saklanır</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Hızlı</h3>
                <p className="text-gray-600 dark:text-gray-300">Gerçek zamanlı veri senkronizasyonu</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Kişisel</h3>
                <p className="text-gray-600 dark:text-gray-300">Size özel AI destekli öneriler</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Sağlıklı yaşam yolculuğunuza bugün başlayın! 🌟
            </h2>
            <p className="text-xl mb-8 opacity-90">
              AI destekli kişisel beslenme koçunuz sizi bekliyor.
            </p>
            <button
              onClick={() => signIn('google')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
            >
              Ücretsiz Hesap Oluştur
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-400">
              © 2025 CalMCP. Model Context Protocol ile güçlendirilmiştir.
            </p>
          </div>
        </footer>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Kalori Takip Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {session.user?.name}
                </span>
              </div>
              <button
                onClick={() => setShowMcpKey(!showMcpKey)}
                className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                MCP Key
              </button>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MCP Key Modal */}
      {showMcpKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Your MCP Server Authentication Key
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Use this key in your MCP server configuration for authentication:
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded font-mono text-sm break-all">
              {session.user?.mcpKey}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigator.clipboard.writeText(session.user?.mcpKey || '')}
                className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Copy Key
              </button>
              <button
                onClick={() => setShowMcpKey(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile & Daily Goal Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {userProfile && <ProfileCard profile={userProfile} />}

          {/* Daily Calorie Balance */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Günlük Kalori Bilançosu</h3>
              {dailyBalance && userProfile && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{dailyBalance.calories_consumed}</p>
                      <p className="text-sm text-gray-600">Alınan Kalori</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{dailyBalance.calories_burned}</p>
                      <p className="text-sm text-gray-600">Yakılan Kalori</p>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${dailyBalance.calorie_balance > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        {dailyBalance.calorie_balance > 0 ? '+' : ''}{dailyBalance.calorie_balance}
                      </p>
                      <p className="text-sm text-gray-600">Net Kalori</p>
                    </div>
                  </div>

                  {/* Daily Goal Progress */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Günlük Kalori Hedefi</span>
                      <span>{dailyBalance.calories_consumed}/{userProfile.daily_calorie_goal?.toFixed(0) || 0} kcal</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((dailyBalance.calories_consumed / userProfile.daily_calorie_goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Macro Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <MacroProgressBar
                      label="Protein"
                      current={dailyBalance.protein_consumed}
                      goal={userProfile.protein_goal_grams}
                      unit="g"
                      color="red"
                    />
                    <MacroProgressBar
                      label="Karbonhidrat"
                      current={dailyBalance.carbs_consumed}
                      goal={userProfile.carbs_goal_grams}
                      unit="g"
                      color="yellow"
                    />
                    <MacroProgressBar
                      label="Yağ"
                      current={dailyBalance.fat_consumed}
                      goal={userProfile.fat_goal_grams}
                      unit="g"
                      color="purple"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Günlük Kalori"
            value={dailyBalance?.calories_consumed || 0}
            subtitle={`Hedef: ${userProfile?.daily_calorie_goal?.toFixed(0) || 0} kcal`}
            icon="🔥"
            color="blue"
          />
          <StatCard
            title="Yakılan Kalori"
            value={dailyBalance?.calories_burned || 0}
            subtitle={`${stats?.exercise.count || 0} egzersiz`}
            icon="💪"
            color="red"
          />
          <StatCard
            title="Net Kalori"
            value={dailyBalance?.calorie_balance || 0}
            subtitle={dailyBalance && dailyBalance.calorie_balance < 0 ? "Kalori açığı" : "Kalori fazlası"}
            icon={dailyBalance && dailyBalance.calorie_balance < 0 ? "📉" : "📈"}
            color={dailyBalance && dailyBalance.calorie_balance < 0 ? "green" : "orange"}
          />
          <StatCard
            title="Günlük Yemek"
            value={stats?.food.count || 0}
            subtitle={`${stats?.food.totalCalories || 0} kcal toplamda`}
            icon="🍽️"
            color="purple"
          />
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Food Entries */}
          <EntryCard title="Son Yemekler" count={foodEntries.length}>
            {foodEntries.map((entry) => (
              <div key={entry._id} className="border-l-4 border-orange-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white capitalize">
                    {entry.meal_type}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {entry.food_name} ({entry.quantity_grams}g)
                </p>
                <div className="flex space-x-4 text-xs text-gray-500">
                  <span>� {entry.total_calories} kcal</span>
                  <span>🥩 {entry.protein_grams.toFixed(1)}g protein</span>
                  <span>🍞 {entry.carbs_grams.toFixed(1)}g carbs</span>
                  <span>🧈 {entry.fat_grams.toFixed(1)}g fat</span>
                </div>
                {entry.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{entry.notes}</p>
                )}
              </div>
            ))}
          </EntryCard>

          {/* Exercise Entries */}
          <EntryCard title="Son Egzersizler" count={exerciseEntries.length}>
            {exerciseEntries.map((entry) => (
              <div key={entry._id} className="border-l-4 border-green-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                    {entry.activity_name}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex space-x-4 text-xs text-gray-500">
                  <span>⏱️ {entry.duration_minutes}m</span>
                  <span>🔥 {entry.calories_burned} kcal</span>
                  <span>� {entry.intensity}/10</span>
                </div>
                {entry.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{entry.notes}</p>
                )}
              </div>
            ))}
          </EntryCard>
        </div>
      </main>
    </div>
  )
}
