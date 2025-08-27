#!/bin/bash

# Configuration Ollama pour SafeCodeGemini
echo "🦙 Configuration d'Ollama pour SafeCodeGemini"

# Variables d'environnement pour Ollama
export OLLAMA_BASE_URL="http://localhost:11434"
export USE_OLLAMA="true"

# Démarrer SafeCodeGemini avec Ollama
echo "📝 Variables d'environnement configurées :"
echo "   OLLAMA_BASE_URL=$OLLAMA_BASE_URL"
echo "   USE_OLLAMA=$USE_OLLAMA"

echo ""
echo "🚀 Pour utiliser Ollama avec SafeCodeGemini, exécutez :"
echo "   source ollama-setup.sh"
echo "   npm start -- --model=llama3.2"

echo ""
echo "💡 Assurez-vous qu'Ollama fonctionne en local :"
echo "   ollama serve"
echo "   ollama run llama3.2"

echo ""
echo "🔧 Test de connexion à Ollama..."
if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
    echo "✅ Ollama est accessible sur localhost:11434"
    echo "📋 Modèles disponibles :"
    curl -s http://localhost:11434/api/tags 2>/dev/null | grep -o '"name":"[^"]*"' | cut -d'"' -f4 | head -5 || echo "Aucun modèle trouvé"
else
    echo "❌ Ollama n'est pas accessible. Assurez-vous qu'il est démarré avec 'ollama serve'"
fi
