import { NextRequest, NextResponse } from 'next/server';

// Mock data for testing when API is not available
const getMockPlayerData = (tag: string) => ({
  name: "Test Player",
  tag: tag,
  expLevel: 14,
  trophies: 5500,
  bestTrophies: 6200,
  cards: [
    { name: "Knight", level: 13, maxLevel: 13, rarity: "Common" },
    { name: "Archers", level: 12, maxLevel: 13, rarity: "Common" },
    { name: "Fireball", level: 11, maxLevel: 12, rarity: "Rare" },
    { name: "Musketeer", level: 10, maxLevel: 12, rarity: "Rare" },
    { name: "Giant", level: 9, maxLevel: 11, rarity: "Rare" },
    { name: "Wizard", level: 8, maxLevel: 11, rarity: "Rare" },
    { name: "Prince", level: 6, maxLevel: 8, rarity: "Epic" },
    { name: "Baby Dragon", level: 5, maxLevel: 8, rarity: "Epic" },
    { name: "Skeleton Army", level: 4, maxLevel: 7, rarity: "Epic" },
    { name: "Witch", level: 3, maxLevel: 7, rarity: "Epic" },
    { name: "Mega Knight", level: 2, maxLevel: 5, rarity: "Legendary" },
    { name: "Princess", level: 1, maxLevel: 5, rarity: "Legendary" },
    { name: "Ice Wizard", level: 1, maxLevel: 5, rarity: "Legendary" },
    { name: "Lumberjack", level: 2, maxLevel: 5, rarity: "Legendary" },
    { name: "Miner", level: 1, maxLevel: 5, rarity: "Legendary" },
    { name: "Sparky", level: 1, maxLevel: 5, rarity: "Legendary" }
  ]
});

export async function GET(
  request: NextRequest,
  { params }: { params: { tag: string } }
) {
  try {
    const { tag } = params;
    console.log('API: Received player tag:', tag);
    
    const apiKey = process.env.CLASH_API_KEY;
    
    // Debug: Log all environment variables
    console.log('API: All env vars:', Object.keys(process.env).filter(key => key.includes('CLASH')));
    console.log('API: CLASH_API_KEY value:', apiKey ? 'EXISTS' : 'NOT FOUND');
    console.log('API: CLASH_API_KEY length:', apiKey?.length || 0);
    
    if (!apiKey) {
      console.error('API: CLASH_API_KEY not configured in environment variables');
      console.log('API: Returning mock data for testing');
      return NextResponse.json(getMockPlayerData(tag));
    }
    
    console.log('API: Environment check - CLASH_API_KEY exists:', !!apiKey);
    console.log('API: Environment check - CLASH_API_KEY length:', apiKey?.length || 0);
    console.log('API: Environment check - CLASH_API_KEY preview:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT SET');
    console.log('API: Environment check - NODE_ENV:', process.env.NODE_ENV);
    console.log('API: Environment check - All env vars starting with CLASH:', Object.keys(process.env).filter(key => key.startsWith('CLASH')));

    // Ensure tag starts with # for the API
    const playerTag = tag.startsWith('#') ? tag : `#${tag}`;
    const encodedTag = encodeURIComponent(playerTag);
    console.log('API: Fetching player data for:', playerTag);
    console.log('API: Making request to:', `https://api.clashroyale.com/v1/players/${encodedTag}`);

    const response = await fetch(
      `https://api.clashroyale.com/v1/players/${encodedTag}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    console.log('API: Clash Royale API response status:', response.status);
    console.log('API: Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const responseText = await response.text().catch(() => 'Could not read response');
      console.error('API: Error response body:', responseText);
      
      if (response.status === 404) {
        console.log('API: Player not found');
        return NextResponse.json(
          { error: 'Player not found' },
          { status: 404 }
        );
      }
      if (response.status === 403) {
        console.error('API: Access forbidden - API key issue');
        console.error('API: This usually means the API key is invalid, expired, or IP restricted');
        console.error('API: Response body:', responseText);
        console.log('API: Returning mock data as fallback');
        return NextResponse.json(getMockPlayerData(tag));
      }
      if (response.status === 429) {
        console.log('API: Rate limit exceeded');
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment and try again.' },
          { status: 429 }
        );
      }
      console.error('API: Clash Royale API error:', response.status);
      return NextResponse.json(
        { error: `Clash Royale API error: ${response.status} - ${responseText}` },
        { status: response.status }
      );
    }

    const playerData = await response.json();
    console.log('API: Player data fetched successfully for:', playerData.name);
    return NextResponse.json(playerData);

  } catch (error) {
    console.error('Player API error:', error);
    return NextResponse.json(
      { error: `Failed to fetch player data: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}