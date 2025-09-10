import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deck } = body;
    console.log('API: Received deck for analysis:', deck);

    if (!deck || !Array.isArray(deck) || deck.length !== 8) {
      console.error('API: Invalid deck format:', deck);
      return NextResponse.json(
        { error: 'Invalid deck format. Must be an array of 8 cards.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a Clash Royale Deck Coach expert. Analyze the given deck and provide structured insights.

    Respond in the following JSON format:
    {
      "winCondition": "Brief description of the main win condition",
      "strengths": ["strength1", "strength2", "strength3"],
      "weaknesses": ["weakness1", "weakness2", "weakness3"],
      "strategy": "Overall strategy description in 2-3 sentences",
      "tips": ["tip1", "tip2", "tip3", "tip4"]
    }

    Focus on:
    - Win conditions and damage dealers
    - Defensive capabilities
    - Synergies between cards
    - Average elixir cost considerations
    - Counter-play vulnerabilities
    - Meta relevance and effectiveness`;

    const userPrompt = `Analyze this Clash Royale deck: ${deck.join(', ')}`;
    console.log('API: Sending request to OpenAI');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    console.log('API: OpenAI response status:', response.status);
    
    if (!response.ok) {
      console.error('API: OpenAI API error:', response.status);
      throw new Error(`OpenAI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    console.log('API: Received analysis from OpenAI');

    try {
      const parsedAnalysis = JSON.parse(analysis);
      console.log('API: Analysis parsed successfully');
      return NextResponse.json(parsedAnalysis);
    } catch (parseError) {
      console.error('API: Failed to parse analysis JSON:', parseError);
      // Fallback if JSON parsing fails
      return NextResponse.json({
        winCondition: "Unable to parse detailed analysis",
        strengths: ["Diverse card selection"],
        weaknesses: ["Analysis parsing failed"],
        strategy: "Please try analyzing your deck again.",
        tips: ["Ensure all card names are correctly spelled", "Try refreshing and submitting again"]
      });
    }

  } catch (error) {
    console.error('Deck coach API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze deck. Please try again.' },
      { status: 500 }
    );
  }
}