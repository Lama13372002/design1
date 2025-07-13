import { NextResponse } from 'next/server';
import { footballService } from '@/lib/football-service';

export async function GET() {
  try {
    const homeData = await footballService.getHomePageData();

    return NextResponse.json({
      success: true,
      data: homeData
    });
  } catch (error) {
    console.error('Home page API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch home page data',
        data: {
          liveMatches: [],
          todayMatches: [],
          popularLeagues: []
        }
      },
      { status: 500 }
    );
  }
}
