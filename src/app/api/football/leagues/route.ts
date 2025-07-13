import { NextResponse } from 'next/server';
import { footballService } from '@/lib/football-service';

export async function GET() {
  try {
    const leagues = await footballService.getPopularLeagues();

    return NextResponse.json({
      success: true,
      data: leagues,
      count: leagues.length
    });
  } catch (error) {
    console.error('Leagues API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch leagues',
        data: []
      },
      { status: 500 }
    );
  }
}
