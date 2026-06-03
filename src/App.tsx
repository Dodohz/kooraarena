import { useEffect, useState, useCallback, useRef } from 'react'
import Header from './components/Header'
import LeagueSection from './components/LeagueSection'
import Sidebar from './components/Sidebar'
import api, { getDateString } from './services/api'
import { Match, LeagueGroup, TabType } from './types'

const AUTO_REFRESH_INTERVAL = 30000 // 30 seconds

function groupMatchesByLeague(matches: Match[]): LeagueGroup[] {
  const map = new Map<number, LeagueGroup>()
  for (const match of matches) {
    const id = match.league.id
    if (!map.has(id)) {
      map.set(id, { league: match.league, matches: [] })
    }
    map.get(id)!.matches.push(match)
  }
  return Array.from(map.values()).sort((a, b) => {
    // Sort: live leagues first
    const aLive = a.matches.some(m => ['LIVE','1H','2H','HT','ET','P'].includes(m.fixture.status.short))
    const bLive = b.matches.some(m => ['LIVE','1H','2H','HT','ET','P'].includes(m.fixture.status.short))
    if (aLive && !bLive) return -1
    if (!aLive && bLive) return 1
    return 0
  })
}

function sortMatchesInLeague(matches: Match[]): Match[] {
  const livePriority = ['1H', '2H', 'LIVE', 'ET', 'P', 'HT']
  return [...matches].sort((a, b) => {
    const aLive = livePriority.includes(a.fixture.status.short)
    const bLive = livePriority.includes(b.fixture.status.short)
    if (aLive && !bLive) return -1
    if (!aLive && bLive) return 1
    if (aLive && bLive) {
      return (b.fixture.status.elapsed || 0) - (a.fixture.status.elapsed || 0)
    }
    return new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()
  })
}

export default function App() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('live')
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'row' | 'card'>('row')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true'
    }
    return true // default dark
  })

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  const fetchMatches = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      else setRefreshing(true)
      setError(null)

      let params: Record<string, string> = {}

      if (activeTab === 'live') {
        params.live = 'all'
      } else if (activeTab === 'today') {
        params.date = getDateString(0)
      } else if (activeTab === 'tomorrow') {
        params.date = getDateString(1)
      } else if (activeTab === 'yesterday') {
        params.date = getDateString(-1)
      }

      const response = await api.get('/fixtures', { params })
      const data: Match[] = response.data.response || []
      setMatches(data)
      setLastUpdated(new Date())
    } catch (err: any) {
      console.error('Error fetching matches:', err)
      const msg =
        err.response?.status === 429
          ? 'تجاوزت الحد المسموح به من الطلبات. حاول بعد قليل.'
          : err.response?.status === 401
          ? 'مفتاح API غير صالح. تحقق من ملف .env.local'
          : err.message || 'فشل تحميل المباريات.'
      setError(msg)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [activeTab])

  // Initial load + tab change
  useEffect(() => {
    setMatches([])
    setSelectedLeague(null)
    fetchMatches(false)
  }, [activeTab])

  // Auto-refresh only on live tab
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (activeTab === 'live') {
      timerRef.current = setInterval(() => fetchMatches(true), AUTO_REFRESH_INTERVAL)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [activeTab, fetchMatches])

  // Computed
  const liveMatches = matches.filter(m =>
    ['LIVE', '1H', '2H', 'HT', 'ET', 'P'].includes(m.fixture.status.short)
  )

  const filteredMatches = selectedLeague
    ? matches.filter(m => m.league.id === selectedLeague)
    : matches

  const grouped = groupMatchesByLeague(
    filteredMatches.map(m => ({
      ...m,
      // sort within group done in LeagueSection
    }))
  ).map(g => ({ ...g, matches: sortMatchesInLeague(g.matches) }))

  const leagueIds = [...new Set(matches.map(m => m.league.id))]

  const tabLabel = {
    live: 'المباريات المباشرة',
    today: 'مباريات اليوم',
    tomorrow: 'مباريات الغد',
    yesterday: 'مباريات الأمس',
  }[activeTab]

  return (
    <div className="app-root" data-theme={darkMode ? 'dark' : 'light'}>
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        liveCount={liveMatches.length}
      />

      <div className="app-layout">
        {/* Sidebar */}
        <Sidebar
          selectedLeague={selectedLeague}
          onSelectLeague={setSelectedLeague}
          leagueIds={leagueIds}
        />

        {/* Main Content */}
        <main className="app-main">
          {/* Content Header */}
          <div className="content-header">
            <div className="content-header__left">
              <h2 className="content-title">{tabLabel}</h2>
              {lastUpdated && (
                <span className="last-updated">
                  آخر تحديث: {lastUpdated.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  {refreshing && <span className="refreshing-indicator"> ↻</span>}
                </span>
              )}
            </div>
            <div className="content-header__right">
              {/* View Toggle */}
              <div className="view-toggle">
                <button
                  className={`view-toggle-btn ${viewMode === 'row' ? 'view-toggle-btn--active' : ''}`}
                  onClick={() => setViewMode('row')}
                  title="عرض قائمة"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === 'card' ? 'view-toggle-btn--active' : ''}`}
                  onClick={() => setViewMode('card')}
                  title="عرض بطاقات"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </button>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => fetchMatches(false)}
                className={`refresh-btn ${refreshing ? 'refresh-btn--spinning' : ''}`}
                title="تحديث"
                disabled={loading || refreshing}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                <span>تحديث</span>
              </button>
            </div>
          </div>

          {/* Live Stats Bar */}
          {activeTab === 'live' && !loading && liveMatches.length > 0 && (
            <div className="live-stats-bar">
              <div className="live-stats-bar__item">
                <span className="live-dot" />
                <span className="live-stats-bar__num">{liveMatches.length}</span>
                <span className="live-stats-bar__label">مباراة مباشرة</span>
              </div>
              <div className="live-stats-bar__divider" />
              <div className="live-stats-bar__item">
                <span className="live-stats-bar__num">
                  {[...new Set(liveMatches.map(m => m.league.id))].length}
                </span>
                <span className="live-stats-bar__label">دوريات ومسابقات</span>
              </div>
              <div className="live-stats-bar__divider" />
              <div className="live-stats-bar__item">
                <span className="live-stats-bar__num">
                  {liveMatches.reduce((sum, m) => sum + (m.goals.home || 0) + (m.goals.away || 0), 0)}
                </span>
                <span className="live-stats-bar__label">أهداف</span>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner">
                <div className="spinner-ring" />
                <div className="spinner-ball">⚽</div>
              </div>
              <p className="loading-text">جاري تحميل المباريات...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h3 className="error-title">حدث خطأ</h3>
              <p className="error-message">{error}</p>
              <button onClick={() => fetchMatches(false)} className="btn btn--primary">
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && matches.length === 0 && (
            <div className="empty-container">
              <div className="empty-icon">
                {activeTab === 'live' ? '📺' : '📅'}
              </div>
              <h3 className="empty-title">
                {activeTab === 'live' ? 'لا توجد مباريات مباشرة حالياً' : 'لا توجد مباريات في هذا التاريخ'}
              </h3>
              <p className="empty-subtitle">
                {activeTab === 'live'
                  ? 'تابع هذه الصفحة للمتابعة حين تبدأ المباريات'
                  : 'جرّب تحديد تاريخ آخر'}
              </p>
              <button onClick={() => fetchMatches(false)} className="btn btn--outline">
                تحديث الآن
              </button>
            </div>
          )}

          {/* No results after filter */}
          {!loading && !error && matches.length > 0 && filteredMatches.length === 0 && (
            <div className="empty-container">
              <div className="empty-icon">🔍</div>
              <h3 className="empty-title">لا توجد مباريات لهذه الدوري</h3>
              <button onClick={() => setSelectedLeague(null)} className="btn btn--outline">
                عرض الكل
              </button>
            </div>
          )}

          {/* Matches */}
          {!loading && !error && grouped.length > 0 && (
            <div className="leagues-container">
              {grouped.map((group, idx) => (
                <LeagueSection
                  key={group.league.id}
                  league={group.league}
                  matches={group.matches}
                  defaultOpen={idx < 5}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-logo">
            <span>⚽</span>
            <span>KooraArena</span>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} KooraArena · نتائج وجداول المباريات الحية
          </p>
          <div className="footer-links">
            <a href="#">سياسة الخصوصية</a>
            <span>·</span>
            <a href="#">اتصل بنا</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
