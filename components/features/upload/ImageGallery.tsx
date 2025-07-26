'use client'

import { useState, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { X, Maximize2, Trash2, Download, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageItem {
  id: string
  url: string
  name?: string
  uploadedAt?: string
  size?: number
}

interface ImageGalleryProps {
  images: ImageItem[]
  onImageDelete?: (imageId: string, imageUrl: string) => void
  onImageClick?: (image: ImageItem) => void
  className?: string
  allowDelete?: boolean
  showDownload?: boolean
  maxColumns?: number
}

interface LightboxState {
  isOpen: boolean
  currentIndex: number
}

export function ImageGallery({
  images,
  onImageDelete,
  onImageClick,
  className = '',
  allowDelete = true,
  showDownload = true,
  maxColumns = 4
}: ImageGalleryProps) {
  const { user } = useAuth()
  const [lightbox, setLightbox] = useState<LightboxState>({ isOpen: false, currentIndex: 0 })
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set())
  const supabase = createClientComponentClient()

  const openLightbox = useCallback((index: number) => {
    setLightbox({ isOpen: true, currentIndex: index })
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox({ isOpen: false, currentIndex: 0 })
  }, [])

  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    setLightbox(prev => {
      const newIndex = direction === 'next' 
        ? (prev.currentIndex + 1) % images.length
        : (prev.currentIndex - 1 + images.length) % images.length
      return { ...prev, currentIndex: newIndex }
    })
  }, [images.length])

  const handleImageClick = useCallback((image: ImageItem, index: number) => {
    if (onImageClick) {
      onImageClick(image)
    } else {
      openLightbox(index)
    }
  }, [onImageClick, openLightbox])

  const handleDeleteImage = useCallback(async (imageId: string, imageUrl: string) => {
    if (!user || !allowDelete) return

    if (!confirm('이 이미지를 삭제하시겠습니까?')) return

    setDeletingImages(prev => new Set(prev).add(imageId))

    try {
      // Extract file path from URL for Supabase Storage deletion
      const urlParts = imageUrl.split('/')
      const bucket = 'travel-images' // Default bucket name
      const filePath = urlParts.slice(urlParts.indexOf(bucket) + 1).join('/')

      if (filePath) {
        const { error } = await supabase.storage
          .from(bucket)
          .remove([filePath])

        if (error) {
          console.error('Storage deletion error:', error)
        }
      }

      onImageDelete?.(imageId, imageUrl)
    } catch (error) {
      console.error('Delete image error:', error)
      alert('이미지 삭제 중 오류가 발생했습니다.')
    } finally {
      setDeletingImages(prev => {
        const newSet = new Set(prev)
        newSet.delete(imageId)
        return newSet
      })
    }
  }, [user, allowDelete, supabase, onImageDelete])

  const handleDownloadImage = useCallback(async (imageUrl: string, imageName?: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = imageName || `image-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      alert('이미지 다운로드 중 오류가 발생했습니다.')
    }
  }, [])

  if (images.length === 0) {
    return (
      <div className={`text-center py-12 text-gray-500 ${className}`}>
        <div className="text-gray-400 mb-2">📷</div>
        <div className="tracking-korean-normal">아직 업로드된 이미지가 없습니다</div>
      </div>
    )
  }

  return (
    <>
      <div className={`${className}`}>
        <div className={`grid gap-4 ${maxColumns === 1 ? 'grid-cols-1' : maxColumns === 2 ? 'grid-cols-1 sm:grid-cols-2' : maxColumns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer">
                <Image
                  src={image.url}
                  alt={image.name || `이미지 ${index + 1}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  onClick={() => handleImageClick(image, index)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white bg-opacity-90 hover:bg-opacity-100"
                      onClick={() => openLightbox(index)}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                    
                    {showDownload && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white bg-opacity-90 hover:bg-opacity-100"
                        onClick={() => handleDownloadImage(image.url, image.name)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {allowDelete && user && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-white border-red-500"
                        onClick={() => handleDeleteImage(image.id, image.url)}
                        disabled={deletingImages.has(image.id)}
                      >
                        {deletingImages.has(image.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {image.name && (
                <div className="mt-2 text-sm text-gray-600 truncate tracking-korean-normal">
                  {image.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
              aria-label="라이트박스 닫기"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox('prev')}
                  className="absolute left-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-colors"
                  aria-label="이전 이미지"
                >
                  ←
                </button>
                <button
                  onClick={() => navigateLightbox('next')}
                  className="absolute right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-colors"
                  aria-label="다음 이미지"
                >
                  →
                </button>
              </>
            )}

            {/* Main image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={images[lightbox.currentIndex]?.url || ''}
                alt={images[lightbox.currentIndex]?.name || '이미지'}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Image info */}
            <div className="absolute bottom-4 left-4 right-4 text-center text-white bg-black bg-opacity-50 rounded-lg p-4">
              <div className="text-lg font-medium tracking-korean-normal">
                {images[lightbox.currentIndex]?.name || `이미지 ${lightbox.currentIndex + 1}`}
              </div>
              <div className="text-sm text-gray-300 mt-1">
                {lightbox.currentIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}