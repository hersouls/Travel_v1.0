'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // ms, 0이면 자동 닫기 없음
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean; // 클릭해야만 닫히는 알림
}

interface NotificationItemProps {
  notification: NotificationData;
  onClose: (id: string) => void;
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const { id, type, title, message, duration = 5000, action, persistent } = notification;

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, persistent, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  return (
    <div
      className={`
        relative p-4 rounded-lg border shadow-lg backdrop-blur-sm
        animate-in slide-in-from-right-5 duration-300
        ${getBackgroundColor()}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {message}
          </p>
          
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2 underline"
            >
              {action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="알림 닫기"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* 진행 바 (자동 닫기가 있는 경우) */}
      {!persistent && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
          <div 
            className="h-full bg-current opacity-30 animate-shrink"
            style={{ 
              animationDuration: `${duration}ms`,
              animationTimingFunction: 'linear'
            }}
          />
        </div>
      )}
    </div>
  );
}

interface NotificationSystemProps {
  notifications: NotificationData[];
  onClose: (id: string) => void;
}

export default function NotificationSystem({ notifications, onClose }: NotificationSystemProps) {
  return (
    <div
      className="fixed top-4 right-4 z-[100] space-y-3 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-label="알림"
    >
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationItem
            notification={notification}
            onClose={onClose}
          />
        </div>
      ))}
    </div>
  );
}

// 알림 관리 훅
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = (notification: Omit<NotificationData, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: NotificationData = {
      id,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // 편의 메서드들
  const success = (title: string, message: string, options?: Partial<NotificationData>) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  };

  const error = (title: string, message: string, options?: Partial<NotificationData>) => {
    return addNotification({
      type: 'error',
      title,
      message,
      persistent: true, // 에러는 기본적으로 수동 닫기
      ...options,
    });
  };

  const warning = (title: string, message: string, options?: Partial<NotificationData>) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options,
    });
  };

  const info = (title: string, message: string, options?: Partial<NotificationData>) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
  };
}

// 브라우저 알림 관리
export class BrowserNotificationManager {
  static async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('브라우저에서 알림을 지원하지 않습니다.');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  static async showNotification(
    title: string,
    options?: NotificationOptions & {
      onClick?: () => void;
      onClose?: () => void;
    }
  ): Promise<Notification | null> {
    if (!('Notification' in window)) {
      return null;
    }

    if (Notification.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        return null;
      }
    }

    const { onClick, onClose, ...notificationOptions } = options || {};

    const notification = new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-96.png',
      ...notificationOptions,
    });

    // Vibration API 별도 호출 (지원하는 브라우저에서)
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    if (onClick) {
      notification.onclick = onClick;
    }

    if (onClose) {
      notification.onclose = onClose;
    }

    return notification;
  }

  // 여행 관련 알림 템플릿
  static showTravelNotification(
    type: 'plan_update' | 'reminder' | 'share', 
    data: { travelId: string; travelTitle?: string; message?: string; sharedBy?: string }
  ) {
    switch (type) {
      case 'plan_update':
        return this.showNotification(
          '여행 계획이 업데이트되었습니다',
          {
            body: `${data.travelTitle}의 일정이 변경되었습니다.`,
            tag: 'travel-update',
            onClick: () => {
              window.focus();
              window.location.href = `/travels/${data.travelId}`;
            },
          }
        );

      case 'reminder':
        return this.showNotification(
          '여행 알림',
          {
            body: data.message,
            tag: 'travel-reminder',
            onClick: () => {
              window.focus();
              window.location.href = `/travels/${data.travelId}`;
            },
          }
        );

      case 'share':
        return this.showNotification(
          '여행 계획이 공유되었습니다',
          {
            body: `${data.sharedBy}님이 여행 계획을 공유했습니다.`,
            tag: 'travel-share',
            onClick: () => {
              window.focus();
              window.location.href = `/travels/${data.travelId}`;
            },
          }
        );
    }
  }
}