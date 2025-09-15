# Clash Royale MCP — Mistral AI Hackathon 2025

An agent plays against you via MCP in split-screen: the UI on the left, a chat with the MCP agent on the right, and the whole match is driven in natural language.

![Game Arena](imgs/Screenshot%202025-09-14%20at%2012.06.22.png)
![Main Menu](imgs/Screenshot%202025-09-14%20at%2012.06.44.png)

Built September 13–14, 2025 at La Maison, Paris.

## Idea

Enable anyone to play live against an agent without pre-training. The LLM reasons over a structured game state, calls bounded tools, and acts in real time. Many concurrent matches run independently, each with its own room.

## User Flow

Open the UI (Vercel) and Le Chat connected to the MCP. Ask to create or join a match to obtain a `game_id`, then say “GO”. The agent reads the state, deploys troops, sends emotes, and explains its moves in short, dry comments. You keep playing in the UI while chatting. Say “STOP” to halt or “RESET” to start fresh. The exact loop and guardrails are documented in Prompt.md.

## What the Agent Can Do

The MCP server exposes tools for match lifecycle and gameplay. Core ones:

* `create_game`, `join_game`
* `get_game_status`
* `spawn_troop`
* `trigger_emote`
* `list_games`

## Example Dialogue (condensed)

**You :**
Hey Le Chat, Let's play Clash Royale together!


**Agent:**
Hey, with pleasure, I started a game, go on *mcp-hackthon.vercel.app* and connect to the game with the game_id:
game_id = c084e558-202c-4a37-9524-b8155798d8b2
When you are ready, say "GO" to start the agent loop.

**You:**
GO

**Agent:**
STATE: elixir red=6 blue=6 | troops=0 | king_red=4824 king_blue=4824
ACTION: GIANT red @ (3,8)
EXPLANATION: We start strong: Giant in the back to build pressure, like a pro. Mumumu.
EMOTE: mumumu

STATE: elixir red=3 blue=8 | troops=1 | king_red=4824 king_blue=4824
ACTION: MINI_PEKKA red @ (13,3)
EXPLANATION: With only 3 elixir, drop a Mini PEKKA left as preventive defense. Just in case.

STATE: elixir red=1 blue=10 | troops=2 | king_red=4824 king_blue=4824
ACTION: No action possible, insufficient elixir.
EXPLANATION: We wait like a noob for elixir to recover. dramatic sigh :/

STATE: elixir red=3 blue=3 | troops=3 | king_red=4824 king_blue=4824
ACTION: MINI_PEKKA red @ (13,15)
EXPLANATION: Add another Mini PEKKA on the right to balance pressure. Opponent clearly favors left.
EMOTE: heheheha

## Why This Matters

No reinforcement-learning pipeline, no data collection, no fragile screen parsing. Through a stable MCP API, a general-purpose LLM plays competently using common-sense reasoning, and you can spin up dozens of simultaneous human-vs-agent matches.

## Architecture

A real-time engine (“GroundTruth”) runs on the backend and emits snapshots at a fixed tick rate. WebSocket keeps players and the agent in sync with sub-50 ms latency. A streamable HTTP MCP endpoint exposes the tools. The Next.js UI renders the match for humans and each match is an isolated room.

## Deployment

Backend is on Railway (authoritative engine), UI is on Vercel at :[mcp-hackthon.vercel.app](https://mcp-hackthon.vercel.app) and the MCP endpoint is : [https://mcp-hackthon-production.up.railway.app/mcp](https://mcp-hackthon-production.up.railway.app/mcp)

## Run a Match

1. Open the UI and start a match to get a `game_id`.
2. In Le Chat, connect the MCP and ask to create or join using that `game_id`.
3. Say “GO” to start the agent loop.
4. Watch the agent play and comment; use “STOP” or “RESET” as needed.

## Team

Eliott Valette ([@eliottvalette](https://github.com/eliottvalette))
Mathias Garcia ([@garciamathias](https://github.com/garciamathias))