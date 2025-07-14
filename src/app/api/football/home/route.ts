import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== TESTING FOOTBALL API WITHOUT CURRENT PARAM ===');

    const apiKey = process.env.FOOTBALL_API_KEY;
    const apiUrl = process.env.FOOTBALL_API_URL || 'https://v3.football.api-sports.io';

    // Тест без параметра current=true
    const testUrl = `${apiUrl}/leagues`;
    console.log('Test URL:', testUrl);

    const response = await fetch(testUrl, {
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': apiKey || '',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      return NextResponse.json({ success: false, error: errorText });
    }

    const data = await response.json();
    console.log('Results count:', data.results || 0);

    // Также протестируем фикстуры на сегодня
    const today = new Date().toISOString().split('T')[0];
    const fixturesUrl = `${apiUrl}/fixtures?date=${today}`;
    console.log('Testing fixtures for today:', fixturesUrl);

    const fixturesResponse = await fetch(fixturesUrl, {
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': apiKey || '',
      },
    });

    const fixturesData = await fixturesResponse.json();
    console.log('Today fixtures count:', fixturesData.results || 0);

    return NextResponse.json({
      success: true,
      leagues: {
        count: data.results || 0,
        sample: data.response?.slice(0, 3)
      },
      todayFixtures: {
        count: fixturesData.results || 0,
        sample: fixturesData.response?.slice(0, 3)
      }
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
