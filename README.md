# Clash Royale Clone · MCP Mistral Only

Jeu temps réel piloté par un agent via MCP custom. Aucune API locale. Toute l'interaction passe par le serveur MCP Mistral.

![Game Arena](imgs/Screenshot%202025-09-14%20at%2012.06.22.png)
![Main Menu](imgs/Screenshot%202025-09-14%20at%2012.06.44.png)

## Connexion MCP

Dans Mistral "Le Chat", ajoute le serveur MCP : `https://api.zepler.xyz/mcp`. Active-le pour la session. Aucun autre service requis.

## Outils MCP

`create_game`, `start_game`, `get_game_state`, `deploy_troop`, `trigger_emote`.

## Règles rapides

Deck fixe : Giant(5), BabyDragon(4), MiniPekka(3), Valkyrie(4). Objectif : détruire les tours ennemies, garder la King Tower en vie. Côté par défaut : "red". Positions par défaut : Giant → (3,8). BabyDragon/Valkyrie/MiniPekka → alterner (13,3)/(13,15), inverser si la pression ennemie est majoritaire à gauche/droite.

## Protocole Agent

### Phase A) INIT (une seule fois)

Exécute `create_game`. Récupère `game_id`. Lance `start_game` si nécessaire côté moteur. Sors exactement :

```
INIT: game_id=<ID>
READY: say "GO" to start
```

Ne boucle pas.

### Phase B) LOOP (démarre quand je dis « GO »)

Objectif : jouer en continu tant qu'au moins une King Tower est vivante. Ne clos pas tant que je ne dis pas « STOP ».

#### Lecture d'état
Appelle `get_game_state(game_id)` ou `get_game_status(matchId=game_id)`. Si échec, réessaie une fois. Si encore échec, passe au choix de carte (version la moins risquée).

#### Log d'état
Formate :
```
STATE: elixir red=<x> blue=<y> | troops=<n> | king_red=<hp> king_blue=<hp>
```

#### Choix de carte jouable
Si élixir < 4 → MiniPekka. Sinon ordre de préférence : BabyDragon > Giant > Valkyrie. Si la carte choisie n'est pas jouable, prendre la moins chère. Si aucune n'est jouable, retourne à l'étape 1.

#### Déploiement
```
deploy_troop|spawn_troop({ matchId: game_id, troopType: <giant|babyDragon|miniPekka|valkyrie>, row, col })
```
Utilise les positions préférées. Log :
```
ACTION: <TROOP> red @ (<row>,<col>)
```
Ajoute :
```
EXPLANATION: <phrase courte, claire, sarcastique>
```

#### Emote (optionnel)
```
trigger_emote({ matchId: game_id, emoteType })
```
Si contre efficace ou avantage d'élixir → haha. Si King Tower perd beaucoup de PV → cry. Si gros push lent (Giant fond de map) → mumumu. Log uniquement si émis :
```
EMOTE: <haha|cry|mumumu>
```

#### Fin de partie
Si match terminé ou King HP=0 :
```
END: winner=<red|blue|null>
```
Repars en INIT sauf si je dis « STOP ».

### Format de sortie à chaque itération

- Une ligne `STATE: …`
- Une ligne `ACTION: …`
- Une ligne `EXPLANATION: …`
- Optionnel : une ligne `EMOTE: <type>`

Aucun autre texte.

## Exemples d'appels outils

**Créer une partie :**
```json
{ "tool": "create_game", "args": {} }
```

**Démarrer (si requis) :**
```json
{ "tool": "start_game", "args": { "matchId": "<GAME_ID>" } }
```

**Lire l'état :**
```json
{ "tool": "get_game_state", "args": { "matchId": "<GAME_ID>" } }
```

**Déployer une troupe :**
```json
{
  "tool": "deploy_troop",
  "args": { "matchId": "<GAME_ID>", "troopType": "babyDragon", "row": 13, "col": 3 }
}
```

**Envoyer une emote :**
```json
{ "tool": "trigger_emote", "args": { "matchId": "<GAME_ID>", "emoteType": "haha" } }
```

## Stack

UI : Next.js + React. Moteur : Node.js avec tick 10 Hz. Synchronisation par WebSocket côté serveur MCP. Aucun endpoint local requis.