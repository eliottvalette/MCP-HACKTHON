# 🎮 Clash Royale MCP - Mistral AI Hackathon 2025

**Real-time strategy game controlled entirely through Mistral's Custom MCP (Model Context Protocol)**

![Game Arena](imgs/Screenshot%202025-09-14%20at%2012.06.22.png)
![Main Menu](imgs/Screenshot%202025-09-14%20at%2012.06.44.png)

*Built during the Mistral AI MCP Hackathon, September 13-14, 2025 at La Maison, Paris*

## 👥 Team

- **Eliott Valette** (`@eliottvalette`)
- **Mathias Garcia** (`@garciamathias`)

Two people, 24 hours, zero sleep, one clear idea from minute one.

## 🏆 What We Built

A fully functional real-time strategy game where **Mistral AI agents can play Clash Royale** through custom MCP tools - no human interface required. The AI can create matches, deploy troops, trigger emotes, and engage in strategic gameplay entirely through Le Chat.

## 🎯 The Hackathon Challenge

The Mistral AI MCP Hackathon challenged us to push the boundaries of Le Chat by creating custom MCP servers. Our question was: **"Can an AI agent play a real-time strategy game as well as a human?"**

Since Le Chat couldn't natively play games or control external applications, we built a complete gaming ecosystem accessible through MCP tools.

## 🚀 Technical Innovation

### MCP Tools We Created
- `create_game` - Initialize new game matches
- `join_game` - Connect to existing matches  
- `get_game_status` - Real-time game state analysis
- `spawn_troop` - Deploy units strategically
- `trigger_emote` - Express emotions during gameplay
- `list_games` - Browse available matches

### Architecture Highlights
- **Real-time Game Engine**: 60 FPS game loop with physics simulation
- **WebSocket Synchronization**: Sub-100ms latency for multiplayer
- **MCP Server Integration**: Custom protocol handlers for Mistral AI
- **Strategic AI Interface**: Structured game state for optimal AI decision-making

### Why we rebuilt the game from scratch
- Using the official APK is illegal. We chose to recreate the core mechanics faithfully and legally.
- From-scratch rebuild gave us full control for MCP integration, deterministic state, and fast iteration.

## 🎮 How It Works

1. **Agent Initialization**: Mistral creates a game through MCP tools
2. **Strategic Analysis**: AI analyzes battlefield state, troop positions, elixir levels
3. **Decision Making**: AI chooses optimal troop deployments and timing
4. **Real-time Execution**: Actions are executed in the live game engine
5. **Continuous Adaptation**: AI responds to opponent moves and game events

```json
// Example MCP Tool Call
{
  "tool": "spawn_troop",
  "args": {
    "matchId": "game_123",
    "troopType": "giant", 
    "row": 15,
    "col": 8
  }
}
```

## 🧠 Hackathon Insights & Tricks

### What We Learned

**1. MCP Protocol Mastery**
- Custom MCP servers need robust error handling - network issues during demos are unforgiving
- Structured responses are crucial: AI agents perform better with consistent JSON schemas
- Session management across MCP calls requires careful state tracking

**2. Real-time Game Development**
- WebSocket heartbeats are essential for stable 48-hour hackathon demos
- Game state synchronization becomes complex with multiple AI agents playing simultaneously
- Visual feedback helps debugging when AI agents make unexpected moves

**3. AI Agent Design**
- Agents need clear game rules and win conditions encoded in the MCP responses
- Strategic decision trees work better than pure ML for real-time gameplay
- Emote systems add personality - our AI became surprisingly expressive!

### Clever Solutions

**Time Pressure Hacks:**
- Used existing Clash Royale sprites to focus on gameplay mechanics
- Implemented a simplified 4-troop deck to reduce complexity
- Built modular MCP tools that could be tested independently

**Demo Day Strategies:**
- Pre-loaded game states for consistent demonstrations
- Created "AI vs AI" matches for entertaining autonomous gameplay
- Added visual game state logging for judges to follow AI decision-making

**Technical Shortcuts:**
- Railway deployment for instant cloud hosting
- Next.js API routes as MCP endpoint proxies
- TypeScript for rapid development and fewer runtime errors

## 🎪 The Hackathon Experience

**La Maison, Paris — 24 Hours, No Sleep**

- **Saturday 12:00 → 24:00**: Idea locked immediately. Rebuilt the game from scratch (legal/compliant), shipped a viable UI, and deployed to Vercel by midnight.
- **00:00 → 07:30**: MCP setup marathon. We tested then discarded ~10 server architectures. Settled on a clean setup with the game engine on Railway ("GroundTruth") and a streamable MCP endpoint.
- **07:30 → 09:30**: Feature additions and hardening. Fixed UI and engine behaviors impacted by MCP integration and deployment specifics.
- **09:30 → 11:00**: Tuned the Mistral MCP Agent to play as intended (see `Prompt.md`).
- **11:00 → 12:00**: Cleaned READMEs and recorded the submission video.

**Team Dynamics:**
- Split responsibilities: engine + UI + MCP split across two people; rapid pair-programming for tricky parts
- Used Discord for coordination and quick decision-making
- Leveraged Mistral's provided resources and cookbooks extensively

**Unexpected Challenges:**
- MCP session persistence across Le Chat conversations
- Real-time game synchronization with variable network latency
- Balancing game complexity vs. demo simplicity

**Deployments & Infra Notes:**
- Engine on Railway (treated as "GroundTruth" for state and synchronization)
- UI on Vercel
- Streamable MCP HTTP endpoint exposed by the engine for Le Chat tools

## 🛠 Tech Stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS
**Backend:** Node.js, Express, WebSocket, TypeScript  
**Game Engine:** Custom 60Hz tick system with collision detection
**MCP Integration:** Custom JSON-RPC 2.0 server implementation
**Deployment:** Railway (backend engine, GroundTruth), Vercel (frontend)
**AI Integration:** Mistral Le Chat with custom MCP tools

## 🎯 Results & Impact

Our project demonstrated that **AI agents can engage in complex, real-time strategic gameplay** through well-designed MCP interfaces. The system successfully:

- Enabled autonomous AI vs AI matches
- Provided strategic decision-making capabilities
- Maintained real-time performance under load
- Created an entertaining and educational demonstration

## 🚀 Try It Yourself

**MCP Server:** `https://mcp-hackthon-production.up.railway.app/mcp`

Add this to your Mistral Le Chat MCP connectors and start playing!

**Example Commands:**
```
Create a new Clash Royale match and start playing strategically
```

## 🏅 Hackathon Recognition

This project showcased the potential of MCP protocols for complex, stateful applications beyond traditional chatbot use cases. It demonstrated how AI agents can control sophisticated real-time systems through well-designed tool interfaces.

---

*Built with ❤️ during 24 hours of non-stop coding at the Mistral AI MCP Hackathon*

**"Can I already do this natively in Le Chat?"** - The hackathon's guiding question that led us to build something truly unique.