'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { User, LogOut, Settings, Loader2 } from 'lucide-react';

export function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    setIsMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="flex h-10 w-10 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-white/70" />
      </div>
    );
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => (window.location.href = '/signin')}
      >
        로그인
      </Button>
    );
  }

  const userDisplayName =
    user.user_metadata?.name || user.email?.split('@')[0] || '사용자';
  const userEmail = user.email || '';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-white/20"
        aria-label="사용자 메뉴"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="hidden text-left sm:block">
          <div className="text-sm font-medium text-white tracking-korean-normal">
            {userDisplayName}
          </div>
          <div className="max-w-[120px] truncate text-xs text-white/70">
            {userEmail}
          </div>
        </div>
      </button>

      {isMenuOpen && (
          <div className="border-b border-white/20 p-4">
            <div className="text-sm font-medium text-white tracking-korean-normal">
              {userDisplayName}
            </div>
            <div className="mt-1 text-xs text-white/70">{userEmail}</div>
          </div>

          <div className="p-2">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                // Navigate to settings page when implemented
                console.log('Settings page not implemented yet');
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white transition-colors tracking-korean-normal hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
              설정
            </button>

            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-300 transition-colors tracking-korean-normal hover:bg-red-500/20 disabled:opacity-50"
            >
              {isSigningOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              {isSigningOut ? '로그아웃 중...' : '로그아웃'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
