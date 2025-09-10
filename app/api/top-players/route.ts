import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.CLASH_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clash Royale API key not configured. Please add CLASH_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Fetch top players from global rankings
    const response = await fetch('https://api.clashroyale.com/v1/locations/global/rankings/players', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Clash Royale API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch top players data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform the data to match our frontend format
    const topPlayers = data.items.slice(0, 8).map((player: any, index: number) => ({
      rank: index + 1,
      name: player.name,
      tag: player.tag,
      trophies: player.trophies,
      clan: player.clan?.name || 'No Clan',
      clanTag: player.clan?.tag || '',
      change: player.previousRank ? (player.previousRank - (index + 1)) : 0,
      arena: player.arena?.name || 'Unknown Arena',
      level: player.expLevel || 1
    }));

    return NextResponse.json({ players: topPlayers });
  } catch (error) {
    console.error('Error fetching top players:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
