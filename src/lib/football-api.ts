import { FootballApiResponse, Fixture, League, Team } from '@/types/football';

class FootballApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.FOOTBALL_API_URL || 'https://v3.football.api-sports.io';
    this.apiKey = process.env.FOOTBALL_API_KEY || '';
  }

  private async request<T>(endpoint: string, params: Record<string, string | number | boolean> = {}): Promise<FootballApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);

    // Добавляем параметры к URL
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key].toString());
      }
    });

    console.log('Football API request:', url.toString());
    console.log('API Key length:', this.apiKey.length);

    const response = await fetch(url.toString(), {
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': this.apiKey,
      },
    });

    console.log('Football API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Football API error response:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Football API JSON response:', result);
    return result;
  }

  // Получить популярные лиги
  async getLeagues(params: {
    country?: string;
    season?: number;
    current?: boolean;
    search?: string;
  } = {}): Promise<FootballApiResponse<League>> {
    return this.request<League>('/leagues', params);
  }

  // Получить команды
  async getTeams(params: {
    league?: number;
    season?: number;
    country?: string;
    search?: string;
  }): Promise<FootballApiResponse<Team>> {
    return this.request<Team>('/teams', params);
  }

  // Получить матчи
  async getFixtures(params: {
    live?: string; // 'all' для всех live матчей
    date?: string; // YYYY-MM-DD
    league?: number;
    season?: number;
    team?: number;
    last?: number;
    next?: number;
    from?: string;
    to?: string;
    status?: string;
    timezone?: string;
  } = {}): Promise<FootballApiResponse<Fixture>> {
    return this.request<Fixture>('/fixtures', params);
  }

  // Получить live матчи
  async getLiveFixtures(): Promise<FootballApiResponse<Fixture>> {
    return this.getFixtures({ live: 'all' });
  }

  // Получить матчи на определенную дату
  async getFixturesByDate(date: string): Promise<FootballApiResponse<Fixture>> {
    return this.getFixtures({ date });
  }

  // Получить матчи лиги
  async getLeagueFixtures(leagueId: number, season: number): Promise<FootballApiResponse<Fixture>> {
    return this.getFixtures({ league: leagueId, season });
  }
}

export const footballApi = new FootballApiClient();
