import { WebcastPushConnection } from 'tiktok-live-connector';
import CONFIG from '../config.js';
import { EventEmitter } from 'events';

class TikTokService extends EventEmitter {
  constructor() {
    super();
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    // Only connect if not already connected
    if (this.isConnected) {
      console.log('🔄 Already connected to TikTok Live!');
      return;
    }

    try {
      this.connection = new WebcastPushConnection(CONFIG.tiktokUsername);
      const state = await this.connection.connect();
      this.isConnected = true;
      
      console.log('✅ Connected to TikTok Live!');
      console.log(`📡 Room ID: ${state.roomId}`);
      console.log(`👤 Streamer: ${CONFIG.tiktokUsername}`);
      
      this.setupEventListeners();
      return state;
    } catch (err) {
      console.error('❌ Failed to connect to TikTok:', err);
      this.isConnected = false;
      throw err;
    }
  }

  setupEventListeners() {
    if (!this.connection) return;

    this.connection.on('chat', (data) => {
      console.log(`💬 ${data.uniqueId}: ${data.comment}`);
      this.emit('chat', {
        username: data.uniqueId,
        message: data.comment.toLowerCase()
      });
    });

    // Handle disconnection
    this.connection.on('disconnected', () => {
      console.log('📴 Disconnected from TikTok Live');
      this.isConnected = false;
    });
  }

  // Cleanup method if needed
  disconnect() {
    if (this.connection) {
      this.connection.disconnect();
      this.isConnected = false;
      this.connection = null;
    }
  }
}

export default new TikTokService();

