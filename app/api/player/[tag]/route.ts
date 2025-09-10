import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { tag: string } }
) {
  try {
    const { tag } = params;
    console.log('API: Received player tag:', tag);
    
    const apiKey = process.env.CLASH_API_KEY;
    
    if (!apiKey) {
      console.error('API: CLASH_API_KEY not configured in environment variables');
      return NextResponse.json(
        { error: 'Clash Royale API key not configured. Please add CLASH_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }
    
    console.log('API: Environment check - CLASH_API_KEY exists:', !!apiKey);
    console.log('API: Environment check - CLASH_API_KEY length:', apiKey?.length || 0);
    console.log('API: Environment check - CLASH_API_KEY preview:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT SET');

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
        return NextResponse.json(
          { error: 'API access denied. The Clash Royale API key may be invalid, expired, or IP restricted. Please check your API key configuration.' },
          { status: 403 }
        );
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