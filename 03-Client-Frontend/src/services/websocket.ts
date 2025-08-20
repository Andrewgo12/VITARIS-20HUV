/**
 * WebSocket Service for VITAL RED Real-time Communication
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import { toast } from '@/components/ui/use-toast';

// Types
interface WebSocketMessage {
  type: string;
  timestamp: string;
  data?: any;
}

interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionHandler = (connected: boolean) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private connectionHandlers: ConnectionHandler[] = [];
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isConnected = false;
  private shouldReconnect = true;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config,
    };
  }

  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.ws = new WebSocket(this.config.url);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    }
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.clearTimers();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnected = false;
    this.notifyConnectionHandlers(false);
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyConnectionHandlers(true);
      this.startHeartbeat();
      
      // Join default rooms
      this.joinRoom('dashboard');
      
      toast({
        title: 'Conexión establecida',
        description: 'Conectado al sistema en tiempo real',
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.isConnected = false;
      this.notifyConnectionHandlers(false);
      this.clearTimers();
      
      if (this.shouldReconnect) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      
      toast({
        title: 'Error de conexión',
        description: 'Problema con la conexión en tiempo real',
        variant: 'destructive',
      });
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    // Handle system messages
    switch (message.type) {
      case 'connection_established':
        console.log('Connection established:', message.data);
        break;
      case 'pong':
        // Heartbeat response
        break;
      case 'error':
        console.error('WebSocket server error:', message.data);
        toast({
          title: 'Error del servidor',
          description: message.data?.message || 'Error desconocido',
          variant: 'destructive',
        });
        break;
      default:
        // Notify registered handlers
        const handlers = this.messageHandlers.get(message.type) || [];
        handlers.forEach(handler => {
          try {
            handler(message);
          } catch (error) {
            console.error('Error in message handler:', error);
          }
        });
        break;
    }
  }

  private handleReconnect(): void {
    if (!this.shouldReconnect || this.reconnectAttempts >= this.config.maxReconnectAttempts!) {
      console.log('Max reconnection attempts reached');
      toast({
        title: 'Conexión perdida',
        description: 'No se pudo restablecer la conexión automáticamente',
        variant: 'destructive',
      });
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval);
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.send({
          type: 'ping',
          timestamp: new Date().toISOString(),
        });
      }
    }, this.config.heartbeatInterval);
  }

  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(connected);
      } catch (error) {
        console.error('Error in connection handler:', error);
      }
    });
  }

  // Public methods
  send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }

  joinRoom(room: string): void {
    this.send({
      type: 'join_room',
      room,
      timestamp: new Date().toISOString(),
    });
  }

  leaveRoom(room: string): void {
    this.send({
      type: 'leave_room',
      room,
      timestamp: new Date().toISOString(),
    });
  }

  requestRecentEmails(limit: number = 10): void {
    this.send({
      type: 'get_recent_emails',
      limit,
      timestamp: new Date().toISOString(),
    });
  }

  requestRecentReferrals(limit: number = 10): void {
    this.send({
      type: 'get_recent_referrals',
      limit,
      timestamp: new Date().toISOString(),
    });
  }

  requestStatistics(): void {
    this.send({
      type: 'get_statistics',
      timestamp: new Date().toISOString(),
    });
  }

  // Event handlers
  onMessage(type: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    
    this.messageHandlers.get(type)!.push(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  onConnection(handler: ConnectionHandler): () => void {
    this.connectionHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      const index = this.connectionHandlers.indexOf(handler);
      if (index > -1) {
        this.connectionHandlers.splice(index, 1);
      }
    };
  }

  // Getters
  get connected(): boolean {
    return this.isConnected;
  }

  get readyState(): number {
    return this.ws?.readyState || WebSocket.CLOSED;
  }
}

// Create singleton instance
const WEBSOCKET_URL = 'ws://localhost:8002';
export const websocketService = new WebSocketService({
  url: WEBSOCKET_URL,
});

// Auto-connect when service is imported
websocketService.connect();

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    if (!websocketService.connected) {
      websocketService.connect();
    }
  }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  websocketService.disconnect();
});

export default websocketService;
export type { WebSocketMessage, MessageHandler, ConnectionHandler };
