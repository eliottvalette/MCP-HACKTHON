import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const WEBSOCKET_URL = process.env.WEBSOCKET_URL || 'ws://localhost:3001';

export async function POST(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const { emoteType } = await request.json();
    const { matchId } = params;

    if (!matchId) {
      return NextResponse.json({ error: 'Match ID is required' }, { status: 400 });
    }

    if (!emoteType || !['heheheha', 'mumumu', 'pleuuurr'].includes(emoteType)) {
      return NextResponse.json({ error: 'Invalid emote type' }, { status: 400 });
    }

    // Get player info from headers or cookies
    const playerId = request.headers.get('X-Player-Id') ||
                    (await cookies()).get('playerId')?.value ||
                    `player_${Date.now()}`;

    const playerName = request.headers.get('X-Player-Name') ||
                      (await cookies()).get('playerName')?.value ||
                      'Player';

    // Send emote via WebSocket
    const wsUrl = new URL(WEBSOCKET_URL);
    const WebSocket = require('ws');
    const ws = new WebSocket(wsUrl.toString());

    return new Promise((resolve) => {
      ws.on('open', () => {
        // Send emote message
        ws.send(JSON.stringify({
          type: 'emote',
          data: {
            matchId,
            playerId,
            playerName,
            emoteType
          }
        }));

        ws.close();

        resolve(NextResponse.json({
          success: true,
          message: `Emote ${emoteType} sent successfully!`,
          matchId,
          emoteType,
          playerId,
          playerName
        }));
      });

      ws.on('error', (error: any) => {
        console.error('WebSocket error:', error);
        resolve(NextResponse.json(
          { error: 'Failed to send emote' },
          { status: 500 }
        ));
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        ws.close();
        resolve(NextResponse.json(
          { error: 'Request timeout' },
          { status: 504 }
        ));
      }, 5000);
    });
  } catch (error) {
    console.error('Error sending emote:', error);
    return NextResponse.json(
      { error: 'Failed to send emote' },
      { status: 500 }
    );
  }
}