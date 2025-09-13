#!/usr/bin/env python3
"""
Script pour lancer le serveur MCP Clash Royale
"""

import uvicorn
import sys

def main():
    """Lance le serveur MCP"""
    print("🎮 Démarrage du serveur MCP Clash Royale...")
    print("📍 URL: http://localhost:8000")
    print("📖 Documentation: http://localhost:8000/docs")
    print("🛠️  Outils MCP: http://localhost:8000/tools")
    print("\nPour arrêter le serveur, appuyez sur Ctrl+C")
    print("-" * 50)
    
    # Port pour déploiement (Railway, Render, etc.)
    import os
    port = int(os.environ.get("PORT", 8000))
    
    try:
        uvicorn.run(
            "mcp_server:app",
            host="0.0.0.0",
            port=port,
            reload=False,  # Désactiver reload en production
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 Serveur arrêté par l'utilisateur")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Erreur lors du démarrage: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()