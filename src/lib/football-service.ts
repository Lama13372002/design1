import pool from './database';
import { footballApi } from './football-api';
import { Fixture, League, Team, MatchEvent } from '@/types/football';

class FootballService {
  // Кэширование данных
  private async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const result = await pool.query(
        'SELECT data FROM api_cache WHERE key = $1 AND expires_at > NOW()',
        [key]
      );
      return result.rows[0]?.data || null;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  private async setCachedData(key: string, data: unknown, expirationMinutes: number = 60): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
      await pool.query(
        `INSERT INTO api_cache (key, data, expires_at)
         VALUES ($1, $2, $3)
         ON CONFLICT (key)
         DO UPDATE SET data = $2, expires_at = $3`,
        [key, JSON.stringify(data), expiresAt]
      );
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  // Получить популярные лиги
  async getPopularLeagues(): Promise<League[]> {
    const cacheKey = 'popular_leagues';
    const cached = await this.getCachedData<League[]>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      // Получаем популярные лиги из API
      console.log('Fetching leagues from Football API...');
      const response = await footballApi.getLeagues({});
      });

      // Фильтруем самые популярные лиги
      const popularLeagueIds = [39, 140, 78, 61, 135, 94]; // Premier League, La Liga, Bundesliga, Ligue 1, Serie A, Champions League
      const popularLeagues = response.response.filter(league =>
        popularLeagueIds.includes(league.id)
      );

      await this.setCachedData(cacheKey, popularLeagues, 1440); // 24 часа
      return popularLeagues;
    } catch (error) {
      console.error('Error fetching popular leagues:', error);
      return [];
    }
  }

  // Получить команды лиги
  async getLeagueTeams(leagueId: number, season: number): Promise<Team[]> {
    const cacheKey = `teams_${leagueId}_${season}`;
    const cached = await this.getCachedData<Team[]>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await footballApi.getTeams({
        league: leagueId,
        season
      });

      await this.setCachedData(cacheKey, response.response, 1440); // 24 часа
      return response.response;
    } catch (error) {
      console.error('Error fetching league teams:', error);
      return [];
    }
  }

  // Получить live матчи
  async getLiveMatches(): Promise<MatchEvent[]> {
    const cacheKey = 'live_matches';
    const cached = await this.getCachedData<MatchEvent[]>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await footballApi.getLiveFixtures();

      const liveMatches: MatchEvent[] = response.response.map(fixture => ({
        id: fixture.id.toString(),
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        homeTeamLogo: fixture.teams.home.logo,
        awayTeamLogo: fixture.teams.away.logo,
        league: fixture.league.name,
        leagueLogo: fixture.league.logo,
        startTime: new Date(fixture.date).toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        date: new Date(fixture.date).toISOString().split('T')[0],
        status: this.mapFixtureStatus(fixture.status.short),
        score: fixture.goals.home !== null && fixture.goals.away !== null ? {
          home: fixture.goals.home,
          away: fixture.goals.away
        } : undefined,
        minute: fixture.status.elapsed,
        venue: fixture.venue?.name,
        round: fixture.league.name
      }));

      await this.setCachedData(cacheKey, liveMatches, 1); // 1 минута для live данных
      return liveMatches;
    } catch (error) {
      console.error('Error fetching live matches:', error);
      return [];
    }
  }

  // Получить матчи на сегодня
  async getTodayMatches(): Promise<MatchEvent[]> {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `matches_${today}`;
    const cached = await this.getCachedData<MatchEvent[]>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await footballApi.getFixturesByDate(today);

      const todayMatches: MatchEvent[] = response.response.map(fixture => ({
        id: fixture.id.toString(),
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        homeTeamLogo: fixture.teams.home.logo,
        awayTeamLogo: fixture.teams.away.logo,
        league: fixture.league.name,
        leagueLogo: fixture.league.logo,
        startTime: new Date(fixture.date).toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        date: new Date(fixture.date).toISOString().split('T')[0],
        status: this.mapFixtureStatus(fixture.status.short),
        score: fixture.goals.home !== null && fixture.goals.away !== null ? {
          home: fixture.goals.home,
          away: fixture.goals.away
        } : undefined,
        minute: fixture.status.elapsed,
        venue: fixture.venue?.name,
        round: fixture.league.name
      }));

      await this.setCachedData(cacheKey, todayMatches, 15); // 15 минут
      return todayMatches;
    } catch (error) {
      console.error('Error fetching today matches:', error);
      return [];
    }
  }

  // Мапинг статусов матчей
  private mapFixtureStatus(apiStatus: string): "upcoming" | "live" | "halftime" | "finished" {
    switch (apiStatus) {
      case 'NS':
      case 'TBD':
        return 'upcoming';
      case '1H':
      case '2H':
      case 'ET':
      case 'P':
      case 'LIVE':
        return 'live';
      case 'HT':
        return 'halftime';
      case 'FT':
      case 'AET':
      case 'PEN':
        return 'finished';
      default:
        return 'upcoming';
    }
  }

  // Получить комбинированные данные для главной страницы
  async getHomePageData(): Promise<{
    liveMatches: MatchEvent[];
    todayMatches: MatchEvent[];
    popularLeagues: League[];
  }> {
    try {
      const [liveMatches, todayMatches, popularLeagues] = await Promise.all([
        this.getLiveMatches(),
        this.getTodayMatches(),
        this.getPopularLeagues()
      ]);

      return {
        liveMatches,
        todayMatches,
        popularLeagues
      };
    } catch (error) {
      console.error('Error fetching home page data:', error);
      return {
        liveMatches: [],
        todayMatches: [],
        popularLeagues: []
      };
    }
  }
}

export const footballService = new FootballService();
