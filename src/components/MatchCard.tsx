import { Match } from '../types'

interface MatchCardProps {
  match: Match
  view?: 'card' | 'row'
  onClick?: () => void
}

const STATUS_MAP: Record<string, { label: string; color: string; isLive: boolean }> = {
  'LIVE': { label: 'مباشر', color: 'live', isLive: true },
  '1H':   { label: 'ش1', color: 'live', isLive: true },
  '2H':   { label: 'ش2', color: 'live', isLive: true },
  'HT':   { label: 'استراحة', color: 'halftime', isLive: true },
  'ET':   { label: 'وقت إضافي', color: 'live', isLive: true },
  'P':    { label: 'ركلات', color: 'live', isLive: true },
  'FT':   { label: 'انتهت', color: 'finished', isLive: false },
  'AET':  { label: 'بعد الإضافي', color: 'finished', isLive: false },
  'PEN':  { label: 'بعد الركلات', color: 'finished', isLive: false },
  'NS':   { label: 'لم تبدأ', color: 'scheduled', isLive: false },
  'PST':  { label: 'مؤجلة', color: 'postponed', isLive: false },
  'CANC': { label: 'ملغية', color: 'cancelled', isLive: false },
  'SUSP': { label: 'موقوفة', color: 'suspended', isLive: false },
  'ABD':  { label: 'مهجورة', color: 'cancelled', isLive: false },
  'TBD':  { label: 'يحدد لاحقاً', color: 'scheduled', isLive: false },
}

function formatKickoffTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export default function MatchCard({ match, view = 'row', onClick }: MatchCardProps) {
  const { fixture, league, teams, goals, score } = match
  const statusInfo = STATUS_MAP[fixture.status.short] || { label: fixture.status.short, color: 'scheduled', isLive: false }

  const homeGoals = goals.home !== null ? goals.home : (score.fulltime.home !== null ? score.fulltime.home : null)
  const awayGoals = goals.away !== null ? goals.away : (score.fulltime.away !== null ? score.fulltime.away : null)
  const hasScore = homeGoals !== null && awayGoals !== null

  const isLive = statusInfo.isLive
  const isScheduled = fixture.status.short === 'NS' || fixture.status.short === 'TBD'
  const isFinished = ['FT', 'AET', 'PEN'].includes(fixture.status.short)

  const homeWin = isFinished && hasScore && homeGoals! > awayGoals!
  const awayWin = isFinished && hasScore && awayGoals! > homeGoals!

  // Row View (like 365Scores / Goal.com list style)
  if (view === 'row') {
    return (
      <div
        className={`match-row ${isLive ? 'match-row--live' : ''}`}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {/* Status / Time */}
        <div className="match-row__status">
          {isLive ? (
            <div className="match-status match-status--live">
              <span className="live-dot" />
              <span>
                {fixture.status.short === 'HT'
                  ? 'استراحة'
                  : fixture.status.elapsed
                  ? `${fixture.status.elapsed}'`
                  : statusInfo.label}
              </span>
            </div>
          ) : isScheduled ? (
            <div className="match-status match-status--scheduled">
              {formatKickoffTime(fixture.date)}
            </div>
          ) : (
            <div className={`match-status match-status--${statusInfo.color}`}>
              {statusInfo.label}
            </div>
          )}
        </div>

        {/* Home Team */}
        <div className="match-row__team match-row__team--home">
          <span className={`team-name ${homeWin ? 'team-name--winner' : ''} ${awayWin ? 'team-name--loser' : ''}`}>
            {teams.home.name}
          </span>
          <img
            src={teams.home.logo}
            alt={teams.home.name}
            className="team-logo"
            onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23374151"/></svg>' }}
          />
        </div>

        {/* Score */}
        <div className="match-row__score">
          {hasScore ? (
            <div className="score-display">
              <span className={`score-num ${homeWin ? 'score-num--win' : ''}`}>{homeGoals}</span>
              <span className="score-sep">:</span>
              <span className={`score-num ${awayWin ? 'score-num--win' : ''}`}>{awayGoals}</span>
            </div>
          ) : (
            <div className="score-display score-display--empty">
              <span className="score-dash">-</span>
              <span className="score-sep">:</span>
              <span className="score-dash">-</span>
            </div>
          )}
          {/* Half Time Score */}
          {(isLive || isFinished) && score.halftime.home !== null && (
            <div className="halftime-score">
              ({score.halftime.home} : {score.halftime.away})
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="match-row__team match-row__team--away">
          <img
            src={teams.away.logo}
            alt={teams.away.name}
            className="team-logo"
            onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23374151"/></svg>' }}
          />
          <span className={`team-name ${awayWin ? 'team-name--winner' : ''} ${homeWin ? 'team-name--loser' : ''}`}>
            {teams.away.name}
          </span>
        </div>

        {/* Watch Icon */}
        <div className="match-row__action">
          {isLive && (
            <button className="watch-btn" title="مشاهدة">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    )
  }

  // Card View
  return (
    <div
      className={`match-card ${isLive ? 'match-card--live' : ''}`}
      onClick={onClick}
    >
      {/* Live Badge */}
      {isLive && (
        <div className="match-card__live-badge">
          <span className="live-dot" />
          {fixture.status.short === 'HT' ? 'استراحة' : fixture.status.elapsed ? `${fixture.status.elapsed}'` : 'مباشر'}
        </div>
      )}

      {/* League */}
      <div className="match-card__league">
        <img src={league.logo} alt={league.name} className="league-logo-sm"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <span>{league.name}</span>
        {league.round && <span className="league-round"> · {league.round}</span>}
      </div>

      {/* Teams & Score */}
      <div className="match-card__body">
        {/* Home */}
        <div className="match-card__team">
          <img src={teams.home.logo} alt={teams.home.name} className="team-logo-lg"
            onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23374151"/></svg>' }} />
          <p className={`team-name-card ${homeWin ? 'font-bold' : ''}`}>{teams.home.name}</p>
        </div>

        {/* Score Center */}
        <div className="match-card__score-center">
          {!isScheduled ? (
            <>
              <div className="score-large">
                {hasScore ? `${homeGoals} : ${awayGoals}` : '- : -'}
              </div>
              {(isLive || isFinished) && score.halftime.home !== null && (
                <div className="score-ht">({score.halftime.home}:{score.halftime.away})</div>
              )}
            </>
          ) : (
            <div className="kickoff-time">{formatKickoffTime(fixture.date)}</div>
          )}
          <div className={`status-badge status-badge--${statusInfo.color}`}>
            {isLive && <span className="live-dot" />}
            {isLive && fixture.status.elapsed ? `${fixture.status.elapsed}'` : statusInfo.label}
          </div>
        </div>

        {/* Away */}
        <div className="match-card__team">
          <img src={teams.away.logo} alt={teams.away.name} className="team-logo-lg"
            onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23374151"/></svg>' }} />
          <p className={`team-name-card ${awayWin ? 'font-bold' : ''}`}>{teams.away.name}</p>
        </div>
      </div>

      {/* Footer */}
      {fixture.venue.name && (
        <div className="match-card__footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{fixture.venue.name}{fixture.venue.city ? `, ${fixture.venue.city}` : ''}</span>
        </div>
      )}
    </div>
  )
}
