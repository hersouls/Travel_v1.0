'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { 
  X, 
  Link2, 
  Copy, 
  Mail, 
  Users, 
  Globe, 
  Lock, 
  Check,
  Loader2,
  UserPlus,
  Trash2
} from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  travelId: string
  travelTitle: string
  isPublic?: boolean
  shareUrl?: string
  collaborators?: Collaborator[]
  onVisibilityChange?: (isPublic: boolean) => void
  onCollaboratorAdd?: (email: string) => void
  onCollaboratorRemove?: (collaboratorId: string) => void
}

interface Collaborator {
  id: string
  email: string
  role: 'viewer' | 'editor'
  status: 'pending' | 'accepted'
  addedAt: string
}

export function ShareModal({
  isOpen,
  onClose,
  travelId,
  travelTitle,
  isPublic = false,
  shareUrl,
  collaborators = [],
  onVisibilityChange,
  onCollaboratorAdd,
  onCollaboratorRemove
}: ShareModalProps) {
  const { user } = useAuth()
  const [visibility, setVisibility] = useState(isPublic)
  const [shareLink, setShareLink] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'viewer' | 'editor'>('viewer')
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const [removingCollaborators, setRemovingCollaborators] = useState<Set<string>>(new Set())
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (isOpen) {
      setVisibility(isPublic)
      if (shareUrl) {
        setShareLink(shareUrl)
      } else {
        setShareLink(`${window.location.origin}/shared/travel/${travelId}`)
      }
    }
  }, [isOpen, isPublic, shareUrl, travelId])

  const handleVisibilityChange = useCallback(async (newVisibility: boolean) => {
    if (!user) return

    setIsGeneratingLink(true)
    try {
      // Update travel plan visibility in database
      const { error } = await supabase
        .from('travel_plans')
        .update({ is_public: newVisibility })
        .eq('id', travelId)
        .eq('user_id', user.id)

      if (error) throw error

      setVisibility(newVisibility)
      onVisibilityChange?.(newVisibility)

      // Generate/remove share link
      if (newVisibility && !shareUrl) {
        const newShareLink = `${window.location.origin}/shared/travel/${travelId}`
        setShareLink(newShareLink)
      }
    } catch (error) {
      console.error('Visibility change error:', error)
      alert('공개 설정 변경 중 오류가 발생했습니다.')
    } finally {
      setIsGeneratingLink(false)
    }
  }, [user, supabase, travelId, shareUrl, onVisibilityChange])

  const handleCopyToClipboard = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (error) {
      console.error('Copy to clipboard error:', error)
      alert('클립보드 복사 중 오류가 발생했습니다.')
    }
  }, [])

  const handleInviteCollaborator = useCallback(async () => {
    if (!user || !inviteEmail.trim()) return

    setIsInviting(true)
    try {
      // Add collaborator to database
      const { error } = await supabase
        .from('collaborators')
        .insert({
          travel_plan_id: travelId,
          invited_by: user.id,
          email: inviteEmail.trim(),
          role: inviteRole,
          status: 'pending'
        })

      if (error) throw error

      onCollaboratorAdd?.(inviteEmail.trim())
      setInviteEmail('')
      
      // TODO: Send invitation email
      console.log('Invitation email should be sent to:', inviteEmail.trim())
    } catch (error) {
      console.error('Invite collaborator error:', error)
      alert('협력자 초대 중 오류가 발생했습니다.')
    } finally {
      setIsInviting(false)
    }
  }, [user, supabase, travelId, inviteEmail, inviteRole, onCollaboratorAdd])

  const handleRemoveCollaborator = useCallback(async (collaboratorId: string) => {
    if (!user || !confirm('이 협력자를 제거하시겠습니까?')) return

    setRemovingCollaborators(prev => new Set(prev).add(collaboratorId))
    try {
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('id', collaboratorId)
        .eq('travel_plan_id', travelId)

      if (error) throw error

      onCollaboratorRemove?.(collaboratorId)
    } catch (error) {
      console.error('Remove collaborator error:', error)
      alert('협력자 제거 중 오류가 발생했습니다.')
    } finally {
      setRemovingCollaborators(prev => {
        const newSet = new Set(prev)
        newSet.delete(collaboratorId)
        return newSet
      })
    }
  }, [user, supabase, travelId, onCollaboratorRemove])

  const handleSendEmail = useCallback(() => {
    const subject = encodeURIComponent(`${travelTitle} - 여행 계획 공유`)
    const body = encodeURIComponent(
      `안녕하세요!\n\n"${travelTitle}" 여행 계획을 공유합니다.\n\n${shareLink}\n\n즐거운 여행 되세요!`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }, [travelTitle, shareLink])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold tracking-korean-normal">
            여행 계획 공유
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Visibility Settings */}
          <div>
            <h3 className="text-lg font-medium mb-4 tracking-korean-normal">
              공개 설정
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="visibility"
                  checked={!visibility}
                  onChange={() => handleVisibilityChange(false)}
                  disabled={isGeneratingLink}
                  className="w-4 h-4 text-blue-600"
                />
                <Lock className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium tracking-korean-normal">비공개</div>
                  <div className="text-sm text-gray-500 break-keep-ko">
                    본인과 초대받은 사람만 볼 수 있습니다
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility}
                  onChange={() => handleVisibilityChange(true)}
                  disabled={isGeneratingLink}
                  className="w-4 h-4 text-blue-600"
                />
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium tracking-korean-normal">공개</div>
                  <div className="text-sm text-gray-500 break-keep-ko">
                    링크를 가진 누구나 볼 수 있습니다
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Share Link */}
          {visibility && shareLink && (
            <div>
              <h3 className="text-lg font-medium mb-4 tracking-korean-normal">
                공유 링크
              </h3>
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-gray-50"
                />
                <Button
                  onClick={() => handleCopyToClipboard(shareLink, 'shareLink')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {copiedStates.shareLink ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      복사됨
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      복사
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleSendEmail}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  이메일
                </Button>
              </div>
            </div>
          )}

          {/* Collaborators */}
          <div>
            <h3 className="text-lg font-medium mb-4 tracking-korean-normal">
              협력자 관리
            </h3>
            
            {/* Add Collaborator */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-2 mb-3">
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="이메일 주소 입력"
                  className="flex-1"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'viewer' | 'editor')}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="viewer">보기 권한</option>
                  <option value="editor">편집 권한</option>
                </select>
                <Button
                  onClick={handleInviteCollaborator}
                  disabled={!inviteEmail.trim() || isInviting}
                  className="flex items-center gap-2"
                >
                  {isInviting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  초대
                </Button>
              </div>
              <div className="text-xs text-gray-500 break-keep-ko">
                협력자에게 이메일 초대가 발송됩니다
              </div>
            </div>

            {/* Collaborators List */}
            {collaborators.length > 0 ? (
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{collaborator.email}</div>
                        <div className="text-sm text-gray-500">
                          {collaborator.role === 'editor' ? '편집 권한' : '보기 권한'} · 
                          {collaborator.status === 'pending' ? ' 초대 대기중' : ' 참여중'}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                      variant="outline"
                      size="sm"
                      disabled={removingCollaborators.has(collaborator.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      {removingCollaborators.has(collaborator.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="tracking-korean-normal">아직 협력자가 없습니다</div>
                <div className="text-sm text-gray-400 break-keep-ko">
                  이메일로 협력자를 초대해보세요
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </Card>
    </div>
  )
}