import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.CLASH_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clash Royale API key not configured' },
        { status: 500 }
      );
    }

    // TODO: Implement real deck popularity data from Clash Royale API
    // For now, return error since we don't have demo data
    return NextResponse.json(
      { error: 'Deck popularity data not available from Clash Royale API' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error fetching trending decks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
