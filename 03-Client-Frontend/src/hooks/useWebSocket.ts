/**
 * WebSocket Hook for VITAL RED Real-time Communication
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { websocketService, type WebSocketMessage, type MessageHandler } from '@/services/websocket';
import { toast } from '@/components/ui/use-toast';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  showConnectionToasts?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  connectionState: number;
  send: (message: any) => void;
  connect: () => void;
  disconnect: () => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  subscribe: (type: string, handler: MessageHandler) => () => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    autoConnect = true,
    showConnectionToasts = true,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionState, setConnectionState] = useState<number>(WebSocket.CLOSED);
  
  const handlersRef = useRef<Map<string, MessageHandler[]>>(new Map());
  const unsubscribersRef = useRef<(() => void)[]>([]);

  // Connection state handler
  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
    setConnectionState(connected ? WebSocket.OPEN : WebSocket.CLOSED);

    if (connected) {
      if (showConnectionToasts) {
        toast({
          title: 'Conectado',
          description: 'Conexión en tiempo real establecida',
        });
      }
      onConnect?.();
    } else {
      if (showConnectionToasts) {
        toast({
          title: 'Desconectado',
          description: 'Conexión en tiempo real perdida',
          variant: 'destructive',
        });
      }
      onDisconnect?.();
    }
  }, [showConnectionToasts, onConnect, onDisconnect]);

  // Message handler
  const handleMessage = useCallback((message: WebSocketMessage) => {
    setLastMessage(message);

    // Call registered handlers for this message type
    const handlers = handlersRef.current.get(message.type) || [];
    handlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in WebSocket message handler:', error);
      }
    });
  }, []);

  // Setup WebSocket service listeners
  useEffect(() => {
    const connectionUnsubscriber = websocketService.onConnection(handleConnectionChange);
    unsubscribersRef.current.push(connectionUnsubscriber);

    // Set initial connection state
    setIsConnected(websocketService.connected);
    setConnectionState(websocketService.readyState);

    return () => {
      unsubscribersRef.current.forEach(unsubscriber => unsubscriber());
      unsubscribersRef.current = [];
    };
  }, [handleConnectionChange]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && !websocketService.connected) {
      websocketService.connect();
    }
  }, [autoConnect]);

  // Public methods
  const send = useCallback((message: any) => {
    websocketService.send(message);
  }, []);

  const connect = useCallback(() => {
    websocketService.connect();
  }, []);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  const joinRoom = useCallback((room: string) => {
    websocketService.joinRoom(room);
  }, []);

  const leaveRoom = useCallback((room: string) => {
    websocketService.leaveRoom(room);
  }, []);

  const subscribe = useCallback((type: string, handler: MessageHandler): (() => void) => {
    // Add to local handlers map
    if (!handlersRef.current.has(type)) {
      handlersRef.current.set(type, []);
    }
    handlersRef.current.get(type)!.push(handler);

    // Subscribe to WebSocket service
    const unsubscriber = websocketService.onMessage(type, handleMessage);
    unsubscribersRef.current.push(unsubscriber);

    // Return unsubscribe function
    return () => {
      // Remove from local handlers
      const handlers = handlersRef.current.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }

      // Unsubscribe from WebSocket service
      unsubscriber();
      
      // Remove from unsubscribers list
      const unsubIndex = unsubscribersRef.current.indexOf(unsubscriber);
      if (unsubIndex > -1) {
        unsubscribersRef.current.splice(unsubIndex, 1);
      }
    };
  }, [handleMessage]);

  return {
    isConnected,
    lastMessage,
    connectionState,
    send,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    subscribe,
  };
};

// Specialized hooks for specific WebSocket functionality

export const useEmailUpdates = () => {
  const { subscribe, joinRoom, leaveRoom } = useWebSocket();
  const [newEmails, setNewEmails] = useState<any[]>([]);
  const [emailUpdates, setEmailUpdates] = useState<any[]>([]);

  useEffect(() => {
    // Join email room
    joinRoom('emails');

    // Subscribe to email events
    const unsubscribeNewEmail = subscribe('new_email', (message) => {
      setNewEmails(prev => [message.data, ...prev.slice(0, 9)]);
      
      toast({
        title: 'Nuevo email',
        description: `Email recibido: ${message.data?.subject}`,
      });
    });

    const unsubscribeEmailUpdate = subscribe('email_updated', (message) => {
      setEmailUpdates(prev => [message.data, ...prev.slice(0, 9)]);
    });

    return () => {
      leaveRoom('emails');
      unsubscribeNewEmail();
      unsubscribeEmailUpdate();
    };
  }, [subscribe, joinRoom, leaveRoom]);

  return { newEmails, emailUpdates };
};

export const useReferralUpdates = () => {
  const { subscribe, joinRoom, leaveRoom } = useWebSocket();
  const [newReferrals, setNewReferrals] = useState<any[]>([]);
  const [referralUpdates, setReferralUpdates] = useState<any[]>([]);

  useEffect(() => {
    // Join referrals room
    joinRoom('referrals');

    // Subscribe to referral events
    const unsubscribeNewReferral = subscribe('new_referral', (message) => {
      setNewReferrals(prev => [message.data, ...prev.slice(0, 9)]);
      
      toast({
        title: 'Nueva referencia',
        description: `Referencia recibida: ${message.data?.referral_number}`,
      });
    });

    const unsubscribeReferralUpdate = subscribe('referral_updated', (message) => {
      setReferralUpdates(prev => [message.data, ...prev.slice(0, 9)]);
      
      toast({
        title: 'Referencia actualizada',
        description: `Estado: ${message.data?.new_status}`,
      });
    });

    return () => {
      leaveRoom('referrals');
      unsubscribeNewReferral();
      unsubscribeReferralUpdate();
    };
  }, [subscribe, joinRoom, leaveRoom]);

  return { newReferrals, referralUpdates };
};

export const useSystemAlerts = () => {
  const { subscribe, joinRoom, leaveRoom } = useWebSocket();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Join alerts room
    joinRoom('alerts');

    // Subscribe to system alerts
    const unsubscribeAlert = subscribe('system_alert', (message) => {
      setAlerts(prev => [message.data, ...prev.slice(0, 19)]);
      
      const { level, title, message: alertMessage } = message.data;
      
      toast({
        title: title || 'Alerta del sistema',
        description: alertMessage,
        variant: level === 'CRITICAL' ? 'destructive' : 'default',
      });
    });

    return () => {
      leaveRoom('alerts');
      unsubscribeAlert();
    };
  }, [subscribe, joinRoom, leaveRoom]);

  return { alerts };
};

export const useProcessingStatus = () => {
  const { subscribe, joinRoom, leaveRoom } = useWebSocket();
  const [processingUpdates, setProcessingUpdates] = useState<any[]>([]);

  useEffect(() => {
    // Join processing room
    joinRoom('processing');

    // Subscribe to processing status updates
    const unsubscribeProcessing = subscribe('processing_status', (message) => {
      setProcessingUpdates(prev => [message.data, ...prev.slice(0, 19)]);
    });

    return () => {
      leaveRoom('processing');
      unsubscribeProcessing();
    };
  }, [subscribe, joinRoom, leaveRoom]);

  return { processingUpdates };
};

export const useStatisticsUpdates = () => {
  const { subscribe } = useWebSocket();
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    // Subscribe to statistics updates
    const unsubscribeStats = subscribe('statistics', (message) => {
      setStatistics(message.data);
    });

    return unsubscribeStats;
  }, [subscribe]);

  return { statistics };
};

export default useWebSocket;
