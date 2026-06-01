import { useEffect, useState } from 'react'
import Header from './components/Header'
import MatchCard from './components/MatchCard'
import api from './services/api'
import { Match } from './types'

function App() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true'
    }
    return false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/fixtures', {
        params: {
          live: 'all',
        },
      })
      setMatches(response.data.response || [])
    } catch (err: any) {
      console.error('Error fetching matches:', err)
      const errorMessage =
        err.response?.data?.errors?.[0] ||
        err.message ||
        'فشل تحميل المباريات. تأكد من API Key.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin text-4xl mb-4">⚽</div>
            <p className="text-gray-600 dark:text-gray-400">جاري تحميل المباريات...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-center">
            <p className="font-bold mb-2">خطأ</p>
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchMatches}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              إعادة محاولة
            </button>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              لا توجد مباريات مباشرة حالياً
            </p>
            <button
              onClick={fetchMatches}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              تحديث
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {matches.length} مباريات مباشرة
              </h2>
              <button
                onClick={fetchMatches}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                تحديث
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <MatchCard key={match.fixture.id} match={match} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
