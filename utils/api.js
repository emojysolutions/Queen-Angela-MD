const axios = require('axios');
const FormData = require('form-data');
const config = require('../config');
const logger = require('./logger');

const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${config.PHONE_NUMBER_ID}`;

class WhatsAppAPI {
  constructor() {
    this.token = config.WHATSAPP_TOKEN;
    this.phoneNumberId = config.PHONE_NUMBER_ID;
  }

  async sendMessage(to, text) {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_URL}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'text',
          text: { body: text }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Failed to send message:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendImage(to, imageUrl, caption = '') {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_URL}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'image',
          image: {
            link: imageUrl,
            caption: caption
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Failed to send image:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendAudio(to, audioUrl) {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_URL}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'audio',
          audio: {
            link: audioUrl
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Failed to send audio:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendDocument(to, documentUrl, filename, caption = '') {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_URL}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'document',
          document: {
            link: documentUrl,
            filename: filename,
            caption: caption
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Failed to send document:', error.response?.data || error.message);
      throw error;
    }
  }

  async markAsRead(messageId) {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_URL}/messages`,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Failed to mark message as read:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new WhatsAppAPI();
