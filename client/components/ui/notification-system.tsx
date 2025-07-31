import React, { useState, useEffect, createContext, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { ScrollArea } from './scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Bell,
  BellRing,
  X,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  User,
  Heart,
  Activity,
  Calendar,
  MessageSquare,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useScreenReader, generateAriaAttributes, getMedicalAriaLabel } from '@/utils/accessibility';

// Tipos de notificaciones
export type NotificationType = 
  | 'emergency' 
  | 'warning' 
  | 'info' 
  | 'success' 
  | 'appointment' 
  | 'message' 
  | 'vital_signs' 
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  patientId?: string;
  patientName?: string;
  actionRequired?: boolean;
  autoExpire?: number; // milliseconds
  sound?: boolean;
}

// Context para el sistema de notificaciones
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Provider del sistema de notificaciones
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { toast } = useToast();

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [notification, ...prev]);

    // Reproducir sonido si está habilitado
    if (soundEnabled && notification.sound !== false) {
      playNotificationSound(notification.priority);
    }

    // Mostrar toast para notificaciones críticas
    if (notification.priority === 'critical' || notification.type === 'emergency') {
      toast({
        title: notification.title,
        description: notification.message,
        variant: 'destructive',
      });
    }

    // Auto-expirar si está configurado
    if (notification.autoExpire) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, notification.autoExpire);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const playNotificationSound = (priority: Notification['priority']) => {
    // Simular sonidos diferentes según la prioridad
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Frecuencias diferentes según prioridad
    const frequencies = {
      low: 440,
      medium: 554,
      high: 659,
      critical: 880
    };

    oscillator.frequency.setValueAtTime(frequencies[priority], audioContext.currentTime);
    oscillator.type = priority === 'critical' ? 'sawtooth' : 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
      soundEnabled,
      setSoundEnabled,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Componente del icono de notificaciones
export const NotificationBell: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { unreadCount, notifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const hasUrgent = notifications.some(n => !n.read && (n.priority === 'critical' || n.type === 'emergency'));

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className={`relative ${hasUrgent ? 'animate-pulse' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {hasUrgent ? (
          <BellRing className="w-5 h-5 text-red-500" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        {unreadCount > 0 && (
          <Badge 
            variant={hasUrgent ? 'destructive' : 'default'}
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <NotificationPanel onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};

// Panel de notificaciones
const NotificationPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll,
    soundEnabled,
    setSoundEnabled 
  } = useNotifications();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'vital_signs':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'system':
        return <Settings className="w-4 h-4 text-gray-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'Ahora';
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Notificaciones</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              Marcar todas como leídas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
            >
              Limpiar todas
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="max-h-96">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay notificaciones</p>
          </div>
        ) : (
          <div className="p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  p-3 mb-2 border-l-4 rounded-r-lg cursor-pointer transition-colors
                  ${getPriorityColor(notification.priority)}
                  ${notification.read ? 'opacity-60' : ''}
                  hover:bg-gray-50
                `}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.patientName && (
                        <p className="text-xs text-gray-500 mt-1">
                          Paciente: {notification.patientName}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {notification.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
