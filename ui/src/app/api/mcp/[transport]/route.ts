export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

type JsonRpcReq = { jsonrpc?: "2.0"; id?: number | string | null; method: string; params?: any };

const tools = [
  { name: "start_game", description: "Démarre une nouvelle partie de Clash Royale", inputSchema: { type: "object", properties: {}, required: [] } },
  {
    name: "deploy_troop",
    description: "Déploie une troupe sur le terrain de bataille",
    inputSchema: {
      type: "object",
      properties: {
        game_id: { type: "string" },
        troop_type: { type: "string", enum: ["GIANT", "BABY_DRAGON", "MINI_PEKKA", "VALKYRIE"] },
        position: { type: "object", properties: { row: { type: "number" }, col: { type: "number" } }, required: ["row", "col"] },
        team: { type: "string", enum: ["red", "blue"] },
      },
      required: ["game_id", "troop_type", "position", "team"],
    },
  },
  { name: "get_game_state", description: "Récupère l'état actuel du jeu (troupes, tours, statistiques)", inputSchema: { type: "object", properties: { game_id: { type: "string" } }, required: ["game_id"] } },
  {
    name: "analyze_strategy",
    description: "Analyse une stratégie Clash Royale",
    inputSchema: { type: "object", properties: { situation: { type: "string" } }, required: ["situation"] },
  },
  {
    name: "send_emote",
    description: "Envoie un emote dans le jeu pour narguer ou célébrer",
    inputSchema: {
      type: "object",
      properties: {
        game_id: { type: "string", description: "ID de la partie" },
        emote_type: { type: "string", enum: ["heheheha", "mumumu", "pleuuurr"], description: "Type d'emote (heheheha pour rire, mumumu pour triste, pleuuurr pour pleurer)" },
      },
      required: ["game_id", "emote_type"],
    },
  },
];

async function proxyApi(path: string, options: RequestInit) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${base}${path}`, options);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { error: "Invalid JSON", raw: text }; }
}

async function executeTool(name: string, args: any) {
  switch (name) {
    case "start_game": {
      const data = await proxyApi("/api/game/init", { method: "POST" });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
    case "deploy_troop": {
      const data = await proxyApi("/api/game/spawn", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(args) });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
    case "get_game_state": {
      const gameId = args?.game_id;
      const data = await proxyApi(`/api/game/${gameId}/state`, { method: "GET" });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
    case "analyze_strategy": {
      return { content: [{ type: "text", text: JSON.stringify({ situation: args.situation, recommendation: "Analyse côté serveur à brancher" }, null, 2) }] };
    }
    case "send_emote": {
      const gameId = args?.game_id;
      const emoteType = args?.emote_type;
      const data = await proxyApi(`/api/match/${gameId}/emote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoteType })
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

function jsonRpcResult(id: any, result: any) { return NextResponse.json({ jsonrpc: "2.0", id: id ?? null, result }); }
function jsonRpcError(id: any, code: number, message: string) { return NextResponse.json({ jsonrpc: "2.0", id: id ?? null, error: { code, message } }); }

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as JsonRpcReq;
    const { id, method, params } = body;
    if (method === "server/info") return jsonRpcResult(id, { name: "clash-royale-mcp", version: "1.0.0", capabilities: { tools: {} } });
    if (method === "tools/list") return jsonRpcResult(id, { tools });
    if (method === "tools/call") {
      const { name, arguments: args } = params ?? {};
      if (!name) return jsonRpcError(id, -32602, "Missing tool name");
      try { return jsonRpcResult(id, await executeTool(name, args ?? {})); }
      catch (e: any) { return jsonRpcError(id, -32000, e?.message ?? "Tool error"); }
    }
    return jsonRpcError(id, -32601, "Method not found");
  } catch { return jsonRpcError(null, -32700, "Parse error"); }
}

export function GET() { return NextResponse.json({ ok: true, endpoint: "MCP streamable" }); }