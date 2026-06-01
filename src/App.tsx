import { useEffect, useState } from 'react'
import api from './services/api'

interface Match {
  id: number
  league: {
    name: string
    logo: string
  }
  teams: {
    home: {
      name: string
      logo: string
    }
    away: {
      name: string
      logo: string
    }
  }
  score: {
    fulltime: {
      home: number | null
      away: number | null
    }
  }
}

function App() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          limit: 10
        }
      })
      setMatches(response.data.response || [])
    } catch (err: any) {
      console.error('Error fetching matches:', err)
      setError(err.response?.data?.errors?.[0] || 'فشل تحميل المباريات')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">⚽ KooraArena</h1>
          <p className="text-gray-300">جاري تحميل المباريات...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">⚽ KooraArena</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchMatches}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            إعادة محاولة
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 text-white p-6">
        <h1 className="text-4xl font-bold">⚽ KooraArena</h1>
        <p className="text-gray-300 mt-2">المباريات المباشرة</p>
      </header>

      <main className="container mx-auto p-6">
        {matches.length === 0 ? (
          <div className="text-center text-gray-300 py-12">
            <p>لا توجد مباريات مباشرة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div key={match.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition">
                <div className="text-sm text-gray-400 mb-2">{match.league.name}</div>
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <img src={match.teams.home.logo} alt={match.teams.home.name} className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-white font-bold">{match.teams.home.name}</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-2xl font-bold text-white">
                      {match.score.fulltime.home} - {match.score.fulltime.away}
                    </p>
                  </div>
                  <div className="text-center flex-1">
                    <img src={match.teams.away.logo} alt={match.teams.away.name} className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-white font-bold">{match.teams.away.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
