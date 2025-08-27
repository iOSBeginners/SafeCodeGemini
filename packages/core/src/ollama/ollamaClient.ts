/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  CountTokensResponse,
  GenerateContentResponse,
  GenerateContentParameters,
  CountTokensParameters,
  EmbedContentResponse,
  EmbedContentParameters,
  Part,
  FunctionCall,
  FunctionResponse,
  FinishReason,
  ContentListUnion,
} from '@google/genai';
import type { ContentGenerator } from '../core/contentGenerator.js';
import type { UserTierId } from '../code_assist/types.js';

export interface OllamaConfig {
  baseUrl: string;
  model: string;
  temperature?: number;
  apiKey?: string;
}

interface OllamaMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: OllamaToolCall[];
  tool_call_id?: string;
}

interface OllamaToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  done_reason?: string;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

interface OllamaStreamResponse {
  model: string;
  created_at: string;
  message?: {
    role: string;
    content: string;
  };
  done: boolean;
}

export class OllamaContentGenerator implements ContentGenerator {
  userTier?: UserTierId;

  constructor(private config: OllamaConfig) {}

  private convertGeminiToOllamaMessages(contents: ContentListUnion): OllamaMessage[] {
    const messages: OllamaMessage[] = [];

    // Handle string input by converting to simple user message
    if (typeof contents === 'string') {
      return [{ role: 'user', content: contents }];
    }

    // Handle array of Content
    const contentArray = Array.isArray(contents) ? contents : [contents];
    
    for (const content of contentArray) {
      if (typeof content === 'string' || !('parts' in content) || !content.parts) continue;

      let messageContent = '';
      const toolCalls: OllamaToolCall[] = [];

      for (const part of content.parts) {
        if (part.text) {
          messageContent += part.text;
        } else if ('functionCall' in part && part.functionCall) {
          const functionCall = part.functionCall as FunctionCall;
          toolCalls.push({
            id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'function',
            function: {
              name: functionCall.name || 'unknown',
              arguments: JSON.stringify(functionCall.args || {}),
            },
          });
        } else if ('functionResponse' in part && part.functionResponse) {
          const functionResponse = part.functionResponse as FunctionResponse;
          messages.push({
            role: 'tool',
            content: JSON.stringify(functionResponse.response),
            tool_call_id: functionResponse.name,
          });
          continue;
        }
      }

      if (messageContent || toolCalls.length > 0) {
        let role: 'system' | 'user' | 'assistant';
        if ('role' in content) {
          switch (content.role) {
            case 'user':
              role = 'user';
              break;
            case 'model':
              role = 'assistant';
              break;
            default:
              role = 'user';
          }
        } else {
          role = 'user';
        }

        const message: OllamaMessage = {
          role,
          content: messageContent,
        };

        if (toolCalls.length > 0) {
          message.tool_calls = toolCalls;
        }

        messages.push(message);
      }
    }

    return messages;
  }

  private convertOllamaToGeminiResponse(
    ollamaResponse: OllamaResponse,
    requestId: string,
  ): GenerateContentResponse {
    const parts: Part[] = [];

    if (ollamaResponse.message?.content) {
      parts.push({ text: ollamaResponse.message.content });
    }

    const response: GenerateContentResponse = {
      candidates: [
        {
          content: {
            role: 'model',
            parts,
          },
          finishReason: ollamaResponse.done ? ('STOP' as FinishReason) : undefined,
          index: 0,
        },
      ],
      promptFeedback: {
        blockReason: undefined,
        safetyRatings: [],
      },
      text: parts.map(p => p.text || '').join(''),
      data: undefined,
      functionCalls: parts.filter(p => 'functionCall' in p).map(p => p.functionCall).filter((fc): fc is FunctionCall => fc !== undefined),
      executableCode: undefined,
      codeExecutionResult: undefined,
    };
    
    return response;
  }

  async generateContent(
    request: GenerateContentParameters,
    userPromptId: string,
  ): Promise<GenerateContentResponse> {
    const messages = this.convertGeminiToOllamaMessages(request.contents);
    
    const ollamaRequest = {
      model: this.config.model,
      messages,
      stream: false,
      options: {
        temperature: this.config.temperature || 0,
      },
    };

    const response = await fetch(`${this.config.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      },
      body: JSON.stringify(ollamaRequest),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const ollamaResponse: OllamaResponse = await response.json();
    return this.convertOllamaToGeminiResponse(ollamaResponse, userPromptId);
  }

  async generateContentStream(
    request: GenerateContentParameters,
    userPromptId: string,
  ): Promise<AsyncGenerator<GenerateContentResponse>> {
    const self = this;
    
    return (async function* () {
      const messages = self.convertGeminiToOllamaMessages(request.contents);
      
      const ollamaRequest = {
        model: self.config.model,
        messages,
        stream: true,
        options: {
          temperature: self.config.temperature || 0,
        },
      };

      const response = await fetch(`${self.config.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(self.config.apiKey && { 'Authorization': `Bearer ${self.config.apiKey}` }),
        },
        body: JSON.stringify(ollamaRequest),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim()) {
              try {
                const ollamaResponse: OllamaStreamResponse = JSON.parse(line);
                if (ollamaResponse.message?.content) {
                  const response: OllamaResponse = {
                    model: ollamaResponse.model,
                    created_at: ollamaResponse.created_at,
                    message: {
                      role: ollamaResponse.message.role,
                      content: ollamaResponse.message.content,
                    },
                    done: ollamaResponse.done,
                  };
                  yield self.convertOllamaToGeminiResponse(response, userPromptId);
                }
              } catch (error) {
                console.warn('Failed to parse Ollama response line:', line, error);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    })();
  }

  async countTokens(request: CountTokensParameters): Promise<CountTokensResponse> {
    // Ollama doesn't have a direct token counting API, so we estimate
    // Basic estimation: ~4 characters per token for most models
    let totalChars = 0;
    
    // Handle string or array of contents
    const contentArray = typeof request.contents === 'string' 
      ? [{ role: 'user' as const, parts: [{ text: request.contents }] }] 
      : Array.isArray(request.contents) ? request.contents : [request.contents];
    
    for (const content of contentArray) {
      if (typeof content === 'string') {
        totalChars += content.length;
      } else if ('parts' in content && content.parts) {
        for (const part of content.parts) {
          if (part.text) {
            totalChars += part.text.length;
          }
        }
      }
    }

    const estimatedTokens = Math.ceil(totalChars / 4);
    
    return {
      totalTokens: estimatedTokens,
    };
  }

  async embedContent(request: EmbedContentParameters): Promise<EmbedContentResponse> {
    // Ollama embedding support (if available)
    let prompt = '';
    if (typeof request.contents === 'string') {
      prompt = request.contents;
    } else if (Array.isArray(request.contents)) {
      const firstContent = request.contents[0];
      if (firstContent && typeof firstContent === 'object' && 'parts' in firstContent && firstContent.parts) {
        prompt = firstContent.parts[0]?.text || '';
      }
    } else if ('parts' in request.contents && request.contents.parts) {
      prompt = request.contents.parts[0]?.text || '';
    }
    
    const embedRequest = {
      model: this.config.model,
      prompt,
    };

    const response = await fetch(`${this.config.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      },
      body: JSON.stringify(embedRequest),
    });

    if (!response.ok) {
      throw new Error(`Ollama embeddings error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      embeddings: [{
        values: result.embedding || [],
      }],
    };
  }
}
