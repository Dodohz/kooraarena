import { POPULAR_LEAGUES } from '../types'

interface SidebarProps {
  selectedLeague: number | null
  onSelectLeague: (id: number | null) => void
  leagueIds: number[]
}

export default function Sidebar({ selectedLeague, onSelectLeague, leagueIds }: SidebarProps) {
  const visibleLeagues = POPULAR_LEAGUES.filter(l => leagueIds.includes(l.id))
  const hasLeagues = visibleLeagues.length > 0

  return (
    <aside className="sidebar">
      {/* Quick Links */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">الدوريات</h3>
        <div className="sidebar-leagues">
          <button
            className={`sidebar-league-item ${selectedLeague === null ? 'sidebar-league-item--active' : ''}`}
            onClick={() => onSelectLeague(null)}
          >
            <span className="sidebar-league-icon">🌐</span>
            <span>جميع الدوريات</span>
          </button>

          {hasLeagues ? (
            visibleLeagues.map((league) => (
              <button
                key={league.id}
                className={`sidebar-league-item ${selectedLeague === league.id ? 'sidebar-league-item--active' : ''}`}
                onClick={() => onSelectLeague(league.id)}
              >
                <span className="sidebar-league-icon">{league.flag}</span>
                <span>{league.name}</span>
              </button>
            ))
          ) : (
            POPULAR_LEAGUES.slice(0, 8).map((league) => (
              <button
                key={league.id}
                className="sidebar-league-item sidebar-league-item--disabled"
                disabled
              >
                <span className="sidebar-league-icon">{league.flag}</span>
                <span>{league.name}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* App Info */}
      <div className="sidebar-section sidebar-info">
        <div className="sidebar-info__item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>تحديث تلقائي كل 30 ثانية</span>
        </div>
        <div className="sidebar-info__item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.37a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>بيانات محدّثة لحظياً</span>
        </div>
      </div>
    </aside>
  )
}
