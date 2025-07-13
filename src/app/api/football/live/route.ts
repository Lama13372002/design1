import { NextResponse } from 'next/server';
import { footballService } from '@/lib/football-service';

export async function GET() {
  try {
    const liveMatches = await footballService.getLiveMatches();

    return NextResponse.json({
      success: true,
      data: liveMatches,
      count: liveMatches.length
    });
  } catch (error) {
    console.error('Live matches API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch live matches',
        data: []
      },
      { status: 500 }
    );
  }
}
