// Типы для API Football

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag?: string;
  season: number;
  current: boolean;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
  country: string;
  founded?: number;
  venue?: {
    name: string;
    capacity: number;
  };
}

export interface FixtureStatus {
  long: string;
  short: string;
  elapsed?: number;
}

export interface FixtureScore {
  home: number | null;
  away: number | null;
}

export interface Fixture {
  id: number;
  referee?: string;
  timezone: string;
  date: string;
  timestamp: number;
  venue?: {
    id: number;
    name: string;
    city: string;
  };
  status: FixtureStatus;
  league: League;
  teams: {
    home: Team;
    away: Team;
  };
  goals: FixtureScore;
  score: {
    halftime: FixtureScore;
    fulltime: FixtureScore;
    extratime?: FixtureScore;
    penalty?: FixtureScore;
  };
}

export interface FootballApiResponse<T> {
  get: string;
  parameters: Record<string, string | number | boolean>;
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T[];
}

export interface MatchEvent {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  league: string;
  leagueLogo?: string;
  startTime: string;
  date: string;
  status: "upcoming" | "live" | "halftime" | "finished";
  score?: { home: number; away: number };
  minute?: number;
  venue?: string;
  round?: string;
}
