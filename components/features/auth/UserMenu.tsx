'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { User, LogOut, Settings, Loader2 } from 'lucide-react'

export function UserMenu() {
  const { user, loading, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    setIsSigningOut(false)
    setIsMenuOpen(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => window.location.href = '/signin'}
        className="tracking-korean-normal"
      >
        로그인
      </Button>
    )
  }

  const userDisplayName = user.user_metadata?.name || user.email?.split('@')[0] || '사용자'
  const userEmail = user.email || ''

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="사용자 메뉴"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900 tracking-korean-normal">
            {userDisplayName}
          </div>
          <div className="text-xs text-gray-500 truncate max-w-[120px]">
            {userEmail}
          </div>
        </div>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-900 tracking-korean-normal">
              {userDisplayName}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {userEmail}
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={() => {
                setIsMenuOpen(false)
                // Navigate to settings page when implemented
                console.log('Settings page not implemented yet')
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors tracking-korean-normal"
            >
              <Settings className="w-4 h-4" />
              설정
            </button>

            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors tracking-korean-normal disabled:opacity-50"
            >
              {isSigningOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              {isSigningOut ? '로그아웃 중...' : '로그아웃'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}