#!/usr/bin/env node

// Test simple pour vérifier l'intégration Ollama
import { OllamaContentGenerator } from './packages/core/src/ollama/ollamaClient.js';

const config = {
  baseUrl: 'http://localhost:11434',
  model: 'llama3.2:latest',
  temperature: 0
};

const client = new OllamaContentGenerator(config);

async function testOllama() {
  console.log('🧪 Test de l\'intégration Ollama...');
  
  try {
    const request = {
      contents: [
        {
          role: 'user',
          parts: [{ text: 'Dis bonjour en français et explique brièvement ce que tu peux faire.' }]
        }
      ]
    };

    console.log('📤 Envoi de la requête à Ollama...');
    const response = await client.generateContent(request, 'test-001');
    
    console.log('✅ Réponse reçue !');
    console.log('💬 Réponse :', response.text);
    console.log('🎯 Test réussi ! Ollama fonctionne avec SafeCodeGemini');
    
  } catch (error) {
    console.error('❌ Erreur lors du test :', error.message);
    console.error('💡 Assurez-vous qu\'Ollama est démarré avec : ollama serve');
  }
}

testOllama();
