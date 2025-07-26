'use client';

import { useEffect, useState } from 'react';
import NotificationSystem, { useNotifications } from '@/components/ui/NotificationSystem';

interface PWAProviderProps {
  children: React.ReactNode;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const { notifications, removeNotification, success } = useNotifications();

  useEffect(() => {
    // Service Worker 등록
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker 등록 성공:', registration);
          success('서비스 워커 활성화', '오프라인에서도 앱을 사용할 수 있습니다.');

          // 업데이트 확인
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // 새 버전 업데이트 알림
                  if (confirm('새 버전이 업데이트되었습니다. 새로고침하시겠습니까?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[PWA] Service Worker 등록 실패:', error);
        });
    }

    // PWA 설치 프롬프트 처리
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    // 설치 완료 처리
    const handleAppInstalled = () => {
      console.log('[PWA] 앱이 설치되었습니다');
      setInstallPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Push 알림 권한 요청
    if ('Notification' in window && Notification.permission === 'default') {
      // 사용자 인터랙션 후에 권한 요청
      const requestNotificationPermission = () => {
        Notification.requestPermission().then((permission) => {
          console.log('[PWA] 알림 권한:', permission);
        });
      };

      // 3초 후 권한 요청 (사용자가 사이트에 익숙해진 후)
      setTimeout(requestNotificationPermission, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [success]);

  // PWA 설치 버튼 표시
  const handleInstallApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log('[PWA] 설치 선택:', outcome);
      setInstallPrompt(null);
    }
  };

      return (
    <>
      {children}
      
      {/* 알림 시스템 */}
      <NotificationSystem 
        notifications={notifications} 
        onClose={removeNotification} 
      />
      
      {/* PWA 설치 프롬프트 */}
      {installPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M6 6h12l-1.8 9H7.8L6 6zm0 0L4 3h1m0 0h1m10 15h.01"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  앱으로 설치하기
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Moonwave Travel을 홈 화면에 추가하여 더 빠르게 사용하세요.
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstallApp}
                className="flex-1 bg-blue-600 text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                설치하기
              </button>
              <button
                onClick={() => setInstallPrompt(null)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                나중에
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// PWA 상태 확인 훅
export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // PWA 설치 상태 확인
      const checkInstallStatus = () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIosPwa = (window.navigator as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone || isIosPwa);
  };

    checkInstallStatus();
    window.matchMedia('(display-mode: standalone)').addListener(checkInstallStatus);

    // 온라인/오프라인 상태 모니터링
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isInstalled, isOnline };
}