import { useState } from 'react'
import { Match, League } from '../types'
import MatchCard from './MatchCard'

interface LeagueSectionProps {
  league: League
  matches: Match[]
  defaultOpen?: boolean
  viewMode?: 'row' | 'card'
}

export default function LeagueSection({ league, matches, defaultOpen = true, viewMode = 'row' }: LeagueSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  const liveCount = matches.filter(m =>
    ['LIVE', '1H', '2H', 'HT', 'ET', 'P'].includes(m.fixture.status.short)
  ).length

  return (
    <div className="league-section">
      {/* League Header */}
      <button
        className="league-section__header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="league-section__info">
          <img
            src={league.logo}
            alt={league.name}
            className="league-logo"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <div className="league-section__meta">
            <span className="league-section__name">{league.name}</span>
            {league.country && (
              <span className="league-section__country">
                {league.flag && (
                  <img
                    src={league.flag}
                    alt={league.country}
                    className="country-flag"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                )}
                {league.country}
              </span>
            )}
          </div>
        </div>
        <div className="league-section__right">
          {liveCount > 0 && (
            <span className="league-live-badge">
              <span className="live-dot" />
              {liveCount} مباشر
            </span>
          )}
          <span className="league-match-count">{matches.length} مباراة</span>
          <svg
            className={`league-chevron ${open ? 'league-chevron--open' : ''}`}
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </button>

      {/* Matches */}
      {open && (
        <div className={`league-section__matches ${viewMode === 'card' ? 'matches-grid' : 'matches-list'}`}>
          {matches.map((match) => (
            <MatchCard
              key={match.fixture.id}
              match={match}
              view={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  )
}
