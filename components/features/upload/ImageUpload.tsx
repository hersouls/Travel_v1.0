'use client'

import { useState, useRef, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react'

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void
  onUploadError?: (error: string) => void
  maxSizeMB?: number
  allowedTypes?: string[]
  className?: string
  bucket?: string
  folder?: string
  placeholder?: string
}

interface UploadState {
  isUploading: boolean
  progress: number
  error: string | null
  preview: string | null
}

export function ImageUpload({
  onUploadSuccess,
  onUploadError,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
  bucket = 'travel-images',
  folder = 'user-uploads',
  placeholder = '여행 사진을 업로드하세요'
}: ImageUploadProps) {
  const { user } = useAuth()
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    preview: null
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()

  const resetUploadState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      preview: null
    })
  }, [])

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return `지원되지 않는 파일 형식입니다. ${allowedTypes.map(type => type.split('/')[1]).join(', ')} 형식만 업로드 가능합니다.`
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      return `파일 크기가 ${maxSizeMB}MB를 초과합니다. (현재: ${fileSizeMB.toFixed(1)}MB)`
    }

    return null
  }, [allowedTypes, maxSizeMB])

  const compressImage = useCallback((file: File, maxWidth = 1920, quality = 0.8): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          resolve(blob!)
        }, file.type, quality)
      }

      img.src = URL.createObjectURL(file)
    })
  }, [])

  const uploadToStorage = useCallback(async (file: File): Promise<string> => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${user.id}/${fileName}`

    // Compress image if it's too large
    let fileToUpload: File | Blob = file
    if (file.size > 1024 * 1024) { // 1MB
      fileToUpload = await compressImage(file)
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw new Error(error.message)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicUrl
  }, [user, supabase, bucket, folder, compressImage])

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    resetUploadState()

    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setUploadState(prev => ({ ...prev, error: validationError }))
      onUploadError?.(validationError)
      return
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file)
    setUploadState(prev => ({ 
      ...prev, 
      preview: previewUrl, 
      isUploading: true,
      error: null 
    }))

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }))
      }, 200)

      const publicUrl = await uploadToStorage(file)

      clearInterval(progressInterval)
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        error: null
      }))

      onUploadSuccess(publicUrl)

      // Clean up preview after success
      setTimeout(() => {
        URL.revokeObjectURL(previewUrl)
        resetUploadState()
      }, 2000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.'
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: errorMessage
      }))
      onUploadError?.(errorMessage)
      URL.revokeObjectURL(previewUrl)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [validateFile, uploadToStorage, onUploadSuccess, onUploadError, resetUploadState])

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const clearPreview = useCallback(() => {
    if (uploadState.preview) {
      URL.revokeObjectURL(uploadState.preview)
    }
    resetUploadState()
  }, [uploadState.preview, resetUploadState])

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploadState.isUploading}
      />

      {!uploadState.preview ? (
        <div
          onClick={triggerFileSelect}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 cursor-pointer transition-colors"
        >
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-600 mb-2 tracking-korean-normal">
            {placeholder}
          </div>
          <div className="text-sm text-gray-500 break-keep-ko">
            {allowedTypes.map(type => type.split('/')[1]).join(', ')} 형식, 최대 {maxSizeMB}MB
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            disabled={uploadState.isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            파일 선택
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={uploadState.preview}
              alt="업로드 미리보기"
              width={400}
              height={192}
              className="w-full h-48 object-cover"
            />
            
            {uploadState.isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <div className="text-sm tracking-korean-normal">
                    업로드 중... {uploadState.progress}%
                  </div>
                  <div className="w-32 bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadState.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {!uploadState.isUploading && (
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              aria-label="미리보기 제거"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {uploadState.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800 break-keep-ko">
            {uploadState.error}
          </div>
        </div>
      )}

      {uploadState.progress === 100 && !uploadState.error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 text-center tracking-korean-normal">
          업로드가 완료되었습니다!
        </div>
      )}
    </div>
  )
}