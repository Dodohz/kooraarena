export interface Team {
  id: number
  name: string
  logo: string
  winner?: boolean | null
}

export interface League {
  id: number
  name: string
  country: string
  logo: string
  flag: string | null
  round?: string
  season?: number
}

export interface Fixture {
  id: number
  referee: string | null
  timezone: string
  date: string
  timestamp: number
  periods: {
    first: number | null
    second: number | null
  }
  venue: {
    id: number | null
    name: string | null
    city: string | null
  }
  status: {
    long: string
    short: string
    elapsed: number | null
  }
}

export interface Score {
  halftime: {
    home: number | null
    away: number | null
  }
  fulltime: {
    home: number | null
    away: number | null
  }
  extratime: {
    home: number | null
    away: number | null
  }
  penalty: {
    home: number | null
    away: number | null
  }
}

export interface Match {
  fixture: Fixture
  league: League
  teams: {
    home: Team
    away: Team
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: Score
}

export interface LeagueGroup {
  league: League
  matches: Match[]
}

export type TabType = 'live' | 'today' | 'tomorrow' | 'yesterday'

export interface NavItem {
  id: TabType
  label: string
  icon: string
}

export const POPULAR_LEAGUES = [
  { id: 2, name: 'دوري أبطال أوروبا', flag: '🏆' },
  { id: 3, name: 'الدوري الأوروبي', flag: '🌍' },
  { id: 39, name: 'الدوري الإنجليزي', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 140, name: 'الدوري الإسباني', flag: '🇪🇸' },
  { id: 135, name: 'الدوري الإيطالي', flag: '🇮🇹' },
  { id: 78, name: 'الدوري الألماني', flag: '🇩🇪' },
  { id: 61, name: 'الدوري الفرنسي', flag: '🇫🇷' },
  { id: 94, name: 'الدوري البرتغالي', flag: '🇵🇹' },
  { id: 307, name: 'دوري روشن السعودي', flag: '🇸🇦' },
  { id: 197, name: 'دوري أدنوك الإماراتي', flag: '🇦🇪' },
]
