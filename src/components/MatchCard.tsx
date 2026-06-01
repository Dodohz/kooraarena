import { Match } from '../types'

interface MatchCardProps {
  match: Match
}

export default function MatchCard({ match }: MatchCardProps) {
  const { fixture, league, teams, goals, score } = match
  const isLive = fixture.status.short === 'LIVE' || fixture.status.short === '1H' || fixture.status.short === '2H'
  const homeGoals = goals.home !== null ? goals.home : score.fulltime.home
  const awayGoals = goals.away !== null ? goals.away : score.fulltime.away

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
      {/* League Info */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <img src={league.logo} alt={league.name} className="w-6 h-6" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {league.name}
        </span>
        {isLive && (
          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            LIVE
          </span>
        )}
      </div>

      {/* Match Status */}
      <div className="text-center mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {fixture.status.long}
        </p>
        {fixture.status.elapsed && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Minute: {fixture.status.elapsed}'
          </p>
        )}
      </div>

      {/* Teams and Score */}
      <div className="flex items-center justify-between">
        {/* Home Team */}
        <div className="flex-1 text-center">
          <img src={teams.home.logo} alt={teams.home.name} className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {teams.home.name}
          </p>
        </div>

        {/* Score */}
        <div className="px-4 text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {homeGoals !== null && awayGoals !== null ? `${homeGoals} - ${awayGoals}` : '-'}
          </p>
        </div>

        {/* Away Team */}
        <div className="flex-1 text-center">
          <img src={teams.away.logo} alt={teams.away.name} className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {teams.away.name}
          </p>
        </div>
      </div>

      {/* Venue */}
      {fixture.venue.name && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {fixture.venue.name}
            {fixture.venue.city && `, ${fixture.venue.city}`}
          </p>
        </div>
      )}
    </div>
  )
}
