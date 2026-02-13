const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const config = require('../config');
const logger = require('./logger');
const personas = require('../data/personas.json');

class AIManager {
  constructor() {
    this.providers = new Map();
    this.conversationHistory = new Map();
    this.userPersonas = new Map();
    this.initialize();
  }

  /**
   * Initialize AI providers based on available API keys
   */
  initialize() {
    // OpenAI (GPT)
    if (config.OPENAI_API_KEY) {
      try {
        this.providers.set('openai', {
          client: new OpenAI({ apiKey: config.OPENAI_API_KEY }),
          name: 'GPT-4o',
          available: true
        });
        logger.success('OpenAI initialized');
      } catch (error) {
        logger.error('Failed to initialize OpenAI:', error.message);
      }
    }

    // Anthropic (Claude)
    if (config.ANTHROPIC_API_KEY) {
      try {
        this.providers.set('anthropic', {
          client: new Anthropic({ apiKey: config.ANTHROPIC_API_KEY }),
          name: 'Claude Opus',
          available: true
        });
        logger.success('Anthropic initialized');
      } catch (error) {
        logger.error('Failed to initialize Anthropic:', error.message);
      }
    }

    // Google Gemini
    if (config.GOOGLE_AI_KEY) {
      try {
        this.providers.set('gemini', {
          client: new GoogleGenerativeAI(config.GOOGLE_AI_KEY),
          name: 'Gemini Pro',
          available: true
        });
        logger.success('Google Gemini initialized');
      } catch (error) {
        logger.error('Failed to initialize Gemini:', error.message);
      }
    }

    // DeepSeek
    if (config.DEEPSEEK_API_KEY) {
      this.providers.set('deepseek', {
        apiKey: config.DEEPSEEK_API_KEY,
        name: 'DeepSeek',
        available: true
      });
      logger.success('DeepSeek initialized');
    }

    if (this.providers.size === 0) {
      logger.warn('No AI providers configured! Add API keys to .env');
    }
  }

  /**
   * Chat with specific provider
   */
  async chat(providerKey, userId, message, systemPrompt = null) {
    if (!this.providers.has(providerKey)) {
      throw new Error(`Provider ${providerKey} not available`);
    }

    const provider = this.providers.get(providerKey);
    
    // Get user persona
    const personaKey = this.userPersonas.get(userId) || 'default';
    const persona = personas[personaKey];
    const finalSystemPrompt = systemPrompt || persona.systemPrompt;

    // Get conversation history
    const historyKey = `${userId}:${providerKey}`;
    let history = this.conversationHistory.get(historyKey) || [];

    try {
      let response;

      if (providerKey === 'openai') {
        response = await this.chatOpenAI(provider.client, message, finalSystemPrompt, history);
      } else if (providerKey === 'anthropic') {
        response = await this.chatAnthropic(provider.client, message, finalSystemPrompt, history);
      } else if (providerKey === 'gemini') {
        response = await this.chatGemini(provider.client, message, finalSystemPrompt, history);
      } else if (providerKey === 'deepseek') {
        response = await this.chatDeepSeek(provider.apiKey, message, finalSystemPrompt, history);
      }

      // Update history
      history.push({ role: 'user', content: message });
      history.push({ role: 'assistant', content: response });

      // Keep only last 20 messages (10 exchanges)
      if (history.length > 20) {
        history = history.slice(-20);
      }

      this.conversationHistory.set(historyKey, history);

      return response;
    } catch (error) {
      logger.error(`${providerKey} error:`, error);
      throw error;
    }
  }

  /**
   * Chat with OpenAI
   */
  async chatOpenAI(client, message, systemPrompt, history) {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  }

  /**
   * Chat with Anthropic
   */
  async chatAnthropic(client, message, systemPrompt, history) {
    const messages = [
      ...history,
      { role: 'user', content: message }
    ];

    const response = await client.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages
    });

    return response.content[0].text;
  }

  /**
   * Chat with Gemini
   */
  async chatGemini(client, message, systemPrompt, history) {
    const model = client.getGenerativeModel({ model: 'gemini-pro' });

    // Gemini doesn't support system prompts in the same way
    // So we prepend it to the first message
    const fullMessage = history.length === 0
      ? `${systemPrompt}\n\n${message}`
      : message;

    const result = await model.generateContent(fullMessage);
    const response = result.response;
    return response.text();
  }

  /**
   * Chat with DeepSeek
   */
  async chatDeepSeek(apiKey, message, systemPrompt, history) {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  /**
   * Smart chat - automatically select best available provider
   */
  async smartChat(userId, message) {
    const priority = ['openai', 'anthropic', 'gemini', 'deepseek'];
    
    for (const providerKey of priority) {
      if (this.providers.has(providerKey)) {
        return await this.chat(providerKey, userId, message);
      }
    }

    throw new Error('No AI providers available');
  }

  /**
   * Get available providers
   */
  getAvailableProviders() {
    return Array.from(this.providers.keys());
  }

  /**
   * Get conversation history
   */
  getHistory(userId, provider) {
    const historyKey = `${userId}:${provider}`;
    return this.conversationHistory.get(historyKey) || [];
  }

  /**
   * Clear conversation history
   */
  clearHistory(userId, provider = null) {
    if (provider) {
      const historyKey = `${userId}:${provider}`;
      this.conversationHistory.delete(historyKey);
    } else {
      // Clear all histories for this user
      for (const key of this.conversationHistory.keys()) {
        if (key.startsWith(`${userId}:`)) {
          this.conversationHistory.delete(key);
        }
      }
    }
  }

  /**
   * Set user persona
   */
  setPersona(userId, personaKey) {
    if (!personas[personaKey]) {
      throw new Error(`Persona ${personaKey} not found`);
    }
    this.userPersonas.set(userId, personaKey);
  }

  /**
   * Get user persona
   */
  getPersona(userId) {
    const personaKey = this.userPersonas.get(userId) || 'default';
    return personas[personaKey];
  }

  /**
   * Generate image with DALL-E
   */
  async generateImage(prompt) {
    if (!this.providers.has('openai')) {
      throw new Error('OpenAI not configured');
    }

    const client = this.providers.get('openai').client;

    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard'
    });

    return response.data[0].url;
  }

  /**
   * Analyze image with GPT-4o Vision
   */
  async analyzeImage(imageUrl, prompt = 'What is in this image?') {
    if (!this.providers.has('openai')) {
      throw new Error('OpenAI not configured');
    }

    const client = this.providers.get('openai').client;

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content;
  }
}

// Create singleton instance
const aiManager = new AIManager();

module.exports = aiManager;
