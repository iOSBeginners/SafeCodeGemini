# 🦙 SafeCodeGemini avec Ollama

Ce fork de Gemini CLI utilise maintenant **Ollama** au lieu de l'API Gemini pour les LLMs locaux.

## 🚀 Installation rapide

### 1. Installer Ollama
```bash
# macOS
brew install ollama

# Ou télécharger depuis https://ollama.ai
```

### 2. Démarrer Ollama et installer un modèle
```bash
# Démarrer le serveur Ollama
ollama serve

# Dans un autre terminal, installer llama3.2
ollama pull llama3.2
```

### 3. Configurer SafeCodeGemini
```bash
# Configurer les variables d'environnement
bash ollama-setup.sh

# Ou manuellement :
export USE_OLLAMA=true
export OLLAMA_BASE_URL=http://localhost:11434
```

### 4. Lancer SafeCodeGemini
```bash
npm start -- --model=llama3.2
```

## 🔧 Configuration

### Variables d'environnement
- `USE_OLLAMA=true` : Active le provider Ollama
- `OLLAMA_BASE_URL` : URL du serveur Ollama (défaut: http://localhost:11434)

### Modèles supportés
Tous les modèles Ollama sont supportés :
- `llama3.2` (recommandé)
- `qwen3` 
- `deepseek-r1`
- `mixtral`
- `codellama`
- etc.

## 🧪 Test d'intégration

Vérifiez que tout fonctionne :
```bash
node test-ollama.js
```

## 🆚 Différences avec Gemini

| Fonctionnalité | Gemini API | Ollama Local |
|----------------|------------|--------------|
| **Coût** | Payant | Gratuit |
| **Confidentialité** | Google | 100% local |
| **Vitesse** | Réseau | Dépend du hardware |
| **Modèles** | Gemini uniquement | Tous modèles Ollama |
| **Configuration** | Clé API requise | Aucune clé |

## 🔄 Basculer entre providers

Pour revenir à Gemini :
```bash
unset USE_OLLAMA
export GEMINI_API_KEY=your_key_here
npm start
```

Pour utiliser Ollama :
```bash
export USE_OLLAMA=true
npm start -- --model=llama3.2
```

## 🐛 Dépannage

### Ollama non accessible
```bash
# Vérifier qu'Ollama fonctionne
curl http://localhost:11434/api/tags

# Redémarrer Ollama
pkill ollama
ollama serve
```

### Performance lente
- Utilisez un GPU compatible
- Essayez des modèles plus petits (`llama3.2:1b`)
- Augmentez la RAM allouée à Ollama

## 📖 Ressources

- [Ollama Documentation](https://ollama.ai/docs)
- [Modèles disponibles](https://ollama.ai/library)
- [SafeCodeGemini Repository](https://github.com/iOSBeginners/SafeCodeGemini)
