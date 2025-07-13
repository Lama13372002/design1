import { NextRequest, NextResponse } from 'next/server';
import { footballService } from '@/lib/football-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    // Если указана дата, получаем матчи на эту дату
    if (date) {
      // Здесь можно добавить получение матчей по дате
      const todayMatches = await footballService.getTodayMatches();
      return NextResponse.json({
        success: true,
        data: todayMatches,
        count: todayMatches.length
      });
    }

    // По умолчанию получаем матчи на сегодня
    const todayMatches = await footballService.getTodayMatches();

    return NextResponse.json({
      success: true,
      data: todayMatches,
      count: todayMatches.length
    });
  } catch (error) {
    console.error('Matches API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch matches',
        data: []
      },
      { status: 500 }
    );
  }
}
