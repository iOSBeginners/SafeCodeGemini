# 🚀 SafeCode AI - Guide d'Installation Complet

SafeCode AI est un assistant IA local utilisant Ollama pour garantir la confidentialité et le contrôle total de vos données.

## 📋 Prérequis

- **Node.js** 18+ 
- **npm** ou **yarn**
- **Git**
- **Curl** (pour tester Ollama)

## 🦙 Étape 1: Installation d'Ollama

### macOS
```bash
# Via Homebrew (recommandé)
brew install ollama

# Ou téléchargement direct
curl -fsSL https://ollama.ai/install.sh | sh
```

### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Windows
Téléchargez depuis [ollama.ai](https://ollama.ai/download) et suivez l'installateur.

## ⚙️ Étape 2: Configuration d'Ollama

### Démarrer le serveur Ollama
```bash
ollama serve
```

### Installer un modèle (dans un nouveau terminal)
```bash
# Modèle recommandé (plus équilibré)
ollama pull llama3.2

# Alternatives selon vos besoins :
ollama pull qwen3        # Excellent pour le code
ollama pull deepseek-r1  # Très performant mais plus lourd
ollama pull codellama    # Spécialisé pour le code
```

### Vérifier l'installation
```bash
curl http://localhost:11434/api/tags
```

## 🔧 Étape 3: Installation de SafeCode AI

### Cloner le repository
```bash
git clone https://github.com/iOSBeginners/SafeCodeGemini.git
cd SafeCodeGemini
```

### Installer les dépendances
```bash
npm install
```

### Construire le projet
```bash
npm run build
```

## 🚀 Étape 4: Configuration et Lancement

### Configuration automatique
```bash
bash ollama-setup.sh
```

### Configuration manuelle
```bash
export USE_OLLAMA=true
export OLLAMA_BASE_URL=http://localhost:11434
```

### Lancement de SafeCode AI
```bash
# Mode interactif
npm start

# Avec un modèle spécifique
npm start -- --model=llama3.2

# Mode non-interactif avec prompt
npm start -- --model=llama3.2 --prompt="Votre question ici"
```

## ✅ Étape 5: Vérification de l'Installation

### Test simple
```bash
npm start -- --model=llama3.2 --prompt="Dis bonjour et confirme que SafeCode AI fonctionne"
```

### Test avec le script fourni
```bash
node test-ollama.js
```

## 🔧 Configuration Avancée

### Variables d'environnement disponibles
```bash
# Obligatoire pour utiliser Ollama
export USE_OLLAMA=true

# URL du serveur Ollama (optionnel)
export OLLAMA_BASE_URL=http://localhost:11434

# Pour utiliser un serveur Ollama distant
export OLLAMA_BASE_URL=http://votre-serveur:11434
```

### Fichier de configuration ~/.safecode/config.yaml
```yaml
provider: ollama
ollama:
  baseUrl: http://localhost:11434
  defaultModel: llama3.2
  temperature: 0.7
```

## 🎯 Modèles Recommandés par Utilisation

### Développement Général
- **llama3.2** (8B) - Excellent équilibre performance/vitesse
- **qwen3** (7B) - Très bon pour le code

### Développement Avancé  
- **deepseek-r1** (14B) - Performances exceptionnelles
- **codellama** (13B) - Spécialisé pour la programmation

### Ressources Limitées
- **llama3.2:1b** - Modèle léger mais capable
- **qwen3:0.5b** - Ultra-léger pour tests

## 🐛 Dépannage

### Ollama ne démarre pas
```bash
# Vérifier les processus
ps aux | grep ollama

# Tuer les processus existants
pkill ollama

# Redémarrer
ollama serve
```

### SafeCode AI ne trouve pas Ollama
```bash
# Vérifier la connexion
curl http://localhost:11434/api/tags

# Vérifier les variables d'environnement
echo $USE_OLLAMA
echo $OLLAMA_BASE_URL
```

### Erreurs de build
```bash
# Nettoyer et reconstruire
npm run clean
npm install
npm run build
```

### Performances lentes
```bash
# Utiliser un modèle plus léger
npm start -- --model=llama3.2:1b

# Ou ajuster la configuration système
export OLLAMA_NUM_GPU=1  # Pour GPU
export OLLAMA_NUM_THREAD=4  # Pour CPU
```

## 🔄 Mise à Jour

### Mettre à jour SafeCode AI
```bash
cd SafeCodeGemini
git pull origin main
npm install
npm run build
```

### Mettre à jour Ollama
```bash
# macOS avec Homebrew
brew upgrade ollama

# Linux/Windows
curl -fsSL https://ollama.ai/install.sh | sh
```

### Mettre à jour les modèles
```bash
ollama pull llama3.2  # Met à jour vers la dernière version
```

## 📖 Utilisation de Base

### Commandes essentielles
```bash
# Mode interactif
npm start

# Prompt simple
npm start -- --prompt="Expliquer les closures JavaScript"

# Avec contexte de fichier
npm start -- --all-files --prompt="Analyser ce code"

# Mode debug
npm start -- --debug --prompt="Votre question"
```

### Commandes intégrées dans SafeCode AI
- `/help` - Afficher l'aide
- `/tools` - Lister les outils disponibles  
- `/settings` - Configuration
- `/auth` - Gestion de l'authentification
- `/clear` - Effacer l'historique

## 🔐 Sécurité et Confidentialité

✅ **Données 100% locales** - Aucune donnée envoyée à des serveurs externes  
✅ **Pas de télémétrie** - Votre code reste privé  
✅ **Open Source** - Code auditable et modifiable  
✅ **Chiffrement local** - Configuration sécurisée  

## 🆘 Support

- **Documentation** : [Lire les docs](./docs/)
- **Issues** : [GitHub Issues](https://github.com/iOSBeginners/SafeCodeGemini/issues)
- **Discussions** : [GitHub Discussions](https://github.com/iOSBeginners/SafeCodeGemini/discussions)

## 🏃‍♂️ Démarrage Rapide (1 minute)

```bash
# 1. Installer Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Démarrer Ollama 
ollama serve &

# 3. Installer un modèle
ollama pull llama3.2

# 4. Cloner et installer SafeCode AI
git clone https://github.com/iOSBeginners/SafeCodeGemini.git
cd SafeCodeGemini && npm install && npm run build

# 5. Configuration et test
bash ollama-setup.sh
npm start -- --prompt="Hello SafeCode AI!"
```

Félicitations ! 🎉 SafeCode AI est maintenant opérationnel sur votre machine.
